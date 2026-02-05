import { useState } from "react";
import { Mail, ArrowLeft, Trash2, Copy, Check, ExternalLink, Hash, User } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export const Inbox = ({ emails, onDeleteEmail }: { emails: any[], onDeleteEmail: (id: string) => void }) => {
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  const renderParsedBody = (text: string) => {
    const regex = /(\b\d{4,8}\b|https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (/^\d{4,8}$/.test(part)) return <span key={i} className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500 font-black border border-blue-500/30 inline-flex items-center gap-1"><Hash className="w-3 h-3" />{part}</span>;
      if (/^https?:\/\//.test(part)) return <a key={i} href={part} target="_blank" rel="noreferrer" className="text-primary underline break-all">{part} <ExternalLink className="w-3 h-3 inline mb-1" /></a>;
      return part;
    });
  };

  if (emails.length === 0) return (
    <div className="text-center py-20 opacity-30 animate-pulse">
      <Mail className="w-16 h-16 mx-auto mb-4" />
      <p className="font-bold italic">Checking for new messages...</p>
    </div>
  );

  if (selectedEmail) return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Button variant="ghost" onClick={() => setSelectedEmail(null)} className="mb-6 -ml-2 text-muted-foreground"><ArrowLeft className="mr-2 h-5 w-5" /> Back to Inbox</Button>
      <div className="bg-card border rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-2xl">
        <h2 className="text-3xl font-black tracking-tight">{selectedEmail.subject}</h2>
        <div className="flex items-center gap-4 border-b pb-6 border-border">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl">{selectedEmail.from[0].toUpperCase()}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{selectedEmail.from}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(selectedEmail.timestamp), "PPPP 'at' p")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(selectedEmail.body); toast.success("Content Copied"); }}>
            <Copy className="w-5 h-5" />
          </Button>
        </div>
        <div className="bg-muted/30 p-6 rounded-2xl border">
          <pre className="whitespace-pre-wrap font-sans text-foreground/80 leading-relaxed text-base">{renderParsedBody(selectedEmail.body)}</pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="divide-y border-t border-border">
      {emails.map((email) => (
        <div key={email.id} onClick={() => setSelectedEmail(email)} className="flex items-center gap-5 py-6 px-4 hover:bg-muted/50 cursor-pointer transition-all group rounded-2xl mt-2">
          <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all font-bold text-xl shadow-sm">
            {email.from[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{email.from}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(email.timestamp), "h:mm a")}</p>
            </div>
            <p className="text-sm font-bold text-foreground/70 truncate mb-1">{email.subject}</p>
            <p className="text-xs text-muted-foreground truncate opacity-60 italic">{email.body.slice(0, 100)}...</p>
          </div>
        </div>
      ))}
    </div>
  );
};