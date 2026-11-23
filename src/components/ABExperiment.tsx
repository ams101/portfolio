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
    <section className="relative py-10 bg-paper overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">

        <div className="bg-white rounded-lg border border-rule p-8 md:p-10 relative overflow-hidden ">
          {isAnimating && (
            <div className="absolute inset-0 bg-white z-20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-accent/40 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-ink font-semibold text-lg">Running experiment...</p>
                <p className="text-muted text-sm mt-1">Analyzing user cohorts</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded bg-accent flex items-center justify-center ">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-normal text-ink">Select Metric</h3>
                </div>
                {metrics.map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`group w-full text-left p-5 rounded-lg border-2 transition duration-300 ${
                      selectedMetric === metric.id
                        ? 'bg-accent/10 border-accent/40 '
                        : 'bg-paper-deep border-rule hover:border-ink'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded transition duration-300 ${
                          selectedMetric === metric.id
                            ? 'bg-accent '
                            : 'bg-rule group-hover:bg-rule'
                        }`}
                      >
                        <metric.icon
                          className={`w-6 h-6 ${
                            selectedMetric === metric.id ? 'text-ink' : 'text-muted group-hover:text-ink'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedMetric === metric.id ? 'text-ink' : 'text-muted group-hover:text-ink'
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
                  <div className="w-10 h-10 rounded bg-accent flex items-center justify-center ">
                    <Beaker className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-normal text-ink">Choose Lever</h3>
                </div>
                {levers.map((lever) => (
                  <button
                    key={lever.id}
                    onClick={() => setSelectedLever(lever.id)}
                    className={`group w-full text-left p-5 rounded-lg border-2 transition duration-300 ${
                      selectedLever === lever.id
                        ? 'bg-accent/10 border-accent/40 '
                        : 'bg-paper-deep border-rule hover:border-ink'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded transition duration-300 ${
                          selectedLever === lever.id
                            ? 'bg-accent '
                            : 'bg-rule group-hover:bg-rule'
                        }`}
                      >
                        <lever.icon
                          className={`w-6 h-6 ${
                            selectedLever === lever.id ? 'text-ink' : 'text-muted group-hover:text-ink'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedLever === lever.id ? 'text-ink' : 'text-muted group-hover:text-ink'
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
                className={`px-8 py-4 rounded font-bold text-lg transition duration-300 ${
                  selectedMetric && selectedLever && !isAnimating
                    ? 'bg-accent text-white '
                    : 'bg-paper-deep text-muted cursor-not-allowed'
                }`}
              >
                Run Experiment
              </button>
              {(selectedMetric || selectedLever || showResult) && (
                <button
                  onClick={handleReset}
                  className="px-6 py-4 rounded font-bold text-lg bg-paper-deep text-ink-soft border border-rule hover:bg-paper-deep hover:border-ink transition duration-300 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reset
                </button>
              )}
            </div>

            {showResult && (
              <div className="mt-8 animate-fadeIn">
                <div className="bg-paper-deep rounded-lg border border-rule p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-white rounded border border-rule">
                      <div className={`text-4xl font-bold mb-2 ${result.isPositive ? 'text-positive' : 'text-negative'}`}>
                        {result.isPositive ? '+' : '-'}{result.change}%
                      </div>
                      <div className="text-muted text-sm uppercase tracking-wide font-semibold">Change</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded border border-rule">
                      <div className="text-4xl font-display font-normal text-accent mb-2">{result.confidence}%</div>
                      <div className="text-muted text-sm uppercase tracking-wide font-semibold">Confidence</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded border border-rule">
                      <div className="text-4xl font-display font-normal text-ink-soft mb-2">7d</div>
                      <div className="text-muted text-sm uppercase tracking-wide font-semibold">Duration</div>
                    </div>
                  </div>

                  <div className="bg-paper-deep border border-rule rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-paper rounded-lg border border-rule">
                        <AlertCircle className="w-6 h-6 text-ink-soft" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-display font-medium text-ink mb-3">Product commentary</h4>
                        <p className="text-ink font-semibold mb-3">
                          "This is when you don't ship."
                        </p>
                        <p className="text-muted text-sm leading-relaxed">
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
