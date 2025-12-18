import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface FloatingDownloadCVProps {
  showOnOtherViews: boolean;
}

const FloatingDownloadCV = ({ showOnOtherViews }: FloatingDownloadCVProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showOnOtherViews) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const metricsSection = document.querySelector('#metrics-section');
      if (metricsSection) {
        const rect = metricsSection.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight * 0.8);
      } else {
        setIsVisible(window.scrollY > 600);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnOtherViews]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <a
        href="/resume.pdf"
        download="Atib_Shaikh_Resume.pdf"
        className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full font-semibold shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105"
      >
        <Download className="w-5 h-5" />
        <span>Download CV</span>
      </a>
    </div>
  );
};

export default FloatingDownloadCV;
