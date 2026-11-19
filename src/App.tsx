import { useState } from 'react';
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

type View = 'home' | 'case-study' | 'article' | 'product-demo';

const scrollToId = (id: string) => {
  // Wait a tick so the target exists after a view change.
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
  }, 50);
};

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const show = (view: View, id: string | null = null) => {
    setCurrentView(view);
    setSelectedId(id);
    window.scrollTo(0, 0);
  };

  const navigate = (target: NavTarget) => {
    if (target === 'built') {
      show('product-demo');
      return;
    }
    if (target === 'home') {
      show('home');
      return;
    }
    if (currentView !== 'home') setCurrentView('home');
    scrollToId(target);
  };

  const openTara = () => {
    setCurrentView('product-demo');
    scrollToId('tara');
  };

  const active: NavTarget | null =
    currentView === 'product-demo' ? 'built' : currentView === 'case-study' ? 'work' : currentView === 'article' ? 'writing' : null;

  return (
    <div className="min-h-screen bg-paper">
      <Navigation active={active} onNavigate={navigate} />

      <main className="max-w-page mx-auto px-6 md:px-8">
        {currentView === 'home' && (
          <>
            <Hero onSeeBuilt={() => show('product-demo')} />
            <CaseStudies onViewDetails={id => show('case-study', id)} />
            <BuiltTeaser onTryTara={openTara} onSeeAll={() => show('product-demo')} />
            <About />
            <Writing onReadArticle={id => show('article', id)} />
            <Contact />
          </>
        )}

        {currentView === 'case-study' && selectedId && (
          <CaseStudyDetail
            caseStudyId={selectedId}
            onBack={() => navigate('work')}
            onOpen={id => show('case-study', id)}
          />
        )}

        {currentView === 'article' && selectedId && (
          <ArticleDetail articleId={selectedId} onBack={() => navigate('writing')} />
        )}

        {currentView === 'product-demo' && <ProductDemoPage />}

        <Footer />
      </main>
    </div>
  );
}

export default App;
