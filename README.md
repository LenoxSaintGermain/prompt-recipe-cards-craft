# Prompt Recipe Cards
*Institutional Memory for the AI Age*

Most companies treat their best AI prompts like Post-it notes—scattered across Slack threads, buried in documents, lost when people leave.

You've seen it: That perfect Perplexity search that unlocked a breakthrough. The prompt template that saved hours of research. The exact phrasing that made the AI finally "get it."

And then... it's gone. Reinvented weekly by each team member who needs it.

## What It Is (And Isn't)

Prompt Recipe Cards is not a bookmark manager. It's a knowledge operating system for AI-native teams.

Instead of saving links, you capture **methodology**.  
Instead of hoarding prompts, you **systematize expertise**.  
Instead of tribal knowledge, you **build institutional memory**.

**The Experience:**

You're in a Perplexity session that's generating incredible results. With one click, you capture not just the prompt, but the **pattern**: what it does, who it's for, when to use it, how to adapt it.

Your AI copilot analyzes the content and suggests which collection it belongs to—"Market Research," "Content Creation," "Business Development." It's already learning your team's workflow.

Later, a new team member searches for "competitive analysis." They don't just find a prompt—they find a complete recipe: the context, the steps, example variations, tips from people who've used it. They're productive in minutes, not weeks.

Built native to AI workflows, not bolted on. Every feature designed around how teams actually discover, refine, and share what works.

## Why This Exists

**The Real Problem:**

The bottleneck isn't AI capability—it's knowledge transfer. Your best people have figured out how to make AI work. They've discovered the prompts that unlock insights, the phrasing that gets better outputs, the workflows that save hours.

But this expertise lives in their heads, their chat histories, their private notes. When they're out, the team regresses. When they leave, the knowledge walks out the door.

**The Insight:**

Humans don't naturally document their process. We're optimized for **doing**, not **teaching**. The moment you ask someone to "write down your best prompts," you've introduced friction that kills adoption.

The only way to capture expertise is to make it **easier to save than to skip**.

Traditional knowledge management tools fail because they treat documentation as an afterthought—something you do *after* the work. But the best time to capture knowledge is *during* the work, when context is fresh and the value is obvious.

**Our Thesis:**

We believe AI expertise should compound, not reset.

Every prompt refined, every pattern discovered, every workflow optimized—these should become institutional assets, not individual secrets. Not because people are selfish, but because we've never made it effortless to share.

## Who This Is For

**You're the kind of person who:**

🎯 **The AI Power User**  
You've figured out the magic formulas. You have that one Perplexity search pattern that consistently delivers gold. But you're tired of being the bottleneck—everyone coming to you for "that prompt you use." You want your expertise to scale without cloning yourself.

🧭 **The Team Lead**  
Your team's AI outputs are wildly inconsistent. Some people get brilliant results, others struggle. You need new hires productive faster and veterans sharing what works. You're not looking for another tool—you're looking for a system that makes best practices *the path of least resistance*.

📚 **The Knowledge Manager**  
You've watched valuable expertise evaporate when people leave. You've tried wikis, documentation tools, Notion databases—they all become graveyards of outdated information. You need something that captures knowledge *in the flow of work*, not as an afterthought.

🎓 **The Training Coordinator**  
You're building AI literacy programs and need real examples, not generic tutorials. You want to show people *exactly* how your organization uses AI, with proven templates they can adapt immediately. Theory is cheap; you deal in results.

💼 **The Consultant / Freelancer**  
Your methodology is your competitive advantage. You need to package your expertise into something clients can use—not just deliver results, but transfer capability. Your recipe cards become your deliverable, your training manual, your differentiator.

## The Vision: Where We're Headed

This isn't just about organizing prompts.

It's about building the infrastructure for institutional AI memory. It's about creating organizations where AI expertise compounds instead of evaporating.

**The Art of the Possible:**

Imagine a company where every AI breakthrough is automatically captured and categorized. Where new hires have access to the collective wisdom of your best AI users from day one. Where your competitive advantage isn't just *using* AI, but *systematizing how you use it*.

Think about the compounding effect: Today, someone discovers a better way to phrase competitive analysis prompts. Tomorrow, three people build on that discovery. Next week, the pattern is refined across a dozen use cases. Next month, it's part of your onboarding. Next quarter, it's your competitive moat.

This is the future of knowledge work: not hoarding individual expertise, but building systems that make everyone smarter.

## Join the Journey

This tool was built with Lovable—from concept to working prototype in days, not months. It demonstrates the very principle it embodies: systematizing what works so others can build on it.

Whether you're here to:
- **Deploy**: Spin up your own instance and start capturing your team's AI expertise
- **Adapt**: Fork the codebase and customize it for your specific workflow  
- **Learn**: See how rapid prototyping enables fast validation and iteration
- **Contribute**: Help build the next generation of knowledge management tools

