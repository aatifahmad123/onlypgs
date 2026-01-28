'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ConfirmationModal from './ConfirmationModal';

export default function AdminActions({ pgId, currentStatus }: { pgId: string; currentStatus: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const initiateAction = (newStatus: string) => {
        setPendingAction(newStatus);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (!pendingAction) return;
        setShowModal(false);
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/pgs/${pgId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: pendingAction })
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Error updating status');
            }
        } catch (e) { // eslint-disable-next-line @typescript-eslint/no-unused-vars
            alert('Error');
        }
        finally {
            setLoading(false);
            setPendingAction(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setPendingAction(null);
    };

    return (
        <>
            <div className="flex gap-4">
                {currentStatus !== 'approved' && (
                    <button onClick={() => initiateAction('approved')} disabled={loading} className="btn" style={{ background: '#2E7D32', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1.5rem' }}>
                        {loading && pendingAction === 'approved' ? 'Processing...' : 'Approve'}
                    </button>
                )}
                {currentStatus !== 'rejected' && (
                    <button onClick={() => initiateAction('rejected')} disabled={loading} className="btn" style={{ background: '#C62828', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1.5rem' }}>
                        {loading && pendingAction === 'rejected' ? 'Processing...' : 'Reject'}
                    </button>
                )}
            </div>

            <ConfirmationModal
                isOpen={showModal}
                message={`Are you sure you want to ${pendingAction === 'approved' ? 'approve' : 'reject'} this PG?`}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}
