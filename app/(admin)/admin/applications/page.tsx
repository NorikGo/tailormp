"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface TailorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  yearsExperience: number;
  specialties: string[];
  portfolioLinks: string | null;
  motivation: string;
  imageUrls: string[];
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
}

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<TailorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<TailorApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/applications");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch applications");
      }

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Fehler",
        description: "Bewerbungen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    setProcessingId(selectedApplication.id);
    try {
      const response = await fetch(`/api/admin/applications/${selectedApplication.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve application");
      }

      toast({
        title: "Bewerbung genehmigt",
        description: `${selectedApplication.name} wurde als Schneider hinzugefügt`,
      });

      setApproveDialogOpen(false);
      setDetailsOpen(false);
      setSelectedApplication(null);
      setNotes("");
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error ? error.message : "Bewerbung konnte nicht genehmigt werden",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;

    setProcessingId(selectedApplication.id);
    try {
      const response = await fetch(`/api/admin/applications/${selectedApplication.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject application");
      }

      toast({
        title: "Bewerbung abgelehnt",
        description: `Bewerbung von ${selectedApplication.name} wurde abgelehnt`,
      });

      setRejectDialogOpen(false);
      setDetailsOpen(false);
      setSelectedApplication(null);
      setNotes("");
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error ? error.message : "Bewerbung konnte nicht abgelehnt werden",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Ausstehend</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Genehmigt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Abgelehnt</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Schneider-Bewerbungen</h1>
        <p className="text-slate-600">Verwalte und prüfe eingehende Bewerbungen</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Alle ({applications.length})
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Ausstehend ({applications.filter((a) => a.status === "pending").length})
            </Button>
            <Button
              variant={statusFilter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("approved")}
            >
              Genehmigt ({applications.filter((a) => a.status === "approved").length})
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("rejected")}
            >
              Abgelehnt ({applications.filter((a) => a.status === "rejected").length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">Keine Bewerbungen gefunden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">{app.name}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>{app.email} • {app.phone}</p>
                      <p>{app.city}, {app.country} • {app.yearsExperience} Jahre Erfahrung</p>
                      <p className="flex flex-wrap gap-1">
                        Spezialisierungen: {app.specialties.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </p>
                      <p className="text-xs text-slate-500">
                        Eingereicht {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true, locale: de })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(app);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye size={16} className="mr-2" />
                      Details
                    </Button>
                    {app.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => {
                            setSelectedApplication(app);
                            setApproveDialogOpen(true);
                          }}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Genehmigen
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedApplication(app);
                            setRejectDialogOpen(true);
                          }}
                        >
                          <XCircle size={16} className="mr-2" />
                          Ablehnen
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bewerbungs-Details</DialogTitle>
            <DialogDescription>
              Vollständige Informationen zur Bewerbung
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-700 mb-1">Bewerber</h4>
                <p className="text-slate-900">{selectedApplication.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">E-Mail</h4>
                  <p className="text-slate-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Telefon</h4>
                  <p className="text-slate-900">{selectedApplication.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Standort</h4>
                  <p className="text-slate-900">{selectedApplication.city}, {selectedApplication.country}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Erfahrung</h4>
                  <p className="text-slate-900">{selectedApplication.yearsExperience} Jahre</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-slate-700 mb-1">Spezialisierungen</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.specialties.map((s, i) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>

              {selectedApplication.portfolioLinks && (
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Portfolio-Links</h4>
                  <a
                    href={selectedApplication.portfolioLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedApplication.portfolioLinks}
                  </a>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm text-slate-700 mb-1">Motivation</h4>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedApplication.motivation}</p>
              </div>

              {selectedApplication.notes && (
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1">Notizen (Admin)</h4>
                  <p className="text-slate-600 text-sm">{selectedApplication.notes}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm text-slate-700 mb-1">Status</h4>
                {getStatusBadge(selectedApplication.status)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bewerbung genehmigen</DialogTitle>
            <DialogDescription>
              {selectedApplication?.name} wird als Schneider hinzugefügt und erhält Zugang zur Plattform.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Notizen (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interne Notizen zur Genehmigung..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleApprove} disabled={!!processingId}>
              {processingId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird genehmigt...
                </>
              ) : (
                "Genehmigen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bewerbung ablehnen</DialogTitle>
            <DialogDescription>
              Die Bewerbung von {selectedApplication?.name} wird abgelehnt.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Grund (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Grund für die Ablehnung..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!!processingId}>
              {processingId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird abgelehnt...
                </>
              ) : (
                "Ablehnen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
