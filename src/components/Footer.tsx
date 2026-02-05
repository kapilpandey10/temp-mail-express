import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="mt-20 py-12 border-t border-white/5">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <p className="text-white font-black italic tracking-tighter">TEMPMAIL</p>
        <p className="text-xs text-slate-500 mt-1">© 2026 pandeykapil.com.np • All Rights Reserved</p>
      </div>
      <div className="flex gap-8">
        <Link to="/privacy" className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Terms of Use</Link>
      </div>
    </div>
  </footer>
);