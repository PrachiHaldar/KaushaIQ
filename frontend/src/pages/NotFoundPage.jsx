import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-panel p-10 max-w-md text-center space-y-4">
        <span className="text-6xl font-black font-display gradient-text-brand block">404</span>
        <h2 className="text-xl font-bold text-white">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested section does not exist or has moved. Return to the KaushIQ home dashboard.
        </p>
        <Link to="/" className="glass-button-primary text-xs inline-flex px-6 py-2.5">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
