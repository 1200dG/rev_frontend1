"use client";

import React, { useState, useEffect, useCallback } from "react";
import FinanceTable from "@/components/common/admin/finance";
import { FinanceApiResponse, FinanceData } from "@/lib/types/common/types";
import api from "@/lib/axios";
import { handleApiError } from "@/lib/errorHandler";
import AdminMobile from "../mobileAdmin";

const Finance: React.FC = React.memo(() => {
  const [period, setPeriod] = useState("Monthly");
  const [financeData, setFinanceData] = useState<FinanceData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchFinanceData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      }
      const response = await api.get(`admin-panel/finance?period=${period}`);
      if (response.data?.status === 200) {
        try {

          const mapped: FinanceData[] = (response.data.data as FinanceApiResponse[]).map((item) => ({
            orderId: item.id,
            accountId: item.account?.name || "DELETED",
            value: `${item.currency} ${item.amount}`,
            date: new Date(item.created_at)
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
              .replace(",", ""),
            product: item.item_purchased,
          }));

          setFinanceData(mapped);
        } catch (e) {
          handleApiError(e);
        }
      } else {
        console.error("Finance API error:", response.data?.message);
      }
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }, [period]);

  useEffect(() => {
    fetchFinanceData(true);
  }, [fetchFinanceData]);

  const handleDataChange = useCallback(() => {
    fetchFinanceData(false);
  }, [fetchFinanceData]);

  return (
    <>
      <div className="hidden sm:flex flex-col gap-4 p-4">
        <FinanceTable
          finance={financeData}
          onDataChange={handleDataChange}
          isLoading={isInitialLoading}
          period={period}
          onChangePeriod={setPeriod}
        />
      </div>
      <div className="sm:hidden block">
        <AdminMobile />
      </div>
    </>
  );
});

Finance.displayName = 'Finance';

export default Finance;
