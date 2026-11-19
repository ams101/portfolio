import { useState } from 'react';

export type NavTarget = 'home' | 'work' | 'built' | 'about' | 'writing' | 'contact';

interface NavigationProps {
  active: NavTarget | null;
  onNavigate: (target: NavTarget) => void;
}

const ITEMS: { target: NavTarget; label: string }[] = [
  { target: 'work', label: 'Work' },
  { target: 'built', label: 'Things I’ve built' },
  { target: 'writing', label: 'Writing' },
  { target: 'about', label: 'About' },
  { target: 'contact', label: 'Contact' },
];

const Navigation = ({ active, onNavigate }: NavigationProps) => {
  const [open, setOpen] = useState(false);

  const go = (target: NavTarget) => {
    setOpen(false);
    onNavigate(target);
  };

  const linkClass = (target: NavTarget) =>
    `text-[15px] text-ink no-underline border-b pb-0.5 transition-colors ${
      active === target ? 'border-accent' : 'border-transparent hover:border-rule-strong'
    }`;

  return (
    <header className="max-w-page mx-auto px-6 md:px-8">
      <nav aria-label="Main" className="flex items-baseline justify-between gap-4 py-7 border-b border-rule">
        <button onClick={() => go('home')} className="font-serif text-[22px] leading-none text-ink">
          Atib Shaikh
        </button>

        <div className="hidden md:flex items-baseline gap-7">
          {ITEMS.map(item => (
            <button key={item.target} onClick={() => go(item.target)} className={linkClass(item.target)}>
              {item.label}
            </button>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-[15px] text-ink border-b border-transparent hover:border-rule-strong pb-0.5">
            Resume
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden font-mono text-[13px] text-ink min-h-[44px] px-1"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="md:hidden flex flex-col border-b border-rule">
          {ITEMS.map(item => (
            <button
              key={item.target}
              onClick={() => go(item.target)}
              className="text-left font-serif text-2xl py-3 border-b border-rule last:border-b-0"
            >
              {item.label}
            </button>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="font-serif text-2xl py-3">
            Resume
          </a>
        </div>
      )}
    </header>
  );
};

export default Navigation;
