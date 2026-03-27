"use client";
import React, { useCallback, useMemo, useState } from "react";
import { FinanceProps } from "@/lib/types/admin";
import { exportToCSV, filterBySearchTerm } from "@/lib/utils/admin";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import Pagination from "../pagination";
import PeriodDropdown from "../periodDropdown";
import { toast } from "react-toastify";

const FinanceTable: React.FC<FinanceProps> = React.memo(({ finance, onDataChange, isLoading = false, period, onChangePeriod }) => {
  const [financeSearch, setFinanceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredFinance = useMemo(
    () => filterBySearchTerm(finance, financeSearch),
    [finance, financeSearch],
  );

  const paginatedFinance = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFinance.slice(startIndex, endIndex);
  }, [filteredFinance, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredFinance.length / itemsPerPage);

  React.useEffect(() => {
    if (filteredFinance.length > 0 && paginatedFinance.length === 0 && currentPage > 1) {
      const newTotalPages = Math.ceil(filteredFinance.length / itemsPerPage);
      const newCurrentPage = Math.min(currentPage, newTotalPages);
      setCurrentPage(newCurrentPage);
    }
  }, [filteredFinance.length, paginatedFinance.length, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = React.useCallback(() => {
    if (filteredFinance.length === 0) {
      toast.info("No finance data to export");
      return;
    }

    const exportData = filteredFinance.map((entry) => ({
      OrderId: entry.orderId,
      AccountID: entry.accountId ?? "-",
      Value: entry.value ?? "-",
      Date: entry.date ?? "-",
      Product: entry.product ?? "-",
    }));

    exportToCSV(
      `finance_${filteredFinance[0]?.orderId ?? "finance"}.csv`,
      exportData
    );
  }, [filteredFinance]);




  const headerActions = useMemo(() => (
    <div className="flex items-center gap-3 w-full">

      {/* Search - Fixed Width */}
      <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-2 w-[200px] h-10 hover:bg-white flex-shrink-0">
        <img src="/admin/search.svg" alt="Search" className="w-5 h-5" />
        <input
          type="search"
          placeholder="Search"
          className="w-full placeholder:text-[#919EAB] text-[#212B36] text-sm font-normal focus:outline-none"
          value={financeSearch}
          onChange={(e) => setFinanceSearch(e.target.value)}
        />
      </div>

      <div className="flex-shrink-0">
        <PeriodDropdown
          mode="local"
          options={["Monthly", "Yearly"]}
          defaultValue={period}
          onChange={onChangePeriod}
        />
      </div>

      <button onClick={handleExport} className="flex justify-center hover:bg-[#454F5B] items-center gap-2 bg-[#22222C] w-[150px] h-10 cursor-pointer flex-shrink-0" >
        <img src="/admin/export.svg" alt="export icon"/>
        <span className="text-white text-sm font-medium">
          Export
        </span>
      </button>

    </div>
  ), [financeSearch, onChangePeriod, handleExport]);

  return (
    <AdminTableCard
      title="Finance"
      headerActions={headerActions}
    >
      <div className="overflow-visible">
        <div className="grid grid-cols-5 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
          <div className="flex justify-between p-4">
            Order ID
            <i className="border border-[#32475C1F]" />
          </div>
          <div className="flex justify-between p-4">
            Account ID
            <i className="border border-[#32475C1F]" />
          </div>
          <div className="flex justify-between p-4">
            Value
            <i className="border border-[#32475C1F]" />
          </div>
          <div className="flex justify-between p-4">
            Date
            <i className="border border-[#32475C1F]" />
          </div>
          <div className="flex justify-between p-4">
            Products
            <i className="border border-[#32475C1F]" />
          </div>
        </div>
        <div>
          {isLoading ? (
            <TableLoader message="Loading finance data..." />
          ) : paginatedFinance.length > 0 ? (
            paginatedFinance.map((financeItem, index) => (
              <div
                key={index}
                className={`grid grid-cols-5 text-sm min-w-[800px] text-[#32475CDE] font-medium ${index < paginatedFinance.length - 1 ? "border-b border-[#32475C1F]" : ""}`}
              >
                <div className="px-4 py-5">{financeItem.orderId}</div>
                <div className="px-4 py-5">{financeItem.accountId}</div>
                <div className="px-4 py-5">{financeItem.value}</div>
                <div className="px-4 py-5">{financeItem.date}</div>
                <div className="px-4 py-5">
                  <span
                    className={`inline-block text-[#0C0C0C] text-sm font-normal px-3 py-1 rounded-md select-none ${financeItem.product === "CREDITS" ? "bg-[#FF6200]/50" : "bg-[#FFEECC]"}`}
                  >
                    {financeItem.product}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              No results found.
            </div>
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </AdminTableCard>
  );
});

FinanceTable.displayName = 'FinanceTable';

export default FinanceTable;
