import React, { useState } from 'react';
import api from '../../services/api';
import { Sparkles, BookOpen, FileText, HelpCircle, Lightbulb, Loader2, Send } from 'lucide-react';

export default function AIStudyAssistant({ moduleId, moduleTitle = 'Module' }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  const handleAction = async (actionType, question) => {
    setLoading(true);
    try {
      const res = await api.post('/ai/study-assistant', {
        moduleId,
        action: actionType,
        question: question || customQuestion
      });
      if (res.success && res.data) {
        setResponse(res.data);
      }
    } catch (err) {
      setResponse({
        title: 'Error',
        response: 'Unable to generate response at this time. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const actionButtons = [
    { label: 'Explain Simply', action: 'explain_simply', icon: Lightbulb, color: 'text-amber-400' },
    { label: 'Summarize Lecture', action: 'summarize', icon: FileText, color: 'text-cyan-400' },
    { label: 'Generate 10 MCQs', action: 'mcq', icon: HelpCircle, color: 'text-purple-400' },
    { label: 'Revision Cheatsheet', action: 'revision_notes', icon: BookOpen, color: 'text-emerald-400' }
  ];

  return (
    <div className="glass-panel p-6 space-y-5 border-indigo-500/20">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm font-display">KaushIQ AI Study Assistant</h4>
            <span className="text-[11px] text-slate-400">RAG Semantic Learning Engine</span>
          </div>
        </div>
        <span className="badge-assessed text-[10px]">Module Grounded</span>
      </div>

      {/* Quick Action Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actionButtons.map((btn, idx) => {
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              onClick={() => handleAction(btn.action)}
              disabled={loading}
              className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all text-left group"
            >
              <Icon className={`w-4 h-4 ${btn.color} mb-1.5 group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-semibold text-slate-200 block">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Question Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (customQuestion.trim()) handleAction('custom', customQuestion);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder={`Ask anything about ${moduleTitle} (e.g. Give me real world use cases)...`}
          className="glass-input text-xs w-full py-2.5"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !customQuestion.trim()}
          className="glass-button-primary text-xs px-4 py-2.5 shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {/* AI Output Display */}
      {loading && (
        <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
          <span>Generating context-grounded explanation from lecture materials...</span>
        </div>
      )}

      {response && !loading && (
        <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h5 className="font-bold text-white text-sm text-brand-300">{response.title}</h5>
            <span className="text-[10px] text-emerald-400 font-semibold">✓ Verified Output</span>
          </div>
          <div className="text-slate-300 leading-relaxed whitespace-pre-line space-y-2 pt-1">
            {response.response}
          </div>
        </div>
      )}
    </div>
  );
}
