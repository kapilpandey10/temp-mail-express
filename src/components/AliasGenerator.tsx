import React from "react";
import { Layout, Globe, Dice5, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AliasGeneratorProps {
  customPrefix: string;
  setCustomPrefix: (val: string) => void;
  onAttempt: (type: 'manual' | 'random') => void;
  disabled: boolean;
}

const AliasGenerator = ({ customPrefix, setCustomPrefix, onAttempt, disabled }: AliasGeneratorProps) => {
  const charCount = customPrefix.length;
  const charLimit = 12;
  const isNearLimit = charCount >= charLimit - 2;
  const isAtLimit = charCount >= charLimit;

  return (
    <div className="max-w-2xl mx-auto mb-10 relative group">
      {/* Animated background glow */}
      <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/[0.03] via-violet-600/[0.02] to-blue-600/[0.03] blur-3xl rounded-full -z-10 group-hover:from-blue-600/[0.08] group-hover:via-violet-600/[0.05] group-hover:to-blue-600/[0.08] transition-all duration-700" />
      
      <div className="bg-white/80 backdrop-blur-xl p-2 rounded-3xl shadow-xl border border-slate-200/60 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-violet-50/20 pointer-events-none rounded-3xl" />
        
        <div className="bg-gradient-to-br from-slate-50/80 to-white/50 p-5 md:p-7 rounded-[1.4rem] flex flex-col sm:flex-row gap-3 items-center border border-white/80 backdrop-blur-sm relative">
          
          {/* Input Container */}
          <div className="flex-1 w-full relative flex items-center group/input">
            {/* Icon */}
            <div className="absolute left-4 flex items-center pointer-events-none z-10 transition-all duration-300">
               <Layout className="w-4 h-4 text-slate-400 group-focus-within/input:text-blue-600 group-focus-within/input:scale-110 transition-all duration-300" />
            </div>
            
            {/* Input Field */}
            <input 
              placeholder="Username" 
              maxLength={charLimit}
              disabled={disabled}
              value={customPrefix}
              onChange={(e) => setCustomPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
              className="w-full h-10 text-sm md:text-base pl-11 pr-4 md:pr-48 rounded-xl bg-white/90 backdrop-blur-sm border-none shadow-sm ring-1 ring-slate-200/80 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300 font-mono text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Domain Badge - Desktop */}
            <div className="absolute right-2 hidden md:flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 px-3.5 py-2 rounded-lg shadow-lg border border-slate-700/50 pointer-events-none transform group-focus-within/input:scale-[1.02] group-focus-within/input:shadow-xl transition-all duration-300">
               <span className="text-[13px] font-semibold text-white/90 tracking-tight">@pandeykapil.com.np</span>
               <Globe size={13} className="text-blue-400 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
            <Button 
              onClick={() => onAttempt('manual')} 
              disabled={disabled || charCount === 0}
              className="h-13 flex-1 sm:min-w-[120px] sm:px-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-slate-900 disabled:hover:to-slate-800 group/btn"
            >
              <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" /> 
              <span>Create Email</span>
            </Button>
            
            <Button 
              variant="outline" 
              disabled={disabled}
              onClick={() => onAttempt('random')} 
              className="h-13 w-13 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 transition-all duration-300 active:rotate-180 shadow-sm hover:shadow-md group/dice"
              title="Generate random username"
            >
              <Dice5 size={20} className="text-slate-400 group-hover/dice:text-blue-600 transition-colors duration-300" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced Status Bar */}
        <div className="px-4 py-3.5 text-center bg-gradient-to-r from-white/50 via-slate-50/50 to-white/50 border-t border-slate-100/80 backdrop-blur-sm rounded-b-[1.3rem]">
           <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2 text-slate-500 transition-colors duration-300 hover:text-emerald-600 group/status">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </div>
                <span className="group-hover/status:translate-x-0.5 transition-transform">Relay Active</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 transition-colors duration-300 hover:text-blue-600 group/status">
                <ShieldCheck size={12} className="text-blue-500" />
                <span className="group-hover/status:translate-x-0.5 transition-transform">AES-256</span>
              </div>
              
              <div className="flex items-center gap-2 transition-colors duration-300">
                <span className={`font-mono transition-all duration-300 ${
                  isAtLimit ? "text-rose-500 scale-110" : 
                  isNearLimit ? "text-amber-500" : 
                  "text-blue-600"
                }`}>
                  {charCount}/{charLimit}
                </span>
                <span className="text-slate-400">chars</span>
              </div>
           </div>
        </div>
      </div>

      {/* Domain Badge - Mobile */}
      <div className="md:hidden mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2.5 rounded-xl shadow-lg border border-slate-700/50 mx-4">
         <Globe size={14} className="text-blue-400" />
         <span className="text-xs font-semibold text-white/90 tracking-tight">@pandeykapil.com.np</span>
      </div>
    </div>
  );
};

export default AliasGenerator;