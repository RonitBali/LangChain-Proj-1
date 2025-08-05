import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'


const Chatbot = () => {
 

  const LOCAL_STORAGE_KEY = "ChatHistory";
  const [input, setInput] = useState("")

  const [messages, setMessages] = useState(() => {
    // const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    // return saved ? JSON.parse(saved) : []
    return [{ role: "ai", text: "Greetings, demon slayer! I am here to assist you on your journey. What knowledge do you seek?" }]
  })

  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

 
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages])

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const question = input.trim();
    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        question,
        history: messages
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, 
      });

      const aiMessage = {
        role: "ai",
        text: res.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = "Sorry, something went wrong!";
      
      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = "Unable to connect to the server. Please check if the backend is running.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
    
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/54fc8146e4b02a22841f4df7/1613993182428-R5SIXOIEUZ5FP6XTU9XE/Cover.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-red-900/50 to-black/90"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r  black backdrop-blur-sm border-b-2 border-orange-400/50 p-3">
          <div className="text-center">
            {/* <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-300 mb-2 font-serif tracking-wider">
              鬼滅の刃
            </h1> */}
            <h2 className="text-2xl md:text-3xl font-bold text-orange-200 mb-1 tracking-wide">
              DEMON SLAYER
            </h2>
            <p className="text-orange-300/80 text-lg">
              Chatbot Assistant
            </p>
            <div className="mt-3 w-24 h-1 bg-gradient-to-r from-orange-400 to-red-400 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-6`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-800/90 to-black text-blue-100 backdrop-blur-sm border border-blue-400/30"
                      : "bg-gradient-to-br from-red-800/30 to-black text-orange-100 backdrop-blur-sm border border-orange-400/30"
                  }`}
                >
                  <div className={`flex items-center mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      msg.role === "user" 
                        ? "bg-blue-400/80 text-blue-900" 
                        : "bg-orange-400/80 text-red-900"
                    }`}>
                      {msg.role === "user" ? "斬" : "鬼"}
                    </div>
                    <span className={`ml-2 text-xs font-semibold opacity-80 ${
                      msg.role === "user" ? "text-blue-200" : "text-orange-200"
                    }`}>
                      {msg.role === "user" ? "Demon Slayer" : "Assistant"}
                    </span>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed font-medium">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="bg-gradient-to-br from-red-800/90 to-orange-700/90 text-orange-100 backdrop-blur-sm border border-orange-400/30 p-4 rounded-2xl shadow-2xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-400/80 text-red-900 flex items-center justify-center text-sm font-bold mr-2">
                      鬼
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form */}
        <div className="bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-t-2 border-orange-400/30 p-4 md:p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Ask something..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-orange-400/30 rounded-xl text-orange-100 placeholder-orange-300/60 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 backdrop-blur-sm transition-all duration-300 text-sm md:text-base"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/5 to-red-400/5 pointer-events-none"></div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed border-2 border-orange-400/30 backdrop-blur-sm text-sm md:text-base"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>...</span>
                  </div>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Send</span>
                  
                  </span>
                )}
              </button>
            </form>
            <p className="text-center text-orange-300/60 text-xs mt-3">
              "Total Concentration Breathing" - Stay focused and ask away!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot