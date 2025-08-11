"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Loader2, MessageCircle, X, Send, Camera, Mic } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "image"
}

interface AIChatProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const addMessage = (role: "user" | "assistant", content: string, type: "text" | "image" = "text") => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      type,
    }
    setMessages((prev) => [...prev, newMessage])
  }



  // sse connection start

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("chat_session_id");
    if (saved) return saved;
    const newId = Math.random().toString().substring(10)
    localStorage.setItem("chat_session_id", newId);
    return newId;
  });

  const [eventSource, setEventSource] = useState<EventSource | null>(null);


  // const backendUrl = `http://127.0.0.1:8000`;
  const backendUrl = `https://backend-service1-68708940504.us-central1.run.app`;
  const sse_url = `${backendUrl}/events/${sessionId}`;
  const send_url = `${backendUrl}/send/${sessionId}`;
  let is_audio = false;

  const lastAssistantMsgId = useRef<string | null>(null);


  useEffect(() => {
    connectSSE();
    // Cleanup on unmount
    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const connectSSE = () => {
    if (eventSource) eventSource.close();
    const es = new EventSource(`${sse_url}?is_audio=${is_audio}`);
    if (process.env.NODE_ENV === "development") {
      console.log("url ", `${sse_url}?is_audio=${is_audio}`)
    }
    es.onopen = () => {
      console.log("Connection opened");
    };


    es.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("[AGENT TO CLIENT]", msg);

        if (msg.mime_type === "text/plain") {
          setIsLoading(true);

          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            const shouldAppend =
              lastMsg &&
              lastMsg.role === "assistant" &&
              lastAssistantMsgId.current &&   
              lastMsg.id === lastAssistantMsgId.current;

            if (shouldAppend) {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMsg,
                  content: lastMsg.content + msg.data,
                },
              ];
            } else {
              const newId = Date.now().toString();
              lastAssistantMsgId.current = newId;
              return [
                ...prev,
                {
                  id: newId,
                  role: "assistant",
                  content: msg.data,
                  timestamp: new Date(),
                  type: "text",
                },
              ];
            }
          });
        }

        if (msg.turn_complete) {
          // End of assistant’s turn
          lastAssistantMsgId.current = null;
          setIsLoading(false);
        }

      } catch (err) {
        console.error("Error parsing SSE message:", err);
        console.warn("Invalid SSE message:", event.data);
      }
    };



    es.onerror = () => {
      console.log("error : Connection closed");
      es.close();
      setTimeout(connectSSE, 1000);
    };

    setEventSource(es);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

    // Add user's message to UI immediately
    addMessage("user", userMessage);

    setInput(""); // clear input
    setIsLoading(true);

    try {
      const res = await fetch(send_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mime_type: "text/plain", data: userMessage }),
      });
      console.log("res", res);
      if (!res.ok) {
        console.error("Failed to send message:", res.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };


  // sse connection end


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        addMessage("user", imageUrl, "image")
        addMessage("user", "I've uploaded an image. Can you help me find similar products?")

        setTimeout(() => {
          addMessage(
            "assistant",
            "I've analyzed your image! Based on the style and colors I can see, I can help you find similar products. Let me know what specific items you're interested in, and I'll guide you to the right products!",
          )
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        addMessage("user", "I'm looking for a casual summer outfit")
        setTimeout(() => {
          addMessage(
            "assistant",
            "Great! I'd love to help you find a casual summer outfit. Are you looking for something specific like dresses, shorts and tops, or maybe a complete coordinated set? What's your preferred style - bohemian, minimalist, or trendy?",
          )
        }, 1000)
      }, 3000)
    } else {
      setIsRecording(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-80 bg-white border-l shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-purple-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">AI Fashion Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Hi! I'm your AI fashion assistant.</p>
                <p className="text-sm">Ask me anything about fashion or describe what you're looking for!</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {message.type === "image" ? (
                    <img
                      src={message.content || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full max-w-48 h-32 object-cover rounded"
                    />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about fashion, styles, or products..."
              disabled={isLoading}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 text-gray-500" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 hover:bg-gray-100 ${isRecording ? "text-red-500" : "text-gray-500"}`}
                onClick={handleVoiceInput}
              >
                <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading || (!input.trim() && !isRecording)} size="sm">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {isRecording && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-2 text-red-500 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording... Tap mic to stop
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
