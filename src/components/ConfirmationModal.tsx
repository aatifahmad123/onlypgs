'use client';

interface ConfirmationModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="card" style={{
                background: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--primary-text)' }}>{message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onCancel} className="btn btn-secondary" style={{ minWidth: '100px' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn" style={{ minWidth: '100px' }}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
