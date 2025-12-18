import { Mail, Linkedin, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-slate-950 relative">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px]"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 rounded-full text-teal-400 font-semibold text-sm mb-4 border border-teal-500/30 backdrop-blur-sm">
            <Mail className="w-4 h-4" />
            Get in Touch
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let's talk
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Open to roles and collaborations in <span className="font-bold text-teal-400">AI Product Management, Growth/Monetization and Payments/FinOps</span> - especially in the UAE, wider GCC, Europe and remote-friendly teams.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <a
            href="mailto:atibshaikh12@gmail.com"
            className="group flex items-center gap-4 px-6 py-5 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative p-4 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl border border-teal-500/20 group-hover:border-teal-500/40 transition-all duration-500 group-hover:scale-110">
              <Mail className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</div>
              <div className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">atibshaikh12@gmail.com</div>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/atibshaikh12/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 px-6 py-5 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative p-4 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl border border-teal-500/20 group-hover:border-teal-500/40 transition-all duration-500 group-hover:scale-110">
              <Linkedin className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn</div>
              <div className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">linkedin.com/in/atibshaikh12</div>
            </div>
          </a>

          <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl border border-teal-500/30">
            <div className="relative p-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-lg shadow-teal-500/25">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">Location</div>
              <div className="text-lg font-semibold text-white">Based in UAE / India (open to relocation / remote)</div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-800/50 text-center">
          <p className="text-slate-500">
            {new Date().getFullYear()} Atib Shaikh. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
