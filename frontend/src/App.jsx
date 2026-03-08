import "./App.css";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <div className="App">
      {/* ── Background website ── */}
      <iframe
        src="https://jbrec.edu.in/"
        title="JBREC Website"
        className="background-iframe"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />

      {/* ── Floating chatbot widget ── */}
      <ChatWidget />
    </div>
  );
}

export default App;
