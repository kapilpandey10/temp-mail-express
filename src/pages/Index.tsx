import React, { useState, useEffect, useCallback } from "react";
import { Bomb, RefreshCw, Dice5, ShieldCheck, Zap, LockKeyhole, Timer, UserCheck, X, CheckCircle2, ShieldAlert, Clock } from "lucide-react";
import { Inbox } from "../components/Inbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";

const WORKER_URL = "https://temp-mail-backend.kapilpandey2068.workers.dev";
const API_TOKEN = "kapil_secure_token_2026"; 

const Index = () => {
  const queryClient = useQueryClient();
  const [currentEmail, setCurrentEmail] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");
  const [usage, setUsage] = useState({ count: 0, resetIn: "24h" });
  const [timeLeft, setTimeLeft] = useState(300); // 5 Minutes
  
  // Captcha Modal States
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingType, setPendingType] = useState<'manual' | 'random' | null>(null);
  const [mathProblem, setMathProblem] = useState({ q: "", a: 0 });
  const [userAnswer, setUserAnswer] = useState("");

  // Logic: 5-Minute Timer
  useEffect(() => {
    if (!currentEmail) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEmail]);

  // Logic: Human Check Generation
  const generateMath = useCallback(() => {
    const n1 = Math.floor(Math.random() * 15) + 5;
    const n2 = Math.floor(Math.random() * 9) + 2;
    setMathProblem({ q: `${n1} + ${n2}`, a: n1 + n2 });
    setUserAnswer("");
  }, []);

  const updateStats = useCallback(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("email_limit") || '{"date": "", "count": 0}');
    setUsage({ count: stored.date === today ? stored.count : 0, resetIn: "24h" });
  }, []);

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  const { data: emails = [], refetch, isFetching } = useQuery({
    queryKey: ["emails", currentEmail],
    queryFn: async () => {
      const res = await fetch(`${WORKER_URL}/messages?email=${currentEmail}`, {
        headers: { "Authorization": `Bearer ${API_TOKEN}` }
      });
      return res.json();
    },
    enabled: !!currentEmail,
  });

  const handleAttempt = (type: 'manual' | 'random') => {
    if (type === 'manual' && customPrefix.length < 3) return toast.error("Prefix too short");
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("email_limit") || '{"count": 0}');
    if (stored.date === today && stored.count >= 5) return toast.error("Daily Limit Reached (5/5)");
    
    generateMath();
    setPendingType(type);
    setShowCaptcha(true);
  };

  const handleVerifyAndCreate = async () => {
    if (parseInt(userAnswer) !== mathProblem.a) {
      toast.error("Security Failed", { description: "Incorrect math. Try again." });
      generateMath();
      return;
    }
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("email_limit") || '{"count": 0}');
    const prefix = pendingType === 'random' ? Math.random().toString(36).substring(2, 8) : customPrefix.toLowerCase().trim();
    
    localStorage.setItem("email_limit", JSON.stringify({ date: today, count: (stored.date === today ? stored.count : 0) + 1 }));
    await queryClient.cancelQueries({ queryKey: ["emails"] });
    
    setCurrentEmail(`${prefix}@pandeykapil.com.np`);
    setTimeLeft(300); // Reset countdown
    setShowCaptcha(false);
    updateStats();
    toast.success("Security Verified");
  };

  const handleSelfDestruct = async () => {
    if (!currentEmail || !window.confirm("PERMANENT WIPE: Delete all data?")) return;
    await fetch(`${WORKER_URL}/messages?email=${currentEmail}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${API_TOKEN}` }
    });
    setCurrentEmail("");
    setCustomPrefix("");
    toast.error("Inbox Purged");
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-blue-100 pb-10">
      
      {/* MOBILE OPTIMIZED NAV */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 md:h-24 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 md:p-2.5 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/20">
              <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">Temp<span className="text-blue-600">Mail</span></span>
          </div>
          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Limit Status</span>
              <div className="flex items-center gap-2">
                <Progress value={(usage.count / 5) * 100} className="w-16 md:w-24 h-1.5 bg-slate-100" />
                <span className="text-[10px] font-black text-slate-600">{usage.count}/5</span>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 md:px-5 py-1.5 rounded-xl text-[9px] md:text-[11px] font-black border border-blue-100 tracking-widest">100% FREE</div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 max-w-5xl pt-10 md:pt-20">
        {/* HERO */}
        <div className="text-center space-y-4 md:space-y-8 mb-12 md:mb-20">
          <h2 className="text-5xl md:text-[11rem] font-black tracking-tighter leading-[0.85] text-slate-950">
            Private <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Protocol.</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-xl max-w-2xl mx-auto px-4">
            Disposable addresses for <span className="text-slate-950 font-black border-b-2 md:border-b-4 border-blue-100">pandeykapil.com.np</span>.
          </p>
        </div>

        {/* GENERATOR */}
        <div className="bg-white p-2 md:p-3 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-50 mb-12 md:mb-20">
          <div className="bg-slate-50 p-6 md:p-16 rounded-[2rem] md:rounded-[3.5rem] flex flex-col lg:flex-row gap-4 md:gap-6 items-center">
            <div className="flex-1 w-full relative">
              <Input 
                placeholder="username" 
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                className="h-16 md:h-24 text-xl md:text-3xl pl-6 md:pl-10 rounded-2xl md:rounded-[2rem] bg-white border-none shadow-sm ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-600/10 transition-all font-mono"
              />
              <span className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl italic opacity-50">@pandeykapil.com.np</span>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button onClick={() => handleAttempt('manual')} className="h-16 md:h-24 flex-1 lg:px-20 rounded-2xl md:rounded-[2rem] bg-slate-950 hover:bg-black text-white font-black text-xl md:text-2xl shadow-xl active:scale-95 transition-all">
                Create
              </Button>
              <Button variant="outline" onClick={() => handleAttempt('random')} className="h-16 w-16 md:h-24 md:w-24 rounded-2xl md:rounded-[2rem] border-2 border-white bg-white shadow-md hover:bg-slate-50 text-slate-400">
                <Dice5 className="w-6 h-6 md:w-10 md:h-10" />
              </Button>
            </div>
          </div>
        </div>

        {/* ACTIVE INBOX */}
        {currentEmail && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-50 shadow-2xl overflow-hidden mb-12">
               <div className="p-8 md:p-16 bg-slate-950 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-widest">
                       <Timer className="w-4 h-4 animate-pulse" /> Purge in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-xl md:text-5xl font-mono font-bold tracking-tight break-all">{currentEmail}</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="ghost" onClick={handleSelfDestruct} className="bg-white/5 hover:bg-rose-500/20 text-rose-400 h-14 md:h-16 flex-1 md:flex-initial rounded-2xl font-black border border-white/5 uppercase tracking-widest text-[10px]">
                       <Bomb className="w-4 h-4 md:w-5 md:h-5 mr-2" /> WIPE
                    </Button>
                    <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-500 text-white h-14 md:h-16 flex-1 md:flex-initial rounded-2xl font-black text-sm md:text-lg shadow-2xl shadow-blue-600/30">
                       <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 mr-2 ${isFetching ? "animate-spin" : ""}`} /> REFRESH
                    </Button>
                  </div>
               </div>
               <div className="p-6 md:p-20">
                  <Inbox emails={emails} onDeleteEmail={() => {}} />
               </div>
            </div>
          </div>
        )}

        {/* FEATURES */}
        {!currentEmail && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-20">
            <FeatureCard icon={<Zap />} title="Instant" desc="Codes arrive in <500ms." color="amber" />
            <FeatureCard icon={<Clock />} title="Clean" desc="5-min auto-purge cycle." color="blue" />
            <FeatureCard icon={<ShieldCheck />} title="Dark" desc="No logs. No tracking." color="emerald" />
          </div>
        )}
      </main>

      {/* --- MOBILE VERIFICATION MODAL --- */}
      {showCaptcha && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 relative shadow-2xl border-4 border-white/10">
            <button onClick={() => setShowCaptcha(false)} className="absolute top-6 right-6 md:top-12 md:right-12 text-slate-300 hover:text-slate-950 transition-colors">
              <X className="w-6 h-6 md:w-10 md:h-10" />
            </button>
            <div className="text-center space-y-6 md:space-y-12">
              <div className="inline-flex p-4 md:p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20">
                <LockKeyhole className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Human Verification</h3>
              
              <div className="bg-slate-950 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-10 border border-white/10 shadow-2xl shadow-black/40">
                <div className="text-4xl md:text-6xl font-mono font-black text-blue-500 tracking-[0.2em] select-none">
                  {mathProblem.q} =
                </div>
                <Input 
                  type="number" 
                  autoFocus
                  placeholder="?"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyAndCreate()}
                  className="w-full h-16 md:h-24 text-center text-4xl md:text-6xl font-black bg-slate-900 border-none text-white rounded-2xl md:rounded-[2rem] focus:ring-4 focus:ring-blue-600 transition-all placeholder:text-slate-800"
                />
              </div>
              <Button onClick={handleVerifyAndCreate} className="w-full h-16 md:h-24 rounded-2xl md:rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg md:text-2xl shadow-2xl active:scale-95 transition-all">
                Confirm Protocols
              </Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
  <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl flex flex-row md:flex-col items-center gap-6">
    <div className={`w-12 h-12 md:w-16 md:h-16 bg-${color}-50 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0`}>
      {React.cloneElement(icon, { className: `w-6 h-6 md:w-8 md:h-8 text-${color}-600` })}
    </div>
    <div className="text-left md:text-center">
      <h3 className="text-lg md:text-2xl font-black tracking-tight">{title}</h3>
      <p className="text-slate-500 text-xs md:text-sm font-medium">{desc}</p>
    </div>
  </div>
);

export default Index;