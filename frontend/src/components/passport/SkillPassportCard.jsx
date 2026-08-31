import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  QrCode,
  CheckCircle2,
  Building2,
  ExternalLink,
  Calendar,
  Layers
} from 'lucide-react';
import QRCodeModal from './QRCodeModal';

export default function SkillPassportCard({ passportData }) {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  if (!passportData) return null;

  const {
    passportCode = 'KSH-2026-NITK-88219',
    verificationHash = '9a8b7c6d5e4f3a2b',
    studentName = 'Rahul Kumar',
    email = 'rahul.student@kaushiq.edu',
    avatar,
    domain = 'Computer Science & Engineering',
    department = 'Computer Science',
    institution = 'National Institute of Technology Karnataka',
    degree = 'B.Tech in Computer Science & Engineering',
    employabilityScore = 87,
    scoreBreakdown = {},
    verifiedSkills = [],
    completedProjects = [],
    verifiedCertifications = [],
    industryEvaluations = []
  } = passportData;

  const verificationUrl = `${window.location.origin}/verify-passport/${passportCode}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="badge-verified-industry text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cryptographically Verified Credential
          </span>
          <span className="text-xs text-slate-400">ID: {passportCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="glass-button-secondary text-xs px-3.5 py-2"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-400" />
            Verify QR
          </button>
          <button
            onClick={handlePrint}
            className="glass-button-primary text-xs px-3.5 py-2"
          >
            <Download className="w-3.5 h-3.5" />
            Download / Print Passport
          </button>
        </div>
      </div>

      {/* Main Passport Card Container */}
      <div className="glass-panel p-8 relative overflow-hidden border-indigo-500/30 shadow-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950">
        {/* Background watermark badge */}
        <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
          <Award className="w-96 h-96 text-brand-400" />
        </div>

        {/* Passport Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center font-bold text-white text-xl">
                {avatar ? (
                  <img src={avatar} alt={studentName} className="w-full h-full object-cover" />
                ) : (
                  studentName.charAt(0)
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white font-display tracking-tight">{studentName}</h2>
                <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified Scholar" />
              </div>
              <p className="text-xs text-slate-300 font-medium">{degree}</p>
              <p className="text-xs text-slate-400">{institution} • {domain}</p>
            </div>
          </div>

          {/* Employability Score Pill */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Employability Score</span>
              <span className="text-3xl font-black text-emerald-400 font-display">{employabilityScore} <span className="text-xs text-slate-400">/ 100</span></span>
            </div>
            <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-md shrink-0">
              <QRCodeSVG value={verificationUrl} size={48} />
            </div>
          </div>
        </div>

        {/* Passport Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 relative z-10">
          {/* Left Column: Verified Skills */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Verified Competency Portfolio ({verifiedSkills.length} Verified Skills):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verifiedSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white text-xs block">{sk.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{sk.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-brand-300 text-xs">{sk.score}%</span>
                      <span className="block text-[10px] text-emerald-400 font-semibold">{sk.verificationLevel.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Projects Section */}
            {completedProjects.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Verified Industry Challenges Completed:
                </h4>
                <div className="space-y-3">
                  {completedProjects.map((p, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{p.title}</span>
                        <span className="badge-verified-industry text-[10px]">
                          Rating: {p.grade} / 5.0 ⭐
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{p.feedback}"</p>
                      <div className="text-[10px] text-slate-500">Partner: {p.industryPartner}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Certifications & Audit Trail */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                Verified Certifications:
              </h4>
              <div className="space-y-2">
                {verifiedCertifications.map((c, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                    <span className="font-semibold text-white block">{c.title}</span>
                    <span className="text-slate-400 text-[10px]">{c.issuer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Signature Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tamper-Evident Verification</span>
              <div className="font-mono text-[10px] text-slate-400 break-all bg-slate-900/80 p-2 rounded border border-slate-800">
                HASH: {verificationHash}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                KaushIQ Trust Engine (SIH 2026 Verified)
              </div>
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        passportCode={passportCode}
        studentName={studentName}
        verificationUrl={verificationUrl}
      />
    </div>
  );
}
