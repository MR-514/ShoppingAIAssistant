/* eslint-disable all */
// @ts-nocheck

"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useRef,
} from "react";

type ChatMessage = {
    id: string;
    role: string;
    message?: string;
    link?: {
        href: string;
        label?: string;
    };
    audioUrl?: string;
    image?: string;
};

type ProductData = {
    name: string;
    url: string;
    brand?: string;
    price?: string;
    dimensions?: string;
    code?: string;
    description?: string;
}

type ChatContextType = {
    isChatOpen: boolean;
    messages: ChatMessage[];
    openChat: () => void;
    closeChat: () => void;
    addMessage: (msg: ChatMessage) => void;
    setSelectedProduct: (name: string | null) => void;
    selectedProduct?: string | null;
    productData: ProductData[];
    setProductData: (data: ProductData[]) => void;
    sessionId?: string;
    isAudio?: boolean;
    setIsAudio?: (value: boolean) => void;
    eventSource?: EventSource | null;
    audioPlayerNode?: React.MutableRefObject<any>;
    audioRecorderNode?: React.MutableRefObject<any>;
    micStream?: React.MutableRefObject<any>;
    bufferTimer?: React.MutableRefObject<any>;
    audioBuffer?: React.MutableRefObject<any[]>;
    sendMessage?: (message: { mime_type: string; data: string }) => Promise<void>;
    chatHeightInPx?: number;
    setChatHeightInPx?: (height: number) => void;
    isGenerating?: boolean;
    setIsGenerating?: (value: boolean) => void;
    isColapsed?: boolean;
    setIsCollapsed?: (value: boolean) => void;
    chatHeight?: number; // Percentage of screen height
    setChatHeight?: (height: number) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Initial welcome message
const initialMessages: ChatMessage[] = [
    {
        id: "init-1",
        role: "system",
        message: "Welcome to Louis Vuitton’s Concierge",
    },
];

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(
        null
    );
    const [productData, setProductData] = useState<ProductData[]>([]);
    const [isColapsed, setIsCollapsed] = useState(false);
    const openChat = () => setIsChatOpen(true);
    const closeChat = () => setIsChatOpen(false);

    const addMessage = (msg: ChatMessage) => {
        setMessages((prev) => [...prev, msg]);
    };

    const [chatHeight, setChatHeight] = useState(60) // Percentage of screen height
    const [chatHeightInPx, setChatHeightInPx] = useState(0)

    const [sessionId] = useState(Math.random().toString().substring(10));
    const [userId] = useState(Math.random().toString().substring(10));
    const [isAudio, setIsAudio] = useState(false);
    const [connected, setConnected] = useState(false);
    const [sendEnabled, setSendEnabled] = useState(false);
    const [eventSource, setEventSource] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);


    const audioPlayerNode = useRef(null);
    const audioRecorderNode = useRef(null);
    const micStream = useRef(null);
    const bufferTimer = useRef(null);
    const audioBuffer = useRef([]);

    // const backendUrl = `https://lv-backend-service5-667682658488.us-central1.run.app/`;
    const backendUrl = `http://127.0.0.1:8000`;
    const sseUrl = `${backendUrl}/events/${userId}/${sessionId}`;
    const sendUrl = `${backendUrl}/send/${userId}/${sessionId}`;

    const lastAssistantMsgId = useRef(null);

    useEffect(() => {
        connectSSE();
        // Cleanup on unmount
        return () => {
            if (eventSource) eventSource.close();
        };
    }, [isAudio]);

    const connectSSE = () => {
        if (eventSource) eventSource.close();
        const es = new EventSource(`${sseUrl}?is_audio=${isAudio}`);
        if (process.env.NODE_ENV === "development") {
            console.log("url ", `${sseUrl}?is_audio=${isAudio}`)
        }
        es.onopen = () => {
            setConnected(true);
            setSendEnabled(true);
            console.log("Connection opened");
        };

        let messageBuffer = "";
        let extractedJson: ProductData[] | null = null;

        es.onmessage = (event) => {
            try {
                // console.log("event data", event.data)
                const msg = JSON.parse(event.data);
                if (process.env.NODE_ENV === "development") {
                    console.log("[AGENT TO CLIENT]", msg);
                }

                if (msg.mime_type === "text/plain") {
                    setIsGenerating(true);

                    setMessages((prev) => {
                        // checking if last message was completed, if not then append to same
                        if (
                            prev.length > 0 &&
                            prev[prev.length - 1].role === (msg.role || "system") &&
                            prev[prev.length - 1].id === lastAssistantMsgId.current
                        ) {
                            return [
                                ...prev.slice(0, -1),
                                {
                                    ...prev[prev.length - 1],
                                    message:
                                        (prev[prev.length - 1].message || "") + msg.data,
                                },
                            ];
                        } else {
                            const newId = Date.now().toString();
                            lastAssistantMsgId.current = newId;
                            return [
                                ...prev,
                                {
                                    id: newId,
                                    role: msg.role || "system",
                                    message: msg.data,
                                },
                            ];
                        }
                    });
                }

                if (msg.turn_complete) {
                    lastAssistantMsgId.current = null;
                    setIsGenerating(false);
                }
                if (msg.interrupted && audioPlayerNode.current) {
                    audioPlayerNode.current.port.postMessage({
                        command: "endOfAudio",
                    });
                    return;
                }

                // ----- Audio messages
                if (msg.mime_type === "audio/pcm" && audioPlayerNode.current) {
                    audioPlayerNode.current.port.postMessage(base64ToArray(msg.data));
                }

                // ----- Product data (JSON)
                if (msg.mime_type === "application/json") {
                    setProductData(msg.data);
                    setChatHeight(35);
                    setChatHeightInPx(20);
                }
            } catch (err) {
                console.error("Error parsing SSE message:", err);
                console.warn("Invalid SSE message:", event.data);
            }
        };

        es.onerror = () => {
            setSendEnabled(false);
            setConnected(false);
            console.log("error : Connection closed");
            es.close();
            setTimeout(connectSSE, 1000);
        };

        setEventSource(es);
    };

    const sendMessage = async (message) => {
        try {
            const res = await fetch(sendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message),
            });
            if (!res.ok) {
                console.error("Failed to send message:", res.statusText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const base64ToArray = (base64) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes.buffer;
    };



    return (
        <ChatContext.Provider
            value={{
                isChatOpen,
                messages,
                openChat,
                closeChat,
                addMessage,
                setSelectedProduct,
                selectedProduct,
                productData,
                setProductData,
                sessionId,
                isAudio,
                setIsAudio,
                eventSource,
                audioPlayerNode,
                audioRecorderNode,
                micStream,
                bufferTimer,
                audioBuffer,
                sendMessage,
                chatHeightInPx,
                setChatHeightInPx,
                isGenerating,
                setIsGenerating,
                isColapsed,
                setIsCollapsed,
                chatHeight,
                setChatHeight,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
