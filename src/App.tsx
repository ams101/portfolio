import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Analytics } from '@vercel/analytics/react';
import Navigation, { type NavTarget } from './components/Navigation';
import Hero from './components/Hero';
import CaseStudies from './components/CaseStudies';
import BuiltTeaser from './components/BuiltTeaser';
import CaseStudyDetail from './components/CaseStudyDetail';
import ProductDemoPage from './components/ProductDemoPage';
import Writing from './components/Writing';
import ArticleDetail from './components/ArticleDetail';
import About from './components/About';
import Contact, { Footer } from './components/Contact';
import { caseStudies } from './data/caseStudies';
import { articles } from './data/articles';
import { hrefFor } from './routes';

type View = 'home' | 'case-study' | 'article' | 'product-demo';
type Route = { view: View; id: string | null };

// See routes.ts for the URL scheme. A home route's id is a section to scroll to.
const parseHash = (hash: string): Route => {
  const [kind, id] = hash.replace(/^#\/?/, '').split('/');
  if (kind === 'work' && id && caseStudies.some(s => s.id === id)) return { view: 'case-study', id };
  if (kind === 'writing' && id && articles.some(a => a.id === id)) return { view: 'article', id };
  if (kind === 'built') return { view: 'product-demo', id: id || null };
  if ((kind === 'work' || kind === 'writing') && !id) return { view: 'home', id: kind };
  return { view: 'home', id: null };
};

// Cross-fade between views where the browser supports it; otherwise change instantly.
const withTransition = (update: () => void) => {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition) doc.startViewTransition(() => flushSync(update));
  else update();
};

const scrollToId = (id: string) => {
  // Wait a tick so the target exists after a view change.
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
  }, 50);
};

function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const routeRef = useRef(route);
  const homeScroll = useRef(0);
  const pendingSection = useRef<string | null>(null);

  useEffect(() => {
    if (route.id && route.view !== 'case-study' && route.view !== 'article') scrollToId(route.id);
    // Only on first load: later changes scroll in the hashchange handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash(window.location.hash);
      const prev = routeRef.current;
      if (prev.view === 'home') homeScroll.current = window.scrollY;
      routeRef.current = next;
      withTransition(() => {
        setRoute(next);
        // Returning home puts you back where you left off; other views start at the top.
        if (next.view === 'home' && prev.view !== 'home') window.scrollTo(0, next.id ? 0 : homeScroll.current);
        else if (!(next.view === prev.view && next.id === prev.id)) window.scrollTo(0, 0);
      });
      const section = pendingSection.current ?? (next.view === 'home' || next.view === 'product-demo' ? next.id : null);
      pendingSection.current = null;
      if (section) scrollToId(section);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const go = (href: string) => {
    if (window.location.hash === href) return;
    window.location.hash = href;
  };

  const navigate = (target: NavTarget) => {
    if (target === 'built') return go(hrefFor.built());
    if (target === 'home') {
      homeScroll.current = 0;
      if (route.view === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      return go(hrefFor.home);
    }
    if (route.view === 'home') return scrollToId(target);
    homeScroll.current = 0;
    pendingSection.current = target;
    go(hrefFor.home);
  };

  const { view: currentView, id: selectedId } = route;

  const active: NavTarget | null =
    currentView === 'product-demo' ? 'built' : currentView === 'case-study' ? 'work' : currentView === 'article' ? 'writing' : null;

  return (
    <div className="min-h-screen bg-paper">
      <Navigation active={active} onNavigate={navigate} />

      <main className="max-w-page mx-auto px-6 md:px-8">
        {currentView === 'home' && (
          <>
            <Hero />
            <CaseStudies />
            <BuiltTeaser />
            <About />
            <Writing />
            <Contact />
          </>
        )}

        {currentView === 'case-study' && selectedId && (
          <CaseStudyDetail caseStudyId={selectedId} />
        )}

        {currentView === 'article' && selectedId && (
          <ArticleDetail articleId={selectedId} />
        )}

        {currentView === 'product-demo' && <ProductDemoPage />}

        <Footer />
      </main>
      <Analytics />
    </div>
  );
}

export default App;
