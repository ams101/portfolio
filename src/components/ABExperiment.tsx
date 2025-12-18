import { useState } from 'react';
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
  const [result, setResult] = useState({ isPositive: true, change: '5.0', confidence: '92.0' });

  const metrics: Option[] = [
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'conversion', label: 'Conversion', icon: Percent },
  ];

  const levers: Option[] = [
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'plan-layout', label: 'Plan Layout', icon: LayoutGrid },
  ];

  const generateResult = () => {
    const isPositive = Math.random() > 0.5;
    const change = (Math.random() * 10 + 1).toFixed(1);
    const confidence = (Math.random() * 10 + 85).toFixed(1);
    return { isPositive, change, confidence };
  };

  const handleRunExperiment = () => {
    if (!selectedMetric || !selectedLever) return;

    setIsAnimating(true);
    setShowResult(false);

    setTimeout(() => {
      setResult(generateResult());
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
    <section className="relative py-24 px-6 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-floatSlow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] animate-floatSlow delay-500"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-full text-emerald-400 font-semibold text-sm mb-4 border border-emerald-500/30 backdrop-blur-sm">
            <Beaker className="w-4 h-4" />
            Experiment Playground
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            A/B Testing Simulator
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Pick a metric, choose a lever, and see what happens. Sometimes the best decision is knowing when not to ship.
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-8 md:p-10 relative overflow-hidden shadow-2xl">
          {isAnimating && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-semibold text-lg">Running experiment...</p>
                <p className="text-slate-400 text-sm mt-1">Analyzing user cohorts</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Select Metric</h3>
                </div>
                {metrics.map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`group w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                      selectedMetric === metric.id
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          selectedMetric === metric.id
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
                            : 'bg-slate-700/50 group-hover:bg-slate-700'
                        }`}
                      >
                        <metric.icon
                          className={`w-6 h-6 ${
                            selectedMetric === metric.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedMetric === metric.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}
                      >
                        {metric.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                    <Beaker className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Choose Lever</h3>
                </div>
                {levers.map((lever) => (
                  <button
                    key={lever.id}
                    onClick={() => setSelectedLever(lever.id)}
                    className={`group w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                      selectedLever === lever.id
                        ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border-teal-500/50 shadow-xl shadow-teal-500/10'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          selectedLever === lever.id
                            ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/30'
                            : 'bg-slate-700/50 group-hover:bg-slate-700'
                        }`}
                      >
                        <lever.icon
                          className={`w-6 h-6 ${
                            selectedLever === lever.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedLever === lever.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
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
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedMetric && selectedLever && !isAnimating
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105'
                    : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                }`}
              >
                Run Experiment
              </button>
              {(selectedMetric || selectedLever || showResult) && (
                <button
                  onClick={handleReset}
                  className="px-6 py-4 rounded-xl font-bold text-lg bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reset
                </button>
              )}
            </div>

            {showResult && (
              <div className="mt-8 animate-fadeIn">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/30">
                      <div className={`text-4xl font-bold mb-2 ${result.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.isPositive ? '+' : '-'}{result.change}%
                      </div>
                      <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Change</div>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/30">
                      <div className="text-4xl font-bold text-teal-400 mb-2">{result.confidence}%</div>
                      <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Confidence</div>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-700/30">
                      <div className="text-4xl font-bold text-slate-300 mb-2">7d</div>
                      <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold">Duration</div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-amber-500/20 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-amber-300 mb-3">Product Commentary</h4>
                        <p className="text-white font-semibold mb-3">
                          "This is when you don't ship."
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
