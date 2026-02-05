import { useState } from "react";
import { Mail, Clock, User, ChevronRight, Inbox as InboxIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

interface InboxProps {
  emails: Email[];
  onDeleteEmail: (id: string) => void;
}

export const Inbox = ({ emails, onDeleteEmail }: InboxProps) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (selectedEmail) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="bg-card border-glow rounded-xl overflow-hidden">
          {/* Email Header */}
          <div className="p-6 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmail(null)}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              ← Back to inbox
            </Button>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {selectedEmail.subject}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{selectedEmail.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(selectedEmail.timestamp)}</span>
              </div>
            </div>
          </div>
          {/* Email Body */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{selectedEmail.body}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="p-4 border-t border-border flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDeleteEmail(selectedEmail.id);
                setSelectedEmail(null);
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <InboxIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Inbox</h2>
        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
          {emails.length}
        </span>
      </div>

      <div className="bg-card border-glow rounded-xl overflow-hidden">
        {emails.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No emails yet</h3>
            <p className="text-sm text-muted-foreground">
              Emails sent to your temporary address will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-border">
              {emails.map((email, index) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full p-4 text-left hover:bg-secondary/30 transition-colors group animate-slide-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${email.read ? "bg-muted" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm truncate ${email.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                          {email.from}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(email.timestamp)}
                        </span>
                      </div>
                      <h4 className={`text-sm truncate mb-1 ${email.read ? "text-muted-foreground" : "text-foreground"}`}>
                        {email.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {email.preview}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};