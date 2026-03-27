"use client";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { SeasonPlayPageProps } from "@/lib/types/common/types";
import SeasonPlayComponent from "@/components/enigma/SeasonPlay";

export default function SeasonPlayPage({ params }: SeasonPlayPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const levelNumber = searchParams.get('levelNumber');
  
  return <SeasonPlayComponent seasonId={id} levelNumber={levelNumber} />;
}
