import { Shield, Lock, Zap, Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                TempMail
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Secure, temporary email addresses for protecting your privacy online. No registration required.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-black text-slate-900 mb-4 uppercase text-sm tracking-wider">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-600 text-sm hover:text-blue-600 transition-colors">
                <Shield className="w-4 h-4" />
                <span>Military-Grade Security</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm hover:text-blue-600 transition-colors">
                <Lock className="w-4 h-4" />
                <span>Zero Data Collection</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm hover:text-blue-600 transition-colors">
                <Zap className="w-4 h-4" />
                <span>Instant Email Generation</span>
              </li>
            </ul>
          </div>

          {/* Security Badge */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 mb-4 uppercase text-sm tracking-wider">Security</h3>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-green-900 text-sm">Encrypted</p>
                  <p className="text-green-600 text-xs">End-to-End</p>
                </div>
              </div>
              <p className="text-green-700 text-xs leading-relaxed">
                All emails are encrypted and auto-delete after 5 minutes for maximum privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by 
              <a 
                href="https://pandeykapil.com.np" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Kapil Pandey
              </a>
            </p>
            <p className="text-slate-500 text-xs">
              © {currentYear} TempMail. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};