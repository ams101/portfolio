import { useState, useEffect, useRef } from 'react';
import {
  CreditCard, Play, Pause, SkipForward, CheckCircle, XCircle, Info,
  User, Store, Smartphone, Building2, Network, Landmark, FileCheck,
  RotateCcw, Shield, ArrowRight, ChevronRight
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
          className={`relative flex flex-col items-center transition duration-500 ${
            isActive ? 'scale-110' : isCompleted ? 'scale-100' : 'scale-95 opacity-60'
          }`}
        >
          <div
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center transition duration-500 ${
              isActive
                ? isFrontend
                  ? 'bg-accent '
                  : 'bg-ink '
                : isCompleted
                ? isFrontend
                  ? 'bg-accent/10 '
                  : 'bg-ink/10 '
                : 'bg-paper-deep border border-rule'
            }`}
          >
            <Icon className={`w-7 h-7 md:w-8 md:h-8 relative z-10 ${isActive ? 'text-white' : isCompleted ? (isFrontend ? 'text-accent' : 'text-ink') : 'text-muted'}`} />
          </div>
          <span className={`mt-2 text-xs md:text-sm font-semibold text-center transition-colors duration-300 ${
            isActive ? 'text-ink' : isCompleted ? 'text-ink-soft' : 'text-muted'
          }`}>
            {node.shortLabel}
          </span>
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-50">
          <div className="px-3 py-2 bg-white border border-rule rounded-lg text-xs text-ink-soft whitespace-nowrap ">
            {node.tooltip}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-rule"></div>
        </div>
      </div>
    );
  };

  const renderConnector = (isActive: boolean, isFrontend: boolean) => (
    <div className="flex items-center justify-center w-8 md:w-12">
      <div className={`relative h-0.5 w-full transition duration-500 ${
        isActive
          ? isFrontend
            ? 'bg-accent'
            : 'bg-ink'
          : 'bg-rule'
      }`}>
        {isActive && (
          <div className={`absolute inset-0 ${isFrontend ? 'bg-accent' : 'bg-ink'} blur-sm opacity-50`}></div>
        )}
      </div>
      <ChevronRight className={`absolute w-4 h-4 transition duration-300 ${
        isActive ? isFrontend ? 'text-accent' : 'text-amber-700' : 'text-muted'
      }`} />
    </div>
  );

  return (
    <section id="product-demo" className="relative py-10 bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="bg-white rounded-lg border border-rule overflow-hidden ">
          <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-rule">
            <div className="lg:col-span-2 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-ink rounded ">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-normal text-ink">Payment Details</h3>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Demo mode - no real transactions
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink-soft mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-semibold">Rs.</span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full bg-paper-deep border border-rule rounded pl-12 pr-4 py-3 text-ink font-semibold focus:outline-none focus:border-ink focus:ring-2 focus:ring-accent/30 transition"
                      placeholder="10000"
                    />
                  </div>
                  {errors.amount && <p className="text-red-700 text-xs mt-1.5">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-soft mb-2">Plan / Package</label>
                  <input
                    type="text"
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full bg-paper-deep border border-rule rounded px-4 py-3 text-ink font-semibold focus:outline-none focus:border-ink focus:ring-2 focus:ring-accent/30 transition"
                    placeholder="Premium Shaadi Plan"
                  />
                  {errors.plan && <p className="text-red-700 text-xs mt-1.5">{errors.plan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-soft mb-2">Scenario</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'happy', label: 'Success', color: 'teal' },
                      { id: 'declined', label: 'Declined', color: 'red' },
                      { id: 'refund', label: 'Refund', color: 'orange' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setForm({ ...form, scenario: s.id as 'happy' | 'declined' | 'refund' })}
                        className={`py-2.5 px-3 rounded text-sm font-semibold transition duration-300 ${
                          form.scenario === s.id
                            ? s.color === 'teal'
                              ? 'bg-accent/10 border-2 border-accent/40 text-accent'
                              : s.color === 'red'
                              ? 'bg-red-50 border-2 border-red-200 text-red-700'
                              : 'bg-amber-50 border-2 border-amber-200 text-amber-700'
                            : 'bg-paper-deep border-2 border-rule text-muted hover:border-ink'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={isSimulating ? resetSimulation : startSimulation}
                  className={`w-full py-4 rounded font-bold transition duration-300 flex items-center justify-center gap-2 ${
                    isSimulating
                      ? 'bg-paper-deep text-ink hover:bg-rule'
                      : 'bg-accent text-white hover:opacity-90'
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
                      className="flex-1 py-2.5 rounded font-semibold text-ink bg-paper-deep hover:bg-rule transition flex items-center justify-center gap-2"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={currentStage >= totalStages}
                      className="flex-1 py-2.5 rounded font-semibold text-ink bg-paper-deep hover:bg-rule transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <h3 className="text-lg font-bold text-ink">Payment Journey</h3>
                {isSimulating && (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>Stage {Math.min(currentStage, totalStages)}/{totalStages}</span>
                  </div>
                )}
              </div>

              {isSimulating && (
                <div className="mb-6">
                  <div className="h-1.5 bg-paper-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-[13px] font-medium text-accent">Frontend layer</span>
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
                  <div className="flex-1 h-px bg-rule"></div>
                  <ArrowRight className="w-4 h-4 text-muted" />
                  <div className="flex-1 h-px bg-rule"></div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-ink"></div>
                    <span className="text-[13px] font-medium text-amber-700">Backend and banking rails</span>
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
                <div className="flex flex-col items-center justify-center py-8 text-muted">
                  <div className="w-16 h-16 rounded-lg bg-paper-deep flex items-center justify-center mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Configure and start the simulation to see the flow</p>
                </div>
              )}

              {isSimulating && eventLog.length > 0 && (
                <div className="mt-6 pt-6 border-t border-rule">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-muted" />
                    <h4 className="text-sm font-semibold text-muted">Event Log</h4>
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
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {log.status === 'success' && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-accent" />}
                        {log.status === 'error' && <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-700" />}
                        {log.status === 'info' && <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-700" />}
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
          <div className="px-4 py-2 bg-paper-deep border border-rule rounded-full text-muted text-sm ">
            Role: Product / Fintech
          </div>
          <div className="px-4 py-2 bg-paper-deep border border-rule rounded-full text-muted text-sm ">
            Focus: In-centre card payments
          </div>
          <div className="px-4 py-2 bg-paper-deep border border-rule rounded-full text-muted text-sm ">
            Impact: Streamlined 100+ centre transactions/day
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;
