import React from 'react';
import { X, TriangleAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ConfirmColor = 'red' | 'emerald' | 'amber' | 'blue' | 'slate';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  description?: string;
  color: ConfirmColor;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const colorMap: Record<ConfirmColor, {
  iconBg: string;
  iconText: string;
  solid: string;
  solidHover: string;
}> = {
  red: {
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    solid: 'bg-red-600',
    solidHover: 'hover:bg-red-700',
  },
  emerald: {
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    solid: 'bg-emerald-600',
    solidHover: 'hover:bg-emerald-700',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    solid: 'bg-amber-600',
    solidHover: 'hover:bg-amber-700',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    solid: 'bg-blue-600',
    solidHover: 'hover:bg-blue-700',
  },
  slate: {
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-600',
    solid: 'bg-slate-600',
    solidHover: 'hover:bg-slate-700',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  description,
  color,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}) => {
  const colors = colorMap[color];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-md z-10 space-y-5 font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center`}>
                  <TriangleAlert size={18} />
                </div>
                <h3 className="text-sm font-medium text-slate-800">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-700">{message}</p>
              {description && (
                <p className="text-xs text-slate-400 font-medium">{description}</p>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-medium text-white cursor-pointer transition-all active:scale-95 ${colors.solid} ${colors.solidHover}`}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border border-slate-100 rounded-2xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
