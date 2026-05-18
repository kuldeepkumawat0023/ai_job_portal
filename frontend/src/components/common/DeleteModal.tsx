'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

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
  title = 'Delete Analysis',
  message = 'Are you sure you want to permanently delete this analysis? This action cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-surface border border-outline-variant/30 rounded-[36px] shadow-2xl p-6 sm:p-10 text-center overflow-hidden z-10"
          >
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Trash Icon */}
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
              <Trash2 className="w-10 h-10" />
            </div>

            {/* Content */}
            <h3 className="text-2xl sm:text-3xl font-black text-on-surface mb-3 tracking-tight leading-tight">
              {title}
            </h3>
            <p className="text-on-surface-variant font-medium text-sm sm:text-base leading-relaxed mb-8 px-2 sm:px-4">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
                className="w-full sm:w-auto min-w-[120px] font-bold text-sm"
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onConfirm}
                isLoading={isLoading}
                className="w-full sm:w-auto min-w-[140px] font-black text-sm bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
