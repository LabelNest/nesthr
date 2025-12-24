import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { currentRole, setCurrentRole } = useRole();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been logged out successfully.',
    });
    navigate('/auth');
  };

  const roleLabels: Record<Role, string> = {
    hr: 'HR / Admin',
    manager: 'Manager',
    employee: 'Employee',
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-xl font-display font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-secondary border-0"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Role:</span>
          <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as Role)}>
            <SelectTrigger className="w-[140px] bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="hr">HR / Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
