import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard, Play, Pause, SkipForward, AlertCircle, CheckCircle, XCircle, Info,
  User, Store, Smartphone, Building2, Network, Landmark, FileCheck, TrendingUp,
  XOctagon, RotateCcw, Zap, Shield, Globe, ArrowRight
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
  zone: 'frontend' | 'backend';
  tooltip: string;
  icon: any;
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
  const [tokenPosition, setTokenPosition] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nodes: Node[] = [
    { id: 0, label: 'Client', zone: 'frontend', tooltip: 'Walk-in customer at Shaadi.com centre', icon: User },
    { id: 1, label: 'Shaadi Centre', zone: 'frontend', tooltip: 'Physical centre where staff assist customers', icon: Store },
    { id: 2, label: 'Payment Interface', zone: 'frontend', tooltip: 'I designed the in-centre UI that triggers secure card payments and maps them to customer accounts', icon: Smartphone },
    { id: 3, label: 'Acquiring Bank', zone: 'backend', tooltip: 'I handled merchant onboarding (MCC, MID/TIDs) and how the acquirer connects to our internal systems', icon: Building2 },
    { id: 4, label: 'Card Network', zone: 'backend', tooltip: 'Visa/Mastercard processing the authorization request', icon: Network },
    { id: 5, label: 'Issuing Bank', zone: 'backend', tooltip: "Customer's bank that approves or declines the transaction", icon: Landmark },
    { id: 6, label: 'Settlement & Finance', zone: 'backend', tooltip: 'I helped define reconciliation rules and reports for finance', icon: FileCheck },
  ];

  const getFlowStages = (scenario: string, amount: string, plan: string): FlowStage[] => {
    const currency = '₹';

    if (scenario === 'happy') {
      return [
        {
          id: 0,
          activeNode: 0,
          frontendMessage: `User entered ${currency}${amount} for "${plan}" at the centre`,
          delay: 1000
        },
        {
          id: 1,
          activeNode: 1,
          frontendMessage: 'Centre staff accessed payment interface and selected payment plan',
          delay: 1200
        },
        {
          id: 2,
          activeNode: 2,
          frontendMessage: 'Created payment intent and attached it to the centre session',
          backendMessage: `Built authorization request for ${currency}${amount} with MCC and terminal ID`,
          delay: 1500
        },
        {
          id: 3,
          activeNode: 3,
          backendMessage: 'Sent auth request to acquiring bank with merchant credentials',
          delay: 1200
        },
        {
          id: 4,
          activeNode: 4,
          backendMessage: 'Card network routing request to issuing bank',
          delay: 1200
        },
        {
          id: 5,
          activeNode: 5,
          backendMessage: 'Issuing bank approved transaction (auth code: 7X9K2M)',
          status: 'success',
          delay: 1500
        },
        {
          id: 6,
          activeNode: 2,
          frontendMessage: 'Marked order as paid and showed success state to centre staff',
          status: 'success',
          delay: 1200
        },
        {
          id: 7,
          activeNode: 6,
          backendMessage: 'Included transaction in settlement batch for T+1 and finance reconciliation',
          status: 'success',
          delay: 1500
        },
      ];
    } else if (scenario === 'declined') {
      return [
        {
          id: 0,
          activeNode: 0,
          frontendMessage: `User entered ${currency}${amount} for "${plan}" at the centre`,
          delay: 1000
        },
        {
          id: 1,
          activeNode: 1,
          frontendMessage: 'Centre staff accessed payment interface and selected payment plan',
          delay: 1200
        },
        {
          id: 2,
          activeNode: 2,
          frontendMessage: 'Created payment intent and attached it to the centre session',
          backendMessage: `Built authorization request for ${currency}${amount} with terminal details`,
          delay: 1500
        },
        {
          id: 3,
          activeNode: 3,
          backendMessage: 'Sent auth request to acquiring bank',
          delay: 1200
        },
        {
          id: 4,
          activeNode: 4,
          backendMessage: 'Card network routing request to issuing bank',
          delay: 1200
        },
        {
          id: 5,
          activeNode: 5,
          backendMessage: 'Issuing bank declined the transaction (insufficient funds)',
          status: 'error',
          delay: 1500
        },
        {
          id: 6,
          activeNode: 2,
          frontendMessage: 'Displayed clear decline message and allowed staff to retry or pick another method',
          status: 'error',
          delay: 1500
        },
      ];
    } else {
      return [
        {
          id: 0,
          activeNode: 6,
          frontendMessage: 'Original payment was completed and settled',
          status: 'info',
          delay: 1000
        },
        {
          id: 1,
          activeNode: 2,
          frontendMessage: 'Staff initiated refund from internal payment tool',
          delay: 1200
        },
        {
          id: 2,
          activeNode: 6,
          backendMessage: 'Mapped refund to original transaction and initiated reversal',
          delay: 1200
        },
        {
          id: 3,
          activeNode: 3,
          backendMessage: `Sent refund request for ${currency}${amount} to acquirer`,
          delay: 1200
        },
        {
          id: 4,
          activeNode: 5,
          backendMessage: 'Issuer reversed the charge and credited customer account',
          status: 'success',
          delay: 1500
        },
        {
          id: 5,
          activeNode: 2,
          frontendMessage: 'Updated customer status and showed refund confirmation',
          status: 'success',
          delay: 1200
        },
        {
          id: 6,
          activeNode: 0,
          frontendMessage: 'Customer notified of successful refund',
          status: 'success',
          delay: 1000
        },
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
    setTokenPosition(0);
    setIsPlaying(true);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setIsPlaying(false);
    setCurrentStage(0);
    setEventLog([]);
    setTokenPosition(0);
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
    if (currentStage < stages.length - 1) {
      processStage(currentStage + 1);
    }
  };

  const processStage = (stageIndex: number) => {
    const stages = getFlowStages(form.scenario, form.amount, form.plan);
    const stage = stages[stageIndex];

    if (!stage) return;

    setCurrentStage(stageIndex);
    setTokenPosition(stage.activeNode);

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
      setTimeout(() => {
        resetSimulation();
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'happy':
        return <TrendingUp className="w-4 h-4" />;
      case 'declined':
        return <XOctagon className="w-4 h-4" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <section id="product-demo" className="relative py-24 px-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent_85%)]"></div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float3d"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float3d delay-300"></div>

      <div className="absolute top-1/4 right-1/3 opacity-5">
        <Shield className="w-64 h-64 text-white" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 opacity-5">
        <Globe className="w-64 h-64 text-white" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-cyan-500/20 rounded-full text-orange-300 font-semibold text-xs mb-3 border border-orange-500/30">
            Fintech · In-centre payments
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">MVP / Product Demo</h2>
          <p className="text-lg text-slate-400 mb-1">Shaadi.com In-Centre Payment Ecosystem</p>
          <p className="text-slate-400">Interact with this demo to see how a payment flows through the system I designed.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/50 rounded-xl border-2 border-slate-700/50 p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <CreditCard className="w-5 h-5 text-orange-400" />
                      </div>
                      Enter your payment details (demo)
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Shield className="w-3 h-3" />
                      <span>Demo only — do not enter real card details</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-12 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-lg opacity-20"></div>
                  </div>
                </div>

                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-8 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="10000"
                    />
                  </div>
                  {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Plan / Package</label>
                  <input
                    type="text"
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Premium Shaadi Plan"
                  />
                  {errors.plan && <p className="text-red-400 text-xs mt-1">{errors.plan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Scenario</label>
                  <select
                    value={form.scenario}
                    onChange={(e) => setForm({ ...form, scenario: e.target.value as any })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="happy">Happy Path</option>
                    <option value="declined">Card Declined</option>
                    <option value="refund">Refund / Chargeback</option>
                  </select>
                </div>

                  <button
                    onClick={startSimulation}
                    disabled={isSimulating}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSimulating
                        ? 'bg-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSimulating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Simulation Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Simulate Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isSimulating && (
              <>
                <div className="bg-slate-800/50 rounded-xl border-2 border-slate-700/50 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <div className="p-1.5 bg-orange-500/20 rounded">
                        {getScenarioIcon(form.scenario)}
                      </div>
                      Scenario: <span className="text-orange-400">{form.scenario === 'happy' ? 'Happy Path' : form.scenario === 'declined' ? 'Card Declined' : 'Refund'}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Stage {Math.min(currentStage, totalStages)} / {totalStages}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={currentStage >= totalStages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentStage >= totalStages
                          ? 'bg-slate-700 cursor-not-allowed'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      <SkipForward className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={resetSimulation}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-white transition-colors"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex gap-1">
                    {Array.from({ length: totalStages }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < currentStage
                            ? 'bg-gradient-to-r from-orange-500 to-cyan-500'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl border-2 border-slate-700/50 p-4 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    Event Log
                  </h4>
                  <div
                    ref={logRef}
                    className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                  >
                    {eventLog.map((log, index) => (
                      <div
                        key={index}
                        className={`text-xs p-2 rounded border ${
                          log.type === 'frontend'
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-200'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {log.status === 'success' && <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-green-400" />}
                          {log.status === 'error' && <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-red-400" />}
                          {log.status === 'info' && <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-blue-400" />}
                          <div>
                            <span className="font-bold uppercase">{log.type}:</span> {log.message}
                          </div>
                        </div>
                      </div>
                    ))}
                    {eventLog.length === 0 && (
                      <div className="text-slate-500 text-xs text-center py-4">
                        Waiting for simulation to start...
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-800/50 rounded-xl border-2 border-slate-700/50 p-8 backdrop-blur-sm min-h-[600px]">
              <h3 className="text-lg font-bold text-white mb-6">Payment Journey</h3>

              <div className="space-y-12">
                <div>
                  <div className="text-xs font-bold text-orange-400 mb-3 uppercase tracking-wide">Front-end</div>
                  <div className="flex flex-wrap items-center gap-4">
                    {nodes.filter(n => n.zone === 'frontend').map((node, index, arr) => (
                      <React.Fragment key={node.id}>
                        <div className="group relative">
                          <div
                            className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-500 ${
                              tokenPosition === node.id
                                ? 'bg-gradient-to-br from-orange-500/30 to-cyan-500/30 border-orange-500 shadow-xl shadow-orange-500/30 scale-110'
                                : isSimulating && eventLog.some(log => stages[currentStage - 1]?.activeNode === node.id)
                                ? 'bg-slate-700/30 border-slate-500'
                                : 'bg-slate-700/20 border-slate-600/30'
                            }`}
                          >
                            {tokenPosition === node.id && (
                              <>
                                <div className="absolute inset-0 bg-orange-400/20 rounded-xl blur-md animate-pulse"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                              </>
                            )}
                            <div className="relative flex items-center gap-2">
                              <node.icon className="w-4 h-4 text-orange-400" />
                              <span className="text-sm font-semibold text-white whitespace-nowrap">
                                {node.label}
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                            {node.tooltip}
                          </div>
                        </div>
                        {index < arr.length - 1 && (
                          <div className="relative flex items-center">
                            <div className={`h-0.5 w-8 transition-all duration-300 ${
                              tokenPosition > node.id ? 'bg-gradient-to-r from-orange-500 to-cyan-500' : 'bg-slate-600/30'
                            }`} />
                            {tokenPosition > node.id && (
                              <ArrowRight className="w-3 h-3 text-orange-500 absolute left-1/2 -translate-x-1/2 animate-pulse" />
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-cyan-400 mb-3 uppercase tracking-wide">Back-end / Banking Rails</div>
                  <div className="flex flex-wrap items-center gap-4">
                    {nodes.filter(n => n.zone === 'backend').map((node, index, arr) => (
                      <React.Fragment key={node.id}>
                        <div className="group relative">
                          <div
                            className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-500 ${
                              tokenPosition === node.id
                                ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-cyan-500 shadow-xl shadow-cyan-500/30 scale-110'
                                : isSimulating && eventLog.some(log => stages[currentStage - 1]?.activeNode === node.id)
                                ? 'bg-slate-700/30 border-slate-500'
                                : 'bg-slate-700/20 border-slate-600/30'
                            }`}
                          >
                            {tokenPosition === node.id && (
                              <>
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-md animate-pulse"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
                              </>
                            )}
                            <div className="relative flex items-center gap-2">
                              <node.icon className="w-4 h-4 text-cyan-400" />
                              <span className="text-sm font-semibold text-white whitespace-nowrap">
                                {node.label}
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                            {node.tooltip}
                          </div>
                        </div>
                        {index < arr.length - 1 && (
                          <div className="relative flex items-center">
                            <div className={`h-0.5 w-8 transition-all duration-300 ${
                              tokenPosition > node.id ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-600/30'
                            }`} />
                            {tokenPosition > node.id && (
                              <ArrowRight className="w-3 h-3 text-cyan-500 absolute left-1/2 -translate-x-1/2 animate-pulse" />
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {!isSimulating && (
                  <div className="text-center py-12 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Fill the form and click "Simulate Payment" to start</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <div className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-300 text-xs font-semibold">
                  Role: Product / Fintech
                </div>
                <div className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-semibold">
                  Focus: In-person card payments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;
