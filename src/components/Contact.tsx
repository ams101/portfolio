import React from 'react';
import { Mail, Linkedin, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full text-blue-700 font-semibold text-sm mb-4 border border-blue-200/50 shadow-sm">
            <Mail className="w-4 h-4" />
            Get in Touch
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-6">
            Let's talk
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Open to roles and collaborations in <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">AI Product Management, Growth/Monetization and Payments/FinOps</span> — especially in the UAE, wider GCC, Europe and remote-friendly teams.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <a
            href="mailto:atibshaikh12@gmail.com"
            className="group flex items-center gap-4 px-6 py-5 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
              <Mail className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors relative z-10" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</div>
              <div className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">atibshaikh12@gmail.com</div>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/atibshaikh12/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 px-6 py-5 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
              <Linkedin className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors relative z-10" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn</div>
              <div className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">linkedin.com/in/atibshaikh12</div>
            </div>
          </a>

          <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl border-2 border-blue-200 shadow-lg">
            <div className="relative p-4 bg-white rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-10 rounded-2xl"></div>
              <MapPin className="w-6 h-6 text-blue-600 relative z-10" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Location</div>
              <div className="text-lg font-semibold text-slate-900">Based in UAE / India (open to relocation / remote)</div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-200 text-center">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Atib Shaikh. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
