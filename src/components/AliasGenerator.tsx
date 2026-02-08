import React from "react";
import { Layout, Globe, Dice5, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AliasGeneratorProps {
  customPrefix: string;
  setCustomPrefix: (val: string) => void;
  onAttempt: (type: 'manual' | 'random') => void;
  disabled: boolean;
}

const AliasGenerator = ({ customPrefix, setCustomPrefix, onAttempt, disabled }: AliasGeneratorProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-10 relative group">
      {/* Subtle background glow */}
      <div className="absolute -inset-6 bg-blue-600/[0.02] blur-[80px] rounded-full -z-10 group-hover:bg-blue-600/[0.05] transition-all duration-1000" />
      
      <div className="bg-white p-2 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden">
        <div className="bg-slate-50/50 p-4 md:p-6 rounded-[1.5rem] flex flex-col sm:flex-row gap-3 items-center border border-white/50">
          
          <div className="flex-1 w-full relative flex items-center group/input">
            <div className="absolute left-4 flex items-center pointer-events-none z-10">
               <Layout className="w-4 h-4 text-blue-500/30 group-focus-within/input:text-blue-500 transition-colors" />
            </div>
            
            <input 
              placeholder="choose-alias" 
              maxLength={12}
              disabled={disabled}
              value={customPrefix}
              onChange={(e) => setCustomPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
              className="w-full h-12 text-sm md:text-base pl-10 pr-6 rounded-xl bg-white border-none shadow-sm ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-600/5 transition-all font-mono text-slate-900 placeholder:text-slate-300 disabled:opacity-50"
            />

            {/* Compact Floating Domain Badge */}
            <div className="absolute right-2 hidden md:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg shadow-md border border-white/5 pointer-events-none transform group-focus-within/input:scale-105 transition-transform">
               <span className="text-[10px] font-bold text-white italic">@pandeykapil.com.np</span>
               <Globe size={12} className="text-blue-400" />
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <Button 
              onClick={() => onAttempt('manual')} 
              disabled={disabled}
              className="h-12 flex-1 sm:px-8 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 mr-1.5" /> Join
            </Button>
            <Button 
              variant="outline" 
              disabled={disabled}
              onClick={() => onAttempt('random')} 
              className="h-12 w-12 rounded-xl border-2 border-slate-100 bg-white hover:bg-slate-50 transition-all active:rotate-180 duration-500 group/dice"
            >
              <Dice5 size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </Button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="p-3 text-center bg-white border-t border-slate-50">
           <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-emerald-500" /> RELAY UP</div>
              <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> AES-256</div>
              <div className="flex items-center gap-1.5"><span className={customPrefix.length >= 12 ? "text-rose-500" : "text-blue-500"}>{customPrefix.length}/12</span> CHARS</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AliasGenerator;