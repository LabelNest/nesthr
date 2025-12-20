import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EfficiencyDot } from '@/components/shared/EfficiencyDot';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { 
  employees, 
  getDirectReports, 
  getEfficiencyForEmployee, 
  getAttendanceForEmployee,
  getAverageEfficiency,
  employeeExpectations 
} from '@/data/mockData';
import { Search, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock manager ID (Sarah Chen)
const managerId = 'emp-002';

const MyTeamPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIndirect, setShowIndirect] = useState(false);

  const directReports = getDirectReports(managerId);
  
  // Get indirect reports (team members of direct reports who are also managers)
  const indirectReports = employees.filter(emp => {
    const manager = employees.find(e => e.id === emp.managerId);
    return manager && manager.managerId === managerId;
  });

  const teamMembers = showIndirect ? [...directReports, ...indirectReports] : directReports;
  
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMember = selectedEmployee ? employees.find(e => e.id === selectedEmployee) : null;
  const selectedEfficiency = selectedEmployee ? getEfficiencyForEmployee(selectedEmployee) : [];
  const selectedAttendance = selectedEmployee ? getAttendanceForEmployee(selectedEmployee) : [];
  const selectedExpectation = selectedEmployee ? employeeExpectations.find(e => e.employeeId === selectedEmployee) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Team</h1>
        <p className="text-muted-foreground">Manage and view your team members</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <Card className="lg:col-span-1 glass-card overflow-hidden">
          <div className="p-4 border-b border-border space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={!showIndirect ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowIndirect(false)}
              >
                Direct ({directReports.length})
              </Button>
              <Button 
                variant={showIndirect ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowIndirect(true)}
              >
                All ({teamMembers.length})
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredMembers.map((member) => {
              const avgEff = getAverageEfficiency(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedEmployee(member.id)}
                  className={cn(
                    'w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left',
                    selectedEmployee === member.id && 'bg-secondary'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">{member.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <EfficiencyDot value={avgEff} showTooltip={false} />
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Employee Details */}
        <Card className="lg:col-span-2 glass-card">
          {selectedMember ? (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">{selectedMember.avatar}</span>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">{selectedMember.name}</h2>
                  <p className="text-muted-foreground">{selectedMember.role}</p>
                  <StatusBadge status={selectedMember.status === 'active' ? 'present' : 'partial'} />
                </div>
              </div>

              {/* Attendance Summary */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Attendance (Last 7 Days)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-present">
                      {selectedAttendance.filter(a => a.status === 'present').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-partial">
                      {selectedAttendance.filter(a => a.status === 'partial').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Partial</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-status-absent">
                      {selectedAttendance.filter(a => a.status === 'absent').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </div>
              </div>

              {/* Efficiency Trend */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Efficiency Trend</h3>
                <ProgressBar 
                  value={getAverageEfficiency(selectedMember.id)} 
                  expected={selectedExpectation?.expectedEfficiency || 80}
                />
                <div className="flex items-center justify-center gap-3 mt-4">
                  {selectedEfficiency.slice(0, 5).map((record) => (
                    <EfficiencyDot 
                      key={record.id}
                      value={record.efficiency} 
                      expected={record.expected}
                      date={record.date}
                    />
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">Contact</h3>
                <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                <p className="text-sm text-muted-foreground">{selectedMember.phone}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a team member to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyTeamPage;
