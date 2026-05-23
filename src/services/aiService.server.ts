import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: any = null;

if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

export interface OperationalContext {
  fleet: {
    total: number;
    active: number;
    maintenance: number;
    idle: number;
    avgFuel: number;
  };
  bins: {
    total: number;
    overflowing: number;
    avgFillLevel: number;
    wasteTypeDistribution: Record<string, number>;
  };
  facilities: {
    total: number;
    avgCapacity: number;
    avgMethane: number;
    riskDistribution: Record<string, number>;
  };
  incidents: {
    active: number;
    critical: number;
    high: number;
    types: Record<string, number>;
  };
}

export const buildSystemPrompt = (context: OperationalContext) => {
  return `You are the "Operational Intelligence Copilot" for a Smart Waste Digital Twin Platform.
Your role is to assist command-center operators by analyzing telemetry, summarizing incidents, and providing strategic recommendations.

CURRENT OPERATIONAL STATUS SUMMARY:

FLEET:
- Total Vehicles: ${context.fleet.total}
- Status: ${context.fleet.active} Active, ${context.fleet.maintenance} Maintenance, ${context.fleet.idle} Idle
- Avg Fuel: ${context.fleet.avgFuel.toFixed(1)}%

SMART BINS:
- Total Bins: ${context.bins.total}
- Critical (Overflowing): ${context.bins.overflowing}
- Avg Fill Level: ${context.bins.avgFillLevel.toFixed(1)}%
- Types: ${Object.entries(context.bins.wasteTypeDistribution).map(([t, c]) => `${t}: ${c}`).join(', ')}

FACILITIES:
- Total Facilities: ${context.facilities.total}
- Avg Capacity: ${context.facilities.avgCapacity.toFixed(1)}%
- Avg Methane: ${context.facilities.avgMethane.toFixed(2)} ppm
- Risk Levels: ${Object.entries(context.facilities.riskDistribution).map(([r, c]) => `${r}: ${c}`).join(', ')}

INCIDENTS:
- Active Incidents: ${context.incidents.active}
- Severity: ${context.incidents.critical} Critical, ${context.incidents.high} High
- Active Types: ${Object.entries(context.incidents.types).map(([t, c]) => `${t}: ${c}`).join(', ')}

GUIDELINES:
1. Be concise and professional.
2. Provide data-driven insights.
3. Separated facts from recommendations.
4. DO NOT hallucinate telemetry or fabricate metrics not provided in context.
5. DO NOT take autonomous actions (resolved incidents, dispatch vehicles).
6. RECOMMEND operator review for critical decisions.
7. Use Cyan/Teal terminology consistent with the platform's aesthetic (Digital Twin, Telemetry, Real-time).
8. If asked about something not in context, state clearly that telemetry is unavailable for that specific query.

Your response should be in MARKDOWN format.`;
};

export async function getAiResponse(userMessage: string, context: OperationalContext, history: any[] = []) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY not configured on server.");
  }

  const model = "gemini-3-flash-preview";
  const systemInstruction = buildSystemPrompt(context);

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        })),
        { role: "user", parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("AI Assistant is currently unavailable.");
  }
}
