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
    <div style={{ fontFamily: 'Menlo, monospace' }} className="bg-pink-500 p-8 h-screen flex flex-col justify-between text-sm text-justify">
      <div className="mb-6">
        <header className="text-center text-white text-3xl mb-2">SoulweightGPT</header>
        <div className="mx-auto w-3/5 my-8">
            <p className="text-right text-white mb-1">
                “To be honest, we didn't know what it meant for a computer to be 'friendly' until Steve told us."
            </p>
            <p className="text-right text-white mt-1">
                — Terry Oyama on building Macintosh, 1984
            </p>
        </div>
        <div className="flex items-center mt-4 mx-auto w-3/5">
          <p className="text-white mr-4">
            Help us turn LLMs from THIS
          </p>
          <img src="/impesonal_computer.jpg" alt="Impersonal Computer" width={180} height={180}/>
          <p className="text-white ml-4 mr-4">
            into THIS
          </p>
          <img src="/friendly_macintosh.jpg" alt="Friendly Macintosh" width={180} height={180}/>
        </div>
        <p className="text-white mt-4 mx-auto w-3/5">
          Let's fine-tune this GPT to be thoughtful, curious, kind, and direct like a human. <br />
          Friendly Macintosh, not Impersonal PC. Friend, not friendly stranger.
        </p>
        <p className="text-white mt-4 mx-auto w-3/5">
          This v0.1 is trained a tiny handmade dataset. Let's see just how good we can make it. <br />
          We're building a better way to eval. For now, just DM your chat @<a href="https://twitter.com/TheSlavant" className="font-semibold underline">TheSlavant</a> and we'll keep fine-tuning.
        </p>
      </div>
            
      <div className="shadow-lg bg-gray-100 rounded-sm p-4 flex-grow overflow-y-scroll mb-6 mx-auto w-3/5">
        {messages.map((message, index) => (
          <div key={index} className={`p-3 mb-3 ${message.sender === 'user' ? 'bg-white rounded-tl-sm rounded-br-sm' : 'bg-gray-300 rounded-tr-sm rounded-bl-sm'}`}>
            {message.text}
          </div>
        ))}
      </div>
      
      <div className="flex mx-auto w-3/5 mb-4">
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-4 border rounded-l-sm mr-1"
        />
        <button onClick={handleSendMessage} className="bg-gray-950 text-white p-4 rounded-r-sm hover:bg-gray-950">
          Send
        </button>
      </div>
    </div>
  );
}
