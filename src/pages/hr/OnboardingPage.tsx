import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, UserPlus, Monitor, FileText, BookOpen, CheckCircle2, Clock, AlertCircle, Trash2, CalendarIcon, ChevronDown, ChevronRight, Settings, Key, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface OnboardingTask {
  id: string;
  employee_id: string;
  task_title: string;
  task_description: string | null;
  category: string;
  task_order: number;
  is_mandatory: boolean | null;
  status: string | null;
  completed_at: string | null;
  document_url: string | null;
  created_at: string | null;
}

interface Employee {
  id: string;
  full_name: string;
  employee_code: string | null;
  joining_date: string | null;
}

const TASK_CATEGORIES = ['Documents', 'Training', 'Profile Setup', 'Equipment', 'Access Setup', 'Other'] as const;

const categoryIcons: Record<string, React.ElementType> = {
  'Documents': FileText,
  'Training': BookOpen,
  'Profile Setup': UserPlus,
  'Equipment': Package,
  'Access Setup': Key,
  'Other': Settings,
};

const categoryColors: Record<string, string> = {
  'Documents': 'bg-blue-100 text-blue-700 border-blue-200',
  'Training': 'bg-green-100 text-green-700 border-green-200',
  'Profile Setup': 'bg-purple-100 text-purple-700 border-purple-200',
  'Equipment': 'bg-orange-100 text-orange-700 border-orange-200',
  'Access Setup': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusColors: Record<string, string> = {
  'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Completed': 'bg-green-100 text-green-700 border-green-200',
};

const OnboardingPage = () => {
  const { employee, role } = useAuth();
  const { toast } = useToast();
  const isAdmin = role === 'Admin';

  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [pendingOpen, setPendingOpen] = useState(true);
  const [inProgressOpen, setInProgressOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    task_title: '',
    category: 'Documents',
    task_description: '',
    is_mandatory: true,
  });

  // Fetch employees for admin dropdown
  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  // Fetch tasks when employee is selected or for non-admin users
  useEffect(() => {
    if (isAdmin && selectedEmployeeId) {
      fetchTasks(selectedEmployeeId);
    } else if (!isAdmin && employee?.id) {
      fetchTasks(employee.id);
    } else if (!isAdmin) {
      setLoading(false);
    }
  }, [isAdmin, selectedEmployeeId, employee?.id]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('hr_employees')
        .select('id, full_name, employee_code, joining_date')
        .eq('status', 'Active')
        .order('full_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast({ title: 'Error', description: 'Failed to load employees', variant: 'destructive' });
    }
  };

  const fetchTasks = async (employeeId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hr_onboarding_tasks')
        .select('*')
        .eq('employee_id', employeeId)
        .order('task_order', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({ title: 'Error', description: 'Failed to load tasks', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.task_title || !selectedEmployeeId || !employee?.id) return;

    setSaving('create');
    try {
      // Get max task_order
      const maxOrder = tasks.reduce((max, t) => Math.max(max, t.task_order), 0);
      
      const { error } = await supabase.from('hr_onboarding_tasks').insert({
        employee_id: selectedEmployeeId,
        task_title: newTask.task_title,
        category: newTask.category,
        task_description: newTask.task_description || null,
        is_mandatory: newTask.is_mandatory,
        task_order: maxOrder + 1,
        status: 'Pending',
      });

      if (error) throw error;

      toast({ title: 'Task created', description: 'Onboarding task added successfully' });
      setNewTask({ task_title: '', category: 'Documents', task_description: '', is_mandatory: true });
      setIsDialogOpen(false);
      fetchTasks(selectedEmployeeId);
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(null);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    setSaving(taskId);
    
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null }
        : t
    ));

    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'Completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('hr_onboarding_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
      // Revert on error
      fetchTasks(isAdmin ? selectedEmployeeId : employee?.id || '');
    } finally {
      setSaving(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    setSaving(taskId);
    try {
      const { error } = await supabase
        .from('hr_onboarding_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast({ title: 'Task deleted', description: 'Onboarding task removed' });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
    } finally {
      setSaving(null);
    }
  };

  const handleCheckboxChange = (task: OnboardingTask) => {
    if (task.status === 'Completed') {
      updateTaskStatus(task.id, 'Pending');
    } else {
      updateTaskStatus(task.id, 'Completed');
    }
  };

  // Group tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const renderTaskItem = (task: OnboardingTask) => {
    const Icon = categoryIcons[task.category] || Settings;
    const isDisabled = saving === task.id;

    return (
      <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-secondary/30 transition-colors border-b border-border last:border-0">
        <Checkbox 
          checked={task.status === 'Completed'} 
          onCheckedChange={() => handleCheckboxChange(task)}
          disabled={isDisabled}
          className="mt-1"
        />
        <Icon className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium",
            task.status === 'Completed' ? 'line-through text-muted-foreground' : 'text-foreground'
          )}>
            {task.task_title}
          </p>
          {task.task_description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.task_description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.is_mandatory && (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className={categoryColors[task.category]}>
            {task.category}
          </Badge>
          {isAdmin ? (
            <Select 
              value={task.status} 
              onValueChange={(value) => updateTaskStatus(task.id, value)}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={statusColors[task.status]}>{task.status}</Badge>
          )}
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => deleteTask(task.id)}
              disabled={isDisabled}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderTaskGroup = (
    title: string, 
    taskList: OnboardingTask[], 
    isOpen: boolean, 
    setIsOpen: (open: boolean) => void,
    statusColor: string
  ) => {
    if (taskList.length === 0) return null;
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-secondary/50">
            <div className="flex items-center gap-2">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span className="font-semibold">{title}</span>
              <Badge className={statusColor}>{taskList.length}</Badge>
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border">
            {taskList.map(renderTaskItem)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Onboarding</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage new employee onboarding tasks' : 'Complete these tasks to finish your onboarding'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedEmployeeId}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Onboarding Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Task Name <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="e.g., Complete ID verification" 
                    value={newTask.task_title}
                    onChange={(e) => setNewTask({ ...newTask, task_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category <span className="text-destructive">*</span></Label>
                  <Select 
                    value={newTask.category} 
                    onValueChange={(v) => setNewTask({ ...newTask, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Optional task description..."
                    value={newTask.task_description}
                    onChange={(e) => setNewTask({ ...newTask, task_description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_mandatory"
                    checked={newTask.is_mandatory}
                    onCheckedChange={(checked) => setNewTask({ ...newTask, is_mandatory: !!checked })}
                  />
                  <Label htmlFor="is_mandatory">Required task</Label>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleCreateTask}
                  disabled={!newTask.task_title || saving === 'create'}
                >
                  {saving === 'create' ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admin: Employee Selector */}
      {isAdmin && (
        <Card className="p-4 glass-card">
          <Label className="text-sm font-medium mb-2 block">Select Employee</Label>
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select employee to manage onboarding" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(emp => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.full_name} {emp.employee_code && `(${emp.employee_code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      )}

      {/* Stats */}
      {(isAdmin ? selectedEmployeeId : true) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 glass-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 glass-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 glass-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <AlertCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inProgressTasks.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 glass-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {((isAdmin && selectedEmployeeId) || !isAdmin) && totalTasks > 0 && (
        <Card className="p-4 glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {selectedEmployee ? `${selectedEmployee.full_name}'s Progress` : 'Your Progress'}
            </span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalTasks} tasks completed
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="glass-card p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </Card>
      )}

      {/* Task List */}
      {!loading && ((isAdmin && selectedEmployeeId) || !isAdmin) && (
        <Card className="glass-card overflow-hidden">
          {tasks.length > 0 ? (
            <>
              {renderTaskGroup('Pending', pendingTasks, pendingOpen, setPendingOpen, statusColors['Pending'])}
              {renderTaskGroup('In Progress', inProgressTasks, inProgressOpen, setInProgressOpen, statusColors['In Progress'])}
              {renderTaskGroup('Completed', completedTasks, completedOpen, setCompletedOpen, statusColors['Completed'])}
            </>
          ) : (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Onboarding Tasks</h3>
              <p className="text-muted-foreground mb-4">
                {isAdmin 
                  ? 'Create tasks for this employee to get started with onboarding.'
                  : 'No onboarding tasks have been assigned to you yet.'}
              </p>
              {isAdmin && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Task
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Empty State - No employee selected (Admin) */}
      {isAdmin && !selectedEmployeeId && !loading && (
        <Card className="p-12 glass-card text-center">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Select an Employee</h3>
          <p className="text-muted-foreground">Choose an employee from the dropdown above to view and manage their onboarding tasks.</p>
        </Card>
      )}
    </div>
  );
};

export default OnboardingPage;
