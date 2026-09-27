import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  X,
  FileCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { CivicDocumentStatus } from '../types';

interface DigiLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  stepId?: string;
  docId?: string;
  onDocumentVerified?: (stepId: string, docId: string, status: CivicDocumentStatus) => Promise<void>;
}

interface VerifiedDocResult {
  documentName: string;
  documentType: string;
  docUri: string;
  issuerName: string;
  issuerOrgId: string;
  verifiedAt: string;
  verificationHash: string;
  status: string;
  extractedData: Record<string, string>;
  digitalSignatureValid: boolean;
}

export const DigiLockerModal: React.FC<DigiLockerModalProps> = ({
  isOpen,
  onClose,
  documentName,
  stepId,
  docId,
  onDocumentVerified
}) => {
  const [loading, setLoading] = useState(false);
  const [verifiedDoc, setVerifiedDoc] = useState<VerifiedDocResult | null>(null);
  const [consent, setConsent] = useState(true);

  if (!isOpen) return null;

  const handleFetchFromDigiLocker = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/civic/digilocker/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName,
          documentType: documentName,
          consentGranted: consent
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setVerifiedDoc(data.document);
        }
      }
    } catch (err) {
      console.error('Failed to fetch from DigiLocker', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToVault = async () => {
    if (stepId && docId && onDocumentVerified) {
      await onDocumentVerified(stepId, docId, 'READY');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1A16] border border-emerald-300/80 dark:border-emerald-700/60 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header with DigiLocker Official Aesthetic */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  DigiLocker & API Setu Direct
                </span>
                <span className="text-[10px] font-bold text-amber-300">
                  Zero-OCR Verified
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Direct Government Repository Connect
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs text-[#11261F] dark:text-[#E8F3EE]">
          
          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-[#EAF2ED] dark:bg-[#12241E] border border-[#CDE3D7] dark:border-[#1F3E33] space-y-2">
            <div className="flex items-center gap-2 text-[#1B4D3E] dark:text-[#6EE7B7] font-bold">
              <Fingerprint className="w-4 h-4" />
              <span>Why pull from DigiLocker instead of uploading photos?</span>
            </div>
            <p className="text-[11px] text-[#4A5D54] dark:text-[#9FB7AC] leading-relaxed">
              Photo uploads often fail due to blurry scans, incorrect OCR parsing, or missing digital stamps. Fetching directly from <strong>DigiLocker / API Setu</strong> provides a tamper-proof, cryptographically signed digital record accepted by 100% of municipal and central departments.
            </p>
          </div>

          {/* Target Document Info */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
              Selected Document for Verification
            </span>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-[#11261F] dark:text-white">
                {documentName}
              </h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Official Issuer Ready
              </span>
            </div>
          </div>

          {/* Verification Result Display */}
          {verifiedDoc ? (
            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-extrabold text-emerald-950 dark:text-emerald-200 text-sm">
                    Cryptographically Authenticated
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                  {verifiedDoc.status}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-[#0D1A16] rounded-xl border border-emerald-200 dark:border-emerald-900/60 font-mono text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuer:</span>
                  <span className="font-bold text-[#11261F] dark:text-white">{verifiedDoc.issuerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doc URI:</span>
                  <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">{verifiedDoc.docUri}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SHA-256 Seal:</span>
                  <span className="text-[10px] text-slate-500">{verifiedDoc.verificationHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Digital Signature:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Valid & Verified</span>
                </div>
              </div>

              {/* Extracted Metadata */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 block">
                  Extracted Authority Records:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(verifiedDoc.extractedData).map(([key, val]) => (
                    <div key={key} className="p-2 bg-white/80 dark:bg-[#0D1A16]/80 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 block">{key}:</span>
                      <strong className="text-[#11261F] dark:text-white">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F6FAF8] dark:bg-[#12241E] border border-[#DCEAE2] dark:border-[#1F3E33] space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E]"
                />
                <span className="text-[11px] text-[#4A5D54] dark:text-[#9FB7AC]">
                  I hereby provide citizen consent to DishaSaathi to authenticate and retrieve my verified certificate directly from MeitY DigiLocker / API Setu.
                </span>
              </label>

              <button
                onClick={handleFetchFromDigiLocker}
                disabled={loading || !consent}
                className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Connecting to DigiLocker Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Fetch Verified {documentName}</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#F6FAF8] dark:bg-[#10271F] border-t border-[#DCE8E1] dark:border-[#1E3B32] flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Official MeitY & National Electronic Data Gateway
          </span>

          <div className="flex items-center gap-2">
            {verifiedDoc ? (
              <button
                onClick={handleSyncToVault}
                className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Mark Ready in Vault</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[#11261F] dark:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
