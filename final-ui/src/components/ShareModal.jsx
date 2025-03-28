import React, { useState, useRef } from 'react';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';

function ShareModal({ isOpen, onClose, noteId, noteTitle }) {
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef(null);
  
  // Use public link format for shared notes
  const shareUrl = `${window.location.origin}/shared/${noteId}`;
  
  if (!isOpen) return null;

  const handleCopy = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-surface-dark rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-accent-coral-200 dark:border-accent-purple-300">
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-light">Share Note</h3>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-primary dark:text-text-light/70 dark:hover:text-text-light"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <p className="text-text-secondary dark:text-text-light/80">
              Share this link with others to give them access to your note:
            </p>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  ref={linkInputRef}
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="input pl-10 pr-10 w-full"
                  onClick={(e) => e.target.select()}
                />
                <LinkIcon className="absolute left-3 top-2.5 text-text-secondary dark:text-text-light/50" size={18} />
              </div>
              
              <button
                onClick={handleCopy}
                className="btn-secondary p-2"
                aria-label="Copy link"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
            
            <div className="flex justify-end pt-2">
              <button onClick={onClose} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;