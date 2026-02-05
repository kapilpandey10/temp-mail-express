import { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DOMAIN = "pandeykapil.com.np";
const EMAIL_DURATION = 5 * 60; // 5 minutes in seconds

const generateRandomEmail = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const length = 8 + Math.floor(Math.random() * 4);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${result}@${DOMAIN}`;
};

interface EmailGeneratorProps {
  onEmailChange: (email: string) => void;
  onExpire: () => void;
}

export const EmailGenerator = ({ onEmailChange, onExpire }: EmailGeneratorProps) => {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(EMAIL_DURATION);
  const [copied, setCopied] = useState(false);

  const generateNewEmail = useCallback(() => {
    const newEmail = generateRandomEmail();
    setEmail(newEmail);
    setTimeLeft(EMAIL_DURATION);
    onEmailChange(newEmail);
    toast.success("New email generated!");
  }, [onEmailChange]);

  useEffect(() => {
    generateNewEmail();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      generateNewEmail();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire, generateNewEmail]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / EMAIL_DURATION) * 100;
  const isLowTime = timeLeft <= 60;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Timer Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-4">
          <div className={`w-2 h-2 rounded-full ${isLowTime ? "bg-destructive animate-countdown" : "bg-primary"}`} />
          <span className="text-sm text-muted-foreground">Email expires in</span>
        </div>
        <div className={`text-6xl font-mono font-bold ${isLowTime ? "text-destructive" : "text-primary"} text-glow`}>
          {formatTime(timeLeft)}
        </div>
        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${isLowTime ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Email Display */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/30 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
        <div className="relative bg-card border-glow rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Your temporary email</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 font-mono text-xl md:text-2xl text-foreground tracking-wide break-all">
              {email}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={generateNewEmail}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={copyToClipboard}
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-medium px-6"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          Copy Email
        </Button>
        <Button
          variant="outline"
          onClick={generateNewEmail}
          className="border-border hover:bg-secondary hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Email
        </Button>
      </div>
    </div>
  );
};