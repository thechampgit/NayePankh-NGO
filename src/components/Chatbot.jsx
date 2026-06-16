import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Trash2, Download, Sun, Moon, AlertCircle } from 'lucide-react';
import { generateChatResponse } from '../services/gemini';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('npbot_theme') === 'dark';
  });
  const [isFirstTime, setIsFirstTime] = useState(() => {
    return localStorage.getItem('npbot_first_time_welcome') !== 'false';
  });
  
  // Rate limiting states
  const [requestTimes, setRequestTimes] = useState([]);
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('npbot_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chat history:", e);
      }
    }
    // Default initial greeting
    return [
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Hello! I am **NPbot**, the virtual assistant for NayePankh Foundation. 😊\n\nHow can I help you today? You can ask me about donating, volunteering, our programs, or how to contact us!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync chat history to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('pankh_ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto scroll to bottom when messages or typing status changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat window opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Front-end Rate Limiting (Max 3 messages in 15 seconds)
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const recentRequests = requestTimes.filter((t) => now - t < 15000);
    
    if (recentRequests.length >= 3) {
      setRateLimitMessage("You are sending messages too quickly. Please wait a moment.");
      setTimeout(() => setRateLimitMessage(''), 4000);
      return;
    }

    setRequestTimes([...recentRequests, now]);

    // Mark welcome banner as dismissed once the user starts interacting
    if (isFirstTime) {
      localStorage.setItem('pankh_ai_first_time_welcome', 'false');
      setIsFirstTime(false);
    }

    const userMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          sender: m.sender,
          text: m.text
        }));

      const botText = await generateChatResponse(textToSend, chatHistory);

      const botMessage = {
        // eslint-disable-next-line react-hooks/purity
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to generate AI response:", error);
      const errorMessage = {
        // eslint-disable-next-line react-hooks/purity
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I apologize, but I am having trouble connecting right now. Please try again or visit our **Contact** page to speak with our team directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const resetMessages = [
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Hello! I am **NPbot**, the virtual assistant for NayePankh Foundation. 😊\n\nHow can I help you today? You can ask me about donating, volunteering, our programs, or how to contact us!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(resetMessages);
      sessionStorage.setItem('npbot_chat_history', JSON.stringify(resetMessages));
      setRequestTimes([]);
    }
  };

  const handleExportChat = () => {
    const exportText = messages.map(msg => {
      const role = msg.sender === 'user' ? 'User' : 'NPbot';
      return `[${msg.timestamp}] ${role}:\n${msg.text}\n`;
    }).join('\n========================\n\n');
    
    const blob = new Blob([`NayePankh Foundation - NPbot Chat Transcript\nExported on: ${new Date().toLocaleString()}\n\n${exportText}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nayepankh_chat_transcript_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('pankh_ai_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const dismissWelcome = () => {
    localStorage.setItem('pankh_ai_first_time_welcome', 'false');
    setIsFirstTime(false);
  };

  const quickPrompts = [
    { label: "💡 How to donate?", query: "How can I donate?" },
    { label: "🤝 Become a volunteer", query: "How can I volunteer?" },
    { label: "📚 Our Programs", query: "What programs does NayePankh run?" },
    { label: "📞 Contact info", query: "What is your contact details and address?" }
  ];

  // Helper to parse simple markdown bold and lists
  const renderMessageText = (text) => {
    const lines = text.split('\n');
    let inList = false;
    const listItems = [];
    const elements = [];

    const parseLine = (line, lineIdx) => {
      let content = line;
      let isListItem = false;

      if (line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
        isListItem = true;
        content = line.trim().substring(2);
      } else if (line.trim().match(/^\d+\.\s/)) {
        isListItem = true;
        content = line.trim().replace(/^\d+\.\s/, '');
      }

      // Format bold text (**bold**)
      const parts = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#132a13]'}`}>
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const parsedText = parts.length > 0 ? parts : content;

      if (isListItem) {
        return <li key={lineIdx} className="my-1.5 leading-relaxed text-sm">{parsedText}</li>;
      }
      return <p key={lineIdx} className="my-1 leading-relaxed text-sm min-h-[1em]">{parsedText}</p>;
    };

    lines.forEach((line, idx) => {
      const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('• ') || line.trim().match(/^\d+\.\s/);
      
      if (isListItem) {
        if (!inList) {
          inList = true;
        }
        listItems.push(parseLine(line, idx));
      } else {
        if (inList) {
          elements.push(
            <ul key={`list-${idx}`} className="list-disc pl-5 my-2 space-y-1">
              {[...listItems]}
            </ul>
          );
          listItems.length = 0;
          inList = false;
        }
        elements.push(parseLine(line, idx));
      }
    });

    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-end`} className="list-disc pl-5 my-2 space-y-1">
          {[...listItems]}
        </ul>
      );
    }

    return elements;
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-2xl ${
          isOpen 
            ? 'p-4 rounded-full bg-[#083344] text-white rotate-90 border border-[#0d9488]/30 h-14 w-14 cursor-pointer' 
            : 'h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 bg-white p-0.5 cursor-pointer animate-pulse'
        }`}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <img src="/chatbot-button.png" className="h-full w-full object-contain rounded-xl" alt="NP Chatbot Logo" />
        )}
      </button>

      {/* Chat Window Container */}
      <div
        className={`fixed bottom-24 right-6 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl shadow-2xl border overflow-hidden flex flex-col z-50 transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        } ${
          isDarkMode 
            ? 'bg-[#13141a] border-[#0d9488]/40 text-slate-100' 
            : 'bg-white border-slate-200/80 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="bg-[#083344] text-white px-4 py-4 flex items-center justify-between border-b border-[#0d9488]/40">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-9 w-9 bg-white p-0.5 rounded-xl border border-primary-450/25 flex items-center justify-center overflow-hidden">
                <img src="/chatbot-logo.png" className="h-full w-full object-contain rounded-lg" alt="NPbot symbol" />
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#083344] animate-ping"></span>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#083344]"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">NPbot</h3>
              <p className="text-[10px] text-primary-200 font-medium">NayePankh Support Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors duration-150"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            {/* Export Transcripts */}
            <button
              onClick={handleExportChat}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors duration-150"
              title="Export Conversation"
            >
              <Download className="h-4 w-4" />
            </button>
            {/* Clear History */}
            {messages.length > 1 && (
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors duration-150"
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors duration-150"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message List Area */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 select-text ${
          isDarkMode ? 'bg-[#0e0f14]' : 'bg-white'
        }`}>
          {/* Welcome Banner Card for First Time Visitor */}
          {isFirstTime && (
            <div className={`p-4 rounded-xl mb-4 border transition-all duration-300 relative ${
              isDarkMode 
                ? 'bg-[#083344]/40 border-[#10b981]/20 text-slate-200' 
                : 'bg-[#ecfdf5] border-[#0d9488]/15 text-[#083344]'
            }`}>
              <button 
                onClick={dismissWelcome}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className={`h-4.5 w-4.5 ${isDarkMode ? 'text-primary-400' : 'text-[#10b981]'}`} />
                <h4 className="font-bold text-[10px] uppercase tracking-wider">Welcome Guest</h4>
              </div>
              <p className="text-xs leading-relaxed">
                Welcome to **NPbot**! I am here to help you get information about 80G tax benefits, volunteer applications, donation drives, and event schedules. Select a suggestion below or type your question to start!
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`px-4 py-2.5 rounded-2xl max-w-[85%] shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-tr-none'
                    : isDarkMode
                      ? 'bg-[#0a232c] text-secondary-100/90 border border-[#0d9488]/20 rounded-tl-none'
                      : 'bg-[#ecfdf5] text-[#083344] rounded-tl-none border border-[#0d9488]/10'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                ) : (
                  renderMessageText(msg.text)
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col items-start">
              <div className={`px-4 py-3 rounded-2xl rounded-tl-none shadow-sm ${
                isDarkMode 
                  ? 'bg-[#0a232c] border border-[#0d9488]/20' 
                  : 'bg-[#ecfdf5] border border-[#0d9488]/10'
              }`}>
                <div className="flex space-x-1.5 items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Rate Limiting Alert */}
        {rateLimitMessage && (
          <div className="mx-4 my-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs animate-bounce">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold">{rateLimitMessage}</span>
          </div>
        )}

        {/* Suggested Quick-Reply Buttons Tray (Show when not typing) */}
        {!isTyping && (
          <div className={`px-3 py-2 border-t flex space-x-2 overflow-x-auto scrollbar-none flex-shrink-0 ${
            isDarkMode ? 'bg-[#13141a] border-[#0d9488]/20' : 'bg-white border-slate-100'
          }`}>
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className={`text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full font-semibold transition-all duration-150 flex-shrink-0 hover:scale-[1.03] active:scale-95 ${
                  isDarkMode
                    ? 'bg-[#0d9488]/30 hover:bg-[#0d9488]/55 text-secondary-200 border border-[#10b981]/20'
                    : 'bg-[#cffafe]/40 hover:bg-[#cffafe]/80 text-secondary-850 border border-[#0d9488]/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className={`p-3 border-t flex items-center space-x-2 flex-shrink-0 ${
            isDarkMode ? 'bg-[#13141a] border-[#0d9488]/20' : 'bg-white border-slate-100'
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask NPbot..."
            className={`flex-1 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-primary-500 transition-colors ${
              isDarkMode
                ? 'bg-[#1a1c24] border border-[#0d9488]/30 text-white placeholder-slate-500 focus:bg-[#13141a]'
                : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white'
            }`}
            maxLength={1000}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-750 disabled:opacity-40 disabled:hover:bg-primary-600 transition-all duration-150 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
