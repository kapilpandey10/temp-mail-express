import React, { useState, useEffect, useCallback } from "react";
import { Bomb, RefreshCw, Dice5, ShieldCheck, Zap, LockKeyhole, Timer, UserCheck, X, CheckCircle2, Share, PlusSquare, Smartphone, Copy, Check, Shield, Lock, Eye, EyeOff, Sparkles, Mail, Trash2, Download, Apple } from "lucide-react";
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
  const [isCopied, setIsCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  // Captcha Modal States
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingType, setPendingType] = useState<'manual' | 'random' | null>(null);
  const [mathProblem, setMathProblem] = useState({ q: "", a: 0 });
  const [userAnswer, setUserAnswer] = useState("");

  // Animation states
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Generate floating background elements
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingElements(elements);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS instructions toast
      toast.info("Install on iOS", {
        description: "Tap the Share button and select 'Add to Home Screen'",
        duration: 6000,
      });
      return;
    }

    if (!deferredPrompt) {
      toast.error("Installation not available", {
        description: "Your browser doesn't support app installation or it's already installed.",
      });
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success("App installed successfully! 🎉", {
        description: "You can now access TempMail from your home screen",
      });
      setIsInstallable(false);
    } else {
      toast.info("Installation cancelled");
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

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
    refetchInterval: 10000,
  });

  const handleCopy = useCallback(() => {
    if (!currentEmail) return;
    navigator.clipboard.writeText(currentEmail);
    setIsCopied(true);
    toast.success("Copied to clipboard", {
      description: currentEmail,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
    });
    setTimeout(() => setIsCopied(false), 2000);
  }, [currentEmail]);

  const handleAttempt = (type: 'manual' | 'random') => {
    if (type === 'manual' && customPrefix.length < 3) {
      toast.error("Prefix must be at least 3 characters");
      return;
    }
    generateMath();
    setPendingType(type);
    setShowCaptcha(true);
  };

  const handleVerifyAndCreate = async () => {
    if (parseInt(userAnswer) !== mathProblem.a) {
      toast.error("Incorrect answer. Please try again.");
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
    setCustomPrefix("");
    updateStats();
    toast.success("🎉 Temporary email created!", {
      description: "Your secure inbox is ready"
    });
  };

  const handleDeleteEmail = useCallback(async () => {
    if (!currentEmail) return;
    
    try {
      await fetch(`${WORKER_URL}/messages?email=${currentEmail}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${API_TOKEN}` }
      });
      
      setCurrentEmail("");
      queryClient.removeQueries({ queryKey: ["emails"] });
      toast.success("Email deleted successfully");
    } catch (error) {
      toast.error("Failed to delete email");
    }
  }, [currentEmail, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 selection:bg-blue-200 pb-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}} />

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl" />
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-2 md:p-2.5 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <span className="text-lg md:text-2xl font-black uppercase tracking-tighter bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
              Temp<span className="text-blue-600">Mail</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Install Button - Only show if not installed */}
            {!isStandalone && (
              <Button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-black shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all flex items-center gap-2"
              >
                {isIOS ? <Apple className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </Button>
            )}
            
            <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold border border-green-200">
              <Shield className="w-4 h-4" />
              <span>Encrypted</span>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 md:px-6 py-2 rounded-xl text-[9px] md:text-[11px] font-black border border-blue-200 tracking-widest uppercase shadow-lg shadow-blue-500/30">
              100% Free
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 max-w-6xl pt-8 md:pt-16 relative z-10">
        {/* HERO */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 shadow-lg mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-bold text-slate-700">Your Privacy Guardian</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Invisibility
            </span>
          </h1>
          
          <p className="text-slate-600 font-medium text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Create disposable email addresses instantly. No sign-up. No tracking. 
            <span className="block mt-2 font-black text-slate-900">Powered by <span className="text-blue-600">pandeykapil.com.np</span></span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold">Zero Tracking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <Timer className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold">5-Min Auto-Delete</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold">CAPTCHA Protected</span>
            </div>
          </div>
        </div>

        {/* GENERATOR */}
        <div className="relative group mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{animationDelay: '200ms'}}>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.8rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-12 rounded-[2.2rem] flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Input 
                  placeholder="your-custom-name" 
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value.replace(/[^a-z0-9]/g, ''))}
                  maxLength={20}
                  className="h-16 md:h-20 text-lg md:text-xl pl-6 pr-12 rounded-2xl bg-white border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm hidden md:block">
                  @pandeykapil.com.np
                </div>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Button 
                  onClick={() => handleAttempt('manual')} 
                  disabled={customPrefix.length < 3}
                  className="h-16 md:h-20 flex-1 lg:px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAttempt('random')} 
                  className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500 shadow-lg transform hover:scale-105 transition-all"
                >
                  <Dice5 className="w-6 h-6 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE INBOX */}
        {currentEmail && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mb-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3.2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
                  </div>

                  <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left flex-1 min-w-0 w-full">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">
                          Identity Shield Active
                        </span>
                      </div>
                      
                      <div 
                        className="flex items-center justify-center md:justify-start gap-3 group/email cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all" 
                        onClick={handleCopy}
                      >
                        <p className="text-lg md:text-3xl font-mono font-bold break-all group-hover/email:text-blue-300 transition-colors">
                          {currentEmail}
                        </p>
                        <div className="bg-white/10 p-2.5 rounded-xl group-hover/email:bg-blue-500 transition-all shrink-0">
                          {isCopied ? 
                            <Check className="w-5 h-5 text-green-400" /> : 
                            <Copy className="w-5 h-5" />
                          }
                        </div>
                      </div>

                      <p className="text-xs text-blue-200 mt-3 font-medium">
                        Auto-deletes in 5 minutes • Click to copy
                      </p>
                    </div>
                    
                    <div className="flex gap-3 shrink-0">
                      <Button 
                        onClick={() => refetch()} 
                        className="bg-blue-600 hover:bg-blue-500 h-14 px-6 rounded-2xl font-black shadow-lg transform hover:scale-105 transition-all"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> 
                        Refresh
                      </Button>
                      
                      <Button 
                        onClick={handleDeleteEmail}
                        variant="outline"
                        className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white h-14 px-6 rounded-2xl font-black shadow-lg transform hover:scale-105 transition-all"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Inbox Content */}
                <div className="p-6 md:p-10">
                  <Inbox emails={emails} onDeleteEmail={() => {}} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PWA INSTALLATION SECTION */}
        {!currentEmail && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{animationDelay: '600ms'}}>
            {/* PWA Promo with Install Button */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Smartphone className="w-64 h-64 rotate-12" />
              </div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTJjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
              
              <div className="relative z-10 flex flex-col justify-center h-full">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-none">
                  Use it like<br />a <span className="italic">Pro App</span>
                </h3>
                <p className="text-blue-100 font-medium mb-8 leading-relaxed text-lg">
                  Install <span className="font-black text-white">TempMail</span> on your device for instant, offline access
                </p>
                
                {/* Install Button */}
                {!isStandalone && (
                  <Button
                    onClick={handleInstallClick}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-16 px-8 rounded-2xl font-black text-lg shadow-2xl transform hover:scale-105 transition-all mb-6 flex items-center justify-center gap-3"
                  >
                    {isIOS ? (
                      <>
                        <Apple className="w-6 h-6" />
                        View Instructions
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6" />
                        Install Now
                      </>
                    )}
                  </Button>
                )}

                {isStandalone && (
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-300" />
                      <span className="font-bold">App already installed!</span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/30 transition-all">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/30 transition-all">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/30 transition-all">
                    <Timer className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Steps - Only show for iOS */}
            {isIOS && (
              <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl flex flex-col justify-center">
                <h4 className="text-sm font-black mb-10 uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Install on iPhone
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-6 group hover:translate-x-2 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shrink-0">
                      1
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-bold text-slate-900 mb-1">Tap the Share button</p>
                      <p className="text-sm text-slate-500">Look for <Share className="w-4 h-4 inline mx-1 text-blue-600" /> at the bottom of Safari</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 group hover:translate-x-2 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shrink-0">
                      2
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-bold text-slate-900 mb-1">Add to Home Screen</p>
                      <p className="text-sm text-slate-500">Tap <PlusSquare className="w-4 h-4 inline mx-1 text-indigo-600" /> in the menu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 group hover:translate-x-2 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shrink-0">
                      3
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-bold text-slate-900 mb-1">Confirm installation</p>
                      <p className="text-sm text-slate-500">Tap <span className="font-bold text-purple-600">Add</span> in the top right corner</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Android/Desktop - Show feature cards instead */}
            {!isIOS && (
              <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl">
                <h4 className="text-sm font-black mb-8 uppercase tracking-widest text-slate-400">
                  Why Install?
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Lightning Fast Access</h5>
                      <p className="text-sm text-slate-600">Launch instantly from your home screen or app drawer</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Works Offline</h5>
                      <p className="text-sm text-slate-600">Access your temporary emails even without internet</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">Native App Experience</h5>
                      <p className="text-sm text-slate-600">Full-screen mode with no browser UI distractions</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FEATURES GRID */}
        {!currentEmail && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{animationDelay: '400ms'}}>
            <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-black mb-2">Military-Grade Security</h3>
                <p className="text-slate-600 leading-relaxed">CAPTCHA verification and encrypted connections protect your privacy</p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black mb-2">Instant Creation</h3>
                <p className="text-slate-600 leading-relaxed">Generate temporary emails in seconds without any registration</p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Timer className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-black mb-2">Auto-Delete</h3>
                <p className="text-slate-600 leading-relaxed">Messages automatically vanish after 5 minutes for maximum privacy</p>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION MODAL */}
        {showCaptcha && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
              <button 
                onClick={() => setShowCaptcha(false)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center space-y-6">
                <div className="inline-flex p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/30">
                  <LockKeyhole className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">Security Check</h3>
                  <p className="text-slate-500 font-medium">Verify you're human to continue</p>
                </div>
                
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-3xl space-y-6 shadow-xl">
                  <div className="text-4xl font-mono font-black text-blue-400 tracking-widest animate-in zoom-in duration-500">
                    {mathProblem.q} = ?
                  </div>
                  <Input 
                    type="number" 
                    autoFocus 
                    value={userAnswer} 
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyAndCreate()}
                    className="w-full h-16 text-center text-3xl font-black bg-slate-800/50 border-2 border-blue-500/30 text-white rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="?"
                  />
                </div>
                
                <Button 
                  onClick={handleVerifyAndCreate} 
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg shadow-xl shadow-blue-500/30 transform hover:scale-105 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Verify & Continue
                </Button>
                
                <p className="text-xs text-slate-400">
                  This helps us prevent spam and abuse
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(-10px) translateX(-10px);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;