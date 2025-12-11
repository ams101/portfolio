import React from 'react';
import ProductDemo from './ProductDemo';
import ABExperiment from './ABExperiment';

interface ProductDemoPageProps {
  onBack: () => void;
}

const ProductDemoPage = ({ onBack }: ProductDemoPageProps) => {
  return (
    <div className="min-h-screen bg-slate-900">
      <ProductDemo />
      <ABExperiment />
    </div>
  );
};

export default ProductDemoPage;
