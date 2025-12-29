/**
 * ADMIN FABRIC - Stoff bearbeiten (R2.2)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface FabricData {
  name: string;
  description: string;
  material: string;
  weight: string;
  pattern: string;
  color: string;
  season: string;
  priceCategory: string;
  priceAdd: number;
  imageUrl: string;
  isActive: boolean;
  position: number;
}

export default function EditFabricPage() {
  const router = useRouter();
  const params = useParams();
  const fabricId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FabricData>({
    name: '',
    description: '',
    material: '',
    weight: '',
    pattern: '',
    color: '',
    season: '',
    priceCategory: 'standard',
    priceAdd: 0,
    imageUrl: '',
    isActive: true,
    position: 0,
  });

  // Load existing fabric data
  useEffect(() => {
    loadFabric();
  }, [fabricId]);

  async function loadFabric() {
    try {
      const res = await fetch('/api/admin/fabrics');
      if (!res.ok) throw new Error('Failed to load fabrics');
      const data = await res.json();

      const fabric = data.fabrics.find((f: any) => f.id === fabricId);
      if (!fabric) {
        alert('Stoff nicht gefunden');
        router.push('/admin/fabrics');
        return;
      }

      setFormData({
        name: fabric.name || '',
        description: fabric.description || '',
        material: fabric.material || '',
        weight: fabric.weight || '',
        pattern: fabric.pattern || '',
        color: fabric.color || '',
        season: fabric.season || '',
        priceCategory: fabric.priceCategory || 'standard',
        priceAdd: fabric.priceAdd || 0,
        imageUrl: fabric.imageUrl || '',
        isActive: fabric.isActive ?? true,
        position: fabric.position || 0,
      });
    } catch (error) {
      console.error('Error loading fabric:', error);
      alert('Fehler beim Laden des Stoffs');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/fabrics/${fabricId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Fehler beim Speichern');
      }

      alert('Stoff erfolgreich aktualisiert!');
      router.push('/admin/fabrics');
    } catch (error: any) {
      console.error('Error saving fabric:', error);
      alert(error.message || 'Fehler beim Speichern');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Lädt Stoff...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Stoff bearbeiten</h2>
        <p className="text-sm text-slate-500 mt-1">
          Aktualisiere die Details des Stoffs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Navy Blue Wool 120s"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beschreibe den Stoff..."
              rows={3}
            />
          </div>

          {/* Material */}
          <div>
            <Label htmlFor="material">Material *</Label>
            <Input
              id="material"
              required
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="z.B. 100% Wool"
            />
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight">Gewicht</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="z.B. 260g/m²"
            />
          </div>

          {/* Color */}
          <div>
            <Label htmlFor="color">Farbe *</Label>
            <Input
              id="color"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="z.B. Navy Blue"
            />
          </div>

          {/* Pattern */}
          <div>
            <Label htmlFor="pattern">Muster</Label>
            <Select
              value={formData.pattern}
              onValueChange={(value) => setFormData({ ...formData, pattern: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wähle ein Muster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Kein Muster</SelectItem>
                <SelectItem value="Solid">Solid</SelectItem>
                <SelectItem value="Pinstripe">Pinstripe</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Herringbone">Herringbone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Season */}
          <div>
            <Label htmlFor="season">Season</Label>
            <Select
              value={formData.season}
              onValueChange={(value) => setFormData({ ...formData, season: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wähle eine Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Keine Season</SelectItem>
                <SelectItem value="All Season">All Season</SelectItem>
                <SelectItem value="Summer">Summer</SelectItem>
                <SelectItem value="Winter">Winter</SelectItem>
                <SelectItem value="Spring/Fall">Spring/Fall</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Category */}
          <div>
            <Label htmlFor="priceCategory">Preis-Kategorie *</Label>
            <Select
              value={formData.priceCategory}
              onValueChange={(value) => setFormData({ ...formData, priceCategory: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Add */}
          <div>
            <Label htmlFor="priceAdd">Aufpreis (EUR) *</Label>
            <Input
              id="priceAdd"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.priceAdd}
              onChange={(e) => setFormData({ ...formData, priceAdd: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">Position (Sortierung)</Label>
            <Input
              id="position"
              type="number"
              min="0"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Active */}
          <div className="col-span-2 flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Stoff ist aktiv (sichtbar für Kunden)
            </Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/fabrics')}
            disabled={saving}
          >
            Abbrechen
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Speichert...' : 'Änderungen speichern'}
          </Button>
        </div>
      </form>
    </div>
  );
}
