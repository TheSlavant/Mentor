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
  const [visibleResponse, setVisibleResponse] = useState<number | null>(null);

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
      const apiResponse = await makeAPICall('Personality: insigthful, witty, direct.', updatedMessages);
      console.log("API Response:", apiResponse);
      const newMessages: Message[] = [...updatedMessages, { text: apiResponse.content, sender: 'assistant' }];
      setMessages(newMessages);
    } catch (error) {
      const newMessages: Message[] = [...updatedMessages, { text: 'Error: Unable to fetch response.', sender: 'assistant' }];
      setMessages(newMessages);
    }

    scrollToBottom();
};

const handleToggle = (index: number) => {
  if (visibleResponse === index) {
    setVisibleResponse(null);
  } else {
    setVisibleResponse(index);
  }
};

  return (
    <div style={{ fontFamily: 'Menlo, monospace' }} className="bg-stone-100 p-8 min-h-screen md:h-screen flex flex-col justify-between text-sm text-left">
      <div className="fadeIn-animation">
        <header className="text-center text-black text-3xl mb-2">
          <div className="flex items-center justify-center">
              Mentor
              <Image 
                src="/macintosh-icon.svg" 
                alt="Macintosh Icon" 
                width={30}  // Approximate size for 3xl text. Adjust as needed.
                height={38.46} 
                className="ml-4" // Adds a small margin to the right
              />
          </div>
        </header>

        {viewMode === 'intro' && (
          <>
            <div className="text-black mx-auto w-full lg:w-1/2 my-8">
              <p className="text-right mb-1">
                <b>&quot;To be honest, we didn&apos;t know what it meant for<br />
                a computer to be &apos;friendly&apos; until Steve told us.&quot;</b>
              </p>
              <p className="text-right mt-1">
                &mdash; Terry Oyama on building Macintosh, 1984
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center mt-8 mx-auto w-full lg:w-1/2">
              <p className="mb-4 md:mb-0 md:mr-4">
                LLMs today:
              </p>
              <Image src="/thinkpad.jpg" alt="Impersonal Computer" width={150} height={104} className="max-w-full"/>
              <p className="mt-4 mb-4 md:mt-0 md:mb-0 md:ml-12 md:mr-4">
                Mentor:
              </p>
              <Image src="/macintosh.jpg" alt="Friendly Macintosh" width={150} height={104} className="max-w-full" />
            </div>
            <div className="mt-8 md:mt-0 mx-auto w-full lg:w-1/2">
              <p className="mt-8">
                In 1984, Macintosh was the first personal computer with a personality. It was friendly, approachable, and easy to use. It was a computer users wanted to talk to.
              </p>
              <blockquote className="pl-4 ml-4 mt-8 italic border-l-4 border-black">
                Jobs kept insisting that the machine should look friendly. As a result, it evolved to resemble a human face. With the disk drive below the screen, the unit was taller and narrower than most computers, suggesting a head. The recess near the base evoked a gentle chin, and Jobs narrowed the strip of plastic at the top so that it avoided looking like a Cro-Magnon forehead. (<a href="https://www.smithsonianmag.com/arts-culture/how-steve-jobs-love-of-simplicity-fueled-a-design-revolution-23868877/." className="underline">Source</a>)
              </blockquote>
              <p className="mt-8">
                <b>Mentor</b> is a prototype for the first language model with a personality. To start, we fine-tuned GPT-3.5 to be insightful, witty, and direct.
              </p>
              <p className="mt-8">
                Imagine the <b>products</b> we can build when we have LLMs with actual personalities. Digital tutors, copilots for thought, lawyers, coaches, personal assistants.
              </p>
              <p className="mt-8">
                Imagine the <b>research</b> we can do. How does training data affect personality? Are some LLM personalities safer than others?
              </p>
            </div>
            <div className="mt-8 md:mt-0 mx-auto w-full lg:w-1/2">
              <p className="mt-8">
                <a href="#" onClick={startChat} className="underline">Talk to Mentor. —&gt;</a>
              </p>
            </div>
          </>
        )}
      </div>

      {viewMode === 'chat' && (
        <>
          <p className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2">For the best results, ask Mentor for advice. For example: &quot;I&apos;m a startup founder. How can I keep my team motivated?&quot; You may have to try 2-3 times for a gem.</p>

          <div onClick={() => handleToggle(1)} className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2 cursor-pointer">
            <b>How is this different from prompting? ▶</b>
          </div>
          {visibleResponse === 1 && (
            <p className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2">Pretty different. We taught GPT-3.5 to extract knowledge from its weights differently, whereas prompting simply sets the context for the existing model. The result is a real personality, not roleplaying.</p>
          )}

          <div onClick={() => handleToggle(2)} className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2 cursor-pointer">
            <b>Can we get a deep personality via fine-tuning? ▶</b>
          </div>
          {visibleResponse === 2 && (
            <p className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2">We think yes. We built this v0.1 with a tiny handcrafted dataset. With more data, we believe we can make it much better.</p>
          )}

          <div onClick={() => handleToggle(3)} className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2 cursor-pointer">
            <b>This looks great. Can I contribute? ▶</b>
          </div>
          {visibleResponse === 3 && (
            <>
              <p className="fadeIn-animation text-black mt-4 mx-auto w-full lg:w-1/2">Yes!</p>
              <p className="fadeIn-animation text-black pl-4 mt-0 mx-auto w-full lg:w-1/2">
                1. Screenshot & DM your chat @<a href="https://twitter.com/TheSlavant" className="font-semibold underline">TheSlavant</a>. Tell us how you like the personality.
              </p>
              <p className="fadeIn-animation text-black pl-4 mt-0 mx-auto w-full lg:w-1/2">
                2. Join us to help build a larger dataset, automate evals, and keep fine-tuning.
              </p>
            </>
          )}

          <div 
            ref={chatRef}
            className="fadeIn-animation bg-stone-100 rounded-sm p-4 flex-grow overflow-y-auto mt-4 mb-6 mx-auto w-full lg:w-1/2">
            {messages.map((message, index) => (
              <div key={index} className={`p-3 mb-3 ${message.sender === 'user' ? 'bg-white rounded-tl-sm rounded-br-sm' : 'bg-gray-300 rounded-tr-sm rounded-bl-sm'}`}>
                {message.text}
              </div>
            ))}
          </div>
          
          <div className="fadeIn-animation shadow-sm flex mx-auto mb-4 w-full lg:w-1/2">
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