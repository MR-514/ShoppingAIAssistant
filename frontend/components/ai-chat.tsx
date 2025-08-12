"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Loader2, MessageCircle, X, Send, Camera, Mic } from "lucide-react"
import { startAudioPlayerWorklet } from "@/utils/audio/audio-player"
import { startAudioRecorderWorklet } from "@/utils/audio/audio-recorder"

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
  const [isAudio, setIsAudio] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const audioPlayerNode = useRef<any>(null)
  const audioRecorderNode = useRef<any>(null)
  const micStream = useRef<MediaStream | null>(null)
  const bufferTimer = useRef<NodeJS.Timeout | null>(null)
  const audioBuffer = useRef<Uint8Array[]>([])

  const lastAssistantMsgId = useRef<string | null>(null)

  // SSE state
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("chat_session_id")
    if (saved) return saved
    const newId = Math.random().toString().substring(10)
    localStorage.setItem("chat_session_id", newId)
    return newId
  })

  // Backend URLs
  // const backendUrl = `http://127.0.0.1:8000`
  const backendUrl = `https://backend-service1-68708940504.us-central1.run.app`
  const sse_url = `${backendUrl}/events/${sessionId}`
  const send_url = `${backendUrl}/send/${sessionId}`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    connectSSE()
    return () => {
      if (eventSource) eventSource.close()
    }
  }, [isAudio]) // reconnect when mode changes

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
    setMessages(prev => [...prev, newMessage])
  }

  // SSE Connection
  const connectSSE = () => {
    if (eventSource) eventSource.close()
    const es = new EventSource(`${sse_url}?is_audio=${isAudio}`)
    es.onopen = () => console.log("SSE connection opened (audio mode:", isAudio, ")")

    es.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        console.log("[AGENT TO CLIENT]", msg)

        // Text messages
        if (msg.mime_type === "text/plain") {
          setIsLoading(true)
          setMessages(prev => {
            if (
              prev.length > 0 &&
              prev[prev.length - 1].role === (msg.role || "assistant") &&
              prev[prev.length - 1].id === lastAssistantMsgId.current
            ) {
              return [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], content: (prev[prev.length - 1].content || "") + msg.data, timestamp: new Date() }
              ]
            } else {
              const newId = Date.now().toString()
              lastAssistantMsgId.current = newId
              return [...prev, { id: newId, role: msg.role || "assistant", content: msg.data, timestamp: new Date() }]
            }
          })
        }

        // Audio messages
        if (msg.mime_type === "audio/pcm" && audioPlayerNode.current) {
          const audioData = base64ToArrayBuffer(msg.data)
          audioPlayerNode.current.port.postMessage(audioData)
        }

        if (msg.turn_complete) {
          lastAssistantMsgId.current = null
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err)
      }
    }

    es.onerror = () => {
      console.log("SSE error — reconnecting...")
      es.close()
      setTimeout(connectSSE, 1000)
    }

    setEventSource(es)
  }

  const sendMessage = async (mime_type: string, data: string) => {
    try {
      const res = await fetch(send_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mime_type, data }),
      })
      if (!res.ok) {
        console.error("Failed to send message:", res.statusText)
        return false
      }
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    addMessage("user", userMessage)
    setInput("")
    setIsLoading(true)
    await sendMessage("text/plain", userMessage)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const base64Image = reader.result as string
      const base64Data = base64Image.split(",")[1]
      addMessage("user", base64Image, "image")
      await sendMessage(file.type, base64Data)
    }
    reader.readAsDataURL(file)
  }

  // Audio handling
  const startAudio = async () => {
    const [playerNode] = await startAudioPlayerWorklet()
    const [recorderNode, , stream] = await startAudioRecorderWorklet(handlePCM)
    audioPlayerNode.current = playerNode
    audioRecorderNode.current = recorderNode
    if (stream instanceof MediaStream) {
      micStream.current = stream
    }
  }

  const stopAudio = () => {
    if (micStream.current) {
      micStream.current.getTracks().forEach(track => track.stop())
      micStream.current = null
    }
    if (bufferTimer.current) {
      clearInterval(bufferTimer.current)
      bufferTimer.current = null
    }
    setIsRecording(false)
  }

  const handleVoiceInput = async () => {
    if (!isRecording) {
      setIsAudio(true)
      if (eventSource) eventSource.close()
      await startAudio()
      connectSSE()
      setIsRecording(true)
    } else {
      stopAudio()
      setIsAudio(false)
      connectSSE()
    }
  }

  const handlePCM = (pcmData: ArrayBuffer) => {
    audioBuffer.current.push(new Uint8Array(pcmData))
    if (!bufferTimer.current) {
      bufferTimer.current = setInterval(sendBufferedAudio, 200)
    }
  }

  const sendBufferedAudio = () => {
    if (audioBuffer.current.length === 0) return
    const totalLength = audioBuffer.current.reduce((sum, chunk) => sum + chunk.length, 0)
    const combinedBuffer = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of audioBuffer.current) {
      combinedBuffer.set(chunk, offset)
      offset += chunk.length
    }
    sendMessage("audio/pcm", arrayBufferToBase64(combinedBuffer.buffer))
    audioBuffer.current = []
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const base64ToArrayBuffer = (base64: string) => {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  if (!isOpen) return null

  return (
    <div className="w-[400px] bg-white border-l shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-purple-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Monica</h3>
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
                <p className="text-sm">Hey👋 I'm Monica, your fashion assistant.</p>
                <p className="text-sm">Ask me anything about fashion or describe what you're looking for!</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}
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
                <div className="bg-gray-100 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>AI is thinking...</span>
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
              disabled={isLoading || isRecording}
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
              Listening... Tap mic to stop
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
