import React, { useState } from 'react';
import { Beaker, TrendingUp, DollarSign, Percent, LayoutGrid, Tag, AlertCircle, X } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  icon: React.ElementType;
}

const ABExperiment = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedLever, setSelectedLever] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const metrics: Option[] = [
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'conversion', label: 'Conversion', icon: Percent },
  ];

  const levers: Option[] = [
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'plan-layout', label: 'Plan Layout', icon: LayoutGrid },
  ];

  const getRandomResult = () => {
    const isPositive = Math.random() > 0.5;
    const change = (Math.random() * 10 + 1).toFixed(1);
    return {
      isPositive,
      change,
      confidence: (Math.random() * 10 + 85).toFixed(1),
    };
  };

  const result = getRandomResult();

  const handleRunExperiment = () => {
    if (!selectedMetric || !selectedLever) return;

    setIsAnimating(true);
    setShowResult(false);

    setTimeout(() => {
      setIsAnimating(false);
      setShowResult(true);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedMetric(null);
    setSelectedLever(null);
    setShowResult(false);
    setIsAnimating(false);
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden perspective-1000">
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent_85%)]"></div>

      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float3d"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float3d delay-500"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-purple-300 font-semibold text-sm mb-4 border border-purple-500/30 shadow-lg shadow-purple-500/10">
            <Beaker className="w-4 h-4" />
            Experiment Playground
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-6">
            A/B Testing Simulator
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Pick a metric, choose a lever, and see what happens. Sometimes the best decision is knowing when not to ship.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border-2 border-slate-700/50 p-8 backdrop-blur-sm relative overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          {isAnimating && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 animate-gradient z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-semibold text-lg">Running experiment...</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Select Metric</h3>
                </div>
                {metrics.map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`group w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:-rotate-1 ${
                      selectedMetric === metric.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-purple-500/50 shadow-xl shadow-purple-500/20 scale-[1.02] -rotate-1'
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          selectedMetric === metric.id
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50'
                            : 'bg-slate-600/50 group-hover:bg-slate-600'
                        }`}
                      >
                        <metric.icon
                          className={`w-6 h-6 ${
                            selectedMetric === metric.id ? 'text-white' : 'text-slate-300'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedMetric === metric.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {metric.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Choose Lever</h3>
                </div>
                {levers.map((lever) => (
                  <button
                    key={lever.id}
                    onClick={() => setSelectedLever(lever.id)}
                    className={`group w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:rotate-1 ${
                      selectedLever === lever.id
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-500/50 shadow-xl shadow-blue-500/20 scale-[1.02] rotate-1'
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          selectedLever === lever.id
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                            : 'bg-slate-600/50 group-hover:bg-slate-600'
                        }`}
                      >
                        <lever.icon
                          className={`w-6 h-6 ${
                            selectedLever === lever.id ? 'text-white' : 'text-slate-300'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedLever === lever.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {lever.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={handleRunExperiment}
                disabled={!selectedMetric || !selectedLever || isAnimating}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedMetric && selectedLever && !isAnimating
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70'
                    : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                Run Experiment
              </button>
              {(selectedMetric || selectedLever || showResult) && (
                <button
                  onClick={handleReset}
                  className="px-6 py-4 rounded-xl font-bold text-lg bg-slate-700/50 text-slate-300 border-2 border-slate-600/50 hover:bg-slate-700 hover:border-slate-500 transition-all duration-300 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reset
                </button>
              )}
            </div>

            {showResult && (
              <div className="mt-8 animate-fadeIn">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700/50 p-8 transform transition-all duration-500 hover:scale-[1.01] animate-pulse3d">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-6 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div className={`text-4xl font-bold mb-2 ${result.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {result.isPositive ? '+' : '-'}{result.change}%
                      </div>
                      <div className="text-slate-400 text-sm uppercase tracking-wide">Change</div>
                    </div>
                    <div className="text-center p-6 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div className="text-4xl font-bold text-blue-400 mb-2">{result.confidence}%</div>
                      <div className="text-slate-400 text-sm uppercase tracking-wide">Confidence</div>
                    </div>
                    <div className="text-center p-6 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div className="text-4xl font-bold text-purple-400 mb-2">7d</div>
                      <div className="text-slate-400 text-sm uppercase tracking-wide">Duration</div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-yellow-500/20 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-yellow-300 mb-3">Product Commentary</h4>
                        <p className="text-slate-300 leading-relaxed mb-4">
                          <span className="font-bold text-white">"This is when you don't ship."</span>
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          A {Math.abs(parseFloat(result.change))}% {result.isPositive ? 'increase' : 'decrease'} might look
                          {result.isPositive ? ' promising' : ' concerning'}, but ask yourself: Does this align with long-term strategy?
                          What are the second-order effects? Sometimes the smartest move is to dig deeper, run another iteration,
                          or recognize that optimization theater isn't the same as building value.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ABExperiment;
