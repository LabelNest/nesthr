import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Calendar,
  FolderOpen,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { role, employee, loading } = useAuth();
  const navigate = useNavigate();

  // Loading skeleton
  if (loading || !employee) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'Admin':
        return 'HR';
      case 'Manager':
        return 'team';
      default:
        return 'personal';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Welcome back, {employee.full_name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's your {getRoleLabel()} overview for today.
        </p>
      </div>

      {/* Quick Stats - Role-based */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Common stats for all roles */}
        <StatCard 
          title="My Efficiency" 
          value="--"
          icon={TrendingUp}
        />
        <StatCard 
          title="Attendance Streak" 
          value="--"
          icon={Clock}
        />

        {/* Employee-specific stats */}
        {role === 'Employee' && (
          <StatCard 
            title="Leave Balance" 
            value="--"
            icon={CheckCircle}
          />
        )}

        {/* Manager-specific stats */}
        {role === 'Manager' && (
          <>
            <StatCard 
              title="Team Members" 
              value="--"
              icon={Users}
            />
            <StatCard 
              title="Pending Approvals" 
              value="--"
              icon={AlertCircle}
            />
          </>
        )}

        {/* Admin-specific stats */}
        {role === 'Admin' && (
          <>
            <StatCard 
              title="Total Employees" 
              value="--"
              icon={Users}
            />
            <StatCard 
              title="Pending Approvals" 
              value="--"
              icon={AlertCircle}
            />
          </>
        )}
      </div>

      {/* Quick Actions - Role-based */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Common actions for all roles */}
        <Card 
          className="p-6 glass-card cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/app/attendance')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Attendance</h3>
                <p className="text-sm text-muted-foreground">Punch in/out for today</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Card>

        <Card 
          className="p-6 glass-card cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate('/app/efficiency')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-efficiency-high/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-efficiency-high" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Efficiency</h3>
                <p className="text-sm text-muted-foreground">View your performance</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Card>

        {/* Employee-specific action */}
        {role === 'Employee' && (
          <Card 
            className="p-6 glass-card cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigate('/app/leaves')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Leaves</h3>
                  <p className="text-sm text-muted-foreground">Apply for leave</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        )}

        {/* Manager-specific action */}
        {role === 'Manager' && (
          <Card 
            className="p-6 glass-card cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigate('/app/team')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Team</h3>
                  <p className="text-sm text-muted-foreground">Manage team members</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        )}

        {/* Admin-specific action */}
        {role === 'Admin' && (
          <Card 
            className="p-6 glass-card cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigate('/app/approvals')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-status-partial/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-status-partial" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Approvals</h3>
                  <p className="text-sm text-muted-foreground">Review pending requests</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        )}
      </div>

      {/* Role-specific quick actions panel */}
      {role === 'Admin' && (
        <Card className="p-6 glass-card">
          <h2 className="font-semibold text-foreground mb-4">HR Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/app/directory')}>
              <FolderOpen className="w-4 h-4 mr-2" />
              View Directory
            </Button>
            <Button onClick={() => navigate('/app/add-employee')} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
            <Button onClick={() => navigate('/app/approvals')} variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Review Approvals
            </Button>
          </div>
        </Card>
      )}

      {role === 'Manager' && (
        <Card className="p-6 glass-card">
          <h2 className="font-semibold text-foreground mb-4">Manager Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/app/team')}>
              <Users className="w-4 h-4 mr-2" />
              View Team
            </Button>
            <Button onClick={() => navigate('/app/expectations')} variant="outline">
              Set Expectations
            </Button>
            <Button onClick={() => navigate('/app/team-efficiency')} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Team Efficiency
            </Button>
          </div>
        </Card>
      )}

      {role === 'Employee' && (
        <Card className="p-6 glass-card">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/app/leaves')}>
              <Calendar className="w-4 h-4 mr-2" />
              Apply for Leave
            </Button>
            <Button onClick={() => navigate('/app/profile')} variant="outline">
              View Profile
            </Button>
            <Button onClick={() => navigate('/app/documents')} variant="outline">
              My Documents
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
