import React, { useState } from "react";

const SentimentAnalyzer = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSentiment = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Error connecting to the server. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      case "neutral":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sentiment Analyzer
          </h1>
          <p className="text-gray-600">
            Enter text to get a random sentiment analysis
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="textInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your text:
            </label>
            <textarea
              id="textInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type something here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          <button
            onClick={analyzeSentiment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              "Analyze Sentiment"
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-gray-50 rounded-md border">
              <h3 className="font-semibold text-gray-800 mb-2">Result:</h3>
              <p className="text-gray-700 mb-3">
                <span className="font-medium">Text:</span> "{result.text}"
              </p>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 mr-2">
                  Sentiment:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(
                    result.sentiment
                  )}`}
                >
                  {result.sentiment.charAt(0).toUpperCase() +
                    result.sentiment.slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by FastAPI & React</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
