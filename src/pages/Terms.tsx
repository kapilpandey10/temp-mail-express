import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Scale, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Terms = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30 pb-20 overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 pt-10 md:pt-20 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Inbox
          </Button>
        </Link>

        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter italic text-white mb-4">
            TERMS OF <span className="text-blue-500">SERVICE</span>
          </h1>
          <p className="text-slate-400 font-medium">
            Last Updated: February 5, 2026 • Effective for pandeykapil.com.np
          </p>
        </header>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Acceptance of Terms</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              By accessing and using the temporary email service at <span className="text-white">pandeykapil.com.np</span>, 
              you agree to be bound by these terms. This service is provided "as is" for the purpose of protecting 
              your primary inbox from spam and temporary communication needs.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <Trash2 className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Data Disposal Policy</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Our system is built for extreme privacy. You understand and agree that:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                All incoming emails are permanently and irrecoverably deleted after 5 minutes of storage.
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                We do not maintain backups or archives of any content processed by the service.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-purple-400">
              <Scale className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-tight">User Conduct</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              You are strictly prohibited from using this service for any illegal activities, including but not limited to 
              spamming, harassment, or bypass of security measures on third-party platforms. Any abuse of our 
              infrastructure may result in a permanent ban of your custom prefix.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Disclaimer of Warranty</h2>
            </div>
            <p className="text-slate-400 leading-relaxed italic">
              We do not guarantee the delivery of every email. Some third-party services may block temporary 
              domains. We are not responsible for any lost information, expired OTPs, or missed verification links 
              due to the 5-minute auto-disposal policy.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-xs text-slate-600 uppercase tracking-[0.2em]">
            Secure Communication Infrastructure
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Terms;