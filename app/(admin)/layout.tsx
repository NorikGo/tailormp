/**
 * ADMIN LAYOUT (R2.2)
 *
 * Layout für Admin-Bereich mit Authentication & Authorization Check
 * Nur User mit role='admin' haben Zugriff
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/app/lib/prisma';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Check Authentication
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login?message=Bitte melde dich an');
  }

  // 2. Check Authorization (Admin-Rolle)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, email: true },
  });

  if (!dbUser || dbUser.role !== 'admin') {
    redirect('/?message=Keine Berechtigung für Admin-Bereich');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-slate-900">
                🔐 Admin Dashboard
              </h1>
              <span className="text-sm text-slate-500">
                {dbUser.email}
              </span>
            </div>
            <nav className="flex gap-4">
              <a
                href="/admin/fabrics"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Fabric Library
              </a>
              <a
                href="/"
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                ← Zurück zur Seite
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
