// Every working demo on the "Things I've built" page. The five featured ones have
// their own sections; the rest open from "More to try".
import ProductDemo from '../components/ProductDemo';
import ABExperiment from '../components/ABExperiment';
import WhatsAppDemo from '../components/WhatsAppDemo';
import RAGPlayground from '../components/RAGPlayground';

export const FEATURED_DEMO_IDS = ['tara', 'comparator', 'id-check', 'ops', 'copilot'] as const;

export const MORE_DEMOS = [
  {
    id: 'whatsapp',
    title: 'WhatsApp booking assistant',
    description: 'Book, change and cancel a stay over chat, and see what it decided on every message.',
    tags: 'Conversation design · guardrails · handoff',
    Component: WhatsAppDemo
  },
  {
    id: 'rag',
    title: 'How RAG works',
    description: 'An interactive walkthrough of retrieval-augmented generation, using a movie recommender.',
    tags: 'Retrieval · embeddings · grounding',
    Component: RAGPlayground
  },
  {
    id: 'payment',
    title: 'Payment flow simulator',
    description: 'The in-centre card payment flow I designed for Shaadi.com, from tap to settlement.',
    tags: 'Payments · Shaadi.com',
    Component: ProductDemo
  },
  {
    id: 'abtest',
    title: 'A/B testing simulator',
    description: 'Pick a metric, choose a lever, and see what happens. Including when not to ship.',
    tags: 'Experimentation · decisions',
    Component: ABExperiment
  }
];

export const DEMO_COUNT = FEATURED_DEMO_IDS.length + MORE_DEMOS.length;
