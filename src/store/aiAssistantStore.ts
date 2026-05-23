import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIAssistantState {
  messages: Message[];
  isChatOpen: boolean;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  recommendations: OperationalRecommendation[];

  toggleChat: (open?: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

const DEFAULT_SUGGESTIONS = [
  "Summarize active critical incidents",
  "Which zones have high overflow risk?",
  "What is the overall fleet status?",
  "Show environmental risk areas",
  "How can I improve collection efficiency?"
];

export interface OperationalRecommendation {
  id: string;
  type: 'optimization' | 'risk' | 'incident' | 'efficiency';
  title: string;
  description: string;
  impact: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

const DEFAULT_RECOMMENDATIONS: OperationalRecommendation[] = [
  {
    id: 'rec1',
    type: 'optimization',
    title: 'Route Batch Alpha-4 Conflict',
    description: 'Multiple trucks detected on Al-Maather Street within 500m. Recommend re-routing TRK-HAZ-42 to Route Beta.',
    impact: 'Reduces congestion delay by 12 mins',
    priority: 'high',
    timestamp: new Date().toISOString()
  },
  {
    id: 'rec2',
    type: 'efficiency',
    title: 'Facility Load Balancing',
    description: 'Al-Hair Facility queue exceeds 85%. Redirect organic waste vehicles to Sulay Node.',
    impact: 'Increases processing throughput by 12%',
    priority: 'medium',
    timestamp: new Date().toISOString()
  }
];

export const useAIAssistantStore = create<AIAssistantState>((set, get) => ({
  messages: [],
  isChatOpen: false,
  isLoading: false,
  error: null,
  suggestions: DEFAULT_SUGGESTIONS,
  recommendations: DEFAULT_RECOMMENDATIONS,

  toggleChat: (open) => set((state) => ({ 
    isChatOpen: open !== undefined ? open : !state.isChatOpen 
  })),

  sendMessage: async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const history = get().messages.slice(-10); // Last 10 messages for context
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      set((state) => ({ 
        messages: [...state.messages, assistantMessage],
        isLoading: false
      }));
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.message || 'Operational communication failure.' 
      });
    }
  },

  clearHistory: () => set({ messages: [], error: null })
}));
