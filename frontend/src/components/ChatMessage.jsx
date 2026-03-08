import "../styles/ChatMessage.css";

const ChatMessage = ({ message }) => {
  const { role, content, timestamp, isError } = message;

  const formatTime = (date) => {
    if (!date || !(date instanceof Date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`message-wrapper ${role}`}>
      {role === "ai" && (
        <div className="message-avatar ai-avatar">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
        </div>
      )}
      {role === "user" && (
        <div className="message-avatar user-avatar">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
      <div className={`message-content ${role} ${isError ? "error" : ""}`}>
        <div className="message-text">{content}</div>
        <div className="message-footer">
          <span className="message-time">{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
