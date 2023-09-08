'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';

type Message = {
  text: string;
  sender: 'user' | 'assistant';
};

export default function Home() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [viewMode, setViewMode] = useState('intro');
  const chatRef = useRef<HTMLDivElement | null>(null);

  const startChat = () => {
    setViewMode('chat');
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const makeAPICall = async (prompt: string, messageHistory: Message[]) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, messageHistory }), // Pass the entire message history
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
    setInputValue('');

    try {
      const apiResponse = await makeAPICall('Personality: Paul.', updatedMessages);
      console.log("API Response:", apiResponse);
      const newMessages: Message[] = [...updatedMessages, { text: apiResponse.content, sender: 'assistant' }];
      setMessages(newMessages);
    } catch (error) {
      const newMessages: Message[] = [...updatedMessages, { text: 'Error: Unable to fetch response.', sender: 'assistant' }];
      setMessages(newMessages);
    }

    scrollToBottom();
};

  return (
    <div style={{ fontFamily: 'Menlo, monospace' }} className="bg-pink-500 p-8 min-h-screen md:h-screen flex flex-col justify-between text-sm text-justify">
      <div className="fadeIn-animation mb-6">
        <header className="text-center text-white text-3xl mb-2">
          <div className="flex items-center justify-center">
              The Macintosh Fine-Tune
              <Image 
                src="/macintosh-icon.svg" 
                alt="Macintosh Icon" 
                width={30}  // Approximate size for 3xl text. Adjust as needed.
                height={38.46} 
                className="ml-4" // Adds a small margin to the right
              />
          </div>
        </header>

        {viewMode === 'intro' ? (
          <>
            <div className="mx-auto w-full lg:w-1/2 my-8">
              <p className="text-right text-white mb-1">
                <b>&quot;To be honest, we didn&apos;t know what it meant for<br />
                a computer to be &apos;friendly&apos; until Steve told us.&quot;</b>
              </p>
              <p className="text-right text-white mt-1">
                &mdash; Terry Oyama on building Macintosh, 1984
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center mt-8 mx-auto w-full lg:w-1/2">
              <p className="text-white mb-4 md:mb-0 md:mr-4">
                LLMs today:
              </p>
              <Image src="/thinkpad.jpg" alt="Impersonal Computer" width={150} height={104} className="max-w-full"/>
              <p className="text-white mt-4 mb-4 md:mt-0 md:mb-0 md:ml-12 md:mr-4">
                The Macintosh Fine-Tune:
              </p>
              <Image src="/macintosh.jpg" alt="Friendly Macintosh" width={150} height={104} className="max-w-full" />
            </div>
            <div className="mt-8 md:mt-0 text-white mx-auto w-full lg:w-1/2">
              <p className="mt-8">
                Macintosh was the first personal computer with a personality. It was friendly, approachable, and easy to use. It was a computer users wanted to talk to.
              </p>
              <blockquote className="pl-4 ml-4 mt-8 italic border-l-4 border-white">
                Jobs kept insisting that the [first Macintosh] should look friendly. As a result, it evolved to resemble a human face. With the disk drive below the screen, the unit was taller and narrower than most computers, suggesting a head. The recess near the base evoked a gentle chin, and Jobs narrowed the strip of plastic at the top so that it avoided looking like a Cro-Magnon forehead. (<a href="https://www.smithsonianmag.com/arts-culture/how-steve-jobs-love-of-simplicity-fueled-a-design-revolution-23868877/." className="underline">Source</a>)
              </blockquote>
              <p className="mt-8">
                <b>The Macintosh Fine-Tune</b> is an effort to build the first language model with a personality. To start, we fine-tuned GPT-3.5 to be insightful, witty, and direct.
              </p>
              <p className="mt-8">
                Imagine the <b>products</b> we can build when we have LLMs with actual personalities. Digital tutors, copilots for thought, lawyers, coaches, personal assistants.
              </p>
              <p className="mt-8">
                Imagine the <b>research</b> we can do. How does training data affect personality? Are some LLM personalities safer than others?
              </p>
            </div>
            <div className="mt-8 md:mt-0 text-white mx-auto w-full lg:w-1/2">
              <p className="mt-8">
                <a href="#" onClick={startChat} className="underline text-white">Imagine just having some fun. —&gt;</a>
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="fadeIn-animation text-white mt-4 mx-auto w-full lg:w-1/2">
                <b>How to use:</b> For the best results, try asking for advice. For example: &quot;I&apos;m a startup founder. What can I do to keep my team motivated?&quot;
            </p>
            <p className="fadeIn-animation text-white mt-4 mx-auto w-full lg:w-1/2">
                <b>Can we get a deep personality via fine-tuning?</b> We think yes. We built this v0.1 with a tiny handcrafted dataset. With more data, we believe we can make it much better.
            </p>
            <p className="fadeIn-animation text-white mt-4 mx-auto w-full lg:w-1/2">
                <b>This looks cool. Can I contribute?</b> Yes!
            </p>
            <p className="fadeIn-animation text-white pl-4 mt-0 mx-auto w-full lg:w-1/2">
                1. Screenshot &amp; DM your chat @<a href="https://twitter.com/TheSlavant" className="font-semibold underline">TheSlavant</a>. Tell us how you like the personality.
            </p>
            <p className="fadeIn-animation text-white pl-4 mt-0 mx-auto w-full lg:w-1/2">
                2. Join us to help build a larger dataset, automate evals, and keep fine-tuning.
            </p>
          </>
        )}
      </div>
      
      {viewMode === 'chat' && (
        <>
          <div 
            ref={chatRef}
            className="fadeIn-animation shadow-lg bg-gray-100 rounded-sm p-4 flex-grow overflow-y-auto mb-6 mx-auto w-full lg:w-1/2">
            {messages.map((message, index) => (
              <div key={index} className={`p-3 mb-3 ${message.sender === 'user' ? 'bg-white rounded-tl-sm rounded-br-sm' : 'bg-gray-300 rounded-tr-sm rounded-bl-sm'}`}>
                {message.text}
              </div>
            ))}
          </div>
          
          <div className="fadeIn-animation flex mx-auto mb-4 w-full lg:w-1/2">
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {if (e.key === 'Enter') handleSendMessage();}}
              placeholder="Type a message..."
              className="flex-1 p-4 border rounded-sm mr-1"
            />
            <button onClick={handleSendMessage} className="fadeIn-animation bg-gray-950 text-white p-4 rounded-r-sm hover:bg-gray-950">
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}