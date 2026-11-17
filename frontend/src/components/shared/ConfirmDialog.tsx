import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'default' | 'danger';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'default',
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 space-y-5">
          <div className="flex items-start gap-4">
            {variant === 'danger' ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle size={18} />
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#DDE8FA] border border-[#93C5FD]/50 flex items-center justify-center text-[#4D90F0]">
                <AlertTriangle size={18} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-sm font-bold text-[#0F172A] mb-1">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-[#334155] leading-relaxed">
                {message}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className="flex-shrink-0 text-[#334155] hover:text-[#0F172A] p-1 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#CBD5E1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0F172A] bg-[#EDF2FB] hover:bg-[#DDE8FA] border border-[#CBD5E1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onConfirm(); onClose(); }}
              className={
                variant === 'danger'
                  ? 'px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm'
                  : 'btn-primary text-xs px-4 py-2 font-semibold'
              }
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
