"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { BRAND } from "@/app/lib/constants/brand";

const SPECIALTIES = [
  { id: "suits", label: "Anzüge" },
  { id: "shirts", label: "Hemden" },
  { id: "pants", label: "Hosen" },
  { id: "dresses", label: "Kleider" },
  { id: "jackets", label: "Jacken" },
  { id: "alterations", label: "Änderungen" },
];

export default function ApplyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Vietnam",
    city: "",
    yearsExperience: "",
    specialties: [] as string[],
    portfolioLinks: "",
    motivation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSpecialtyToggle = (specialtyId: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialtyId)
        ? prev.specialties.filter((s) => s !== specialtyId)
        : [...prev.specialties, specialtyId],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name ist erforderlich";
    if (!formData.email.trim()) newErrors.email = "E-Mail ist erforderlich";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }
    if (!formData.phone.trim()) newErrors.phone = "Telefonnummer ist erforderlich";
    if (!formData.city.trim()) newErrors.city = "Stadt ist erforderlich";
    if (!formData.yearsExperience || parseInt(formData.yearsExperience) < 1) {
      newErrors.yearsExperience = "Bitte gib deine Erfahrung in Jahren an (mind. 1)";
    }
    if (formData.specialties.length === 0) {
      newErrors.specialties = "Wähle mindestens eine Spezialisierung";
    }
    if (!formData.motivation.trim() || formData.motivation.length < 50) {
      newErrors.motivation = "Bitte schreibe mindestens 50 Zeichen über deine Motivation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Formular unvollständig",
        description: "Bitte fülle alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tailor-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          yearsExperience: parseInt(formData.yearsExperience),
          imageUrls: [], // TODO: Implement image upload later
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bewerbung konnte nicht gesendet werden");
      }

      setIsSuccess(true);
      toast({
        title: "Bewerbung gesendet!",
        description: "Wir melden uns innerhalb von 5 Werktagen bei dir.",
      });
    } catch (error) {
      console.error("Application error:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error ? error.message : "Bewerbung konnte nicht gesendet werden",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Vielen Dank für deine Bewerbung!
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Wir haben deine Bewerbung erhalten und werden sie sorgfältig prüfen. Du erhältst innerhalb von 5 Werktagen eine Rückmeldung von uns per E-Mail.
            </p>
            <Button onClick={() => router.push("/")} size="lg">
              Zurück zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Werde Teil von {BRAND.name}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bist du ein erfahrener Schneider aus Vietnam? Bewirb dich jetzt und werde Teil unseres fairen Netzwerks.
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Was wir bieten:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>60% des Verkaufspreises - deutlich über dem Branchendurchschnitt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Regelmäßige Aufträge durch unsere wachsende Kundenbasis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Transparente Prozesse und pünktliche Auszahlungen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Dein Profil wird auf unserer Plattform präsentiert</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Bewerbungsformular</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Persönliche Daten</h3>

                <div>
                  <Label htmlFor="name">Vollständiger Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Dein vollständiger Name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="deine@email.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+84 xxx xxx xxx"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Land *</Label>
                    <Select value={formData.country} onValueChange={(v) => handleInputChange("country", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vietnam">Vietnam</SelectItem>
                        <SelectItem value="Thailand">Thailand</SelectItem>
                        <SelectItem value="Cambodia">Kambodscha</SelectItem>
                        <SelectItem value="Other">Andere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city">Stadt *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="z.B. Hanoi, Ho Chi Minh City"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Erfahrung & Fähigkeiten</h3>

                <div>
                  <Label htmlFor="yearsExperience">Jahre Erfahrung *</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="1"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                    placeholder="z.B. 10"
                    className={errors.yearsExperience ? "border-red-500" : ""}
                  />
                  {errors.yearsExperience && (
                    <p className="text-xs text-red-600 mt-1">{errors.yearsExperience}</p>
                  )}
                </div>

                <div>
                  <Label>Spezialisierungen * (mindestens eine)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {SPECIALTIES.map((specialty) => (
                      <div key={specialty.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty.id}
                          checked={formData.specialties.includes(specialty.id)}
                          onCheckedChange={() => handleSpecialtyToggle(specialty.id)}
                        />
                        <label
                          htmlFor={specialty.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {specialty.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.specialties && (
                    <p className="text-xs text-red-600 mt-1">{errors.specialties}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="portfolioLinks">Portfolio-Links (optional)</Label>
                  <Input
                    id="portfolioLinks"
                    value={formData.portfolioLinks}
                    onChange={(e) => handleInputChange("portfolioLinks", e.target.value)}
                    placeholder="https://... (URLs zu deinen Arbeiten)"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Falls vorhanden, teile Links zu deinem Portfolio oder Social Media
                  </p>
                </div>

                <div>
                  <Label htmlFor="motivation">Warum möchtest du Teil von {BRAND.name} werden? *</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange("motivation", e.target.value)}
                    placeholder="Erzähle uns über deine Motivation und warum du bei uns arbeiten möchtest..."
                    rows={6}
                    className={errors.motivation ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Mindestens 50 Zeichen ({formData.motivation.length}/50)
                  </p>
                  {errors.motivation && (
                    <p className="text-xs text-red-600 mt-1">{errors.motivation}</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    "Bewerbung absenden"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
