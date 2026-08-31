import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';
import AIStudyAssistant from '../components/ai/AIStudyAssistant';
import {
  BookOpen,
  FileText,
  Play,
  HelpCircle,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Send
} from 'lucide-react';

export default function LearningDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [moduleData, setModuleData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, notes, lectures, quiz, ai
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/learning/${slug}`);
        if (res.success) setModuleData(res.data);
      } catch (err) {
        console.error('Failed to load module:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [slug]);

  const handleOptionSelect = (questionId, optionKey) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!moduleData?.quizzes?.[0]) return;

    setSubmittingQuiz(true);
    try {
      const res = await api.post('/learning/quiz/submit', {
        quizId: moduleData.quizzes[0].id,
        answers: selectedAnswers
      });

      if (res.success) {
        setQuizResult(res.data);
        setQuizSubmitted(true);

        if (res.data.isPassed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
          addToast({
            title: `Quiz Passed! Score: ${res.data.score}%`,
            message: `Your skill score has been updated in DB. Readiness recalculated!`,
            type: 'success'
          });
        } else {
          addToast({
            title: `Quiz Score: ${res.data.score}%`,
            message: 'You need 70% to pass and update your verified skill score.',
            type: 'warning'
          });
        }
      }
    } catch (err) {
      addToast({ title: 'Submission Error', message: err.message, type: 'error' });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Loading course modules, lecture notes and interactive assessments...</p>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold">Module Not Found</h3>
        <Link to="/learning" className="glass-button-primary text-xs">Return to Learning Hub</Link>
      </div>
    );
  }

  const quiz = moduleData.quizzes?.[0];
  const notes = moduleData.notes || [];
  const lectures = moduleData.lectures || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link to="/learning" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Learning Hub
        </Link>
      </div>

      {/* Module Header Card */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-brand-500/30 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
            {moduleData.domain?.name}
          </span>
          <span className="badge-assessed text-[10px]">
            {moduleData.level} Level
          </span>
          <span className="badge-verified-project text-[10px]">
            {moduleData.durationHours} Hours Practical
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
          {moduleData.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {moduleData.description}
        </p>

        <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
          <span className="text-slate-300">Instructor: <strong>{moduleData.facultyAuthor?.user?.name || 'Dr. Ananya Sharma'}</strong></span>
          <span>•</span>
          <span>Institution: <strong>{moduleData.facultyAuthor?.institution?.institutionName || 'NIT Karnataka'}</strong></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'notes', label: `Notes (${notes.length})`, icon: FileText },
          { id: 'lectures', label: `Lectures (${lectures.length})`, icon: Play },
          { id: 'quiz', label: 'Interactive Quiz & Skill Boost', icon: HelpCircle, highlight: true },
          { id: 'ai', label: 'AI Study Assistant', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 ${
                isActive
                  ? 'bg-slate-900/80 text-brand-300 border-brand-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
              } ${tab.highlight && !isActive ? 'text-amber-400' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="glass-panel p-6 sm:p-8 space-y-6 text-xs text-slate-300">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Course Outcomes & Industry Relevance</h3>
              <p className="leading-relaxed text-slate-300">
                This comprehensive module is designed in collaboration with TechNova Solutions. By completing the notes, lectures, and interactive assessment, students validate foundational machine learning algorithms, evaluation metrics, and production API containerization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">Key Competencies Targeted:</span>
                <ul className="space-y-1 text-slate-400">
                  <li>• Supervised Learning Loss Formulations</li>
                  <li>• L1 / L2 Regularization & Feature Sparsity</li>
                  <li>• Stratified Cross-Validation for Imbalanced Medical Data</li>
                  <li>• Scikit-Learn Pipelines & FastAPI Deployment</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">Linked Career Pathways:</span>
                <ul className="space-y-1 text-slate-400">
                  <li>• AI / Machine Learning Engineer (₹14-28 LPA)</li>
                  <li>• Biomedical Informatics Specialist (₹10-20 LPA)</li>
                  <li>• Full-Stack Cloud Architect (₹12-24 LPA)</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveTab('quiz')}
                className="glass-button-primary text-xs px-5 py-2.5"
              >
                Take Interactive Quiz <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 2. NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="glass-panel p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white text-base font-display">{note.title}</h3>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    {note.readTimeMinutes} min read
                  </span>
                </div>
                <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans space-y-3">
                  {note.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. LECTURES TAB */}
        {activeTab === 'lectures' && (
          <div className="space-y-6">
            {lectures.map((lec) => (
              <div key={lec.id} className="glass-panel p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-white text-base">{lec.title}</h3>
                  <span className="badge-assessed text-[10px]">{lec.durationMinutes} Minutes</span>
                </div>

                {/* Embedded Video Player */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                  <iframe
                    src={lec.videoUrl}
                    title={lec.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {lec.transcript && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-slate-300 block">Lecture Summary & Notes:</span>
                    <p className="text-slate-400 leading-relaxed">{lec.transcript}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 4. QUIZ TAB (CRITICAL DEMO STEP 4) */}
        {activeTab === 'quiz' && (
          <div className="glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-lg font-display">{quiz?.title || 'Knowledge Assessment'}</h3>
                <p className="text-xs text-slate-400">Passing score ≥ {quiz?.passingScore || 70}% automatically updates your verified skill benchmark in DB!</p>
              </div>
              <span className="badge-verified-industry text-xs">Instant Verification</span>
            </div>

            {/* Quiz Result Banner */}
            {quizSubmitted && quizResult && (
              <div className={`p-4 rounded-xl border ${
                quizResult.isPassed
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-100'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-100'
              } space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    {quizResult.isPassed ? '🎉 Assessment Passed with Distinction!' : '⚠️ Assessment Completed'}
                  </span>
                  <span className="text-xl font-black font-display">{quizResult.score}%</span>
                </div>
                <p className="text-xs opacity-90">
                  {quizResult.isPassed
                    ? `Congratulations! Machine Learning skill verified at ${quizResult.score}%. Your profile readiness has increased!`
                    : 'Review the explanations below and re-attempt to upgrade your verified score.'}
                </p>
              </div>
            )}

            {/* Questions Form */}
            <form onSubmit={handleQuizSubmit} className="space-y-6">
              {quiz?.questions?.map((q, qIdx) => {
                const selected = selectedAnswers[q.id];
                const resultItem = quizResult?.questionResults?.find((r) => r.questionId === q.id);

                return (
                  <div key={q.id} className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold shrink-0">
                        {qIdx + 1}
                      </span>
                      <h4 className="font-semibold text-white text-sm leading-relaxed">
                        {q.questionText}
                      </h4>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {['A', 'B', 'C', 'D'].map((optKey) => {
                        const optText = q[`option${optKey}`];
                        const isSelected = selected === optKey;
                        const isCorrectOption = q.correctOption === optKey;

                        let optClass = 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300';
                        if (isSelected) {
                          optClass = 'bg-brand-600/20 border-brand-500 text-brand-200 ring-1 ring-brand-500';
                        }
                        if (quizSubmitted) {
                          if (isCorrectOption) {
                            optClass = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                          } else if (isSelected && !isCorrectOption) {
                            optClass = 'bg-rose-950/50 border-rose-500 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optKey}
                            type="button"
                            onClick={() => handleOptionSelect(q.id, optKey)}
                            disabled={quizSubmitted}
                            className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${optClass}`}
                          >
                            <span className="font-bold shrink-0 opacity-70">({optKey})</span>
                            <span className="leading-relaxed">{optText}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {quizSubmitted && q.explanation && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
                        <span className="font-bold text-slate-300 block">Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {!quizSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittingQuiz || Object.keys(selectedAnswers).length < (quiz?.questions?.length || 1)}
                    className="glass-button-primary text-xs px-8 py-3"
                  >
                    {submittingQuiz ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Assessment
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* 5. AI STUDY ASSISTANT TAB */}
        {activeTab === 'ai' && (
          <AIStudyAssistant moduleId={moduleData.id} moduleTitle={moduleData.title} />
        )}
      </div>
    </div>
  );
}
