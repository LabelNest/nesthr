import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { leaveRequests, currentUser } from '@/data/mockData';
import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';

const MyLeavesPage = () => {
  const userLeaves = leaveRequests.filter(r => r.employeeId === currentUser.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Leaves</h1>
          <p className="text-muted-foreground">View and request time off</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 glass-card">
          <p className="text-sm text-muted-foreground">Annual Leave</p>
          <p className="text-2xl font-bold text-foreground">12 <span className="text-sm font-normal text-muted-foreground">/ 15 days</span></p>
        </Card>
        <Card className="p-4 glass-card">
          <p className="text-sm text-muted-foreground">Sick Leave</p>
          <p className="text-2xl font-bold text-foreground">8 <span className="text-sm font-normal text-muted-foreground">/ 10 days</span></p>
        </Card>
        <Card className="p-4 glass-card">
          <p className="text-sm text-muted-foreground">Personal Days</p>
          <p className="text-2xl font-bold text-foreground">3 <span className="text-sm font-normal text-muted-foreground">/ 3 days</span></p>
        </Card>
      </div>

      {/* Leave Requests */}
      <Card className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">My Leave Requests</h2>
        </div>
        <div className="divide-y divide-border">
          {userLeaves.length > 0 ? (
            userLeaves.map((leave) => (
              <div key={leave.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">{leave.reason}</p>
                  </div>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leave requests yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MyLeavesPage;
