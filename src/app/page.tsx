'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react';
import OpenAI from "openai";

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
        console.log("API Response:", apiResponse);
        const newMessages: Message[] = [...updatedMessages, { text: apiResponse.content, sender: 'AI' }];
        setMessages(newMessages);
    } catch (error) {
        const newMessages: Message[] = [...updatedMessages, { text: 'Error: Unable to fetch response.', sender: 'AI' }];
        setMessages(newMessages);
    }

    setInputValue('');
};

  return (
    <div className="font-sans bg-white p-8 h-screen flex flex-col justify-between">
      <div className="mb-6">
        <header className="text-center text-3xl mb-2">Personality: Paul</header>
        <p className="text-center text-gray-600">
          This model is fine-tuned to be thoughtful, concise, and kind. 
          It offers good insights and selectively uses sense of humor.
        </p>
      </div>
      
      <div className="shadow-lg bg-gray-100 rounded-lg p-4 flex-grow overflow-y-scroll mb-6 mx-auto w-2/3">
        {messages.map((message, index) => (
          <div key={index} className={`p-3 mb-3 ${message.sender === 'user' ? 'bg-white rounded-tl-lg rounded-br-lg' : 'bg-gray-300 rounded-tr-lg rounded-bl-lg'}`}>
            {message.text}
          </div>
        ))}
      </div>
      
      <div className="flex mx-auto w-2/3 mb-4">
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-4 border rounded-l-lg mr-1"
        />
        <button onClick={handleSendMessage} className="bg-gray-950 text-white p-4 rounded-r-lg hover:bg-gray-950">
          Send
        </button>
      </div>
    </div>
  );
}
