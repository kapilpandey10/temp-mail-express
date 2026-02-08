import React, { useState, useEffect, useRef } from "react";
import { 
  Mail, ArrowLeft, ExternalLink, Copy, Clock, ChevronRight, 
  RefreshCw, ShieldCheck, Hash, Trash2, Gift, Volume2, VolumeX 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

interface InboxProps {
  emails: any[];
  isFetching: boolean;
  onDeleteEmail?: (emailId: string) => void;
}

// Welcome message that appears after 5 seconds
const WELCOME_MESSAGE = {
  id: 'welcome-message',
  from: 'team@pandeykapil.com.np',
  subject: 'Welcome to GhostMail! 🎉',
  body: `Hey there, Ghost! 👻

Thank you for using GhostMail - your secure, disposable email service.

Here's what you need to know:

🔐 SECURITY FEATURES:
- Your session is hardware-locked to this device only
- All emails are encrypted with AES-256
- Messages auto-delete after 5 minutes
- No data is stored permanently

⚡ HOW TO USE:
1. Share this temporary email address for signups, OTPs, or verifications
2. Receive emails instantly in this inbox
3. Click on any OTP code to copy it automatically
4. All data vanishes after the timer expires

🎯 PRO TIPS:
- You can manually delete messages anytime
- Refresh to check for new emails
- The timer shows remaining session time
- Use random generation for maximum anonymity

Need help? Visit: https://pandeykapil.com.np/support

Stay anonymous, stay secure! 🛡️

- The GhostMail Team`,
  timestamp: new Date().toISOString(),
  isWelcome: true
};

const Inbox = ({ emails, isFetching, onDeleteEmail }: InboxProps) => {
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [deletingEmails, setDeletingEmails] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousEmailCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    // Create notification sound using Web Audio API
    audioRef.current = new Audio();
    
    // You can use a custom sound file or the default notification sound
    // Option 1: Use a notification sound URL
    // audioRef.current.src = '/sounds/notification.mp3';
    
    // Option 2: Use a data URL for a simple beep (no external file needed)
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi66+aiUhELTqHf7bllHAU2jdXuy3YnBSp+yfDajzsKFFux6OyrWBQLSJzd8L1rIAUrlc/03It3KwYSabvs56NUFQ1Qp+PvsmEcBTiQ1vPNdysGJ3zJ8N2RQAoUXrTp66lWFApFnt/xwG4gBSuBzvLaijYIGWi66+ejUhELTqHf7bllHAU2jdTty3YnBSp+yPDajzsKFFux6OyrWBQLR5zd8L5rHwUrlc/03It3KwYSabvs56NUFQ1Qp+PvsmEcBTiQ1vPNdysGKHzJ8N2RQAoUXrTp66lWFApFnt/xwG4gBSuBzvLaijYIGWi76+ejUhELTaHf7bllHAU2jdTty3YnBSp+yPDajzsKE1ux6OyrWBQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OyrWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OyrWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OysWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OysWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OysWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OysWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OysWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIGGi76+ejUhELTaHf7blmHAU2jdTty3YnBSp+yPDajzsKE1ux6OysWRQLSJzd8L5rIAUrlc/03It3KwYTabbr56NUFQ1Qp+PvsmEcBTiP1vPNdysGKHzJ8N+RQQoUXrPp66lWFApFnt/xwG4gBSuBzvLaijYIG==';
    
    audioRef.current.volume = 0.5; // Set volume to 50%
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play notification sound when new email arrives
  useEffect(() => {
    const currentEmailCount = emails.length;
    
    // Only play sound if:
    // 1. Sound is enabled
    // 2. Email count increased (new email arrived)
    // 3. This isn't the initial load (previousEmailCount > 0)
    if (soundEnabled && currentEmailCount > previousEmailCount.current && previousEmailCount.current > 0) {
      playNotificationSound();
      
      // Show toast notification
      toast.success('New Email Received!', {
        description: emails[0]?.subject || 'Check your inbox',
        duration: 3000,
      });
    }
    
    previousEmailCount.current = currentEmailCount;
  }, [emails.length, soundEnabled]);

  const playNotificationSound = () => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    }
  };

  // Show welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Combine welcome message with actual emails
  const allEmails = showWelcome ? [WELCOME_MESSAGE, ...emails] : emails;

  // Handle delete with confirmation
  const handleDelete = (emailId: string, emailSubject: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent email from opening when clicking delete

    // Check if it's the welcome message
    if (emailId === 'welcome-message') {
      setShowWelcome(false);
      toast.success("Welcome message removed");
      return;
    }

    // Add to deleting set for loading state
    setDeletingEmails(prev => new Set([...prev, emailId]));

    // Show confirmation toast with undo option
    toast.success(`Deleted: ${emailSubject}`, {
      description: "Message permanently removed",
      action: {
        label: "Undo",
        onClick: () => {
          setDeletingEmails(prev => {
            const newSet = new Set(prev);
            newSet.delete(emailId);
            return newSet;
          });
          toast.info("Delete cancelled");
        },
      },
      duration: 3000,
    });

    // Actually delete after a short delay (allows undo)
    setTimeout(() => {
      if (onDeleteEmail) {
        onDeleteEmail(emailId);
      }
      setDeletingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(emailId);
        return newSet;
      });
      
      // Close detail view if deleted email was selected
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    }, 3000);
  };

  const renderParsedBody = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const otpRegex = /\b\d{4,8}\b/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(part);
        if (isImage) {
          return (
            <div key={i} className="my-6 group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-10 transition duration-500"></div>
              <div className="relative bg-white p-1 rounded-xl border border-slate-100 shadow-md">
                <img 
                  src={part} 
                  alt="Transmission" 
                  className="max-w-full h-auto rounded-lg" 
                  onError={(e) => (e.currentTarget.style.display = 'none')} 
                />
              </div>
            </div>
          );
        }
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noreferrer" 
            className="text-blue-600 font-bold underline decoration-1 underline-offset-2 break-all hover:text-blue-700"
          >
            {part} <ExternalLink size={10} className="inline ml-0.5" />
          </a>
        );
      }
      
      const subParts = part.split(otpRegex);
      const matches = part.match(otpRegex);
      return (
        <span key={i}>
          {subParts.map((sub, idx) => (
            <React.Fragment key={idx}>
              {sub}
              {matches?.[idx] && (
                <span 
                  className="mx-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-sm font-black shadow-sm cursor-pointer hover:bg-blue-700 transition-colors inline-flex items-center"
                  onClick={() => { 
                    navigator.clipboard.writeText(matches[idx]); 
                    toast.success("Code Copied", { description: matches[idx] }); 
                  }}
                >
                  <Hash size={10} className="mr-1" /> {matches[idx]}
                </span>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  const getInitials = (email: string) => email.split('@')[0].slice(0, 1).toUpperCase();

  if (isFetching && emails.length === 0 && !showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-3" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Feed...</p>
      </div>
    );
  }

  if (allEmails.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Mail className="w-5 h-5 text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Frequency Silent</h3>
        <p className="text-xs text-slate-400 max-w-[200px] mx-auto">Waiting for incoming secure transmissions...</p>
      </div>
    );
  }

  if (selectedEmail) {
    const isDeleting = deletingEmails.has(selectedEmail.id);
    const isWelcomeMsg = selectedEmail.id === 'welcome-message';

    return (
      <div className="animate-in fade-in slide-in-from-right-2 duration-200">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSelectedEmail(null)} 
          className="mb-4 -ml-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-wider"
        >
          <ArrowLeft className="mr-1.5 h-3 w-3" /> Back
        </Button>
        
        <div className={`bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg transition-opacity ${isDeleting ? 'opacity-50' : 'opacity-100'}`}>
          <div className={`p-5 md:p-6 ${isWelcomeMsg ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-950'} text-white`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-lg md:text-xl font-bold leading-tight flex-1">
                {selectedEmail.subject}
              </h2>
              {isWelcomeMsg && (
                <Gift className="w-6 h-6 text-white/80 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-3 border-t border-white/10 pt-4">
              <div className={`w-9 h-9 rounded-lg ${isWelcomeMsg ? 'bg-white/20' : 'bg-blue-600'} flex items-center justify-center text-white font-black text-sm`}>
                {getInitials(selectedEmail.from)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">{selectedEmail.from}</p>
                <p className="text-[9px] text-white/40 uppercase font-black tracking-tighter">
                  {format(new Date(selectedEmail.timestamp), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap selection:bg-blue-100">
            {renderParsedBody(selectedEmail.body)}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
             <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {isWelcomeMsg ? 'Official Message' : 'Isolated Session'}
                </span>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <Button 
                 size="sm"
                 variant="outline"
                 className="flex-1 sm:flex-none h-9 px-4 rounded-lg border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs"
                 onClick={() => { 
                   navigator.clipboard.writeText(selectedEmail.body); 
                   toast.success("Copied to clipboard"); 
                 }}
               >
                  <Copy size={12} className="mr-1.5" /> Copy
               </Button>
               <Button 
                 size="sm"
                 variant="destructive"
                 disabled={isDeleting}
                 className="flex-1 sm:flex-none h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
                 onClick={(e) => handleDelete(selectedEmail.id, selectedEmail.subject, e)}
               >
                  <Trash2 size={12} className="mr-1.5" /> 
                  {isDeleting ? 'Deleting...' : 'Delete'}
               </Button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter out emails that are being deleted
  const visibleEmails = allEmails.filter(email => !deletingEmails.has(email.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Encrypted Feed ({visibleEmails.length})
        </h3>
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          
          <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[8px] font-black text-emerald-600 uppercase">Live</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-2">
        {visibleEmails.map((email, i) => {
          const isDeleting = deletingEmails.has(email.id);
          const isWelcomeMsg = email.id === 'welcome-message';

          return (
            <div 
              key={email.id} 
              onClick={() => setSelectedEmail(email)} 
              className={`bg-white border ${isWelcomeMsg ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'} p-4 rounded-xl cursor-pointer hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-4 group animate-in fade-in ${isDeleting ? 'opacity-50' : 'opacity-100'}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg ${isWelcomeMsg ? 'bg-blue-100' : 'bg-slate-50'} flex items-center justify-center ${isWelcomeMsg ? 'text-blue-600' : 'text-slate-300'} font-black text-base group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0`}>
                {isWelcomeMsg ? <Gift size={20} /> : getInitials(email.from)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-[9px] font-black ${isWelcomeMsg ? 'text-blue-600' : 'text-slate-400'} uppercase truncate group-hover:text-blue-500 transition-colors`}>
                    {email.from}
                  </p>
                  <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                    <Clock size={8} /> {format(new Date(email.timestamp), "p")}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors leading-none mb-1">
                  {email.subject}
                </p>
                <p className="text-[11px] text-slate-400 truncate opacity-70">
                  {(email.body || "").slice(0, 60)}...
                </p>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(email.id, email.subject, e)}
                disabled={isDeleting}
                className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete message"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      {visibleEmails.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900 mb-1">Auto-Delete Notice</p>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                All messages will be permanently deleted after 5 minutes. You can also manually delete them anytime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;