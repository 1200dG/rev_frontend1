"use client";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import TournamentPlay from "@/components/clash/TournamentPlay";

interface TournamentPlayPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TournamentPlayPage({ params }: TournamentPlayPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('levelNumber');
  const levelNumber = levelParam ? Number(levelParam) : undefined;

  return <TournamentPlay tournamentId={id} levelNumber={levelNumber} />;
}
