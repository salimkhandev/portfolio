import { faImage, faPaperPlane, faTimes, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import profilePic from "/image-prof-github.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : 'http://localhost:3000/api';

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi! I'm Salim's Assistant. How can I help you today? Feel free to ask about his skills or upload a screenshot of your problem!" }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const toggleChat = () => setIsOpen(prev => !prev);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    
    if (isOpen && window.innerWidth < 480) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleOpenChatTopic = (e) => {
      setIsOpen(true);
      if (e.detail && e.detail.topic) {
        setInputText(`What is ${e.detail.topic}? Please explain.`);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    };

    window.addEventListener("openChatTopic", handleOpenChatTopic);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("openChatTopic", handleOpenChatTopic);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          file,
          base64: reader.result,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMsg = { 
      role: 'user', 
      text: inputText, 
      imageBase64: selectedImage?.base64,
      mimeType: selectedImage?.mimeType
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Get the last 12 messages (excluding the one just added) for history
      const historyForApi = messages.slice(-12).map(m => ({
        role: m.role,
        text: m.text
      }));

      const payload = {
        message: userMsg.text,
        history: historyForApi,
        imageBase64: userMsg.imageBase64,
        mimeType: userMsg.mimeType
      };

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "some troubile in the connection , pleary retry again now" }]);
        setInputText(userMsg.text);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "some troubile in the connection , pleary retry again now" }]);
      setInputText(userMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = windowSize.width < 480;

  const chatStyle = isMobile ? {
    width: "100%", height: "100%", bottom: 0, right: 0, position: "fixed", borderRadius: 0
  } : {
    width: "700px", maxWidth: "calc(100vw - 40px)", height: "550px", maxHeight: "calc(100vh - 120px)", bottom: "90px", right: "20px", position: "fixed", borderRadius: "12px"
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        style={{
          ...chatStyle,
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          boxShadow: isMobile ? "none" : "0 10px 40px rgba(0,0,0,0.1)",
          zIndex: 9998,
          border: isMobile ? 'none' : '1px solid #e5e7eb',
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black text-white">
          <div className="flex items-center gap-3">
            <img src={profilePic} alt="Salim Khan" className="w-10 h-10 rounded-full border-2 border-gray-600 object-cover" />
            <div>
              <h3 className="font-bold text-sm">Salim&apos;s Assistant</h3>
            </div>
          </div>
          <button onClick={toggleChat} className="text-gray-300 hover:text-white p-2">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-blue-600' : 'bg-black'}`}>
                  {msg.role === 'user' ? (
                    <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                  ) : (
                    <img src={profilePic} alt="Salim" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-black border border-gray-200 rounded-tl-none shadow-sm'}`}>
                  {msg.imageBase64 && (
                    <img src={msg.imageBase64} alt="Upload" className="max-w-full rounded-lg mb-2 border border-gray-200" />
                  )}
                  <div className="text-sm">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({node, ...props}) => <code className="bg-black/10 px-1 py-0.5 rounded font-mono text-xs" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 max-w-[85%] items-start">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src={profilePic} alt="Salim" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-gray-200 rounded-tl-none shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="p-2 border-t border-gray-200 bg-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedImage.base64} alt="Preview" className="w-10 h-10 object-cover rounded border" />
              <span className="text-xs text-gray-600 truncate max-w-[150px]">{selectedImage.file.name}</span>
            </div>
            <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-red-500 p-1">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-gray-200 bg-white flex items-end gap-2">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100"
            title="Upload Screenshot"
          >
            <FontAwesomeIcon icon={faImage} />
          </button>
          
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 max-h-32 min-h-[40px] p-2 bg-gray-100 border-transparent rounded-xl focus:ring-0 focus:border-transparent text-sm resize-none"
            rows={1}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: isMobile ? "10px" : "20px",
          width: isMobile ? "56px" : "64px",
          height: isMobile ? "56px" : "64px",
          backgroundColor: "#000000",
          color: "white",
          zIndex: isOpen && isMobile ? "0" : "9999",
          opacity: isOpen && isMobile ? "0" : "1",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        className="hover:scale-105"
      >
        <FontAwesomeIcon icon={faRobot} className="text-2xl" />
      </div>
    </>
  );
}

export default FloatingChat;
