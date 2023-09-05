'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from "openai";

type Message = {
  text: string;
  sender: 'user' | 'AI';
};

export default function Home() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState('');

  const fetchMockAPI = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) reject("API Error");
        else resolve("Hello, this is a mock response!");
      }, 1000);
    });
  };

  const makeAPICall = async (prompt: string, userMessage: string) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, userMessage }),
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error("Error calling the internal API:", error);
        throw error;
    }
  }

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message to chat
    const updatedMessages: Message[] = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(updatedMessages);

    try {
        const apiResponse = await makeAPICall('Personality: Paul.', inputValue);
        const newMessages: Message[] = [...updatedMessages, { text: apiResponse, sender: 'AI' }];
        setMessages(newMessages);
    } catch (error) {
        const newMessages: Message[] = [...updatedMessages, { text: 'Error: Unable to fetch response.', sender: 'AI' }];
        setMessages(newMessages);
    }

    setInputValue('');
};

  return (
    <div className="font-sans bg-white p-8">
      <header className="text-center text-2xl mb-6">Minimalist Chat</header>
      <div className="border p-4 h-96 overflow-y-scroll mb-6">
        {messages.map((message, index) => (
          <div key={index} className={`p-4 rounded-lg mb-4 ${message.sender === 'user' ? 'bg-gray-300' : 'bg-gray-200'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-4 border rounded-l-lg mr-1"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-4 rounded-r-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}
