import React from 'react';
import Modal from '../common/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function QRCodeModal({ isOpen, onClose, passportCode, studentName, verificationUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Skill Passport Verification" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-5 p-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h4 className="font-bold text-white text-base">{studentName}</h4>
          <p className="text-xs text-slate-400 mt-0.5">Passport ID: <strong className="text-brand-300">{passportCode}</strong></p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-slate-800">
          <QRCodeSVG value={verificationUrl} size={180} />
        </div>

        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Scan this QR code with any mobile camera or scanner to verify verified skills, project certifications, and employability metrics.
        </p>

        {/* Copy Link Input */}
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={verificationUrl}
            className="glass-input text-xs w-full font-mono py-2 text-slate-400 select-all"
          />
          <button
            onClick={handleCopy}
            className="glass-button-secondary text-xs px-3 py-2 shrink-0"
            title="Copy verification URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="w-full pt-2">
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button-primary text-xs w-full py-2.5"
          >
            Open Public Verification Page <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
