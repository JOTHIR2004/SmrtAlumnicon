import { useState } from "react";

export default function DigiAsst() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [company, setCompany] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !company.trim() || !year.trim()) return;

    const userMsg = {
      sender: "user",
      text: `${input}`,
      meta: `Company: ${company} | Year: ${year}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://digiasst.onrender.com/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          year,
          question: input,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col overflow-hidden">


      {/* Header */}
      <div className="w-full h-full p-4 text-center text-white font-semibold border-b border-gray-700">
        DigiAsst – Interview Digital Assistant
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-5 py-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap text-left
                ${msg.sender === "user"
                  ? "bg-green-600 text-white max-w-[90%] md:max-w-[70%]"
                  : "bg-gray-700 text-gray-200 max-w-[90%] md:max-w-[70%]"
                }`}
            >
              <div>{msg.text}</div>
              {msg.meta && (
                <div className="text-xs text-gray-900 opacity-80">
                  {msg.meta}
                </div>
              )}
            </div>

          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">
            DigiAsst is typing...
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="w-full border-t border-gray-700 p-4 space-y-3">

        {/* Company & Year */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company (e.g. Comcast)"
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none placeholder-gray-400"
          />

          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year (e.g. 2025)"
            className="w-full md:w-40 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none placeholder-gray-400"
          />
        </div>

        {/* Question Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about Round 2, coding, HR..."
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg outline-none placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 px-6 rounded-lg text-white font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
