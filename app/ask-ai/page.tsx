"use client";

import { useState } from "react";

export default function AskQuestionPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); // Toggle to show/hide full answer
  const [filterEmail, setFilterEmail] = useState(""); // New state for filter email


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!filterEmail) {
    setErrorMessage("Please enter a sender or recipient email.");
    return;
  }

  if (!emailRegex.test(filterEmail)) {
    setErrorMessage("Please enter a valid email address.");
    return;
  }

    setIsLoading(true);
    setErrorMessage(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, filterEmail }), // Added filterEmail here
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setErrorMessage(data.error || "Failed to get a response.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      console.error("Error submitting question:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600 px-20 rounded-2xl">
      <div className="max-w-lg w-full p-20 bg-white rounded-2xl transition-transform transform hover:scale-105 shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Ask MailBrain
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Sender/Recipient Email:
            </label>
            <input
              type="email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email address..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question:
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full h-28 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Type your question here..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              "Ask Now"
            )}
          </button>
        </form>

        {answer && (
          <div className="mt-8 p-6 bg-green-50 border border-green-300 text-green-900 rounded-lg shadow-md max-h-48 overflow-hidden">
            <h2 className="text-lg font-semibold mb-2">Answer:</h2>
            <p className={`${!isExpanded && "line-clamp-3"} text-sm`}>
              {answer}
            </p>
            {/* Show "Read More" only if answer is long */}
            {answer.length > 200 && (
              <button
                onClick={toggleExpand}
                className="mt-2 text-indigo-600 hover:underline text-sm font-semibold"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        )}

        {errorMessage && (
          <p className="mt-8 text-center text-red-600 font-medium">
            {errorMessage}
          </p>
        )}
      </div>
    </main>
  );
}