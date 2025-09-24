/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, MessageCircle } from "lucide-react";


import { askQuestion } from "./api";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: "user", text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askQuestion(input.trim());
      const botMessage = { role: "bot", text: response.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        role: "bot", 
        text: "Sorry, I encountered an error while processing your question. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container-wrapper">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-icon">
          <MessageCircle className="chat-header-icon-svg" />
        </div>
        <div className="chat-header-content">
          <h3 className="chat-header-title">Policy Assistant</h3>
          <p className="chat-header-subtitle">Ask questions about your uploaded document</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <Bot className="chat-empty-icon" />
            <h4 className="chat-empty-title">Ready to help!</h4>
            <p className="chat-empty-description">
              Ask me anything about your policy document. I can help you understand specific clauses, 
              find information, or clarify complex terms.
            </p>
            <div className="chat-suggestions">
              <button 
                className="chat-suggestion-button"
                onClick={() => setInput("What are the key points of this policy?")}
              >
                What are the key points?
              </button>
              <button 
                className="chat-suggestion-button"
                onClick={() => setInput("Can you summarize the main requirements?")}
              >
                Summarize requirements
              </button>
              <button 
                className="chat-suggestion-button"
                onClick={() => setInput("What are the compliance guidelines?")}
              >
                Compliance guidelines
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className={`chat-message chat-message-${message.role}`}>
                <div className="chat-message-avatar">
                  {message.role === "user" ? (
                    <User className="chat-avatar-icon" />
                  ) : (
                    <Bot className="chat-avatar-icon" />
                  )}
                </div>
                <div className="chat-message-content">
                  <div className="chat-message-bubble">
                    <p className="chat-message-text">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="chat-message chat-message-bot">
                <div className="chat-message-avatar">
                  <Bot className="chat-avatar-icon" />
                </div>
                <div className="chat-message-content">
                  <div className="chat-message-bubble">
                    <div className="chat-typing-indicator">
                      <div className="chat-typing-dot"></div>
                      <div className="chat-typing-dot"></div>
                      <div className="chat-typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your policy document..."
            rows="1"
            disabled={isLoading}
          />
          <button 
            className={`chat-send-button ${!input.trim() || isLoading ? 'chat-send-button-disabled' : ''}`}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <Send className="chat-send-icon" />
          </button>
        </div>
        <p className="chat-input-hint">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

export default Chat;