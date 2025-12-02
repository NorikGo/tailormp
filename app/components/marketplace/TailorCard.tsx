import Link from "next/link";
import { Star, MapPin, Award } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tailor } from "@/app/types/tailor";

interface TailorCardProps {
  tailor: Tailor;
}

export default function TailorCard({ tailor }: TailorCardProps) {
  const truncateBio = (bio: string, maxLength: number = 100) => {
    if (bio.length <= maxLength) return bio;
    return bio.substring(0, maxLength) + "...";
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex-1">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-slate-600">
              {tailor.name.charAt(0)}
            </span>
          </div>

          {/* Name and Country */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {tailor.name}
              </h3>
              {tailor.isVerified && (
                <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{tailor.country}</span>
            </div>
          </div>
        </div>

        {/* Rating and Orders */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{tailor.rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-600">
            {tailor.totalOrders} Bestellungen
          </span>
          <span className="text-slate-600">
            {tailor.yearsExperience} Jahre
          </span>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tailor.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {truncateBio(tailor.bio)}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full h-11 touch-manipulation">
          <Link href={`/tailors/${tailor.id}`}>Profil ansehen</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
