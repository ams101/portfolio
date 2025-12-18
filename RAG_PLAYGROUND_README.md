# RAG Playground: Movie Recommender

An educational interactive demo that teaches how Retrieval-Augmented Generation (RAG) works, step by step.

## Overview

This demo implements a complete RAG pipeline for movie recommendations using a dataset of 100 movies. It visualizes every step of the process, from dataset loading through final recommendations, making RAG concepts tangible and understandable.

## How It Works

### What is RAG?

**RAG = Retrieve relevant information first, then Generate an answer grounded in that retrieved context.**

Instead of relying solely on a model's memory, RAG systems:
1. Search through a knowledge base to find relevant information
2. Use that information to generate accurate, grounded responses

### The 8-Step Pipeline

#### Step 1: Dataset
- Loads `movies100.json` from `/src/data/`
- Contains 100 movies with titles, years, genres, synopses, and tags
- Provides search and browse functionality
- Shows genre distribution statistics

#### Step 2: Chunking
- Splits each movie synopsis into chunks of 80-120 words
- Allows retrieval to grab the most relevant parts of each synopsis
- Visualizes original text and resulting chunks

#### Step 3: Embeddings (Keyless)
- Generates 256-dimensional pseudo-embeddings locally
- Uses deterministic hashed bag-of-words with TF weighting
- No external API required
- Shows embedding preview

#### Step 4: Vector Search
- Builds in-memory index of all chunk vectors
- Creates query vector: `positive_embedding - 0.75 × negative_embedding`
- Computes cosine similarity between query and all chunks
- Returns top 6 most similar chunks with scores

#### Step 5: Retrieved Context
- Assembles exact "Context Pack" from top chunks
- Formats as: `[Movie: Title (Year) | Genres | Chunk #] <text>`
- This context grounds the generation step

#### Step 6: Prompt Assembly
- Shows complete prompt structure:
  - **SYSTEM**: Instructions for the model
  - **USER**: Positive and negative preferences
  - **CONTEXT**: Retrieved context pack

#### Step 7: Generation
Two modes available:

**A) Keyless Mode (Default)**
- Groups retrieved chunks by movie
- Scores movies by max/avg similarity
- Picks top 3-5 distinct movies
- Generates natural language recommendations using templates
- Derives reasons from tags, genres, and chunk keywords

**B) Live LLM Mode (Optional)**
- User can paste OpenAI API key (memory only, not stored)
- Would call OpenAI chat completions with assembled prompt
- Falls back to keyless if key missing or API fails
- Currently defaults to keyless for demo purposes

#### Step 8: Final Answer
- Displays 3-5 movie recommendations as cards
- Shows "Why this matches" bullets
- Lists sources used (Movie ID + chunk indices)
- Expandable citations to see exact chunks

## Features

### User Interface

**Left Pane: Try It**
- Positive query input: "What do you want?"
- Negative query input: "What to avoid?"
- Three execution modes:
  - **Step-by-Step**: Animates through all 8 steps with delays
  - **Instantly**: Runs entire pipeline at once
  - **Reset**: Clears all results

**Right Pane: Behind the Scenes**
- Vertical stepper with 8 expandable steps
- Each step shows concrete produced data
- Active step highlighted during step-by-step mode
- Completed steps show green checkmark

### Interactive Elements

- **Sample Queries**: Click to fill with pre-written examples
- **Latency Simulation**: Toggle realistic delays for step-by-step mode
- **Dataset Search**: Filter movies by title, genre, or tag
- **Movie Preview**: Click any movie to see full details
- **Citations Toggle**: Expand to see exact chunks used for each recommendation
- **Advanced Settings**: Enable Live LLM mode with API key

### Sample Queries

1. "Witty romantic comedy with friends-to-lovers; avoid gore"
2. "Space exploration with hopeful tone; avoid horror"
3. "Heist thriller with clever twists; avoid slow drama"
4. "Found-family road trip; avoid violence"

## Technical Implementation

### Data Structure

Movies are stored in `/src/data/movies100.json` with schema:
```json
{
  "id": "M001",
  "title": "Movie Title",
  "year": 2010,
  "genres": ["Drama", "Comedy"],
  "synopsis": "150-300 words of plot summary",
  "tags": ["witty", "friends-to-lovers", "hopeful"]
}
```

### Key Algorithms

**Text Chunking**
```typescript
chunkText(text: string, minWords = 80, maxWords = 120): string[]
```
- Splits text into roughly equal-sized chunks
- Maintains word boundaries

**Pseudo-Embedding Generation**
```typescript
generatePseudoEmbedding(text: string): number[]
```
- Returns 256-dimensional vector
- Uses word hashing for deterministic results
- Normalizes to unit length
- No external dependencies

**Vector Similarity**
```typescript
cosineSimilarity(a: number[], b: number[]): number
```
- Computes dot product of normalized vectors
- Returns similarity score between 0 and 1

**Retrieval**
```typescript
retrieveChunks(positive: string, negative: string, k = 6): RetrievedChunk[]
```
- Embeds both positive and negative queries
- Creates combined query vector with negative weighting
- Ranks all chunks by cosine similarity
- Returns top-k results

### Client-Side Only

- No backend required
- All processing happens in the browser
- Perfect for portfolio deployment
- Works on static hosting (Netlify, Vercel, GitHub Pages)

## Installation & Setup

The demo is already integrated into the project. To use:

1. Ensure `movies100.json` exists at `/src/data/movies100.json` ✓
2. Component is at `/src/components/RAGPlayground.tsx`
3. Integrated into ProductDemoPage component
4. Access via the main demo page

## Optional: Live LLM Mode

To enable actual LLM generation:

1. Click "Advanced Settings"
2. Check "Use Live LLM"
3. Paste your OpenAI API key
4. Key stored in memory only (not persisted)
5. Currently falls back to keyless mode

**Note**: The keyless mode is fully functional and demonstrates the complete RAG pipeline without requiring any API keys.

## Educational Value

This demo teaches:

1. **Why RAG**: Shows how retrieval grounds generation in facts
2. **Chunking Strategy**: Visualizes how text is split for retrieval
3. **Vector Embeddings**: Demonstrates how text becomes numbers
4. **Semantic Search**: Shows similarity-based retrieval in action
5. **Context Assembly**: Reveals how retrieved info becomes prompts
6. **Generation Methods**: Compares keyless vs. LLM approaches
7. **Source Attribution**: Demonstrates citation and traceability

Perfect for:
- Portfolio demonstrations
- Teaching RAG concepts
- Interview discussions about AI systems
- Understanding retrieval-based systems

## Architecture Highlights

- **Modular Design**: Each step is isolated and testable
- **Type Safety**: Full TypeScript throughout
- **Performance**: Client-side processing handles 100 movies easily
- **Extensibility**: Easy to swap in real embeddings or LLM
- **Educational Focus**: Every step shows real intermediate data

## Future Enhancements

Possible improvements:
- Integration with actual embedding API (OpenAI, Cohere)
- Real LLM generation with streaming
- Larger movie datasets
- Filter by year, genre before retrieval
- Hybrid search (keyword + semantic)
- Re-ranking strategies
- A/B test different chunking strategies
- Explain similarity scores in detail

## License & Credits

Built as part of a portfolio demonstration project.
Dataset: Synthetic movie data generated for educational purposes.
