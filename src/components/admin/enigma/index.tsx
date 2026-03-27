"use client";

import React, { useState, useEffect, useCallback } from "react";
import Seasons from "@/components/common/admin/seasons";
import { getAllSeasons, updateSeason } from "@/lib/services/common/adminActions";
import { SeasonData } from "@/lib/types/common/types";
import { handleApiError } from "@/lib/errorHandler";
import AllRiddles from "@/components/common/admin/riddles/AllRiddlesSeason";
import AdminMobile from "../mobileAdmin";
import RiddlesTable from "@/components/common/admin/riddles";

const Enigma: React.FC = React.memo(() => {
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>(undefined);
  const [showAllRiddles, setShowAllRiddles] = useState(false);
  const [isAddingRiddles, setIsAddingRiddles] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState({
    seasons: true,
    riddles: true,
  });
  const [selectedSeasonData, setSelectedSeasonData] = useState<SeasonData | null>(null);

  const handleEditLevel = (seasonData: SeasonData | null) => {
    setShowAllRiddles(true);
    setSelectedSeasonData(seasonData)
  }

  const fetchSeasons = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(prev => ({ ...prev, seasons: true }));
      }

      const seasonsData = await getAllSeasons();
      setSeasons(seasonsData);

      if (!selectedSeasonId && seasonsData.length > 0) {
        const activeSeason = seasonsData.find(s => s.status.toLowerCase() === "active") || seasonsData[0];
        setSelectedSeasonId(activeSeason.id);
        //updateSelectedRiddlesForSeason(activeSeason.id);
      }

      return seasonsData;
    } catch (err) {
      handleApiError(err);
      return [];
    } finally {
      if (isInitial) {
        setIsInitialLoading(prev => ({ ...prev, seasons: false }));
      }
    }
  }, [selectedSeasonId]);


  useEffect(() => {
    fetchSeasons(true);
  }, []);

  const handleSeasonsDataChange = useCallback(async () => {
    await fetchSeasons(false);
  }, [fetchSeasons]);

  // const updateSelectedRiddlesForSeason = useCallback(
  //   (seasonId: number) => {
  //     const season = seasons.find((s) => s.id === seasonId);
  //     if (!season) {
  //       setSelectedRiddles([]);
  //       return;
  //     }


  //   },
  //   [seasons]
  // );

  const handleSeasonSelect = useCallback(
    (seasonId: number) => {
      setSelectedSeasonId(seasonId);
      //updateSelectedRiddlesForSeason(seasonId);
    },
    []);

  const handleRiddlesAdded = useCallback(
    async (riddleIds: string[], seasonId?: number) => {

      if (!seasonId || riddleIds.length === 0) return;

      setIsAddingRiddles(true);
      try {
        const validRiddleIds = riddleIds
          .map((id) => Number(id))
          .filter((id) => !isNaN(id) && id > 0);

        if (validRiddleIds.length === 0) {
          throw new Error("No valid riddles selected.");
        }

        await updateSeason(seasonId, { riddle_ids: validRiddleIds });

        await fetchSeasons(false);
        //onDataChange?.();  

      } catch (error) {
        handleApiError(error, "Failed to add riddles to the season.");
      } finally {
        setIsAddingRiddles(false);
      }
    }, [fetchSeasons, handleApiError]
  );

  const handleRiddleDeleted = useCallback(async () => {
    try {
      setIsInitialLoading(prev => ({ ...prev, seasons: true }));

      await fetchSeasons(false);

      if (selectedSeasonId) {
        const updatedSeason = seasons.find(s => s.id === selectedSeasonId);
        if (updatedSeason) {
          setSelectedSeasonData(updatedSeason);
        }
      }
    } catch (error) {
      handleApiError(error, "Failed to refresh season data after deleting a riddle.");
    } finally {
      setIsInitialLoading(prev => ({ ...prev, seasons: false }));
    }
  }, [fetchSeasons, selectedSeasonId, seasons]);

  return (
    <>
      <div className="block sm:hidden">
        <AdminMobile />
      </div>
      <div className="hidden sm:block">
        {showAllRiddles ? (
          <div className="flex flex-col gap-4 p-4">
            <AllRiddles
              levels={selectedSeasonData?.levels}
              onClose={() => setShowAllRiddles(false)}
              selectedSeasonId={selectedSeasonId}
              onDataChange={handleSeasonsDataChange}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <RiddlesTable
              viewMode="simple"
              onDataChange={handleRiddleDeleted}
              onRiddlesAdded={handleRiddlesAdded}
              isLoading={isInitialLoading.seasons || isAddingRiddles}
              itemsPerPage={3}
              selectedSeasonId={selectedSeasonId}
              onSeasonSelect={handleSeasonSelect}
              seasons={seasons}
              onShowAllRiddles={handleEditLevel}
            />
            <div className="h-4" />
            <Seasons
              seasons={seasons}
              onDataChange={handleSeasonsDataChange}
              isLoading={isInitialLoading.seasons}
            />
          </div>
        )}
      </div>
    </>
  );
});

Enigma.displayName = "Enigma";

export default Enigma;
