import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    // First, get the org_id from organizations table
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (orgError) {
      return { error: new Error('Failed to fetch organization') };
    }

    if (!orgData) {
      return { error: new Error('No organization found. Please contact your administrator.') };
    }

    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (signUpError) {
      return { error: signUpError as Error };
    }

    if (!authData.user) {
      return { error: new Error('Failed to create user') };
    }

    // Generate employee code
    const employeeCode = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    // Create employee record
    const { data: employeeData, error: employeeError } = await supabase
      .from('hr_employees')
      .insert({
        user_id: authData.user.id,
        full_name: fullName,
        email: email,
        role: role,
        employee_code: employeeCode,
        status: 'Active',
        org_id: orgData.id,
        joining_date: today,
      })
      .select()
      .single();

    if (employeeError) {
      console.error('Employee creation error:', employeeError);
      return { error: new Error('Failed to create employee record') };
    }

    // Create employee details record
    const { error: detailsError } = await supabase
      .from('hr_employee_details')
      .insert({
        employee_id: employeeData.id,
      });

    if (detailsError) {
      console.error('Employee details creation error:', detailsError);
    }

    // Create default leave entitlements
    const currentYear = new Date().getFullYear();
    const leaveTypes = [
      { leave_type: 'Casual', total_leaves: 12 },
      { leave_type: 'Sick', total_leaves: 10 },
      { leave_type: 'Earned', total_leaves: 15 },
    ];

    for (const leave of leaveTypes) {
      const { error: leaveError } = await supabase
        .from('hr_leave_entitlements')
        .insert({
          employee_id: employeeData.id,
          org_id: orgData.id,
          leave_type: leave.leave_type,
          total_leaves: leave.total_leaves,
          used_leaves: 0,
          year: currentYear,
        });

      if (leaveError) {
        console.error('Leave entitlement creation error:', leaveError);
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
