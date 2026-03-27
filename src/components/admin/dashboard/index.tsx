"use client"
import { useState, useEffect, useContext, } from "react";
import DashboardCard from "@/components/common/admin/dashboardCard";
import TotalProfitChart from "@/components/common/admin/barChart";
import RecentTransactionsTable from "@/components/common/admin/recentTransactions";
import api from "@/lib/axios";
import { DashboardResponse, FinanceData } from "@/lib/types/common/types";
import { AppContext } from "@/components/context/AppContext";
import { handleApiError } from "@/lib/errorHandler";
import AdminMobile from "../mobileAdmin";

const Dashboard: React.FC = () => {
  const { selectedPeriod } = useContext(AppContext)!;
  const [chartPeriod, setChartPeriod] = useState("Yearly");
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [transactions, setTransactions] = useState<FinanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`admin-panel/dashboard/?data_period=${selectedPeriod}&graph_period=${chartPeriod}`);
        if (response.data?.status === 200) {
          const apiData: DashboardResponse = response.data.data;
          setDashboardData(apiData);
          try {
            const mapped = apiData.transactions.map((item) => {
              return {
                orderId: item.id?.toString(),
                accountId: item.account?.name,
                value: `${item.currency} ${item.amount}`,
                date: new Date(item.created_at).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).replace(",", ""),
                product: item.item_purchased,
              };
            });

            setTransactions(mapped);
          } catch (e) {
            handleApiError(e);
          }

        }
      } catch (error) {
        handleApiError(error, "Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedPeriod, chartPeriod]);

  const cards = dashboardData ? [
    { title: "Total Profit", value: dashboardData.total_profits.current, percentage: dashboardData.total_profits.difference },
    { title: "Hints", value: dashboardData.hints.current, percentage: dashboardData.hints.difference },
    { title: "Lives", value: dashboardData.lives.current, percentage: dashboardData.lives.difference },
    { title: "Tournaments", value: dashboardData.tournament.current, percentage: dashboardData.tournament.difference },
  ] : [];

  return (
    <>
      <div className="sm:hidden block">
        <AdminMobile />
      </div>
      <div className="hidden sm:block">
        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-36 rounded-2xl" />
            )) : cards.map((item, index) => (
              <DashboardCard key={index} title={item.title} percentage={item.percentage} value={item.value.toString()} />
            ))}
          </div>
          <TotalProfitChart period={chartPeriod} onChangePeriod={setChartPeriod} chartData={dashboardData?.chart ?? { labels: [], values: [], unit: "" }} />
          <RecentTransactionsTable transactions={transactions} isLoading={loading} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
