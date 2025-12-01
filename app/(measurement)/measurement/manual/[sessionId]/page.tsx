'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Measurements } from '@/app/lib/measurement/measurements.types';

/**
 * Manual Measurement Form
 *
 * Manuelle Eingabe von Körpermaßen:
 * - Multi-Step Form mit Anleitungen
 * - Validierung
 * - Speichert in DB
 */
export default function ManualMeasurementPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  const [measurements, setMeasurements] = useState<
    Partial<Measurements>
  >({
    unit: 'cm',
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

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      // Validierung
      const requiredFields: (keyof Measurements)[] = [
        'shoulders',
        'chest',
        'waist',
        'hips',
      ];
      const missing = requiredFields.filter(
        (field) => !measurements[field]
      );

      if (missing.length > 0) {
        throw new Error(
          `Bitte fülle alle Pflichtfelder aus: ${missing.join(', ')}`
        );
      }

      const res = await fetch(`/api/measurement/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements }),
      });

      if (!res.ok) throw new Error('Speichern fehlgeschlagen');

      // Erfolg! Redirect zurück zum Checkout
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
          <p>Lade Session...</p>
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📏 Körpermaße eingeben
          </h1>
          <p className="text-gray-600">
            Bitte miss deine Körpermaße sorgfältig und gib sie hier
            ein. Alle Maße in Zentimeter (cm).
          </p>
        </div>

        {/* Measurement Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">
            Deine Körpermaße
          </h2>

          <div className="space-y-6">
            {/* Shoulders - Pflichtfeld */}
            <MeasurementInputWithHelp
              label="Schultern *"
              value={measurements.shoulders || 0}
              onChange={(v) => updateMeasurement('shoulders', v)}
              unit="cm"
              help="Miss die breiteste Stelle deiner Schultern von einer Schulter zur anderen."
              required
            />

            {/* Chest - Pflichtfeld */}
            <MeasurementInputWithHelp
              label="Brust *"
              value={measurements.chest || 0}
              onChange={(v) => updateMeasurement('chest', v)}
              unit="cm"
              help="Miss an der breitesten Stelle deiner Brust, unter den Achseln."
              required
            />

            {/* Waist - Pflichtfeld */}
            <MeasurementInputWithHelp
              label="Taille *"
              value={measurements.waist || 0}
              onChange={(v) => updateMeasurement('waist', v)}
              unit="cm"
              help="Miss an der schmalsten Stelle deiner Taille, normalerweise knapp über dem Bauchnabel."
              required
            />

            {/* Hips - Pflichtfeld */}
            <MeasurementInputWithHelp
              label="Hüfte *"
              value={measurements.hips || 0}
              onChange={(v) => updateMeasurement('hips', v)}
              unit="cm"
              help="Miss an der breitesten Stelle deiner Hüfte."
              required
            />

            <div className="border-t pt-6">
              <h3 className="text-md font-semibold mb-4 text-gray-700">
                Optionale Maße
              </h3>

              {/* Arm Length */}
              <MeasurementInputWithHelp
                label="Armlänge"
                value={measurements.armLength || 0}
                onChange={(v) => updateMeasurement('armLength', v)}
                unit="cm"
                help="Miss von der Schulter bis zum Handgelenk."
              />

              {/* Back Length */}
              <MeasurementInputWithHelp
                label="Rückenlänge"
                value={measurements.backLength || 0}
                onChange={(v) => updateMeasurement('backLength', v)}
                unit="cm"
                help="Miss vom Nacken bis zur Taille."
              />

              {/* Inseam */}
              <MeasurementInputWithHelp
                label="Innenbeinlänge"
                value={measurements.inseam || 0}
                onChange={(v) => updateMeasurement('inseam', v)}
                unit="cm"
                help="Miss von der Leiste bis zum Knöchel."
              />

              {/* Neck */}
              <MeasurementInputWithHelp
                label="Hals"
                value={measurements.neck || 0}
                onChange={(v) => updateMeasurement('neck', v)}
                unit="cm"
                help="Miss den Umfang deines Halses."
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Wird gespeichert...' : '✓ Maße speichern'}
          </button>

          <p className="mt-4 text-sm text-gray-500 text-center">
            * Pflichtfelder
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Tipps zum Messen
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Trage eng anliegende Kleidung beim Messen</li>
            <li>• Lass dir von jemand anderem helfen für genauere Ergebnisse</li>
            <li>• Miss immer an der gleichen Stelle</li>
            <li>• Atme normal aus beim Messen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Measurement Input with Help Text
 */
function MeasurementInputWithHelp({
  label,
  value,
  onChange,
  unit,
  help,
  required = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  help: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          step="0.1"
          min="0"
          placeholder="0.0"
          required={required}
        />
        <span className="text-gray-500 w-12">{unit}</span>
      </div>
      <p className="text-sm text-gray-500">{help}</p>
    </div>
  );
}
