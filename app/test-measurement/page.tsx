'use client';

import { MeasurementButton } from '@/app/components/measurement';
import { useAuth } from '@/app/hooks/useAuth';

/**
 * Demo Test Page für Measurement Provider
 *
 * Zum Testen:
 * 1. Öffne http://localhost:3000/test-measurement
 * 2. Klicke "Maße nehmen"
 * 3. QR-Code erscheint (Mock Provider)
 * 4. Kopiere Link und öffne in neuem Tab
 * 5. Teste den kompletten Flow
 */
export default function TestMeasurementPage() {
  const { user } = useAuth();

  // Falls nicht eingeloggt, zeige Login-Hinweis
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Login erforderlich
          </h2>
          <p className="text-gray-600 mb-6">
            Du musst eingeloggt sein, um den Measurement-Provider zu testen.
          </p>
          <a
            href="/auth/login"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Zum Login
          </a>
        </div>
      </div>
    );
  }

  const testUserId = user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Measurement Provider Test
          </h1>
          <p className="text-lg text-gray-600">
            Teste die Provider Architecture
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Provider */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              ⚙️ Aktueller Provider
            </h2>
            <div className="bg-blue-50 rounded p-3 mb-3">
              <p className="text-sm text-gray-600 mb-1">
                Environment Variable:
              </p>
              <code className="text-blue-800 font-mono">
                MEASUREMENT_PROVIDER={process.env.NEXT_PUBLIC_MEASUREMENT_PROVIDER || 'mock'}
              </code>
            </div>
            <p className="text-sm text-gray-600">
              Ändere den Provider in der <code className="bg-gray-100 px-1 rounded">.env</code> Datei
            </p>
          </div>

          {/* Test Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-900">
              📋 Test Anleitung
            </h2>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Klicke "Maße nehmen"</li>
              <li>2. QR-Code Modal erscheint</li>
              <li>3. Kopiere den Link</li>
              <li>4. Öffne in neuem Tab</li>
              <li>5. Fülle Form aus</li>
              <li>6. Klicke "Scan abschließen"</li>
            </ol>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Test Measurement Flow
          </h2>

          <div className="space-y-4">
            {/* Mock Provider Test */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Mock Provider Test
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Simuliert 3DLOOK Flow mit Demo-Daten (kostenlos)
              </p>
              <MeasurementButton
                userId={testUserId}
                variant="primary"
                onComplete={(sessionId) => {
                  console.log('✅ Session completed:', sessionId);
                  alert(`Session ${sessionId} erfolgreich abgeschlossen!`);
                }}
              />
            </div>

            {/* Manual Provider Hinweis */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">
                Manual Provider Test
              </h3>
              <p className="text-gray-600 mb-3 text-sm">
                Um den Manual Provider zu testen:
              </p>
              <ol className="text-sm text-gray-600 space-y-1 mb-4">
                <li>1. Öffne <code className="bg-white px-1 rounded">.env</code></li>
                <li>2. Ändere zu: <code className="bg-white px-1 rounded">MEASUREMENT_PROVIDER=manual</code></li>
                <li>3. Restart dev server</li>
                <li>4. Klicke "Maße nehmen" oben</li>
              </ol>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  💡 Aktueller Provider: <strong>mock</strong> (für Production ändere zu <strong>manual</strong> oder <strong>3dlook</strong>)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">
            🏗️ Architecture Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded p-4">
              <h3 className="font-semibold mb-2 text-purple-900">
                Provider Pattern
              </h3>
              <p className="text-sm text-gray-600">
                Wechsle Provider durch .env Änderung - kein Code-Refactoring nötig
              </p>
            </div>
            <div className="bg-purple-50 rounded p-4">
              <h3 className="font-semibold mb-2 text-purple-900">
                Type-Safe
              </h3>
              <p className="text-sm text-gray-600">
                Vollständig typisiert mit TypeScript Interfaces
              </p>
            </div>
            <div className="bg-purple-50 rounded p-4">
              <h3 className="font-semibold mb-2 text-purple-900">
                Kostenlos MVP
              </h3>
              <p className="text-sm text-gray-600">
                Mock Provider ermöglicht Testing ohne 3DLOOK Kosten
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Siehe{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              MEASUREMENT_SETUP.md
            </code>{' '}
            für vollständige Dokumentation
          </p>
        </div>
      </div>
    </div>
  );
}
