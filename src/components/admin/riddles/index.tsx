"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import RiddlesTable from "@/components/common/admin/riddles";
import { getAllDailyRiddles, getAllRiddles } from "@/lib/services/common/adminActions";
import { DailyRiddleApiData, RiddleApiData } from "@/lib/types/common/types";
import DailyRiddlesTable from "@/components/common/admin/dailyRiddles";
import { handleApiError } from "@/lib/errorHandler";
import AdminMobile from "../mobileAdmin";

const Riddles: React.FC = React.memo(() => {
  const [riddlesData, setRiddlesData] = useState<RiddleApiData[]>([]);
  const [dailyRiddlesData, setDailyRiddlesData] = useState<DailyRiddleApiData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const riddles = useMemo(() => {
    const transformedRiddles = riddlesData.map((riddle: RiddleApiData) => ({
      id: riddle.id || 0,
      level_id: riddle.level_id?.toString() || '0',
      levelNumber: riddle.id || 0,
      title: riddle.title || '',
      solution: riddle.solution || '',
      hint1: riddle.general_hint || '',
      hint2: riddle.intermediate_hint || '',
      hint3: riddle.final_hint || '',
      type: riddle.type || '',
      files: riddle.files ? riddle.files.map(fileObj => {
        const fileName = fileObj.file.split('/').pop() || 'Unknown file';
        return fileName;
      }) : [],
    }));

    return transformedRiddles.sort((a, b) => parseInt(a.level_id) - parseInt(b.level_id));
  }, [riddlesData]);

  const fetchRiddles = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsInitialLoading(true);
      const [riddlesRes, dailyRiddlesRes] = await Promise.all([
        getAllRiddles(),
        getAllDailyRiddles(),
      ]);
      setRiddlesData(riddlesRes);
      setDailyRiddlesData(dailyRiddlesRes);
    } catch (err: unknown) {
      handleApiError(err, "Failed to fetch riddles. Please try again.");
    } finally {
      if (isInitial) setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiddles(true);
  }, [fetchRiddles]);

  const handleDataChange = useCallback(() => {
    fetchRiddles(false);
  }, [fetchRiddles]);

  return (

    <>
      <div className="block sm:hidden">
        <AdminMobile />
      </div>
      <div className="sm:flex flex-col hidden gap-4 p-4">
        <RiddlesTable
          riddles={riddles}
          viewMode="full"
          onDataChange={handleDataChange}
          isLoading={isInitialLoading}
        />
        <DailyRiddlesTable
          riddles={riddlesData}
          dailyRiddlesData={dailyRiddlesData}
          onDataChange={handleDataChange}
          isLoading={isInitialLoading}
        />
      </div>
    </>
  );
});

Riddles.displayName = 'Riddles';

export default Riddles;
