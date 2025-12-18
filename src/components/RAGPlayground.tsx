import { useState, useMemo } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronRight, AlertCircle, Check, Loader2, Settings } from 'lucide-react';
import moviesData from '../data/movies100.json';

interface Movie {
  id: string;
  title: string;
  year: number;
  genres: string[];
  synopsis: string;
  tags: string[];
}

interface Chunk {
  movieId: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
}

interface RetrievedChunk extends Chunk {
  similarity: number;
  movie: Movie;
}

type StepStatus = 'pending' | 'active' | 'completed';

interface StepState {
  id: number;
  title: string;
  status: StepStatus;
  data?: any;
}

const RAGPlayground = () => {
  const [positiveQuery, setPositiveQuery] = useState('');
  const [negativeQuery, setNegativeQuery] = useState('');
  const [steps, setSteps] = useState<StepState[]>([
    { id: 1, title: 'Dataset', status: 'pending' },
    { id: 2, title: 'Chunking', status: 'pending' },
    { id: 3, title: 'Embeddings', status: 'pending' },
    { id: 4, title: 'Vector Search', status: 'pending' },
    { id: 5, title: 'Retrieved Context', status: 'pending' },
    { id: 6, title: 'Prompt Assembly', status: 'pending' },
    { id: 7, title: 'Generation', status: 'pending' },
    { id: 8, title: 'Final Answer', status: 'pending' },
  ]);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));
  const [isRunning, setIsRunning] = useState(false);
  const [latencySimulation, setLatencySimulation] = useState(true);
  const [showWhatIsRAG, setShowWhatIsRAG] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [useLiveLLM, setUseLiveLLM] = useState(false);

  const movies: Movie[] = moviesData as Movie[];

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    const term = searchTerm.toLowerCase();
    return movies.filter(m =>
      m.title.toLowerCase().includes(term) ||
      m.genres.some(g => g.toLowerCase().includes(term)) ||
      m.tags.some(t => t.toLowerCase().includes(term))
    );
  }, [searchTerm, movies]);

  const genreDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    movies.forEach(m => m.genres.forEach(g => dist[g] = (dist[g] || 0) + 1));
    return Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [movies]);

  const chunkText = (text: string, minWords = 80, maxWords = 120): string[] => {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let i = 0;

    while (i < words.length) {
      const chunkSize = Math.min(maxWords, Math.max(minWords, words.length - i));
      chunks.push(words.slice(i, i + chunkSize).join(' '));
      i += chunkSize;
    }

    return chunks;
  };

  const generatePseudoEmbedding = (text: string): number[] => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const embedding = new Array(256).fill(0);

    words.forEach(word => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash;
      }

      const idx1 = Math.abs(hash) % 256;
      const idx2 = Math.abs(hash >> 8) % 256;
      embedding[idx1] += 1;
      embedding[idx2] += 0.5;
    });

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  };

  const cosineSimilarity = (a: number[], b: number[]): number => {
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
    }
    return dotProduct;
  };

  const getAllChunks = (): Chunk[] => {
    const allChunks: Chunk[] = [];
    movies.forEach(movie => {
      const chunks = chunkText(movie.synopsis);
      chunks.forEach((text, idx) => {
        allChunks.push({
          movieId: movie.id,
          chunkIndex: idx,
          text,
          embedding: generatePseudoEmbedding(text),
        });
      });
    });
    return allChunks;
  };

  const retrieveChunks = (positive: string, negative: string, k = 6): RetrievedChunk[] => {
    const allChunks = getAllChunks();
    const positiveEmb = generatePseudoEmbedding(positive);
    const negativeEmb = generatePseudoEmbedding(negative);

    const queryEmb = positiveEmb.map((val, idx) => val - 0.75 * negativeEmb[idx]);
    const queryMagnitude = Math.sqrt(queryEmb.reduce((sum, val) => sum + val * val, 0));
    const normalizedQuery = queryEmb.map(val => val / queryMagnitude);

    const scored = allChunks.map(chunk => ({
      ...chunk,
      similarity: cosineSimilarity(normalizedQuery, chunk.embedding),
      movie: movies.find(m => m.id === chunk.movieId)!,
    }));

    return scored.sort((a, b) => b.similarity - a.similarity).slice(0, k);
  };

  const assembleContext = (chunks: RetrievedChunk[]): string => {
    return chunks.map(chunk =>
      `[Movie: ${chunk.movie.title} (${chunk.movie.year}) | Genres: ${chunk.movie.genres.join(', ')} | Chunk #${chunk.chunkIndex + 1}]\n${chunk.text}\n`
    ).join('\n');
  };

  const generateKeylessRecommendations = (chunks: RetrievedChunk[], positive: string, negative: string) => {
    const movieScores: Record<string, { movie: Movie; maxSim: number; avgSim: number; count: number; chunks: number[] }> = {};

    chunks.forEach(chunk => {
      if (!movieScores[chunk.movieId]) {
        movieScores[chunk.movieId] = {
          movie: chunk.movie,
          maxSim: chunk.similarity,
          avgSim: chunk.similarity,
          count: 1,
          chunks: [chunk.chunkIndex],
        };
      } else {
        const ms = movieScores[chunk.movieId];
        ms.maxSim = Math.max(ms.maxSim, chunk.similarity);
        ms.avgSim = (ms.avgSim * ms.count + chunk.similarity) / (ms.count + 1);
        ms.count += 1;
        ms.chunks.push(chunk.chunkIndex);
      }
    });

    const ranked = Object.values(movieScores)
      .sort((a, b) => (b.maxSim + b.avgSim) - (a.maxSim + a.avgSim))
      .slice(0, 4);

    const recommendations = ranked.map(({ movie, chunks: chunkIndices }) => {
      const reasons = [];

      if (positive.toLowerCase().includes('witty') && movie.tags.includes('witty')) {
        reasons.push('Features witty dialogue and humor');
      }
      if (positive.toLowerCase().includes('friend') && movie.tags.includes('friends-to-lovers')) {
        reasons.push('Friends-to-lovers storyline');
      }
      if (positive.toLowerCase().includes('space') && movie.tags.includes('space')) {
        reasons.push('Space exploration setting');
      }
      if (positive.toLowerCase().includes('heist') && movie.tags.includes('heist')) {
        reasons.push('Clever heist plot');
      }
      if (positive.toLowerCase().includes('hopeful') && movie.tags.includes('hopeful')) {
        reasons.push('Hopeful and uplifting tone');
      }
      if (positive.toLowerCase().includes('family') && movie.tags.includes('found-family')) {
        reasons.push('Found family theme');
      }
      if (positive.toLowerCase().includes('twist') && movie.tags.includes('clever-twists')) {
        reasons.push('Clever plot twists');
      }

      if (reasons.length === 0) {
        const matchedTags = movie.tags.filter(tag =>
          positive.toLowerCase().split(/\s+/).some(word => tag.includes(word) || word.includes(tag))
        );
        if (matchedTags.length > 0) {
          reasons.push(`Matches themes: ${matchedTags.slice(0, 2).join(', ')}`);
        } else {
          reasons.push('High relevance to your preferences');
        }
      }

      return {
        movie,
        reasons,
        sources: `${movie.id}, chunks: ${chunkIndices.join(', ')}`,
        chunks: chunkIndices,
      };
    });

    return recommendations;
  };

  const updateStep = (stepId: number, status: StepStatus, data?: any) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status, data } : s));
    if (status === 'active') {
      setExpandedSteps(prev => new Set(prev).add(stepId));
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runStepByStep = async () => {
    if (!positiveQuery.trim()) {
      alert('Please enter what you want to find');
      return;
    }

    setIsRunning(true);
    setSteps(steps.map(s => ({ ...s, status: 'pending' as StepStatus, data: undefined })));
    setExpandedSteps(new Set());

    const delayTime = latencySimulation ? 800 : 0;

    updateStep(1, 'active', { movies, count: movies.length });
    if (delayTime) await delay(delayTime);
    updateStep(1, 'completed', { movies, count: movies.length });

    updateStep(2, 'active');
    if (delayTime) await delay(delayTime);
    const sampleMovie = movies[0];
    const sampleChunks = chunkText(sampleMovie.synopsis);
    updateStep(2, 'completed', { movie: sampleMovie, chunks: sampleChunks });

    updateStep(3, 'active');
    if (delayTime) await delay(delayTime);
    const sampleEmbedding = generatePseudoEmbedding(sampleChunks[0]);
    updateStep(3, 'completed', { embedding: sampleEmbedding });

    updateStep(4, 'active');
    if (delayTime) await delay(delayTime * 1.5);
    const retrieved = retrieveChunks(positiveQuery, negativeQuery || '');
    updateStep(4, 'completed', { chunks: retrieved });

    updateStep(5, 'active');
    if (delayTime) await delay(delayTime);
    const context = assembleContext(retrieved);
    updateStep(5, 'completed', { context });

    updateStep(6, 'active');
    if (delayTime) await delay(delayTime);
    const prompt = {
      system: 'You are a movie recommender. Use ONLY the provided context. If context is insufficient, say so.',
      user: `Positive: ${positiveQuery}${negativeQuery ? `\nNegative: ${negativeQuery}` : ''}`,
      context,
    };
    updateStep(6, 'completed', { prompt });

    updateStep(7, 'active');
    if (delayTime) await delay(delayTime * 1.2);

    let recommendations;
    if (useLiveLLM && apiKey) {
      recommendations = await generateWithLLM(prompt);
    } else {
      recommendations = generateKeylessRecommendations(retrieved, positiveQuery, negativeQuery || '');
    }

    updateStep(7, 'completed', { mode: useLiveLLM && apiKey ? 'live' : 'keyless', recommendations });

    updateStep(8, 'active');
    if (delayTime) await delay(delayTime);
    updateStep(8, 'completed', { recommendations });

    setIsRunning(false);
  };

  const generateWithLLM = async (prompt: any) => {
    return generateKeylessRecommendations(
      steps.find(s => s.id === 4)?.data?.chunks || [],
      positiveQuery,
      negativeQuery || ''
    );
  };

  const runInstantly = async () => {
    if (!positiveQuery.trim()) {
      alert('Please enter what you want to find');
      return;
    }

    setIsRunning(true);

    const retrieved = retrieveChunks(positiveQuery, negativeQuery || '');
    const context = assembleContext(retrieved);
    const sampleMovie = movies[0];
    const sampleChunks = chunkText(sampleMovie.synopsis);
    const sampleEmbedding = generatePseudoEmbedding(sampleChunks[0]);

    const prompt = {
      system: 'You are a movie recommender. Use ONLY the provided context. If context is insufficient, say so.',
      user: `Positive: ${positiveQuery}${negativeQuery ? `\nNegative: ${negativeQuery}` : ''}`,
      context,
    };

    const recommendations = generateKeylessRecommendations(retrieved, positiveQuery, negativeQuery || '');

    setSteps([
      { id: 1, title: 'Dataset', status: 'completed', data: { movies, count: movies.length } },
      { id: 2, title: 'Chunking', status: 'completed', data: { movie: sampleMovie, chunks: sampleChunks } },
      { id: 3, title: 'Embeddings', status: 'completed', data: { embedding: sampleEmbedding } },
      { id: 4, title: 'Vector Search', status: 'completed', data: { chunks: retrieved } },
      { id: 5, title: 'Retrieved Context', status: 'completed', data: { context } },
      { id: 6, title: 'Prompt Assembly', status: 'completed', data: { prompt } },
      { id: 7, title: 'Generation', status: 'completed', data: { mode: 'keyless', recommendations } },
      { id: 8, title: 'Final Answer', status: 'completed', data: { recommendations } },
    ]);

    setExpandedSteps(new Set([8]));
    setIsRunning(false);
  };

  const reset = () => {
    setSteps(steps.map(s => ({ ...s, status: 'pending' as StepStatus, data: undefined })));
    setExpandedSteps(new Set([1]));
  };

  const toggleStep = (stepId: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const fillSample = (positive: string, negative: string) => {
    setPositiveQuery(positive);
    setNegativeQuery(negative);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">RAG Playground: Movie Recommender</h2>
          <p className="text-slate-300 text-lg mb-6">
            Learn how Retrieval-Augmented Generation works, step by step
          </p>

          <button
            onClick={() => setShowWhatIsRAG(!showWhatIsRAG)}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
            What is RAG?
            <ChevronDown className={`w-4 h-4 transition-transform ${showWhatIsRAG ? 'rotate-180' : ''}`} />
          </button>

          {showWhatIsRAG && (
            <div className="mt-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-left max-w-3xl mx-auto">
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">RAG = Retrieve relevant information first, then Generate an answer grounded in that retrieved context.</strong>
                <br /><br />
                Instead of relying solely on a model's memory, RAG systems search through a knowledge base to find relevant information,
                then use that information to generate accurate, grounded responses. This demo shows you exactly how that process works
                with a movie recommendation system.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Try It</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What do you want? (positive)
                  </label>
                  <textarea
                    value={positiveQuery}
                    onChange={(e) => setPositiveQuery(e.target.value)}
                    placeholder="e.g., Witty romantic comedy with friends-to-lovers"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What to avoid? (negative)
                  </label>
                  <textarea
                    value={negativeQuery}
                    onChange={(e) => setNegativeQuery(e.target.value)}
                    placeholder="e.g., gore, horror"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={runStepByStep}
                    disabled={isRunning}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                    Step-by-Step
                  </button>

                  <button
                    onClick={runInstantly}
                    disabled={isRunning}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    Instantly
                  </button>

                  <button
                    onClick={reset}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-3">Sample queries (click to fill):</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => fillSample('Witty romantic comedy with friends-to-lovers', 'gore')}
                      className="w-full text-left px-4 py-2 bg-slate-900/50 hover:bg-slate-900 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      Witty romantic comedy with friends-to-lovers; avoid gore
                    </button>
                    <button
                      onClick={() => fillSample('Space exploration with hopeful tone', 'horror')}
                      className="w-full text-left px-4 py-2 bg-slate-900/50 hover:bg-slate-900 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      Space exploration with hopeful tone; avoid horror
                    </button>
                    <button
                      onClick={() => fillSample('Heist thriller with clever twists', 'slow drama')}
                      className="w-full text-left px-4 py-2 bg-slate-900/50 hover:bg-slate-900 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      Heist thriller with clever twists; avoid slow drama
                    </button>
                    <button
                      onClick={() => fillSample('Found-family road trip', 'violence')}
                      className="w-full text-left px-4 py-2 bg-slate-900/50 hover:bg-slate-900 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      Found-family road trip; avoid violence
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-3">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={latencySimulation}
                      onChange={(e) => setLatencySimulation(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-teal-500 focus:ring-teal-500"
                    />
                    Latency simulation (adds delays for realism)
                  </label>

                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Settings
                  </button>

                  {showSettings && (
                    <div className="p-4 bg-slate-900/50 rounded-lg space-y-3 border border-slate-700">
                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useLiveLLM}
                          onChange={(e) => setUseLiveLLM(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-teal-500 focus:ring-teal-500"
                        />
                        Use Live LLM (requires API key)
                      </label>

                      {useLiveLLM && (
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">OpenAI API Key (memory only)</label>
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <p className="text-xs text-slate-500 mt-1">Note: Currently uses keyless mode regardless</p>
                        </div>
                      )}

                      <p className="text-xs text-slate-500">
                        Mode: <span className="text-teal-400 font-medium">
                          {useLiveLLM && apiKey ? 'Live LLM' : 'Keyless (default)'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Behind the Scenes</h3>

              <div className="space-y-3">
                {steps.map((step) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    isExpanded={expandedSteps.has(step.id)}
                    onToggle={() => toggleStep(step.id)}
                    selectedMovieId={selectedMovieId}
                    setSelectedMovieId={setSelectedMovieId}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredMovies={filteredMovies}
                    genreDistribution={genreDistribution}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  step: StepState;
  isExpanded: boolean;
  onToggle: () => void;
  selectedMovieId: string | null;
  setSelectedMovieId: (id: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredMovies: Movie[];
  genreDistribution: [string, number][];
}

const StepCard = ({ step, isExpanded, onToggle, selectedMovieId, setSelectedMovieId, searchTerm, setSearchTerm, filteredMovies, genreDistribution }: StepCardProps) => {
  const [showCitations, setShowCitations] = useState<Record<string, boolean>>({});

  const getStatusIcon = () => {
    if (step.status === 'completed') return <Check className="w-5 h-5 text-emerald-400" />;
    if (step.status === 'active') return <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
  };

  const getStatusColor = () => {
    if (step.status === 'completed') return 'border-emerald-500/30 bg-emerald-500/5';
    if (step.status === 'active') return 'border-teal-500/50 bg-teal-500/10';
    return 'border-slate-700 bg-slate-900/30';
  };

  return (
    <div className={`border rounded-lg transition-all duration-300 ${getStatusColor()}`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <span className="font-semibold text-white">
            Step {step.id}: {step.title}
          </span>
        </div>
        {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>

      {isExpanded && step.data && (
        <div className="px-4 pb-4 border-t border-slate-700/50 mt-2 pt-4">
          <StepContent
            step={step}
            selectedMovieId={selectedMovieId}
            setSelectedMovieId={setSelectedMovieId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredMovies={filteredMovies}
            genreDistribution={genreDistribution}
            showCitations={showCitations}
            setShowCitations={setShowCitations}
          />
        </div>
      )}
    </div>
  );
};

interface StepContentProps {
  step: StepState;
  selectedMovieId: string | null;
  setSelectedMovieId: (id: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredMovies: Movie[];
  genreDistribution: [string, number][];
  showCitations: Record<string, boolean>;
  setShowCitations: (citations: Record<string, boolean>) => void;
}

const StepContent = ({ step, selectedMovieId, setSelectedMovieId, searchTerm, setSearchTerm, filteredMovies, genreDistribution, showCitations, setShowCitations }: StepContentProps) => {
  switch (step.id) {
    case 1:
      return (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Dataset loaded: <strong className="text-white">{step.data.count} movies</strong>
          </p>
          <div className="text-sm text-slate-400">
            <p className="mb-2">Top genres:</p>
            <div className="flex flex-wrap gap-2">
              {genreDistribution.map(([genre, count]) => (
                <span key={genre} className="px-2 py-1 bg-slate-800 rounded text-xs">
                  {genre} ({count})
                </span>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 mb-2"
            />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredMovies.slice(0, 20).map(movie => (
                <button
                  key={movie.id}
                  onClick={() => setSelectedMovieId(selectedMovieId === movie.id ? null : movie.id)}
                  className="w-full text-left px-3 py-2 bg-slate-900/50 hover:bg-slate-800 rounded text-xs text-slate-300 transition-colors"
                >
                  {movie.title} ({movie.year}) - {movie.genres.join(', ')}
                </button>
              ))}
            </div>
          </div>

          {selectedMovieId && (
            <div className="p-3 bg-slate-900 rounded border border-slate-700 text-xs">
              {(() => {
                const movie = filteredMovies.find(m => m.id === selectedMovieId);
                if (!movie) return null;
                return (
                  <div>
                    <h4 className="text-white font-semibold mb-1">{movie.title} ({movie.year})</h4>
                    <p className="text-slate-400 mb-2">{movie.genres.join(', ')}</p>
                    <p className="text-slate-300 text-xs mb-2">{movie.synopsis}</p>
                    <div className="flex flex-wrap gap-1">
                      {movie.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-teal-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      );

    case 2:
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">
            Chunking strategy: <strong className="text-white">80-120 words per chunk</strong>
          </p>
          <p className="text-slate-400 text-xs">
            Why chunk? So retrieval can grab the most relevant parts of each synopsis.
          </p>

          <div className="p-3 bg-slate-900 rounded border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Example: {step.data.movie.title}</p>
            <p className="text-xs text-slate-500 mb-2">Original synopsis:</p>
            <p className="text-xs text-slate-300 mb-3">{step.data.movie.synopsis}</p>

            <p className="text-xs text-slate-500 mb-2">Split into {step.data.chunks.length} chunks:</p>
            <div className="space-y-2">
              {step.data.chunks.map((chunk: string, idx: number) => (
                <div key={idx} className="p-2 bg-slate-800 rounded">
                  <p className="text-xs text-teal-400 mb-1">Chunk #{idx + 1}</p>
                  <p className="text-xs text-slate-300">{chunk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">
            Embedding dimension: <strong className="text-white">256</strong>
          </p>
          <p className="text-slate-400 text-xs">
            Local embedding simulation using hashed bag-of-words with TF weighting
          </p>

          <div className="p-3 bg-slate-900 rounded border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Sample embedding (first 12 values):</p>
            <div className="font-mono text-xs text-slate-300">
              [{step.data.embedding.slice(0, 12).map((v: number) => v.toFixed(4)).join(', ')}...]
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            Note: This is a deterministic pseudo-embedding for educational purposes
          </p>
        </div>
      );

    case 4:
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">
            Retrieved <strong className="text-white">{step.data.chunks.length}</strong> most similar chunks
          </p>
          <p className="text-slate-400 text-xs">
            Query vector = positive embedding - 0.75 × negative embedding
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {step.data.chunks.map((chunk: RetrievedChunk, idx: number) => (
              <div key={idx} className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {chunk.movie.title} ({chunk.movie.year})
                    </p>
                    <p className="text-xs text-slate-400">Chunk #{chunk.chunkIndex + 1}</p>
                  </div>
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs font-mono">
                    {chunk.similarity.toFixed(4)}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{chunk.text}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">Context pack assembled from top chunks</p>

          <div className="p-3 bg-slate-900 rounded border border-slate-700 max-h-96 overflow-y-auto">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
              {step.data.context}
            </pre>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">Prompt components:</p>

          <div className="space-y-2">
            <div className="p-3 bg-slate-900 rounded border border-slate-700">
              <p className="text-xs font-semibold text-teal-400 mb-1">SYSTEM</p>
              <p className="text-xs text-slate-300">{step.data.prompt.system}</p>
            </div>

            <div className="p-3 bg-slate-900 rounded border border-slate-700">
              <p className="text-xs font-semibold text-teal-400 mb-1">USER</p>
              <p className="text-xs text-slate-300 whitespace-pre-wrap">{step.data.prompt.user}</p>
            </div>

            <div className="p-3 bg-slate-900 rounded border border-slate-700">
              <p className="text-xs font-semibold text-teal-400 mb-1">CONTEXT</p>
              <p className="text-xs text-slate-300 whitespace-pre-wrap">
                {step.data.prompt.context.slice(0, 500)}...
              </p>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-3">
          <p className="text-slate-300 text-sm">
            Generation mode: <strong className="text-teal-400">{step.data.mode}</strong>
          </p>

          {step.data.mode === 'keyless' && (
            <div className="p-3 bg-slate-900 rounded border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Keyless generation process:</p>
              <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                <li>Group chunks by movie</li>
                <li>Score movies by max + average similarity</li>
                <li>Pick top 3-5 distinct movies</li>
                <li>Generate reasons from tags/genres/keywords</li>
              </ol>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Recommendations generated: {step.data.recommendations.length}
          </p>
        </div>
      );

    case 8:
      return (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm font-semibold">
            Top Recommendations
          </p>

          <div className="space-y-3">
            {step.data.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <h4 className="text-white font-semibold mb-1">
                  {rec.movie.title} ({rec.movie.year})
                </h4>
                <p className="text-xs text-slate-400 mb-2">{rec.movie.genres.join(', ')}</p>

                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Why this matches:</p>
                  <ul className="space-y-1">
                    {rec.reasons.map((reason: string, ridx: number) => (
                      <li key={ridx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-teal-400 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setShowCitations({ ...showCitations, [rec.movie.id]: !showCitations[rec.movie.id] })}
                  className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
                >
                  {showCitations[rec.movie.id] ? 'Hide citations' : 'Show citations'}
                </button>

                {showCitations[rec.movie.id] && (
                  <div className="mt-3 p-3 bg-slate-800 rounded border border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Sources used:</p>
                    <p className="text-xs text-slate-300 font-mono">{rec.sources}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return <p className="text-slate-400 text-sm">No data available</p>;
  }
};

export default RAGPlayground;
