'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Measurements } from '@/app/lib/measurement/measurements.types';

/**
 * Mock Measurement Mobile Page
 *
 * Simuliert den 3DLOOK Flow:
 * - Zeigt vorausgefüllte Demo-Daten
 * - User kann Werte anpassen
 * - "Scan abschließen" → Speichert in DB
 */
export default function MockMeasurementPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  // Demo Measurements (realistische Werte)
  const [measurements, setMeasurements] = useState<
    Partial<Measurements>
  >({
    shoulders: 45,
    chest: 98,
    waist: 85,
    hips: 95,
    armLength: 60,
    backLength: 45,
    inseam: 82,
    outseam: 108,
    neck: 38,
    thigh: 58,
    unit: 'cm',
    confidence: 0.95,
  });

  // Lade Session beim Mount
  useEffect(() => {
    loadSession();
  }, [sessionId]);

  async function loadSession() {
    try {
      const res = await fetch(`/api/measurement/${sessionId}`);
      if (!res.ok) throw new Error('Session nicht gefunden');

      const data = await res.json();
      setSession(data.session);

      // Wenn bereits completed, zeige gespeicherte Measurements
      if (data.session.measurements) {
        setMeasurements(data.session.measurements);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fehler beim Laden'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/measurement/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements }),
      });

      if (!res.ok) throw new Error('Speichern fehlgeschlagen');

      const data = await res.json();

      // Erfolg! Redirect zurück zum Checkout
      // TODO: Redirect zur Checkout Page wenn orderId vorhanden
      alert('Measurements erfolgreich gespeichert!');
      router.push('/'); // Vorerst zur Homepage
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Fehler beim Speichern'
      );
    } finally {
      setSaving(false);
    }
  }

  function updateMeasurement(key: keyof Measurements, value: number) {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Lade Measurement Session...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Fehler
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            📏 Body Measurement (Demo)
          </h1>
          <p className="text-sm text-blue-700">
            Dies ist eine Demo-Version. Die Werte sind vorausgefüllt,
            du kannst sie aber anpassen um den Flow zu testen.
          </p>
        </div>

        {/* Measurement Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Deine Körpermaße
          </h2>

          <div className="space-y-4">
            {/* Shoulders */}
            <MeasurementInput
              label="Schultern"
              value={measurements.shoulders || 0}
              onChange={(v) => updateMeasurement('shoulders', v)}
              unit="cm"
            />

            {/* Chest */}
            <MeasurementInput
              label="Brust"
              value={measurements.chest || 0}
              onChange={(v) => updateMeasurement('chest', v)}
              unit="cm"
            />

            {/* Waist */}
            <MeasurementInput
              label="Taille"
              value={measurements.waist || 0}
              onChange={(v) => updateMeasurement('waist', v)}
              unit="cm"
            />

            {/* Hips */}
            <MeasurementInput
              label="Hüfte"
              value={measurements.hips || 0}
              onChange={(v) => updateMeasurement('hips', v)}
              unit="cm"
            />

            {/* Arm Length */}
            <MeasurementInput
              label="Armlänge"
              value={measurements.armLength || 0}
              onChange={(v) => updateMeasurement('armLength', v)}
              unit="cm"
            />

            {/* Back Length */}
            <MeasurementInput
              label="Rückenlänge"
              value={measurements.backLength || 0}
              onChange={(v) => updateMeasurement('backLength', v)}
              unit="cm"
            />

            {/* Inseam */}
            <MeasurementInput
              label="Innenbeinlänge"
              value={measurements.inseam || 0}
              onChange={(v) => updateMeasurement('inseam', v)}
              unit="cm"
            />

            {/* Outseam */}
            <MeasurementInput
              label="Außenbeinlänge"
              value={measurements.outseam || 0}
              onChange={(v) => updateMeasurement('outseam', v)}
              unit="cm"
            />

            {/* Neck */}
            <MeasurementInput
              label="Hals"
              value={measurements.neck || 0}
              onChange={(v) => updateMeasurement('neck', v)}
              unit="cm"
            />

            {/* Thigh */}
            <MeasurementInput
              label="Oberschenkel"
              value={measurements.thigh || 0}
              onChange={(v) => updateMeasurement('thigh', v)}
              unit="cm"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={saving}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Wird gespeichert...' : '✓ Scan abschließen'}
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            In der Production-Version würden hier echte 3D-Scans
            durchgeführt.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Measurement Input Component
 */
function MeasurementInput({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="flex-1 font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.1"
          min="0"
        />
        <span className="text-gray-500 w-8">{unit}</span>
      </div>
    </div>
  );
}
