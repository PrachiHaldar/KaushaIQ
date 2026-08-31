import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';
import {
  Target,
  Building2,
  Clock,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
  Send,
  CheckCircle2,
  ExternalLink,
  Award,
  Loader2,
  Star
} from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student Submission Form
  const [repoUrl, setRepoUrl] = useState('https://github.com/rahulkumar-demo/ai-healthcare-prediction-fastapi');
  const [liveDemoUrl, setLiveDemoUrl] = useState('https://healthcare-ai-demo.kaushiq.app');
  const [documentationUrl, setDocumentationUrl] = useState('https://docs.healthcare-ai.kaushiq.app');
  const [submissionNotes, setSubmissionNotes] = useState('Containerized FastAPI microservice with Scikit-Learn training pipeline, SHAP model interpretability charts, and ROC-AUC 0.91.');
  const [submitting, setSubmitting] = useState(false);

  // Industry Evaluation Form
  const [grade, setGrade] = useState('4.7');
  const [mentorFeedback, setMentorFeedback] = useState('Outstanding implementation! Modular FastAPI architecture, clear SHAP model interpretability charts, and high ROC-AUC benchmark achieved.');
  const [evaluating, setEvaluating] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${slug}`);
      if (res.success) setProject(res.data);
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  // Student submits solution
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (user?.role !== 'STUDENT') {
      addToast({ title: 'Student Role Required', message: 'Switch to Student Demo to submit a solution.', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/projects/submit', {
        projectId: project.id,
        repoUrl,
        liveDemoUrl,
        documentationUrl,
        submissionNotes
      });

      if (res.success) {
        addToast({
          title: '🚀 Challenge Solution Submitted!',
          message: 'Your project solution is now SUBMITTED. Industry mentor will evaluate it.',
          type: 'success'
        });
        await fetchProject();
      }
    } catch (err) {
      addToast({ title: 'Submission Failed', message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Industry Mentor evaluates submission (CRITICAL STEP 5 & 6)
  const handleEvaluate = async (submissionId) => {
    setEvaluating(true);
    try {
      const res = await api.post('/projects/evaluate', {
        submissionId,
        grade: parseFloat(grade),
        mentorFeedback,
        technicalCompetency: 92,
        problemSolving: 90,
        communication: 88,
        professionalConduct: 95
      });

      if (res.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        addToast({
          title: `🎉 Project Evaluated (${grade}/5.0)!`,
          message: `Skills verified! Student readiness updated to ${res.data.updatedReadiness}/100 in DB.`,
          type: 'success'
        });
        await fetchProject();
      }
    } catch (err) {
      addToast({ title: 'Evaluation Error', message: err.message, type: 'error' });
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Loading challenge specifications, datasets, and submissions...</p>
      </div>
    );
  }

  if (!project) return null;

  // Check if current student has submitted
  const mySubmission = project.submissions?.find((s) => s.student?.userId === user?.id || s.studentId === user?.studentProfile?.id);
  const anySubmission = project.submissions?.[0]; // First submission for evaluation demo

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link to="/projects" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Industry Challenges
        </Link>
      </div>

      {/* Header Card */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-cyan-500/30 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {project.domain?.name}
          </span>
          <span className="badge-verified-industry text-[10px]">
            <ShieldCheck className="w-3 h-3" /> Industry Verified Challenge
          </span>
          <span className="badge-assessed text-[10px]">
            {project.difficulty} Level
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <DollarSign className="w-4 h-4" />
            {project.stipend || '₹20,000 Completion Grant'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            {project.durationWeeks} Weeks Duration
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Provided by: <strong className="text-white">{project.industry?.companyName || 'TechNova Solutions'}</strong>
          </span>
        </div>
      </div>

      {/* Challenge Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="glass-panel p-6 space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Problem Statement</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {project.problemStatement}
          </p>
          {project.datasetUrl && (
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Provided Dataset:</span>
              <a
                href={project.datasetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 hover:text-brand-300 font-mono text-[11px] underline flex items-center gap-1"
              >
                {project.datasetUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Expected Deliverables</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {project.deliverables}
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Evaluation Benchmarks</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {project.evaluationCriteria}
            </p>
          </div>
        </div>
      </div>

      {/* STEP 5: Student Submission Section */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-lg font-display">Student Challenge Submission</h3>
            <p className="text-xs text-slate-400">Submit your working GitHub repository and live microservice demonstration link.</p>
          </div>
          {mySubmission && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              mySubmission.status === 'EVALUATED'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
            }`}>
              Status: {mySubmission.status}
            </span>
          )}
        </div>

        {mySubmission?.status === 'EVALUATED' ? (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verified Industry Project Completed!</span>
              </div>
              <span className="text-xl font-black text-emerald-300 font-display">
                Rating: {mySubmission.grade} / 5.0 ⭐
              </span>
            </div>
            <p className="text-xs text-slate-300 italic">
              "{mySubmission.mentorFeedback}"
            </p>
            <div className="pt-2 border-t border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <span>Verified Skills Added: <strong>Machine Learning, Python Programming, Data Analytics</strong></span>
              <Link to="/passport" className="underline font-bold">View in Skill Passport →</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitProject} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live Demo / Inference API URL</label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://my-app.kaushiq.app"
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Architecture & Model Notes</label>
              <textarea
                rows={3}
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Explain training pipeline, ROC-AUC score, and API structure..."
                className="glass-input w-full"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="glass-button-primary text-xs px-6 py-2.5"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Solution for Evaluation
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* STEP 6: Industry Mentor Evaluation Section (Available for Industry/Faculty/Admin or Demo Evaluation) */}
      {(user?.role === 'INDUSTRY' || user?.role === 'ADMIN' || user?.role === 'FACULTY' || anySubmission) && (
        <div className="glass-panel p-6 sm:p-8 space-y-5 border-indigo-500/40 bg-gradient-to-r from-slate-900/90 to-indigo-950/30">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-400" />
              <div>
                <h3 className="font-bold text-white text-base font-display">
                  Industry Mentor Evaluation Panel (Demo Simulator)
                </h3>
                <p className="text-xs text-slate-400">
                  Grade Rahul's submission to trigger the 61 → 87 Readiness leap and endorse verified skills in DB.
                </p>
              </div>
            </div>
            <span className="badge-verified-industry text-xs">Mentor Action</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mentor Rating (Out of 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="glass-input w-full text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mentor Feedback & Endorsement</label>
                <input
                  type="text"
                  value={mentorFeedback}
                  onChange={(e) => setMentorFeedback(e.target.value)}
                  className="glass-input w-full text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleEvaluate(anySubmission?.id || mySubmission?.id || 'demo-sub-id')}
                disabled={evaluating}
                className="glass-button-primary text-xs px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                {evaluating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Star className="w-4 h-4" /> Evaluate & Leap Readiness (61 → 87)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
