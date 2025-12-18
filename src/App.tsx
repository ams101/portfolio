import { useState, useEffect } from 'react';
import ScrollProgress from './components/ScrollProgress';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import CaseStudies from './components/CaseStudies';
import CaseStudyDetail from './components/CaseStudyDetail';
import ProductDemoPage from './components/ProductDemoPage';
import Writing from './components/Writing';
import ArticleDetail from './components/ArticleDetail';
import About from './components/About';
import Contact from './components/Contact';
import FloatingDownloadCV from './components/FloatingDownloadCV';
import ScrollToTop from './components/ScrollToTop';

type View = 'home' | 'case-study' | 'article' | 'product-demo';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openCaseStudy = (id: string) => {
    setSelectedId(id);
    setCurrentView('case-study');
    window.scrollTo(0, 0);
  };

  const openArticle = (id: string) => {
    setSelectedId(id);
    setCurrentView('article');
    window.scrollTo(0, 0);
  };

  const openProductDemo = () => {
    setCurrentView('product-demo');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedId(null);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (currentView === 'home') {
      document.body.style.overflow = 'auto';
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-slate-950">
      <ScrollProgress />
      <Navigation
        onHomeClick={goHome}
        showHomeButton={currentView !== 'home'}
        onProductDemoClick={openProductDemo}
      />

      {currentView === 'home' && (
        <>
          <Hero />
          <Metrics />
          <About />
          <CaseStudies onViewDetails={openCaseStudy} />
          <Writing onReadArticle={openArticle} />
          <Contact />
        </>
      )}

      {currentView === 'case-study' && selectedId && (
        <CaseStudyDetail caseStudyId={selectedId} onBack={goHome} />
      )}

      {currentView === 'article' && selectedId && (
        <ArticleDetail articleId={selectedId} onBack={goHome} />
      )}

      {currentView === 'product-demo' && (
        <ProductDemoPage onBack={goHome} />
      )}

      <FloatingDownloadCV showOnOtherViews={currentView !== 'home'} />
      <ScrollToTop />
    </div>
  );
}

export default App;
