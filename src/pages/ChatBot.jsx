import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// --- SVG Icons ---
const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300 mr-3">
        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


// --- Main App Component ---
export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatContainerRef = useRef(null);

    const initialMessage = { text: "Hello! I'm a chat assistant powered by Gemini. Ask me anything!", sender: 'model' };

    // Effect to load marked.js for markdown parsing
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    // Effect to load messages from localStorage
    useEffect(() => {
        try {
            const storedMessages = localStorage.getItem('chatMessages');
            if (storedMessages) {
                setMessages(JSON.parse(storedMessages));
            } else {
                setMessages([initialMessage]);
            }
        } catch (error) {
            console.error("Failed to parse messages from localStorage:", error);
            setMessages([initialMessage]);
        }
    }, []);

    // Effect to save messages to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem('chatMessages', JSON.stringify(messages));
            } catch (error) {
                console.error("Failed to save messages to localStorage:", error);
            }
        }
    }, [messages]);

    // Effect to scroll to the bottom of the chat on new messages
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // --- API Call Logic ---
    const callGeminiAPI = async (prompt, currentMessages) => {
        setIsLoading(true);
        setError('');

        const apiKey = "AIzaSyB-wlZ3hzIfYB_JyqlC53yZtuVCYcbHi9U"; // <-- PASTE YOUR API KEY HERE
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const chatHistory = currentMessages.map(msg => ({
             role: msg.sender === 'user' ? 'user' : 'model',
             parts: [{ text: msg.text }]
        }));

        const payload = {
            contents: chatHistory,
            generationConfig: {
                temperature: 0.7,
                topP: 1,
                topK: 1,
                maxOutputTokens: 2048,
            },
        };
        
        let retries = 3;
        let delay = 1000;

        for (let i = 0; i < retries; i++) {
             try {
                const response = await axios.post(apiUrl, payload, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = response.data;
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const modelResponse = candidate.content.parts[0].text;
                    setMessages(prev => [...prev, { text: modelResponse, sender: 'model' }]);
                    setIsLoading(false);
                    return;
                } else {
                    throw new Error("Invalid response structure from API.");
                }

            } catch (err) {
                console.error('API Call Error:', err.response ? err.response.data : err.message);
                 if (i === retries - 1) {
                    const userFriendlyError = "Sorry, I'm having trouble connecting. Please try again later.";
                    setError(userFriendlyError);
                    setMessages(prev => [...prev, { text: userFriendlyError, sender: 'model' }]);
                    setIsLoading(false);
                 } else {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                 }
            }
        }
    };

    // --- Event Handlers ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (userMessage) {
            const newMessages = [...messages, { text: userMessage, sender: 'user' }];
            setMessages(newMessages);
            setInputValue('');
            callGeminiAPI(userMessage, newMessages);
        }
    };
    
    const handleClearChat = () => {
        setMessages([initialMessage]);
        localStorage.removeItem('chatMessages');
    }

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen font-sans">
            <div className="flex flex-col w-full max-w-2xl h-full md:h-[90vh] md:max-h-[800px] bg-white rounded-lg shadow-2xl">
                {/* Header */}
                <header className="bg-gradient-to-r from-purple-800 to-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between shadow-md">
                    <div className="flex items-center">
                        <BotIcon />
                        <h1 className="text-xl font-bold">Help Buddy</h1>
                    </div>
                    <button 
                        onClick={handleClearChat}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                        title="Clear Chat"
                    >
                        <ClearIcon />
                    </button>
                </header>

                {/* Chat Container */}
                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a78bfa #f3f4f6' }}>
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg.text} sender={msg.sender} />
                    ))}
                    {isLoading && <TypingIndicator />}
                </div>

                {/* Input Form */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask Help Buddy anything..."
                            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                            autoComplete="off"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-110 disabled:bg-purple-300 disabled:cursor-not-allowed disabled:scale-100"
                            disabled={isLoading || !inputValue.trim()}
                        >
                            <SendIcon />
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}





// --- Child Components ---
const MessageBubble = ({ message, sender }) => {


    const [copied, setCopied] = useState(false);
    const isUser = sender === 'user';
    const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
    const bubbleStyles = isUser 
        ? 'bg-gradient-to-br from-purple-600 to-indigo-500 text-white' 
        : 'bg-gray-200 text-gray-800';

    const handleCopy = () => {
        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const parsedMessage = window.marked ? window.marked.parse(message) : message.replace(/\n/g, '<br>');

    return (
        <div className={`group flex animate-messageFadeIn ${bubbleAlignment} mb-4 relative`}>
             <div
                className={`prose p-3 rounded-xl max-w-[85%] break-words shadow-md ${bubbleStyles}`}
                dangerouslySetInnerHTML={{ __html: parsedMessage }}
            />
            {!isUser && (
                <button
                    onClick={handleCopy}
                    className="absolute -right-2 -top-2 p-1.5 bg-gray-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    title={copied ? "Copied!" : "Copy"}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            )}
        </div>
    );
};






const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
        <div className="bg-gray-200 text-gray-800 p-4 rounded-xl flex items-center space-x-2 shadow-md">
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-dotBounce"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-dotBounce delay-150"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-dotBounce delay-300"></span>
        </div>
    </div>
);


const style = document.createElement('style');
style.innerHTML = `
    .prose ul { list-style-type: disc; margin-left: 1.5rem; }
    .prose ol { list-style-type: decimal; margin-left: 1.5rem; }
    .prose pre { background-color: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;}
    .prose code { font-family: monospace; }
    
    .animate-messageFadeIn {
        animation: messageFadeIn 0.5s ease-in-out;
    }
    @keyframes messageFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-dotBounce { animation: dotBounce 1.4s infinite ease-in-out both; }
    .delay-150 { animation-delay: 0.15s; }
    .delay-300 { animation-delay: 0.3s; }

    @keyframes dotBounce {
        0%, 80%, 100% { transform: scale(0); } 
        40% { transform: scale(1.0); }
    }
`;
document.head.appendChild(style);

