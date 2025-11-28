import TailorCard from "./TailorCard";
import { Tailor } from "@/app/types/tailor";

interface TailorGridProps {
  tailors: Tailor[];
}

export default function TailorGrid({ tailors }: TailorGridProps) {
  if (tailors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">Keine Schneider gefunden.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tailors.map((tailor) => (
        <TailorCard key={tailor.id} tailor={tailor} />
      ))}
    </div>
  );
}
