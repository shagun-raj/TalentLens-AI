import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  Briefcase,
  Users,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const RecruiterCopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    copilotMessages,
    sendCopilotMessage,
    isCopilotTyping,
    currentJob,
    candidates
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, isCopilotOpen]);

  if (!isCopilotOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isCopilotTyping) {
      sendCopilotMessage(input);
      setInput('');
    }
  };

  const samplePrompts = [
    `Who is the top candidate for ${currentJob?.title || 'this role'} and why?`,
    'Compare top 2 candidates on technical skills & experience',
    'Generate 4 tailored interview questions for this pool',
    'What key skill gaps exist among current applicants?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>TalentLens Copilot</span>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                Gemini 3.7
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Active Context: <strong className="text-slate-300">{currentJob?.title || 'General'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <p>{msg.content}</p>
              <span
                className={`text-[10px] block text-right font-mono ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isCopilotTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing candidate pool...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-3 bg-slate-950/40 border-t border-slate-800/80">
        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-indigo-400" />
          <span>Suggested Inquiries</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendCopilotMessage(prompt)}
              disabled={isCopilotTyping}
              className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-left transition-colors border border-slate-700/50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${currentJob?.title || 'candidate'} qualifications...`}
          disabled={isCopilotTyping}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isCopilotTyping}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
