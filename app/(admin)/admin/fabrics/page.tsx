/**
 * ADMIN FABRIC LIBRARY - Übersicht (R2.2)
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Fabric {
  id: string;
  name: string;
  material: string;
  color: string;
  priceCategory: string;
  priceAdd: number;
  isActive: boolean;
  position: number;
  createdAt: string;
}

export default function AdminFabricsPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load Fabrics
  useEffect(() => {
    loadFabrics();
  }, []);

  async function loadFabrics() {
    try {
      const res = await fetch('/api/admin/fabrics');
      if (!res.ok) throw new Error('Failed to load fabrics');
      const data = await res.json();
      setFabrics(data.fabrics);
    } catch (error) {
      console.error('Error loading fabrics:', error);
      alert('Fehler beim Laden der Stoffe');
    } finally {
      setLoading(false);
    }
  }

  // Delete Fabric
  async function handleDelete() {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/fabrics/${deleteId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error);
      }

      alert('Stoff erfolgreich gelöscht');
      setDeleteId(null);
      loadFabrics();
    } catch (error: any) {
      console.error('Error deleting fabric:', error);
      alert(error.message || 'Fehler beim Löschen des Stoffs');
    } finally {
      setDeleting(false);
    }
  }

  // Format Price
  function formatPrice(price: number) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fabric Library</h2>
          <p className="text-sm text-slate-500 mt-1">
            Verwalte die zentrale Stoff-Bibliothek ({fabrics.length} Stoffe)
          </p>
        </div>
        <Link href="/admin/fabrics/new">
          <Button>+ Neuen Stoff anlegen</Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Farbe</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Aufpreis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fabrics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                  Noch keine Stoffe angelegt. Lege den ersten Stoff an!
                </TableCell>
              </TableRow>
            ) : (
              fabrics.map((fabric, index) => (
                <TableRow key={fabric.id}>
                  <TableCell className="font-medium text-slate-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{fabric.name}</TableCell>
                  <TableCell>{fabric.material}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-slate-300"
                        style={{ backgroundColor: fabric.color.toLowerCase() }}
                        title={fabric.color}
                      />
                      {fabric.color}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        fabric.priceCategory === 'luxury'
                          ? 'default'
                          : fabric.priceCategory === 'premium'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {fabric.priceCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(fabric.priceAdd)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={fabric.isActive ? 'default' : 'secondary'}>
                      {fabric.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/fabrics/${fabric.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(fabric.id)}
                      >
                        Löschen
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stoff löschen?</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du diesen Stoff löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Löscht...' : 'Ja, löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
