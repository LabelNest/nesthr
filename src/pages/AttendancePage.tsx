import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import { getAttendanceForEmployee, currentUser, AttendanceRecord } from '@/data/mockData';
import { format } from 'date-fns';

const AttendancePage = () => {
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<string | null>(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const attendanceRecords = getAttendanceForEmployee(currentUser.id);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendanceRecords.find(r => r.date === today);
    if (existing) {
      setTodayRecord(existing);
      setPunchInTime(existing.punchIn);
      setPunchOutTime(existing.punchOut);
      setIsPunchedIn(!!existing.punchIn && !existing.punchOut);
    }
  }, []);

  const handlePunchIn = () => {
    const now = new Date();
    const timeStr = format(now, 'HH:mm');
    setPunchInTime(timeStr);
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    const now = new Date();
    const timeStr = format(now, 'HH:mm');
    setPunchOutTime(timeStr);
    setIsPunchedIn(false);
  };

  const calculateTotalHours = () => {
    if (!punchInTime || !punchOutTime) return null;
    const [inH, inM] = punchInTime.split(':').map(Number);
    const [outH, outM] = punchOutTime.split(':').map(Number);
    const hours = (outH + outM/60) - (inH + inM/60);
    return hours.toFixed(2);
  };

  const getStatus = (): 'present' | 'absent' | 'partial' => {
    if (!punchInTime) return 'absent';
    const totalHours = calculateTotalHours();
    if (totalHours && parseFloat(totalHours) >= 8) return 'present';
    if (totalHours && parseFloat(totalHours) < 8) return 'partial';
    return 'present'; // Punched in but not out yet
  };

  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const partialDays = attendanceRecords.filter(r => r.status === 'partial').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">Track your daily punch in and punch out times</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Present Days (This Week)" 
          value={presentDays} 
          icon={Calendar}
        />
        <StatCard 
          title="Partial Days" 
          value={partialDays} 
          icon={Clock}
        />
        <StatCard 
          title="Avg Hours/Day" 
          value="8.2h" 
          icon={Clock}
        />
      </div>

      {/* Today's Attendance */}
      <Card className="p-8 glass-card">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-lg font-medium text-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          {/* Status */}
          <div>
            <StatusBadge status={getStatus()} className="text-base px-4 py-1" />
          </div>

          {/* Punch Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="punch" 
              onClick={handlePunchIn}
              disabled={isPunchedIn || !!punchInTime}
              className="min-w-40"
            >
              <LogIn className="w-5 h-5" />
              Punch In
            </Button>
            <Button 
              variant="punchOut" 
              onClick={handlePunchOut}
              disabled={!isPunchedIn || !!punchOutTime}
              className="min-w-40"
            >
              <LogOut className="w-5 h-5" />
              Punch Out
            </Button>
          </div>

          {/* Time Display */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Punch In</p>
              <p className="text-2xl font-mono font-semibold text-foreground">
                {punchInTime || '--:--'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Punch Out</p>
              <p className="text-2xl font-mono font-semibold text-foreground">
                {punchOutTime || '--:--'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Hours</p>
              <p className="text-2xl font-mono font-semibold text-primary">
                {calculateTotalHours() ? `${calculateTotalHours()}h` : '--:--'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Attendance */}
      <Card className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Attendance</h2>
        </div>
        <div className="divide-y divide-border">
          {attendanceRecords.slice(0, 5).map((record) => (
            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div>
                <p className="font-medium text-foreground">
                  {format(new Date(record.date), 'EEEE, MMM d')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {record.punchIn || '--:--'} - {record.punchOut || '--:--'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {record.totalHours ? `${record.totalHours}h` : '-'}
                </span>
                <StatusBadge status={record.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AttendancePage;
