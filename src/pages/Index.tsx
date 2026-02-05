import React, { useState, useEffect, useCallback } from "react";
import { Bomb, RefreshCw, Dice5, ShieldCheck, Zap, LockKeyhole, Timer, UserCheck, X, CheckCircle2, Share, PlusSquare, Smartphone } from "lucide-react";
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
  
  // Captcha Modal States
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingType, setPendingType] = useState<'manual' | 'random' | null>(null);
  const [mathProblem, setMathProblem] = useState({ q: "", a: 0 });
  const [userAnswer, setUserAnswer] = useState("");

  const generateMath = useCallback(() => {
    const n1 = Math.floor(Math.random() * 12) + 5;
    const n2 = Math.floor(Math.random() * 8) + 2;
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
    generateMath();
    setPendingType(type);
    setShowCaptcha(true);
  };

  const handleVerifyAndCreate = async () => {
    if (parseInt(userAnswer) !== mathProblem.a) {
      toast.error("Verification Failed");
      generateMath();
      return;
    }
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("email_limit") || '{"count": 0}');
    const prefix = pendingType === 'random' ? Math.random().toString(36).substring(2, 8) : customPrefix.toLowerCase().trim();
    localStorage.setItem("email_limit", JSON.stringify({ date: today, count: (stored.date === today ? stored.count : 0) + 1 }));
    await queryClient.cancelQueries({ queryKey: ["emails"] });
    setCurrentEmail(`${prefix}@pandeykapil.com.np`);
    setShowCaptcha(false);
    updateStats();
    toast.success("Security Verified");
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-blue-100 pb-10">
      
      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 md:h-24 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 md:p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">Temp<span className="text-blue-600">Mail</span></span>
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 md:px-5 py-1.5 rounded-xl text-[9px] md:text-[11px] font-black border border-blue-100 tracking-widest uppercase">100% Free Pro</div>
        </div>
      </nav>

      <main className="container mx-auto px-4 max-w-5xl pt-10 md:pt-20">
        {/* HERO */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-5xl md:text-[9rem] font-black tracking-tighter leading-none text-slate-950">
            Digital <br /><span className="text-blue-600">Invisibility.</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-xl max-w-xl mx-auto">
            Disposable addresses on <span className="font-black text-slate-900 italic">pandeykapil.com.np</span>. 
          </p>
        </div>

        {/* GENERATOR */}
        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-50 mb-16">
          <div className="bg-slate-50 p-6 md:p-14 rounded-[2rem] flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Input 
                placeholder="username" 
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                className="h-16 md:h-20 text-xl pl-6 rounded-2xl bg-white border-none shadow-sm ring-1 ring-slate-200"
              />
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <Button onClick={() => handleAttempt('manual')} className="h-16 md:h-20 flex-1 lg:px-12 rounded-2xl bg-slate-950 text-white font-black text-lg">
                Create
              </Button>
              <Button variant="outline" onClick={() => handleAttempt('random')} className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border-2 border-white bg-white">
                <Dice5 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* ACTIVE INBOX */}
        {currentEmail && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mb-20">
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-2xl overflow-hidden">
               <div className="p-8 md:p-12 bg-slate-950 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 italic">Identity Shield Active</span>
                    <p className="text-xl md:text-4xl font-mono font-bold break-all">{currentEmail}</p>
                  </div>
                  <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-500 h-14 px-8 rounded-2xl font-black shadow-lg">
                     <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> REFRESH
                  </Button>
               </div>
               <div className="p-6 md:p-12">
                  <Inbox emails={emails} onDeleteEmail={() => {}} />
               </div>
            </div>
          </div>
        )}

        {/* NEW SECTION: IPHONE INSTALLATION GUIDE */}
        {!currentEmail && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* The "Why" Card */}
            <div className="bg-blue-600 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-blue-600/20 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Smartphone className="w-64 h-64 rotate-12" /></div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 italic leading-none">Use it like <br />a Pro App.</h3>
              <p className="text-blue-100 font-medium mb-8 leading-relaxed">
                Add <b>pandeykapil.com.np</b> to your home screen to receive OTPs instantly without opening your browser. Secure, fast, and always ready.
              </p>
              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10"><ShieldCheck className="w-6 h-6" /></div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10"><Zap className="w-6 h-6" /></div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10"><Timer className="w-6 h-6" /></div>
              </div>
            </div>

            {/* The "How" Card (Visual Instructions) */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-center">
              <h4 className="text-xl font-black mb-8 uppercase tracking-widest text-slate-400">Install on iPhone</h4>
              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 border border-slate-100">1</div>
                  <p className="font-bold text-slate-700">Tap the <Share className="w-5 h-5 inline mx-1 text-blue-600" /> <b>Share</b> button in Safari</p>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 border border-slate-100">2</div>
                  <p className="font-bold text-slate-700">Scroll down and tap <PlusSquare className="w-5 h-5 inline mx-1 text-blue-600" /> <b>Add to Home Screen</b></p>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 border border-slate-100">3</div>
                  <p className="font-bold text-slate-700">Tap <b>Add</b> in the top right corner</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION MODAL */}
        {showCaptcha && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl">
              <button onClick={() => setShowCaptcha(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-950"><X className="w-6 h-6" /></button>
              <div className="text-center space-y-8">
                <div className="inline-flex p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20"><LockKeyhole className="w-8 h-8 text-white" /></div>
                <h3 className="text-3xl font-black tracking-tight">Human Check</h3>
                <div className="bg-slate-950 p-8 rounded-[2rem] space-y-6">
                  <div className="text-3xl font-mono font-black text-blue-500 tracking-widest">{mathProblem.q} =</div>
                  <Input type="number" autoFocus value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="w-full h-16 text-center text-3xl font-black bg-slate-900 border-none text-white rounded-2xl focus:ring-2 focus:ring-blue-600" />
                </div>
                <Button onClick={handleVerifyAndCreate} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/30">Verify & Continue</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;