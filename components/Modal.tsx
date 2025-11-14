
import React, { useEffect, useState } from 'react';
import { ModalState } from '../types';

interface ModalProps {
    modalState: ModalState;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ modalState, onClose }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (modalState.isOpen) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 200);
            return () => clearTimeout(timer);
        }
    }, [modalState.isOpen]);

    if (!shouldRender) {
        return null;
    }

    const handleConfirm = () => {
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
        onClose();
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalState.isOpen ? 'modal-enter' : 'modal-leave'}`}
            onClick={onClose}
        >
            <div className="modal-overlay absolute inset-0 bg-black/40"></div>
            <div 
                className="modal-dialog bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-slate-700 dark:text-slate-300 text-lg mb-6">{modalState.message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={handleConfirm} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500">
                        {modalState.isConfirm ? 'Confirm' : 'OK'}
                    </button>
                    {modalState.isConfirm && (
                        <button onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
