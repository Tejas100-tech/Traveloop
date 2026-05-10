import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, X, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function VoiceAssistant() {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Namaste! 🙏 I'm your India travel assistant. Tap the mic and ask me anything about traveling in India — cities, costs in ₹, best time to visit, food, and more! You can also ask me to open a city guide or start planning a trip." }
  ]);
  const [transcript, setTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const addResponse = useCallback(async (userText: string) => {
    setProcessing(true);
    
    // Add user message to history
    const userMessage: Message = { role: "user", text: userText };
    const history = [...messages, userMessage];
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      
      const data = await res.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
        speak(data.text);
      }
      
      if (data.action) {
        if (data.action.type === "navigate_cities") {
          setLocation(`/cities?q=${encodeURIComponent(data.action.query)}`);
        } else if (data.action.type === "add_trip") {
          setLocation(`/cities?add=${encodeURIComponent(data.action.city)}`);
        }
      }
      
    } catch (err) {
      console.error(err);
      const fallback = "Sorry, I'm having trouble connecting right now. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", text: fallback }]);
      speak(fallback);
    } finally {
      setProcessing(false);
    }
  }, [messages, speak, setLocation]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
    };
    recognition.onend = () => {
      setListening(false);
      if (transcript.trim()) {
        const userText = transcript.trim();
        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setTranscript("");
        addResponse(userText);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
  }, [transcript, addResponse]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const sendText = useCallback(() => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    addResponse(userText);
  }, [inputText, addResponse]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="India Travel Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "520px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-orange-500 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">India Travel Assistant</p>
            <p className="text-xs text-orange-100">{listening ? "Listening..." : speaking ? "Speaking..." : "Ask me anything"}</p>
          </div>
        </div>
        <button onClick={() => { setOpen(false); window.speechSynthesis?.cancel(); }} className="p-1.5 rounded-lg hover:bg-orange-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background" style={{ minHeight: 0, maxHeight: "320px" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <Bot className="w-4 h-4 text-orange-500" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-orange-500 text-white rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {processing && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mr-2">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            </div>
          </div>
        )}
        {transcript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm bg-orange-200 text-orange-900 italic rounded-br-sm">
              {transcript}...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type or speak..."
            className="flex-1 text-sm rounded-xl border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendText()}
          />
          {speaking ? (
            <button onClick={stopSpeaking} className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-200 transition-colors shrink-0">
              <Volume2 className="w-4 h-4" />
            </button>
          ) : supported ? (
            <button
              onClick={listening ? stopListening : startListening}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                listening ? "bg-red-100 text-red-500 hover:bg-red-200 animate-pulse" : "bg-orange-100 text-orange-500 hover:bg-orange-200"
              }`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          ) : null}
          <button
            onClick={sendText}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-orange-600 transition-colors shrink-0 text-xs font-bold"
          >
            →
          </button>
        </div>
        {supported && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            {listening ? "🔴 Listening — tap mic to stop" : "Tap 🎤 to speak in English"}
          </p>
        )}
      </div>
    </div>
  );
}
