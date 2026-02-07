import { useState } from "react";
import { Mail, ArrowLeft, Copy, ExternalLink, Hash, Clock, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export const Inbox = ({ emails, onDeleteEmail }: { emails: any[], onDeleteEmail: (id: string) => void }) => {
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  const renderParsedBody = (text: string) => {
    const regex = /(\b\d{4,8}\b|https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (/^\d{4,8}$/.test(part)) {
        return (
          <span 
            key={i} 
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black border border-blue-600 inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(part);
              toast.success("Code copied!", { description: part });
            }}
          >
            <Hash className="w-4 h-4" />
            {part}
          </span>
        );
      }
      if (/^https?:\/\//.test(part)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noreferrer" 
            className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 break-all font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            {part} 
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }
      return part;
    });
  };

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const getColorFromEmail = (email: string) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
      'from-violet-500 to-purple-600',
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (emails.length === 0) {
    return (
      <div className="text-center py-32 animate-in fade-in duration-700">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
          <div className="relative bg-gradient-to-br from-slate-100 to-blue-100 p-8 rounded-3xl">
            <Mail className="w-20 h-20 text-slate-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">No Messages Yet</h3>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
          Your inbox is empty. Emails sent to your temporary address will appear here automatically.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">Auto-refreshing every 10 seconds</span>
        </div>
      </div>
    );
  }

  if (selectedEmail) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedEmail(null)} 
          className="mb-6 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> 
          Back to Inbox
        </Button>
        
        <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
                {selectedEmail.subject}
              </h2>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColorFromEmail(selectedEmail.from)} flex items-center justify-center text-white font-black text-xl shadow-xl`}>
                  {getInitials(selectedEmail.from)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg mb-1 truncate">{selectedEmail.from}</p>
                  <div className="flex items-center gap-3 text-sm text-blue-200">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(selectedEmail.timestamp), "PPP 'at' p")}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { 
                    navigator.clipboard.writeText(selectedEmail.body); 
                    toast.success("Email content copied!"); 
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
                >
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Email Body */}
          <div className="p-8 md:p-10">
            <div className="bg-white border-2 border-slate-100 p-8 rounded-3xl shadow-inner">
              <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-base md:text-lg">
                {renderParsedBody(selectedEmail.body)}
              </pre>
            </div>
            
            {/* Email Metadata */}
            <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 font-medium">From:</span>
                  <p className="font-bold text-slate-900 mt-1">{selectedEmail.from}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Received:</span>
                  <p className="font-bold text-slate-900 mt-1">
                    {format(new Date(selectedEmail.timestamp), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600" />
          Inbox ({emails.length})
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {emails.map((email, index) => (
          <div 
            key={email.id} 
            onClick={() => setSelectedEmail(email)} 
            className="group relative bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-2 border-slate-100 hover:border-blue-200 rounded-2xl p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getColorFromEmail(email.from)} flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                {getInitials(email.from)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <p className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {email.from}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    {format(new Date(email.timestamp), "h:mm a")}
                  </div>
                </div>
                
                <p className="text-base font-bold text-slate-700 truncate mb-2 group-hover:text-slate-900 transition-colors">
                  {email.subject}
                </p>
                
                <p className="text-sm text-slate-500 truncate leading-relaxed">
                  {email.body.slice(0, 120)}...
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                </div>
              </div>
            </div>
            
            {/* Unread indicator */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  );
};