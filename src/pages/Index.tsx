import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Zap, Timer, Sparkles, Fingerprint, Volume2, VolumeX, 
  Copy, RefreshCw, Smartphone, Share, PlusSquare, 
  CheckCircle2, Shield, Cpu, Terminal, Layers,
  ChevronRight, Activity, Check, Lock, Globe, 
  ArrowRight, Star, Inbox as InboxIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Modular Component Imports
import AliasGenerator from "../components/AliasGenerator";
import Inbox from "../components/Inbox";
import SecurityModal from "../components/SecurityCheck";

// --- CONFIGURATION ---
const WORKER_URL = "https://temp-mail-backend.kapilpandey2068.workers.dev";
const API_TOKEN = "kapil_secure_token_2026"; 
const EMAIL_LIFETIME = 5 * 60; 

const Index = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [emailCreatedAt, setEmailCreatedAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(EMAIL_LIFETIME);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deletedEmails, setDeletedEmails] = useState<Set<string>>(new Set());
  
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingType, setPendingType] = useState<'manual' | 'random' | null>(null);
  const [mathProblem, setMathProblem] = useState({ q: "", a: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const prevEmailCount = useRef(0);

  useEffect(() => {
    let id = localStorage.getItem("kp_device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("kp_device_id", id);
    }
    setDeviceId(id);
    const savedSound = localStorage.getItem("sound_enabled");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const { data: allEmails = [], refetch, isFetching } = useQuery({
    queryKey: ["emails", currentEmail, deviceId],
    queryFn: async () => {
      if (!currentEmail || !deviceId) return [];
      const res = await fetch(`${WORKER_URL}/messages?email=${currentEmail}`, {
        headers: { 
          "Authorization": `Bearer ${API_TOKEN}`, 
          "X-Device-ID": deviceId, 
          "Accept": "application/json" 
        }
      });
      if (!res.ok) {
        if (res.status === 403) toast.error("Access Forbidden - Hardware Mismatch");
        throw new Error("Connection Interrupted");
      }
      const data = await res.json();
      if (data.length > prevEmailCount.current && soundEnabled && prevEmailCount.current > 0) {
        toast.success("New Message Received! 🔔");
      }
      prevEmailCount.current = data.length;
      return data;
    },
    enabled: !!currentEmail && !!deviceId,
    refetchInterval: 10000,
  });

  // Filter out deleted emails
  const emails = allEmails.filter(email => !deletedEmails.has(email.id));

  const handleDeleteEmail = (emailId: string) => {
    setDeletedEmails(prev => new Set([...prev, emailId]));
  };

  useEffect(() => {
    if (!emailCreatedAt) return;
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - emailCreatedAt) / 1000);
      const remaining = Math.max(0, EMAIL_LIFETIME - elapsed);
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        setCurrentEmail("");
        setEmailCreatedAt(null);
        setDeletedEmails(new Set());
        toast.error("Session expired - All data purged");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [emailCreatedAt]);

  const onAttempt = (type: 'manual' | 'random') => {
    if (type === 'manual' && customPrefix.length < 3) {
      return toast.error("Alias must be at least 3 characters");
    }
    const n1 = Math.floor(Math.random() * 12) + 6;
    const n2 = Math.floor(Math.random() * 8) + 3;
    setMathProblem({ q: `${n1} + ${n2}`, a: n1 + n2 });
    setUserAnswer("");
    setPendingType(type);
    setShowCaptcha(true);
  };

  const handleVerifyAndCreate = () => {
    if (parseInt(userAnswer) !== mathProblem.a) {
      return toast.error("Incorrect answer - Please try again");
    }
    const prefix = pendingType === 'random' 
      ? Math.random().toString(36).substring(2, 12) 
      : customPrefix.toLowerCase().trim();
    setCurrentEmail(`${prefix}@pandeykapil.com.np`);
    setEmailCreatedAt(Date.now());
    prevEmailCount.current = 0;
    setDeletedEmails(new Set());
    setShowCaptcha(false);
    toast.success("Email address activated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 selection:bg-blue-100">
      
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-xl opacity-30 rounded-2xl" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-2.5 lg:p-3 rounded-2xl shadow-xl">
                  <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight">GhostMail</h1>
                <p className="text-xs font-bold text-blue-600 tracking-wider">v5.8 Alpha</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => { 
                  const ns = !soundEnabled; 
                  setSoundEnabled(ns); 
                  localStorage.setItem("sound_enabled", String(ns)); 
                  toast.info(ns ? "Sound enabled" : "Sound disabled"); 
                }}
                className="rounded-xl h-11 w-11 border border-slate-200 hover:border-slate-300"
              >
                {soundEnabled ? (
                  <Volume2 size={20} className="text-blue-600" />
                ) : (
                  <VolumeX size={20} className="text-slate-400" />
                )}
              </Button>
              
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg">
                <Fingerprint size={16} className="text-blue-400" />
                <span className="text-xs font-bold tracking-wide">Device Locked</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 lg:px-12 py-12 lg:py-20 max-w-7xl">
        
        {/* Hero Section */}
        {!currentEmail && (
          <section className="text-center mb-16 lg:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold mb-8 lg:mb-12">
              <Sparkles className="w-4 h-4" />
              Military-Grade Privacy Infrastructure
            </div>
            
            {/* Main Heading */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight mb-6 lg:mb-8">
              Ghost <span className="text-blue-600">Identity</span>
            </h2>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8 lg:mb-12">
              Create disposable email addresses instantly on{" "}
              <span className="font-bold text-slate-900">pandeykapil.com.np</span>.
              <br className="hidden md:block" />
              Built for total anonymity and digital privacy.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
              <FeatureBadge icon={<Shield size={16} />} text="Zero Tracking" />
              <FeatureBadge icon={<Cpu size={16} />} text="Edge Computing" />
              <FeatureBadge icon={<Activity size={16} />} text="Real-time Sync" />
              <FeatureBadge icon={<Lock size={16} />} text="AES-256 Encrypted" />
            </div>
          </section>
        )}

        {/* Alias Generator */}
        <AliasGenerator 
          customPrefix={customPrefix} 
          setCustomPrefix={setCustomPrefix} 
          onAttempt={onAttempt} 
          disabled={!!currentEmail} 
        />

        {/* Active Session */}
        {currentEmail && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 mb-16 lg:mb-24">
            <div className="bg-white rounded-3xl lg:rounded-[3rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden">
              
              {/* Session Header */}
              <div className="p-6 lg:p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 lg:gap-12">
                  
                  {/* Session Info */}
                  <div className="flex-1 w-full space-y-6 lg:space-y-8">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 lg:gap-6">
                      {/* Timer */}
                      <div className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <Timer 
                          size={24} 
                          className={timeRemaining < 60 ? "text-red-400 animate-pulse" : "text-blue-400"} 
                        />
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">
                            Time Left
                          </p>
                          <p className="font-mono text-2xl lg:text-3xl font-black">
                            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-emerald-500/10 backdrop-blur-md rounded-2xl border border-emerald-500/20">
                        <Activity size={24} className="text-emerald-400 animate-pulse" />
                        <div>
                          <p className="text-xs text-emerald-300 font-bold uppercase tracking-wide mb-1">
                            Status
                          </p>
                          <p className="text-xl lg:text-2xl font-black text-emerald-400">
                            Active
                          </p>
                        </div>
                      </div>

                      {/* Message Count */}
                      <div className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-blue-500/10 backdrop-blur-md rounded-2xl border border-blue-500/20">
                        <InboxIcon size={24} className="text-blue-400" />
                        <div>
                          <p className="text-xs text-blue-300 font-bold uppercase tracking-wide mb-1">
                            Messages
                          </p>
                          <p className="text-xl lg:text-2xl font-black text-blue-400">
                            {emails.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div 
                      className="cursor-pointer group"
                      onClick={() => { 
                        navigator.clipboard.writeText(currentEmail); 
                        toast.success("Email address copied!"); 
                        setIsCopied(true); 
                        setTimeout(() => setIsCopied(false), 2000); 
                      }}
                    >
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                        Your Temporary Address
                      </p>
                      <div className="flex items-center gap-4 lg:gap-6">
                        <p className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-mono font-black tracking-tight group-hover:text-blue-400 transition-colors break-all flex-1">
                          {currentEmail}
                        </p>
                        <div className="flex-shrink-0">
                          {isCopied ? (
                            <div className="p-3 lg:p-4 bg-emerald-500/20 rounded-2xl">
                              <Check size={28} className="text-emerald-400" />
                            </div>
                          ) : (
                            <div className="p-3 lg:p-4 bg-white/5 group-hover:bg-blue-600 rounded-2xl transition-all">
                              <Copy size={28} className="text-white/40 group-hover:text-white transition-colors" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <Button 
                    onClick={() => refetch()} 
                    className="w-full xl:w-auto h-14 lg:h-16 px-8 lg:px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base lg:text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                  >
                    <RefreshCw className={`w-5 h-5 lg:w-6 lg:h-6 mr-3 ${isFetching ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Inbox */}
              <div className="p-6 lg:p-12">
                <Inbox 
                  emails={emails} 
                  isFetching={isFetching}
                  onDeleteEmail={handleDeleteEmail}
                />
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!currentEmail && (
          <section className="mb-16 lg:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Column - Text */}
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div>
                  <div className="inline-flex p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 mb-6">
                    <Shield size={32} className="text-white" />
                  </div>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                    Total <span className="text-blue-600">Privacy</span>
                  </h3>
                  <p className="text-lg lg:text-xl text-slate-600 leading-relaxed">
                    Traditional email is a tracking beacon. GhostMail destroys the trace. 
                    Every message is isolated to volatile memory that evaporates when your session ends.
                  </p>
                </div>

                {/* Feature Grid */}
                <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                  <FeatureCard 
                    icon={<Terminal size={24} />}
                    title="Zero Persistence"
                    description="No physical disk storage utilized"
                  />
                  <FeatureCard 
                    icon={<Globe size={24} />}
                    title="Global Mesh"
                    description="20ms maximum response latency"
                  />
                  <FeatureCard 
                    icon={<Lock size={24} />}
                    title="AES-256 Tunneling"
                    description="Military-grade encryption"
                  />
                  <FeatureCard 
                    icon={<Layers size={24} />}
                    title="Edge Computing"
                    description="Distributed infrastructure"
                  />
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="absolute -inset-8 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl">
                  <div className="space-y-6 lg:space-y-8">
                    <SecurityMetric 
                      label="Encryption Level"
                      value="AES-256"
                      color="blue"
                    />
                    <SecurityMetric 
                      label="Session Lifetime"
                      value="5 Minutes"
                      color="emerald"
                    />
                    <SecurityMetric 
                      label="Data Recovery"
                      value="0% Possible"
                      color="red"
                    />
                    <SecurityMetric 
                      label="Tracker Blocking"
                      value="100% Active"
                      color="indigo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PWA Installation Section */}
        {!currentEmail && (
          <section className="mb-16 lg:mb-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-lg">
              
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-blue-700 text-xs font-bold mb-4">
                    <Smartphone size={14} />
                    Progressive Web App
                  </div>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                    Install <span className="text-blue-600">GhostMail</span>
                  </h3>
                  <p className="text-lg text-slate-600 max-w-2xl">
                    Add GhostMail to your home screen for instant access as a native app
                  </p>
                </div>
              </div>

              {/* Installation Steps */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-8">
                <InstallStep 
                  num="1" 
                  icon={<Share size={24} />}
                  title="Tap Share" 
                  description="Find the share icon in Safari's toolbar"
                />
                <InstallStep 
                  num="2" 
                  icon={<PlusSquare size={24} />}
                  title="Add to Home" 
                  description="Select 'Add to Home Screen' from menu"
                />
                <InstallStep 
                  num="3" 
                  icon={<CheckCircle2 size={24} />}
                  title="Launch" 
                  description="Open GhostMail as a native app"
                />
              </div>

              {/* CTA Banner */}
              <div className="p-6 lg:p-8 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <Smartphone size={28} />
                  </div>
                  <p className="text-lg lg:text-xl font-bold">
                    Optimized for iOS & Android
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  className="h-12 px-6 rounded-xl border border-white/20 text-white hover:bg-white hover:text-slate-900 font-bold"
                >
                  Learn More
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {!currentEmail && (
          <section className="mb-16 lg:mb-24">
            <div className="text-center mb-12 lg:mb-16">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                Frequently Asked <span className="text-blue-600">Questions</span>
              </h3>
              <p className="text-lg text-slate-600">
                Everything you need to know about GhostMail
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <FAQCard 
                question="Why use GhostMail?"
                answer="GhostMail uses hardware-isolated sessions that are physically locked to your device. Not even our engineers can access your messages. All data is stored in volatile memory and permanently deleted after 5 minutes."
              />
              <FAQCard 
                question="How long do emails last?"
                answer="Messages are stored for exactly 5 minutes in ephemeral RAM. After expiration, memory pointers are overwritten and data is purged with 0% recoverability."
              />
              <FAQCard 
                question="Is it good for OTPs?"
                answer="Yes! We maintain premium TLD relay nodes with 99.8% deliverability for OTP codes, social signups, and verification emails from global platforms."
              />
              <FAQCard 
                question="Can developers use this?"
                answer="Absolutely. GhostMail is free, ad-free, and provides high-performance infrastructure for developers, security researchers, and privacy enthusiasts."
              />
            </div>
          </section>
        )}

      </main>

      {/* Security Modal */}
      {showCaptcha && (
        <SecurityModal 
          mathProblem={mathProblem} 
          userAnswer={userAnswer} 
          setUserAnswer={setUserAnswer} 
          onVerify={handleVerifyAndCreate} 
          onClose={() => setShowCaptcha(false)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 max-w-7xl">
          
          {/* Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-2 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-black">GhostMail</span>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-md">
                World-class temporary email infrastructure on{" "}
                <span className="font-bold text-slate-900">pandeykapil.com.np</span>. 
                Privacy infrastructure for the next generation.
              </p>
            </div>

            {/* Links - Technical */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Technical
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">
                  Edge Relay Mesh
                </li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">
                  Volatile Memory
                </li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">
                  Hardware Lock
                </li>
              </ul>
            </div>

            {/* Links - Legal */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">
                  Terms of Service
                </li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">
                  Contact
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              © 2026 GhostMail Infrastructure • Powered by pandeykapil.com.np
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
    <div className="text-blue-600">{icon}</div>
    <span className="text-sm font-bold text-slate-700">{text}</span>
  </div>
);

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all group">
    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);

const SecurityMetric = ({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: string; 
  color: string;
}) => {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className="flex items-center justify-between p-4 lg:p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
      <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <div className={`px-4 py-2 rounded-xl font-mono font-black text-lg lg:text-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}
      </div>
    </div>
  );
};

const InstallStep = ({ 
  num, 
  icon, 
  title, 
  description 
}: { 
  num: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="text-center group">
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="text-5xl font-black text-blue-600/20 group-hover:text-blue-600/40 transition-colors">
        {num}
      </div>
      <div className="w-14 h-14 bg-slate-100 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm">
        {icon}
      </div>
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);

const FAQCard = ({ 
  question, 
  answer 
}: { 
  question: string; 
  answer: string;
}) => (
  <div className="p-6 lg:p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
    <div className="flex items-start gap-4 mb-4">
      <div className="p-2 bg-blue-50 group-hover:bg-blue-600 rounded-lg transition-colors flex-shrink-0">
        <ChevronRight size={20} className="text-blue-600 group-hover:text-white transition-colors" />
      </div>
      <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        {question}
      </h4>
    </div>
    <p className="text-slate-600 leading-relaxed pl-12">
      {answer}
    </p>
  </div>
);

export default Index;