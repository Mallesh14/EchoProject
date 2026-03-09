import React from 'react';
import { Button } from './ui/Button';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    isDeleting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    productName,
    isDeleting,
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={!isDeleting ? onClose : undefined}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-sm animate-fade-in-scale">
                    <div className="relative rounded-2xl bg-[#161821] border border-white/[0.09] shadow-2xl shadow-black/60 overflow-hidden">
                        {/* Top accent – danger red */}
                        <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-500" />

                        <div className="p-6">
                            {/* Icon & close */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all disabled:opacity-40"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <h3 className="text-base font-bold text-white mb-1.5">Delete Product</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-gray-200">"{productName}"</span>?
                                This action <span className="text-red-400 font-semibold">cannot be undone</span>.
                            </p>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={onClose}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1"
                                    onClick={onConfirm}
                                    isLoading={isDeleting}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