You're in the right place.

**Ready to begin?** See [Quick Start](#-quick-start) below.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase account (free tier works) - [Sign up here](https://supabase.com)
- API keys for AI providers (optional but recommended for full features)

### Local Development

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
# Copy .env.example to .env and add your Supabase credentials
cp .env.example .env

# Step 5: Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Setup

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

For AI features, configure these secrets in your Supabase project dashboard under Edge Functions:
- `GEMINI_API_KEY` - For Google Gemini AI integration
- `CLAUDE_API_KEY` - For Anthropic Claude AI integration

## 🏗️ Technical Architecture

**Built With:**
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **AI Integration**: Multi-provider support (Google Gemini, Anthropic Claude)
- **State Management**: TanStack Query for server state synchronization
- **Export Capabilities**: PDF (jsPDF), PNG (html2canvas), Markdown
- **Drag & Drop**: @dnd-kit for intuitive reordering

**Why This Stack:**

This is a React-native web application optimized for rapid development and production deployment. Supabase provides full-stack capabilities—database, real-time subscriptions, authentication, serverless functions—without infrastructure complexity.

The multi-provider AI integration ensures flexibility and prevents vendor lock-in. Teams can choose between Gemini (fast, cost-effective) and Claude (nuanced, powerful) based on their needs.

The component architecture follows shadcn/ui patterns: copy-paste components that you own, not a dependency that owns you. This means full customization without fighting a framework.

## 📦 Core Features

### Recipe Card Management
- **Create & Edit**: Rich editor with all fields (what it does, who it's for, steps, examples, tips)
- **Difficulty Levels**: Categorize as Beginner, Intermediate, or Advanced
- **Collections**: Organize cards into themed collections (Market Research, Content Creation, etc.)
- **Bulk Operations**: Import, export, move, or delete multiple cards at once
- **Search & Filter**: Find cards by name, content, difficulty, or collection

### AI-Powered Intelligence

**Multi-Card Smart Parsing**  
Paste bulk content from Perplexity training materials or documentation. The AI automatically:
- Detects individual recipe cards within the content
- Extracts structured data (name, description, steps, examples)
- Suggests appropriate difficulty levels
- Recommends collections based on content analysis

```typescript
// Example: Parse multiple cards from text
const parsedCards = await parseRecipeContent(bulkText, 'gemini');
// Returns array of structured RecipeCard objects ready to save
```

**AI Copilot Panel**  
Real-time assistance for any field. Stuck on how to describe "who it's for"? The copilot analyzes your existing content and suggests improvements:
- Context-aware suggestions based on the full card
- Field-specific guidance (steps should be actionable, tips should be specific)
- Refinement options to iterate on suggestions

**Collection Intelligence**  
The system learns from your card content to suggest relevant collections. Marketing-focused prompts automatically surface "Marketing" collections. Technical prompts highlight "Engineering" or "Data Analysis" categories.

**Batch Enhancement**  
Select multiple cards and enhance them all at once. The AI reviews each card for:
- Clarity and completeness
- Actionable steps and concrete examples
- Target audience specificity
- Practical, tested tips

### Export & Sharing

**PDF Export**
- **Document Layout**: Traditional top-to-bottom format for printing or digital distribution
- **Slide Layout**: Landscape orientation optimized for presentations and screen sharing
- Professional styling with proper typography and spacing

**PNG Export**  
High-resolution image export for:
- Embedding in presentations
- Sharing on collaboration tools (Slack, Teams, Notion)
- Creating visual libraries

**Markdown Export**  
Structured markdown output for:
- Documentation systems (GitBook, Docusaurus)
- Version control (track changes in Git)
- Integration with wikis and knowledge bases

### Organization & Collaboration

**Collections System**
- Create themed collections (by department, use case, skill level)
- Multi-collection assignment (one card can belong to multiple collections)
- Quick actions: bulk move, export collection, analyze trends

**Connection Status Monitoring**  
Real-time connection indicator shows Supabase status. If offline, the UI adapts gracefully, queuing operations for when connection returns.

**Import Job Tracking**  
When importing bulk cards, track progress with:
- Total cards processed
- Success/failure counts
- Error logs for troubleshooting
- Retry mechanisms for failed imports

## 🔧 Development

### Project Structure

```
src/
├── components/
│   ├── recipe-card/              # Card-specific components
│   │   ├── BasicInfoSection.tsx  # Name, difficulty, description fields
│   │   ├── StepsSection.tsx      # Step-by-step instructions
│   │   ├── ExamplePromptsSection.tsx
│   │   ├── TipsSection.tsx
│   │   ├── MultiCardImportSection.tsx  # Bulk AI parsing
│   │   ├── AICopilotPanel.tsx    # Real-time AI assistance
│   │   ├── LayoutEditor.tsx      # Drag-drop section reordering
│   │   └── ...
│   ├── ui/                       # shadcn/ui components (Button, Dialog, etc.)
│   ├── RecipeCardEditor.tsx      # Main card editing interface
│   ├── RecipeCardLibrary.tsx     # Grid view of all cards
│   ├── CollectionDetailView.tsx  # Collection management
│   ├── BulkManagement.tsx        # Bulk operations panel
│   └── ExportUtils.tsx           # PDF/PNG/MD export logic
├── hooks/
│   ├── useRecipeCards.ts         # Card CRUD operations
│   ├── useCollections.ts         # Collection management
│   ├── useContentAnalysis.ts     # AI content analysis
│   ├── useJsonImport.ts          # Import job handling
│   └── useConnectionStatus.ts    # Real-time connection monitoring
├── services/
│   └── aiService.ts              # AI provider abstraction layer
├── integrations/
│   └── supabase/
│       ├── client.ts             # Supabase client instance
│       └── types.ts              # Database type definitions
├── pages/
│   ├── Index.tsx                 # Main application page
│   └── NotFound.tsx              # 404 handler
└── utils/
    └── retryUtils.ts             # Network retry logic

supabase/
├── functions/
│   ├── parse-recipe-content/     # AI bulk parsing endpoint
│   ├── improve-recipe-card/      # AI card enhancement
│   ├── recipe-assistant/         # Field-specific AI help
│   ├── batch-enhance-cards/      # Bulk AI processing
│   └── check-ai-providers/       # Provider availability check
└── migrations/                   # Database schema versioning
```

### Key Architectural Decisions

**1. Edge Functions for AI Security**  
All AI API calls go through Supabase Edge Functions. This keeps API keys server-side and prevents exposure in client code. The client simply requests an operation; the server handles provider selection and key management.

```typescript
// Client code - no API keys exposed
const result = await aiService.improveRecipeCard(card, 'gemini');

// Server handles the actual API call with secure keys
const response = await fetch('https://generativelanguage.googleapis.com/...', {
  headers: { 'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') }
});
```

**2. Multi-Provider Flexibility**  
Provider selection happens at the function level. Want to use Claude for complex cards and Gemini for simple ones? Just change the provider parameter. The abstraction layer handles API differences.

**3. Retry Logic with Exponential Backoff**  
Network requests include built-in retry mechanisms. If a save fails due to connection issues, it automatically retries up to 3 times with increasing delays. Users see clear feedback about retry attempts.

```typescript
await withRetry(
  async () => supabase.from('recipe_cards').insert(card),
  {
    maxAttempts: 3,
    delayMs: 1000,
    onRetry: (attempt) => toast.info(`Retrying... (${attempt}/3)`)
  }
);
```

**4. Optimistic Updates with Rollback**  
The UI updates immediately when you save a card, then syncs with the server in the background. If the save fails, it rolls back the optimistic update and shows an error.

**5. Bulk Operations with Promise.allSettled**  
Bulk operations process cards in parallel, not sequentially. If 10 cards are being saved, they all save simultaneously. Promise.allSettled ensures that one failure doesn't stop the rest.

```typescript
const results = await Promise.allSettled(
  cards.map(card => saveCard(card))
);
const successful = results.filter(r => r.status === 'fulfilled').length;
// Continue with successful saves even if some failed
```

## 🚢 Deployment

### Deploy to Lovable (Recommended)

1. Open your [Lovable project](https://lovable.dev/projects/b8887d6e-dccb-42ed-b009-9f95831603b8)
2. Click **"Publish"** in the top right corner
3. Your app is live at `your-project.lovable.app`
4. Optional: Connect a custom domain in Settings → Domains

**Note**: Edge functions deploy automatically. Frontend changes require clicking "Update" in the publish dialog.

### Self-Hosting

**Frontend Deployment:**

```bash
# Build the production bundle
npm run build

# Deploy the dist/ folder to any static hosting:
# - Vercel: vercel deploy
# - Netlify: netlify deploy --prod
# - Cloudflare Pages: wrangler pages publish dist
```

**Backend Deployment (Supabase):**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Deploy Edge Functions
supabase functions deploy parse-recipe-content
supabase functions deploy improve-recipe-card
supabase functions deploy recipe-assistant
supabase functions deploy batch-enhance-cards
supabase functions deploy check-ai-providers

# Set secrets for Edge Functions
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set CLAUDE_API_KEY=your_key
```

**Environment Variables:**

Configure in your hosting platform:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## 📚 API Documentation

### AI Service Methods

```typescript
import { aiService } from '@/services/aiService';

// Parse bulk content into structured recipe cards
const cards = await aiService.parseRecipeContent(
  content: string,
  provider: 'gemini' | 'claude'
);
// Returns: RecipeCard[]

// Enhance an existing card with AI suggestions
const improved = await aiService.improveRecipeCard(
  cardData: RecipeCard,
  provider: 'gemini' | 'claude'
);
// Returns: RecipeCard

// Get field-specific assistance
const suggestion = await aiService.getRecipeAssistance(
  field: string,           // e.g., 'whoItsFor'
  currentValue: string,    // Current field content
  context: RecipeCard,     // Full card context
  provider: 'gemini' | 'claude'
);
// Returns: string

// General AI generation
const text = await aiService.generateWithAI(
  prompt: string,
  provider: 'gemini' | 'claude'
);
// Returns: string

// Check which AI providers are available
const providers = await aiService.getAvailableAIProviders();
// Returns: { name: string, displayName: string, available: boolean }[]
```

### Database Schema

**recipe_cards**
```sql
CREATE TABLE recipe_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  what_it_does TEXT NOT NULL,
  who_its_for TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  steps JSONB DEFAULT '[]',
  example_prompts JSONB DEFAULT '[]',
  example_in_action TEXT,
  prompt_template TEXT,
  perplexity_chat_link TEXT,
  tips JSONB DEFAULT '[]',
  tags TEXT[],
  department TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**collections**
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**card_collections** (many-to-many join table)
```sql
CREATE TABLE card_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES recipe_cards(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(card_id, collection_id)
);
```

**import_jobs** (bulk import tracking)
```sql
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total_cards INTEGER DEFAULT 0,
  processed_cards INTEGER DEFAULT 0,
  failed_cards INTEGER DEFAULT 0,
  error_log TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Edge Function Endpoints

All Edge Functions follow this pattern:

```
POST https://your-project.supabase.co/functions/v1/{function-name}
Authorization: Bearer {supabase_anon_key}
Content-Type: application/json
```

**parse-recipe-content**
```json
{
  "content": "Bulk text content to parse",
  "provider": "gemini"
}
```
Returns: `{ cards: RecipeCard[] }`

**improve-recipe-card**
```json
{
  "cardData": { /* RecipeCard object */ },
  "provider": "gemini"
}
```
Returns: `{ improvedCard: RecipeCard }`

**recipe-assistant**
```json
{
  "field": "whoItsFor",
  "currentValue": "Current field content",
  "context": { /* Full RecipeCard */ },
  "provider": "gemini"
}
```
Returns: `{ suggestion: string }`

## 🤝 Contributing

Contributions welcome! This project demonstrates rapid prototyping with Lovable. Key areas for contribution:

**High-Impact Features:**
- **Version Control**: Track changes to recipe cards over time
- **Collaboration**: Real-time editing, comments, suggestions
- **Analytics**: Usage tracking, popular recipes, team insights
- **Semantic Search**: Find cards by concept, not just keywords
- **Template Library**: Pre-built recipe templates for common use cases

**AI Enhancements:**
- Additional AI providers (OpenAI, Cohere, local models)
- Prompt chaining (generate multi-step workflows)
- Auto-tagging based on content
- Similarity detection (find related recipes)

**Export Formats:**
- DOCX export for Word compatibility
- HTML export for web embedding
- JSON API for programmatic access
- Anki deck export for spaced repetition learning

**Developer Experience:**
- GraphQL API layer
- REST API with OpenAPI spec
- CLI tool for bulk operations
- Browser extension for quick capture

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test locally: `npm run dev`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with [Lovable](https://lovable.dev) - demonstrating how rapid prototyping enables going from concept to working product in days, not months.

This project itself is a recipe card for building AI-powered knowledge management tools. The entire application—from database schema to AI integrations to export functionality—was prototyped and deployed in under a week.

**The Stack:**
- [Supabase](https://supabase.com) for instant backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for beautiful, accessible components
- [TanStack Query](https://tanstack.com/query) for server state management
- [Tailwind CSS](https://tailwindcss.com) for rapid styling
- [Google Gemini](https://ai.google.dev) & [Anthropic Claude](https://anthropic.com) for AI capabilities

**Special Thanks:**
- The Lovable community for feedback and suggestions
- Early adopters who tested the bulk import features
- AI researchers whose work made these integrations possible

---

**Project Info**
- **URL**: https://lovable.dev/projects/b8887d6e-dccb-42ed-b009-9f95831603b8
- **Status**: Production-ready prototype, actively maintained
- **Version**: 1.0.0
- **Last Updated**: January 2025

---

*"The best documentation doesn't just explain—it persuades, inspires, and positions."*

Every great tool is unfinished. Every powerful idea starts as a conversation. This is both a tool for capturing knowledge and a demonstration of what's possible when you systematize the process of building itself.