import { useState } from "react";
import ChatBot from "./ChatBot";
import "../styles/ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const closeChat = () => setIsOpen(false);

  return (
    <>
      {/* ── Side panel ── */}
      <div className={`chat-panel ${isOpen ? "open" : ""}`}>
        <ChatBot onClose={closeChat} />
      </div>

      {/* ── Backdrop (mobile) ── */}
      {isOpen && <div className="chat-backdrop" onClick={closeChat} />}

      {/* ── Floating action button ── */}
      <button
        className={`chat-fab ${isOpen ? "fab-open" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        title={isOpen ? "Close chat" : "Chat with ConverseBOT"}
      >
        {/* Open state → X icon */}
        <span className={`fab-icon fab-close ${isOpen ? "visible" : ""}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* Closed state → robot icon */}
        <span className={`fab-icon fab-bot ${!isOpen ? "visible" : ""}`}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="7"
              width="14"
              height="10"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <line
              x1="12"
              y1="4"
              x2="12"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="3.5" r="1.5" fill="currentColor" />
            <circle cx="9.5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="14.5" cy="12" r="1.5" fill="currentColor" />
            <path
              d="M9.5 15.5 Q12 17 14.5 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <line
              x1="2"
              y1="11"
              x2="5"
              y2="11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="11"
              x2="22"
              y2="11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* Pulse ring when closed */}
        {!isOpen && <span className="fab-pulse" />}
      </button>
    </>
  );
};

export default ChatWidget;
