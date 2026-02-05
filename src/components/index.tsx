import { useState } from "react";
import { Mail, ArrowLeft, Trash2, Copy, Check, Clock, User } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}

export const Inbox = ({ emails, onDeleteEmail }: { emails: Email[], onDeleteEmail: (id: string) => void }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. EMPTY STATE
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Mail className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">Your inbox is empty</p>
      </div>
    );
  }

  // 2. DETAIL VIEW (Like opening an email in Gmail)
  if (selectedEmail) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedEmail(null)}
            className="hover:bg-white/5 -ml-2 text-slate-400"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleCopy(selectedEmail.body)}
              className="text-slate-400 hover:text-white"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                onDeleteEmail(selectedEmail.id);
                setSelectedEmail(null);
              }}
              className="text-rose-500 hover:bg-rose-500/10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Email Content */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {selectedEmail.subject}
          </h2>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">{selectedEmail.from}</p>
              <p className="text-xs text-slate-500">
                {format(new Date(selectedEmail.timestamp), "MMM d, h:mm a")}
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <pre className="text-slate-300 whitespace-pre-wrap font-sans text-base leading-relaxed break-words bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              {selectedEmail.body}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // 3. INBOX LIST VIEW
  return (
    <div className="divide-y divide-white/5 border-t border-white/5">
      {emails.map((email) => (
        <div 
          key={email.id}
          onClick={() => setSelectedEmail(email)}
          className="flex items-center gap-4 py-4 px-2 hover:bg-white/[0.03] cursor-pointer transition-colors group"
        >
          {/* Avatar Icon */}
          <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold shrink-0">
            {email.from[0].toUpperCase()}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-sm font-bold text-slate-200 truncate">{email.from}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">
                {format(new Date(email.timestamp), "h:mm a")}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-300 truncate">{email.subject}</p>
            <p className="text-xs text-slate-500 truncate opacity-70">
              {email.body.slice(0, 100)}...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};