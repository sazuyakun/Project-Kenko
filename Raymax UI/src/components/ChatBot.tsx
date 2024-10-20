import React, { useState } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';
import VoiceRecorder from './VoiceRecorder';

const API_URL = 'http://127.0.0.1:8080/llm';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (message: string) => {
    if (message.trim()) {
      setIsLoading(true);
      const userMessage = message;
      setMessages(prevMessages => [...prevMessages, { role: 'bot', content: userMessage }]);
      setInput('');

      try {
        const response = await axios.post(API_URL, { user: userMessage }, {
          headers: {
            'Content-Type': 'application/json',
            // 'Origin': window.location.origin,
          },
          // withCredentials: true,
        });

        const botMessage = { role: 'human', content: response.data.agent };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Sorry, I encountered an error. Please try again.';
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            errorMessage = 'Sorry, there was a CORS error. Please check the server configuration.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        }
        setMessages(prevMessages => [...prevMessages, { role: 'human', content: errorMessage }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'bot' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'bot'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            <span className="inline-block animate-pulse">Thinking...</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center">
        <VoiceRecorder onSendMessage={handleSend} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          className="flex-1 bg-gray-700 text-white p-2 rounded-l-lg ml-2"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-purple-600 text-white p-2 rounded-r-lg disabled:opacity-50"
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;