import { useState, useCallback } from "react";
import { Shield, Zap, Clock, Lock } from "lucide-react";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Inbox } from "@/components/Inbox";
import { toast } from "sonner";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

// Mock emails for demonstration
const mockEmails: Email[] = [
  {
    id: "1",
    from: "welcome@service.com",
    subject: "Welcome to TempMail!",
    preview: "Thank you for using our temporary email service...",
    body: "Thank you for using our temporary email service!\n\nYour disposable email address is ready to use. Any emails sent to this address will appear in your inbox instantly.\n\nThis email will expire in 5 minutes, so make sure to complete your registrations quickly!\n\nBest regards,\nTempMail Team",
    timestamp: new Date(Date.now() - 60000),
    read: false,
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant",
    description: "Get a new email address in seconds",
  },
  {
    icon: Clock,
    title: "5 Minutes",
    description: "Auto-expires for your privacy",
  },
  {
    icon: Shield,
    title: "Anonymous",
    description: "No registration required",
  },
  {
    icon: Lock,
    title: "Secure",
    description: "Protect your real inbox",
  },
];

const Index = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [emails, setEmails] = useState<Email[]>(mockEmails);

  const handleEmailChange = useCallback((email: string) => {
    setCurrentEmail(email);
  }, []);

  const handleExpire = useCallback(() => {
    setEmails([]);
    toast.info("Email expired! Generating new address...");
  }, []);

  const handleDeleteEmail = useCallback((id: string) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
    toast.success("Email deleted");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Disposable Email Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
              Temp<span className="text-primary text-glow">Mail</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-fade-in">
              Protect your privacy with instant disposable email addresses. 
              No signup, no hassle—just quick, secure emails.
            </p>
          </header>

          {/* Email Generator */}
          <section className="mb-16">
            <EmailGenerator onEmailChange={handleEmailChange} onExpire={handleExpire} />
          </section>

          {/* Features */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </section>

          {/* Inbox */}
          <section>
            <Inbox emails={emails} onDeleteEmail={handleDeleteEmail} />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 TempMail • <span className="text-primary font-mono">pandeykapil.com.np</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
