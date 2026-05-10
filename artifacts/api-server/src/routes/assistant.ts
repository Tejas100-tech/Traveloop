import { Router, type IRouter, type Request, type Response } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

console.log("[assistant] OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// ── Local knowledge base fallback ───────────────────────────────────────────
const KB: Record<string, string> = {
  "taj mahal": "The Taj Mahal is in Agra, Uttar Pradesh. Entry is ₹1100 for foreigners, ₹50 for Indians. Best visited at sunrise. It's a 2-3 hour train ride from Delhi.",
  "agra": "Agra is famous for the Taj Mahal and Agra Fort. Budget ₹2,000–4,000/day. Best time: October to March.",
  "jaipur": "Jaipur, the Pink City, is in Rajasthan. Key sights: Amber Fort, Hawa Mahal, City Palace. Budget ₹2,000–4,000/day. Best time: October to March.",
  "goa": "Goa is India's beach paradise. North Goa has lively beaches like Baga; South Goa is quieter. Budget ₹2,500–6,000/day. Best season: November to February.",
  "kerala": "Kerala is known for backwaters, hill stations, and Ayurveda. Must-do: houseboat in Alleppey (₹8,000–15,000/night). Best season: September to March.",
  "varanasi": "Varanasi is India's spiritual capital on the Ganges. The evening Ganga Aarti is unmissable. Budget ₹1,500–3,000/day. Best time: October to March.",
  "mumbai": "Mumbai is India's City of Dreams. Visit Gateway of India, Marine Drive, and Dharavi. Budget ₹3,000–8,000/day.",
  "delhi": "Delhi is India's capital with incredible history. Visit Red Fort, Qutub Minar, and Humayun's Tomb. Budget ₹2,000–5,000/day.",
  "udaipur": "Udaipur, the City of Lakes, is India's most romantic destination. City Palace and Lake Pichola are highlights. Budget ₹2,500–6,000/day.",
  "amritsar": "Amritsar is home to the Golden Temple — free entry. Also visit Wagah Border. Budget ₹1,500–3,000/day.",
  "darjeeling": "Darjeeling is famous for tea gardens and Himalayan views. Take the Toy Train! Budget ₹2,000–4,000/day.",
  "rishikesh": "Rishikesh is the Yoga Capital — great for rafting, bungee, and yoga retreats. Budget ₹1,500–3,500/day.",
  "mysuru": "Mysuru is famous for the Mysore Palace and sandalwood. Best time: October (Dasara festival). Budget ₹1,500–3,000/day.",
  "jaisalmer": "Jaisalmer is the Golden City in the Thar Desert. Camel safaris and desert camping are must-dos. Budget ₹2,000–4,000/day.",
  "jodhpur": "Jodhpur is the Blue City dominated by the magnificent Mehrangarh Fort. Budget ₹2,000–4,000/day.",
  "hyderabad": "Hyderabad is the City of Pearls. Famous for Charminar, Biryani, and Golconda Fort. Budget ₹2,500–5,000/day.",
  "kolkata": "Kolkata is the City of Joy — India's cultural capital. Victoria Memorial, Howrah Bridge, and Durga Puja. Budget ₹2,000–4,000/day.",
  "hampi": "Hampi is a UNESCO World Heritage Site — ancient Vijayanagara Empire ruins amid a lunar landscape. Budget ₹1,500–3,000/day.",
  "leh": "Leh-Ladakh is a surreal high-altitude desert with Buddhist monasteries and Pangong Lake. Budget ₹3,000–6,000/day.",
  "ladakh": "Leh-Ladakh is a surreal high-altitude desert with Buddhist monasteries and Pangong Lake. Budget ₹3,000–6,000/day.",
  "golden triangle": "The Golden Triangle covers Delhi, Agra, and Jaipur — India's most popular circuit. Plan 5–7 days. Total budget: ₹15,000–30,000 per person.",
  "budget": "India is very budget-friendly! Budget travelers: ₹1,500–2,500/day. Mid-range: ₹3,000–6,000/day. Luxury: ₹8,000+/day.",
  "best time": "The best time to visit most of India is October to March. Avoid June to September monsoon for most regions.",
  "transport": "India has excellent rail connectivity. Book trains on IRCTC. Apps: Ola and Uber for city taxis. Metro in Delhi, Mumbai, Bangalore.",
  "food": "Must-try foods: Butter chicken (Delhi), Vada pav (Mumbai), Biryani (Hyderabad), Masala dosa (South India), Fish curry (Goa/Kerala).",
  "currency": "India's currency is the Indian Rupee (₹). 1 USD ≈ ₹83. ATMs are widely available. UPI payments widely accepted.",
  "visa": "Most foreigners need an e-Visa at indianvisaonline.gov.in. Tourist e-Visa allows 90 days and costs $25–80 USD.",
  "hello": "Namaste! 🙏 I'm your India travel assistant. Ask me about cities like Delhi, Mumbai, Goa, Kerala, Jaipur, or topics like budget, best time to visit, or transport.",
  "help": "I can help with: city guides, budgets in ₹, best time to visit, transport, food, and visas. Just ask!",
};

const CITY_NAMES = ["agra", "jaipur", "varanasi", "goa", "mumbai", "kerala", "delhi", "udaipur",
  "amritsar", "darjeeling", "rishikesh", "mysuru", "jaisalmer", "jodhpur", "hyderabad",
  "kolkata", "hampi", "leh", "ladakh"];

function localResponse(input: string): { text: string; action: any } {
  const lower = input.toLowerCase();
  const exploreKeywords = ["show me", "explore", "tell me about", "what is", "info about", "guide to", "visit"];
  const addKeywords = ["add", "plan trip to", "trip to", "add to trip", "add to my trip", "plan a trip"];

  for (const city of CITY_NAMES) {
    if (lower.includes(city)) {
      const displayName = city.charAt(0).toUpperCase() + city.slice(1);
      if (addKeywords.some(k => lower.includes(k))) {
        return { text: `Sure! Opening ${displayName} in the City Explorer so you can add it to your trip.`, action: { type: "add_trip", city: displayName } };
      }
      if (exploreKeywords.some(k => lower.includes(k))) {
        return { text: KB[city] || `Showing you ${displayName} in the City Explorer!`, action: { type: "navigate_cities", query: displayName } };
      }
    }
  }

  for (const [key, value] of Object.entries(KB)) {
    if (lower.includes(key)) return { text: value, action: null };
  }

  if (lower.includes("plan") || lower.includes("itinerary") || lower.includes("route")) {
    return { text: "Popular routes: Golden Triangle (Delhi-Agra-Jaipur, 6 days), South India (Bangalore-Mysuru-Kerala, 10 days), or Rajasthan circuit (Jaipur-Jodhpur-Udaipur, 7 days). Which interests you?", action: null };
  }
  if (lower.includes("cost") || lower.includes("cheap") || lower.includes("expensive")) {
    return { text: "India is quite affordable! Budget: ₹1,500–2,500/day. Mid-range: ₹3,000–6,000/day. Luxury: ₹8,000+/day. Flights between cities cost ₹2,000–8,000.", action: null };
  }
  if (lower.includes("safe") || lower.includes("safety")) {
    return { text: "India is generally safe for tourists. Use registered taxis like Ola or Uber, keep valuables secure, and drink bottled water. Jaipur, Goa, and Kerala are very tourist-friendly.", action: null };
  }

  return { text: "I'm your India travel expert! Ask me about cities like Goa, Kerala, Jaipur, Delhi or Mumbai, or ask about budgets, best time to visit, transport, food, or visas. 🇮🇳", action: null };
}

// ── OpenAI system prompt and tools ──────────────────────────────────────────
const systemPrompt = `You are an expert India travel assistant for a platform called Traveloop.
Your goal is to help users plan trips to India, provide budget estimates (in Indian Rupees ₹), recommend cities, and answer travel-related questions.
You can also perform UI actions using tools if the user wants to see a city in the City Explorer or add a city to their Trip Plan.
Keep your responses concise, friendly, and suitable for text-to-speech (use plain text, no markdown).
If the user asks to explore or see a city, use the explore_city tool.
If the user asks to add a city to their trip or plan a trip to a city, use the start_trip_plan tool.
Always provide a brief spoken response even when using a tool.`;

const tools = [
  { type: "function" as const, function: { name: "explore_city", description: "Navigates the user to the City Explorer for a specific city.", parameters: { type: "object", properties: { city_name: { type: "string" } }, required: ["city_name"] } } },
  { type: "function" as const, function: { name: "start_trip_plan", description: "Opens the Add to Trip dialog for a specific city.", parameters: { type: "object", properties: { city_name: { type: "string" } }, required: ["city_name"] } } },
];

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const openai = getOpenAI();

    // Try OpenAI first, fall back to local KB on any failure
    if (openai) {
      try {
        const apiMessages = [
          { role: "system" as const, content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role as "user" | "assistant", content: m.text }))
        ];
        const response = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: apiMessages, tools, tool_choice: "auto", temperature: 0.7 });
        const choice = response.choices[0];
        let action = null;
        let text = choice.message.content || "";
        if (choice.message.tool_calls?.length) {
          const toolCall = choice.message.tool_calls[0];
          const args = JSON.parse(toolCall.function.arguments);
          if (toolCall.function.name === "explore_city") action = { type: "navigate_cities", query: args.city_name };
          else if (toolCall.function.name === "start_trip_plan") action = { type: "add_trip", city: args.city_name };
          if (!text) text = `Sure, opening ${args.city_name} for you now.`;
        }
        res.json({ text, action });
        return;
      } catch (openaiErr: any) {
        console.warn("[assistant] OpenAI failed, using local fallback:", openaiErr?.message);
      }
    }

    // Local knowledge base fallback
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user");
    const result = localResponse(lastUserMessage?.text || "");
    res.json(result);

  } catch (error: any) {
    console.error("[assistant] Error:", error?.message);
    res.status(500).json({ error: error?.message || "Failed to process chat request" });
  }
});

export default router;
