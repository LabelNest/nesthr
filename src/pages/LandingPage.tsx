import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  TrendingUp, 
  Target, 
  Users, 
  FileText, 
  DollarSign,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const features = [
  { 
    icon: Clock, 
    title: 'Attendance', 
    description: 'Punch In / Punch Out tracking with real-time status' 
  },
  { 
    icon: TrendingUp, 
    title: 'People Efficiency', 
    description: 'Track work output with visual heatmaps and trends' 
  },
  { 
    icon: Target, 
    title: 'Manager Expectations', 
    description: 'Set and monitor efficiency goals for teams' 
  },
  { 
    icon: Users, 
    title: 'HR Administration', 
    description: 'Complete employee lifecycle management' 
  },
  { 
    icon: FileText, 
    title: 'Documents', 
    description: 'Secure document storage and management' 
  },
  { 
    icon: DollarSign, 
    title: 'Salary', 
    description: 'Payroll information and salary history' 
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <div>
              <span className="font-display font-bold text-foreground">NestHR</span>
              <span className="text-xs text-muted-foreground ml-1">by LabelNest</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/app">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/app">
              <Button variant="landing" size="lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Features */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                  People Efficiency & HR Intelligence Platform
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  A modern HR platform that prioritizes efficiency insights over micromanagement. 
                  Empower your teams with the right tools and visibility.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/app">
                  <Button variant="landing" size="xl" className="gap-2">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="landingOutline" size="xl">
                  Learn More
                </Button>
              </div>

              {/* Feature List */}
              <div className="grid sm:grid-cols-2 gap-4 pt-8">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={feature.title}
                      className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                {/* Dashboard Preview Card */}
                <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden animate-fade-in">
                  {/* Mock Dashboard Header */}
                  <div className="bg-sidebar p-4 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-status-absent" />
                    <div className="w-3 h-3 rounded-full bg-status-partial" />
                    <div className="w-3 h-3 rounded-full bg-status-present" />
                    <div className="flex-1 text-center">
                      <span className="text-sm text-sidebar-foreground/70">NestHR Dashboard</span>
                    </div>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="p-6 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-xs text-muted-foreground">Team Efficiency</div>
                        <div className="text-2xl font-bold text-primary">87%</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-xs text-muted-foreground">Attendance</div>
                        <div className="text-2xl font-bold text-status-present">95%</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-xs text-muted-foreground">On Time</div>
                        <div className="text-2xl font-bold text-foreground">92%</div>
                      </div>
                    </div>

                    {/* Efficiency Heatmap Preview */}
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="text-xs text-muted-foreground mb-3">Weekly Efficiency</div>
                      <div className="flex gap-2">
                        {[85, 92, 78, 88, 90, 0, 0].map((val, i) => (
                          <div 
                            key={i}
                            className={`flex-1 h-8 rounded ${
                              val === 0 ? 'bg-muted' :
                              val >= 85 ? 'bg-efficiency-high' :
                              val >= 70 ? 'bg-efficiency-medium' :
                              'bg-efficiency-low'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                          <div key={i} className="flex-1 text-center text-xs text-muted-foreground">
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 bg-card rounded-xl shadow-elevated border border-border p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-status-present" />
                    <span className="text-sm font-medium">Punched In at 9:02 AM</span>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-card rounded-xl shadow-elevated border border-border p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="text-xs text-muted-foreground mb-1">Today's Efficiency</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-efficiency-high">91%</span>
                    <span className="text-xs text-muted-foreground">of 85% expected</span>
                  </div>
                </div>
              </div>

              {/* Background decorations */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 NestHR by LabelNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
