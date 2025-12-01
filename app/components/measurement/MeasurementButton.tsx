'use client';

import { useState } from 'react';
import QRCodeModal from './QRCodeModal';

interface MeasurementButtonProps {
  userId: string;
  orderId?: string;
  onComplete?: (sessionId: string) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * Measurement Button Component
 *
 * Provider-agnostic Button der eine Measurement Session startet
 * - Mock Provider → Zeigt QR-Code Modal
 * - Manual Provider → Redirect zur Manual Form
 */
export default function MeasurementButton({
  userId,
  orderId,
  onComplete,
  variant = 'primary',
  className = '',
}: MeasurementButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [session, setSession] = useState<any>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      // Erstelle neue Session
      const res = await fetch('/api/measurement/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, orderId }),
      });

      if (!res.ok) throw new Error('Fehler beim Erstellen der Session');

      const data = await res.json();
      setSession(data.session);

      // Provider-spezifisches Verhalten
      if (data.provider === 'mock') {
        // Mock: Zeige QR-Code Modal
        setShowQRModal(true);
      } else if (data.provider === 'manual') {
        // Manual: Redirect zur Form
        window.location.href = data.session.mobileUrl;
      } else {
        // 3DLOOK oder andere: Zeige QR-Code Modal
        setShowQRModal(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unbekannter Fehler'
      );
    } finally {
      setLoading(false);
    }
  }

  const baseClasses =
    'px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${baseClasses} ${variantClasses} ${className}`}
      >
        {loading ? 'Lädt...' : '📏 Maße nehmen'}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {/* QR Code Modal (für Mock & 3DLOOK) */}
      {showQRModal && session && (
        <QRCodeModal
          session={session}
          onClose={() => {
            setShowQRModal(false);
            if (onComplete) onComplete(session.id);
          }}
        />
      )}
    </>
  );
}
