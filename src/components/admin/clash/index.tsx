"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import TournamentTable from "@/components/common/admin/tournaments";
import { getAllTournaments } from "@/lib/services/common/adminActions";
import { TournamentApiData } from "@/lib/types/common/types";
import { handleApiError } from "@/lib/errorHandler";
import AdminMobile from "../mobileAdmin";

const Clash: React.FC = React.memo(() => {
  const [tournamentsData, setTournamentsData] = useState<TournamentApiData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const tournaments = useMemo(() => {
    const transformedTournaments = tournamentsData.map((tournament: TournamentApiData) => ({
      id: tournament.tournament_id || 'CM0000',
      numericId: tournament.id || 0,
      title: tournament.title || '',
      paid: tournament.paid || '',
      status: tournament.status || '',
      result_status: tournament.result_status,
    }));

    return transformedTournaments;
  }, [tournamentsData]);

  const fetchTournaments = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      }
      const data = await getAllTournaments();
      setTournamentsData(data);
    } catch (err: unknown) {
      handleApiError(err, "Failed to fetch tournaments. Please try again.");
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchTournaments(true);
  }, [fetchTournaments]);

  const handleDataChange = useCallback(() => {
    fetchTournaments(false);
  }, [fetchTournaments]);

  return (
    <>
      <div className="sm:hidden block">
        <AdminMobile />
      </div>
      <div className="sm:flex flex-col hidden gap-4 p-4">
        <TournamentTable tournaments={tournaments} onDataChange={handleDataChange} isLoading={isInitialLoading} />
      </div>
    </>
  );
});

Clash.displayName = 'Clash';

export default Clash;
