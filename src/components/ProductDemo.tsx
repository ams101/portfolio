import { useState, useEffect, useRef } from 'react';
import {
  CreditCard, Play, Pause, SkipForward, CheckCircle, XCircle, Info,
  User, Store, Smartphone, Building2, Network, Landmark, FileCheck,
  RotateCcw, Zap, Shield, ArrowRight, ChevronRight
} from 'lucide-react';

interface PaymentForm {
  amount: string;
  plan: string;
  paymentMethod: string;
  scenario: 'happy' | 'declined' | 'refund';
}

interface FlowStage {
  id: number;
  activeNode: number;
  frontendMessage?: string;
  backendMessage?: string;
  status?: 'success' | 'error' | 'info';
  delay: number;
}

interface Node {
  id: number;
  label: string;
  shortLabel: string;
  zone: 'frontend' | 'backend';
  tooltip: string;
  icon: React.ElementType;
}

const ProductDemo = () => {
  const [form, setForm] = useState<PaymentForm>({
    amount: '10000',
    plan: 'Premium Shaadi Plan',
    paymentMethod: 'credit',
    scenario: 'happy'
  });

  const [errors, setErrors] = useState<Partial<PaymentForm>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [eventLog, setEventLog] = useState<Array<{ type: 'frontend' | 'backend', message: string, status?: string }>>([]);
  const [tokenPosition, setTokenPosition] = useState(-1);
  const [completedNodes, setCompletedNodes] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nodes: Node[] = [
    { id: 0, label: 'Customer', shortLabel: 'Customer', zone: 'frontend', tooltip: 'Walk-in customer at Shaadi.com centre', icon: User },
    { id: 1, label: 'Shaadi Centre', shortLabel: 'Centre', zone: 'frontend', tooltip: 'Physical centre where staff assist customers', icon: Store },
    { id: 2, label: 'Payment UI', shortLabel: 'Pay UI', zone: 'frontend', tooltip: 'I designed the in-centre UI that triggers secure card payments', icon: Smartphone },
    { id: 3, label: 'Acquirer', shortLabel: 'Acquirer', zone: 'backend', tooltip: 'I handled merchant onboarding (MCC, MID/TIDs) and acquirer connections', icon: Building2 },
    { id: 4, label: 'Card Network', shortLabel: 'Network', zone: 'backend', tooltip: 'Visa/Mastercard processing the authorization request', icon: Network },
    { id: 5, label: 'Issuing Bank', shortLabel: 'Issuer', zone: 'backend', tooltip: "Customer's bank that approves or declines the transaction", icon: Landmark },
    { id: 6, label: 'Settlement', shortLabel: 'Settle', zone: 'backend', tooltip: 'I helped define reconciliation rules and reports for finance', icon: FileCheck },
  ];

  const frontendNodes = nodes.filter(n => n.zone === 'frontend');
  const backendNodes = nodes.filter(n => n.zone === 'backend');

  const getFlowStages = (scenario: string, amount: string, plan: string): FlowStage[] => {
    const currency = 'Rs.';

    if (scenario === 'happy') {
      return [
        { id: 0, activeNode: 0, frontendMessage: `Customer entered ${currency}${amount} for "${plan}"`, delay: 1200 },
        { id: 1, activeNode: 1, frontendMessage: 'Centre staff accessed payment interface', delay: 1200 },
        { id: 2, activeNode: 2, frontendMessage: 'Payment intent created', backendMessage: `Auth request built for ${currency}${amount}`, delay: 1500 },
        { id: 3, activeNode: 3, backendMessage: 'Auth request sent to acquirer', delay: 1200 },
        { id: 4, activeNode: 4, backendMessage: 'Card network routing to issuer', delay: 1200 },
        { id: 5, activeNode: 5, backendMessage: 'Transaction approved (auth: 7X9K2M)', status: 'success', delay: 1500 },
        { id: 6, activeNode: 2, frontendMessage: 'Payment success displayed', status: 'success', delay: 1200 },
        { id: 7, activeNode: 6, backendMessage: 'Added to T+1 settlement batch', status: 'success', delay: 1500 },
      ];
    } else if (scenario === 'declined') {
      return [
        { id: 0, activeNode: 0, frontendMessage: `Customer entered ${currency}${amount} for "${plan}"`, delay: 1200 },
        { id: 1, activeNode: 1, frontendMessage: 'Centre staff accessed payment interface', delay: 1200 },
        { id: 2, activeNode: 2, frontendMessage: 'Payment intent created', backendMessage: `Auth request for ${currency}${amount}`, delay: 1500 },
        { id: 3, activeNode: 3, backendMessage: 'Auth request sent to acquirer', delay: 1200 },
        { id: 4, activeNode: 4, backendMessage: 'Card network routing to issuer', delay: 1200 },
        { id: 5, activeNode: 5, backendMessage: 'Transaction declined (insufficient funds)', status: 'error', delay: 1500 },
        { id: 6, activeNode: 2, frontendMessage: 'Decline message shown, retry available', status: 'error', delay: 1500 },
      ];
    } else {
      return [
        { id: 0, activeNode: 6, frontendMessage: 'Original payment was settled', status: 'info', delay: 1200 },
        { id: 1, activeNode: 2, frontendMessage: 'Staff initiated refund request', delay: 1200 },
        { id: 2, activeNode: 6, backendMessage: 'Refund mapped to original transaction', delay: 1200 },
        { id: 3, activeNode: 3, backendMessage: `Refund request for ${currency}${amount} sent`, delay: 1200 },
        { id: 4, activeNode: 5, backendMessage: 'Issuer reversed the charge', status: 'success', delay: 1500 },
        { id: 5, activeNode: 2, frontendMessage: 'Refund confirmation displayed', status: 'success', delay: 1200 },
        { id: 6, activeNode: 0, frontendMessage: 'Customer notified of refund', status: 'success', delay: 1200 },
      ];
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentForm> = {};
    if (!form.amount || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!form.plan.trim()) {
      newErrors.plan = 'Please enter a plan name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startSimulation = () => {
    if (!validateForm()) return;
    setIsSimulating(true);
    setCurrentStage(0);
    setEventLog([]);
    setTokenPosition(-1);
    setCompletedNodes([]);
    setIsPlaying(true);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setIsPlaying(false);
    setCurrentStage(0);
    setEventLog([]);
    setTokenPosition(-1);
    setCompletedNodes([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stepForward = () => {
    const stages = getFlowStages(form.scenario, form.amount, form.plan);
    if (currentStage < stages.length) {
      processStage(currentStage);
      setCurrentStage(prev => prev + 1);
    }
  };

  const processStage = (stageIndex: number) => {
    const stages = getFlowStages(form.scenario, form.amount, form.plan);
    const stage = stages[stageIndex];
    if (!stage) return;

    setTokenPosition(stage.activeNode);
    setCompletedNodes(prev => [...new Set([...prev, stage.activeNode])]);

    const newLogs = [];
    if (stage.frontendMessage) {
      newLogs.push({ type: 'frontend' as const, message: stage.frontendMessage, status: stage.status });
    }
    if (stage.backendMessage) {
      newLogs.push({ type: 'backend' as const, message: stage.backendMessage, status: stage.status });
    }
    setEventLog(prev => [...prev, ...newLogs]);
  };

  useEffect(() => {
    if (!isSimulating || !isPlaying) return;

    const stages = getFlowStages(form.scenario, form.amount, form.plan);

    if (currentStage < stages.length) {
      const stage = stages[currentStage];
      timerRef.current = setTimeout(() => {
        processStage(currentStage);
        setCurrentStage(prev => prev + 1);
      }, stage.delay);
    } else {
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSimulating, isPlaying, currentStage, form.scenario, form.amount, form.plan]);

  useEffect(() => {
    resetSimulation();
  }, [form.scenario]);

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [eventLog]);

  const stages = getFlowStages(form.scenario, form.amount, form.plan);
  const totalStages = stages.length;
  const progress = isSimulating ? Math.min((currentStage / totalStages) * 100, 100) : 0;

  const renderNode = (node: Node, isActive: boolean, isCompleted: boolean) => {
    const Icon = node.icon;
    const isFrontend = node.zone === 'frontend';

    return (
      <div key={node.id} className="group relative">
        <div
          className={`relative flex flex-col items-center transition-all duration-500 ${
            isActive ? 'scale-110' : isCompleted ? 'scale-100' : 'scale-95 opacity-60'
          }`}
        >
          <div
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              isActive
                ? isFrontend
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-2xl shadow-teal-500/50'
                  : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-2xl shadow-orange-500/50'
                : isCompleted
                ? isFrontend
                  ? 'bg-gradient-to-br from-teal-500/80 to-emerald-500/80 shadow-lg shadow-teal-500/30'
                  : 'bg-gradient-to-br from-orange-500/80 to-amber-500/80 shadow-lg shadow-orange-500/30'
                : 'bg-slate-800/80 border border-slate-700/50'
            }`}
          >
            {isActive && (
              <>
                <div className={`absolute inset-0 rounded-2xl ${isFrontend ? 'bg-teal-400' : 'bg-orange-400'} opacity-30 animate-ping`}></div>
                <div className={`absolute -inset-1 rounded-2xl ${isFrontend ? 'bg-teal-500/20' : 'bg-orange-500/20'} blur-md`}></div>
              </>
            )}
            <Icon className={`w-7 h-7 md:w-8 md:h-8 relative z-10 ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`} />
          </div>
          <span className={`mt-2 text-xs md:text-sm font-semibold text-center transition-colors duration-300 ${
            isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
          }`}>
            {node.shortLabel}
          </span>
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
          <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 whitespace-nowrap shadow-xl">
            {node.tooltip}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-slate-700"></div>
        </div>
      </div>
    );
  };

  const renderConnector = (isActive: boolean, isFrontend: boolean) => (
    <div className="flex items-center justify-center w-8 md:w-12">
      <div className={`relative h-0.5 w-full transition-all duration-500 ${
        isActive
          ? isFrontend
            ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
            : 'bg-gradient-to-r from-orange-500 to-amber-500'
          : 'bg-slate-700/50'
      }`}>
        {isActive && (
          <div className={`absolute inset-0 ${isFrontend ? 'bg-teal-400' : 'bg-orange-400'} blur-sm opacity-50`}></div>
        )}
      </div>
      <ChevronRight className={`absolute w-4 h-4 transition-all duration-300 ${
        isActive ? isFrontend ? 'text-teal-400' : 'text-orange-400' : 'text-slate-600'
      }`} />
    </div>
  );

  return (
    <section id="product-demo" className="relative py-24 px-6 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white"></div>

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-floatSlow"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-floatSlow delay-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/10 via-teal-500/10 to-orange-500/10 rounded-full text-orange-400 font-semibold text-sm mb-4 border border-orange-500/30 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            Interactive Product Demo
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Payment Flow Simulator
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the in-centre payment system I designed for Shaadi.com. Watch how transactions flow through the entire ecosystem.
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/50">
            <div className="lg:col-span-2 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/25">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Payment Details</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Demo mode - no real transactions
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">Rs.</span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white font-semibold focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      placeholder="10000"
                    />
                  </div>
                  {errors.amount && <p className="text-red-400 text-xs mt-1.5">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Plan / Package</label>
                  <input
                    type="text"
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="Premium Shaadi Plan"
                  />
                  {errors.plan && <p className="text-red-400 text-xs mt-1.5">{errors.plan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Scenario</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'happy', label: 'Success', color: 'teal' },
                      { id: 'declined', label: 'Declined', color: 'red' },
                      { id: 'refund', label: 'Refund', color: 'orange' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setForm({ ...form, scenario: s.id as 'happy' | 'declined' | 'refund' })}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          form.scenario === s.id
                            ? s.color === 'teal'
                              ? 'bg-teal-500/20 border-2 border-teal-500/50 text-teal-400'
                              : s.color === 'red'
                              ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
                              : 'bg-orange-500/20 border-2 border-orange-500/50 text-orange-400'
                            : 'bg-slate-800/50 border-2 border-slate-700/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={isSimulating ? resetSimulation : startSimulation}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSimulating
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <RotateCcw className="w-5 h-5" />
                      Reset Simulation
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Simulation
                    </>
                  )}
                </button>

                {isSimulating && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayPause}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={currentStage >= totalStages}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SkipForward className="w-4 h-4" />
                      Step
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Payment Journey</h3>
                {isSimulating && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Stage {Math.min(currentStage, totalStages)}/{totalStages}</span>
                  </div>
                )}
              </div>

              {isSimulating && (
                <div className="mb-6">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Frontend Layer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {frontendNodes.map((node, index) => (
                      <div key={node.id} className="flex items-center">
                        {renderNode(node, tokenPosition === node.id, completedNodes.includes(node.id))}
                        {index < frontendNodes.length - 1 && renderConnector(completedNodes.includes(node.id) && completedNodes.includes(frontendNodes[index + 1]?.id), true)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Backend / Banking Rails</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {backendNodes.map((node, index) => (
                      <div key={node.id} className="flex items-center">
                        {renderNode(node, tokenPosition === node.id, completedNodes.includes(node.id))}
                        {index < backendNodes.length - 1 && renderConnector(completedNodes.includes(node.id) && completedNodes.includes(backendNodes[index + 1]?.id), false)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!isSimulating && (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Configure and start the simulation to see the flow</p>
                </div>
              )}

              {isSimulating && eventLog.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-slate-500" />
                    <h4 className="text-sm font-semibold text-slate-400">Event Log</h4>
                  </div>
                  <div
                    ref={logRef}
                    className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin"
                  >
                    {eventLog.map((log, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 text-xs p-3 rounded-lg border ${
                          log.type === 'frontend'
                            ? 'bg-teal-500/5 border-teal-500/20 text-teal-300'
                            : 'bg-orange-500/5 border-orange-500/20 text-orange-300'
                        }`}
                      >
                        {log.status === 'success' && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />}
                        {log.status === 'error' && <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />}
                        {log.status === 'info' && <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-400" />}
                        {!log.status && <div className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span>{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 text-sm backdrop-blur-sm">
            Role: Product / Fintech
          </div>
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 text-sm backdrop-blur-sm">
            Focus: In-centre card payments
          </div>
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 text-sm backdrop-blur-sm">
            Impact: Streamlined 100+ centre transactions/day
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;
