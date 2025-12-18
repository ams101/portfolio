import { useState, useEffect } from 'react';
import { Menu, X, Home } from 'lucide-react';

interface NavigationProps {
  onHomeClick: () => void;
  showHomeButton: boolean;
  onProductDemoClick: () => void;
}

const Navigation = ({ onHomeClick, showHomeButton, onProductDemoClick }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about', isPage: false },
    { label: 'Case Studies', href: '#case-studies', isPage: false },
    { label: 'Product Demo', href: '#product-demo', isPage: true },
    { label: 'Writing', href: '#writing', isPage: false },
    { label: 'Contact', href: '#contact', isPage: false },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isPage && item.href === '#product-demo') {
      onProductDemoClick();
      setMobileMenuOpen(false);
    } else {
      scrollToSection(item.href);
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-slate-950/90 backdrop-blur-xl shadow-xl shadow-slate-950/20 border-b border-slate-800/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showHomeButton && (
                <button
                  onClick={onHomeClick}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 font-medium shadow-lg shadow-teal-500/25"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </button>
              )}
              <button
                onClick={() => {
                  if (showHomeButton) {
                    onHomeClick();
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="text-xl font-bold text-white hover:text-teal-400 transition-colors"
              >
                Atib Shaikh
              </button>
            </div>

            {!showHomeButton && (
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item)}
                    className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors rounded-lg hover:bg-slate-800/50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-[72px] left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-xl">
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium transition-colors rounded-lg"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
