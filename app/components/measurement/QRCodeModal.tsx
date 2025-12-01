'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  session: any;
  onClose: () => void;
}

/**
 * QR Code Modal Component
 *
 * Zeigt QR-Code für Mobile Measurement
 * - Generiert QR-Code aus session.mobileUrl
 * - Polling für Status-Updates
 * - Schließt automatisch wenn completed
 */
export default function QRCodeModal({
  session,
  onClose,
}: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [status, setStatus] = useState(session.status);
  const [polling, setPolling] = useState(true);

  // Generiere QR-Code beim Mount
  useEffect(() => {
    generateQRCode();
  }, [session.mobileUrl]);

  // Polling für Status-Updates
  useEffect(() => {
    if (!polling || status === 'completed') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/measurement/${session.id}`);
        const data = await res.json();

        if (data.session.status === 'completed') {
          setStatus('completed');
          setPolling(false);

          // Auto-close nach 2 Sekunden
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000); // Poll alle 3 Sekunden

    return () => clearInterval(interval);
  }, [polling, status, session.id, onClose]);

  async function generateQRCode() {
    try {
      const dataUrl = await QRCode.toDataURL(session.mobileUrl, {
        width: 300,
        margin: 2,
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('QR Code generation error:', err);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(session.mobileUrl);
    alert('Link in Zwischenablage kopiert!');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              📱 Scanne mit deinem Handy
            </h2>
            {session.provider === 'mock' && (
              <p className="text-sm text-blue-600 mt-1">
                Demo-Version
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* QR Code */}
        {qrCodeDataUrl ? (
          <div className="flex justify-center mb-4">
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              className="rounded-lg border-2 border-gray-200"
            />
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600">
            1. Öffne die Kamera-App auf deinem Smartphone
          </p>
          <p className="text-sm text-gray-600">
            2. Richte die Kamera auf den QR-Code
          </p>
          <p className="text-sm text-gray-600">
            3. Folge den Anweisungen auf dem Handy
          </p>
        </div>

        {/* Alternative: Copy Link */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-2">
            Alternativ: Link kopieren
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={session.mobileUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-white"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
            >
              Kopieren
            </button>
          </div>
        </div>

        {/* Status */}
        {status === 'completed' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-medium text-center">
              ✓ Measurements erfolgreich gespeichert!
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm text-center">
              Warte auf Scan...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
