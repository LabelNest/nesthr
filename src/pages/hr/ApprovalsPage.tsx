import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { leaveRequests, profileEditRequests } from '@/data/mockData';
import { CheckCircle, XCircle, Clock, FileEdit, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApprovalsPage = () => {
  const { toast } = useToast();

  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending');
  const pendingEdits = profileEditRequests.filter(r => r.status === 'pending');

  const handleApprove = (type: 'leave' | 'edit', id: string) => {
    toast({
      title: "Approved",
      description: `The ${type} request has been approved.`,
    });
  };

  const handleReject = (type: 'leave' | 'edit', id: string) => {
    toast({
      title: "Rejected",
      description: `The ${type} request has been rejected.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Approvals</h1>
        <p className="text-muted-foreground">Review and approve pending requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 glass-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-partial/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-status-partial" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingLeaves.length}</p>
              <p className="text-sm text-muted-foreground">Pending Leave Requests</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 glass-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileEdit className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingEdits.length}</p>
              <p className="text-sm text-muted-foreground">Pending Profile Edits</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="leaves" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaves" className="gap-2">
            <Calendar className="w-4 h-4" />
            Leave Requests ({pendingLeaves.length})
          </TabsTrigger>
          <TabsTrigger value="edits" className="gap-2">
            <FileEdit className="w-4 h-4" />
            Profile Edits ({pendingEdits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaves">
          <Card className="glass-card overflow-hidden">
            {pendingLeaves.length > 0 ? (
              <div className="divide-y divide-border">
                {pendingLeaves.map((request) => (
                  <div key={request.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave: {' '}
                          {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reason: {request.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove('leave', request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject('leave', request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending leave requests</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="edits">
          <Card className="glass-card overflow-hidden">
            {pendingEdits.length > 0 ? (
              <div className="divide-y divide-border">
                {pendingEdits.map((request) => (
                  <div key={request.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileEdit className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          Updating <span className="font-medium">{request.field}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground line-through">{request.oldValue}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground font-medium">{request.newValue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove('edit', request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject('edit', request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending profile edit requests</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalsPage;
