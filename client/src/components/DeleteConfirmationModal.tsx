import React from 'react';
import { Button } from './ui/Button';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Product</h3>
                <p className="mb-6 text-sm text-gray-500">
                    Are you sure you want to delete <strong className="font-semibold text-gray-900">"{productName}"</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};
