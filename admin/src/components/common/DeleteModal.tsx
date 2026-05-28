'use client';

import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import Button from './Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-card border border-outline-variant/30 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-10 text-center overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>

        {/* Trash Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-red-500/10 border border-red-500/20 text-red-500">
          <Trash2 className="w-8 h-8" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 px-2 sm:px-4">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center items-center">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto min-w-[120px] font-bold text-sm dark:border-zinc-700 dark:text-zinc-300"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto min-w-[140px] font-bold text-sm shadow-lg shadow-red-500/20"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
export { DeleteModal };
