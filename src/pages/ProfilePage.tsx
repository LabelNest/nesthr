import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { currentUser, profileEditRequests } from '@/data/mockData';
import { User, Mail, Phone, MapPin, GraduationCap, Users, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: currentUser.phone,
    address: currentUser.address,
    emergencyContact: currentUser.emergencyContact,
    education: currentUser.education,
  });

  const userEditRequests = profileEditRequests.filter(r => r.employeeId === currentUser.id);

  const handleSave = () => {
    toast({
      title: "Changes Submitted",
      description: "Your profile changes have been submitted for HR approval.",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">View and update your personal information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Pending Edit Requests */}
      {userEditRequests.filter(r => r.status === 'pending').length > 0 && (
        <Card className="p-4 bg-status-partial/10 border-status-partial/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-status-partial mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Pending Approval</p>
              <p className="text-sm text-muted-foreground">
                You have {userEditRequests.filter(r => r.status === 'pending').length} profile change(s) pending HR approval.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Header */}
      <Card className="p-6 glass-card">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-foreground">{currentUser.avatar}</span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-muted-foreground">{currentUser.role}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={currentUser.status === 'active' ? 'present' : currentUser.status === 'probation' ? 'partial' : 'pending'} />
              <span className="text-sm text-muted-foreground">
                • {currentUser.department}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Read-only Information */}
        <Card className="p-6 glass-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Work Information
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These fields cannot be edited by employees.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Manager</p>
                <p className="font-medium text-foreground">{currentUser.managerName || 'None'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-medium text-foreground">
                  {format(new Date(currentUser.startDate), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Editable Information */}
        <Card className="p-6 glass-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Personal Information
          </h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input 
                  id="emergency"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input 
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                * Changes will be submitted for HR approval
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{currentUser.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{currentUser.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium text-foreground">{currentUser.emergencyContact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Education</p>
                  <p className="font-medium text-foreground">{currentUser.education}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Edit History */}
      {userEditRequests.length > 0 && (
        <Card className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Edit Request History</h3>
          </div>
          <div className="divide-y divide-border">
            {userEditRequests.map((request) => (
              <div key={request.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{request.field}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.oldValue} → {request.newValue}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(request.requestedAt), 'MMM d, yyyy')}
                  </span>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
