import React from "react";
import { LockKeyhole, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityProps {
  mathProblem: { q: string; a: number };
  userAnswer: string;
  setUserAnswer: (val: string) => void;
  onVerify: () => void;
  onClose: () => void;
}

const Security = ({ 
  mathProblem, 
  userAnswer, 
  setUserAnswer, 
  onVerify, 
  onClose 
}: SecurityProps) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[280px] rounded-3xl p-5 text-center shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-3">
          <LockKeyhole size={24} className="text-blue-600" />
        </div>
        
        <h3 className="text-lg font-bold mb-1 tracking-tight text-slate-950">
          Verify you are Human
        </h3>
        <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
Solve the Math        </p>
        
        <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100/50">
          <div className="text-xl font-mono font-bold text-slate-600 mb-3 select-none">
            {mathProblem.q} = ?
          </div>
          <input 
            type="number" 
            autoFocus 
            placeholder="Answer"
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && onVerify()}
            className="h-10 w-full text-center text-lg font-black bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-200" 
          />
        </div>
        
        <Button 
          onClick={onVerify} 
          className="w-full h-11 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm active:scale-95 transition-all shadow-md"
        >
          <CheckCircle2 size={16} className="mr-2" />
          Verify
        </Button>
      </div>
    </div>
  );
};

export default Security;