"use client";
import React, { useMemo, useState } from "react";
import { RecentTransactionsProps } from "@/lib/types/admin";
import { filterBySearchTerm } from "@/lib/utils/admin";
import TableLoader from "../dotsLoader";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AdminTableCard from "../adminTableCard";

const RecentTransactionsTable: React.FC<RecentTransactionsProps> = React.memo(({
  transactions,
  onDataChange,
  isLoading = false,
}) => {
  const [transactionSearch, setTransactionSearch] = useState("");
  const router = useRouter();
  const filteredTransactions = useMemo(
    () => filterBySearchTerm(transactions, transactionSearch),
    [transactions, transactionSearch],
  );


  const viewAllButton = (
    <button onClick={() => router.push('/admin/finance')} className="flex justify-center items-center bg-black border border-[#919EAB52] hover:bg-[#454F5B] cursor-pointer px-3 py-2 gap-1 md:gap-2 w-1/2" >
      <img src="/admin/viewAll.svg" width={20} height={25} />
      <span className="text-white text-sm font-medium">View All</span>
      {/* <ArrowRight className="w-4 h-4 text-white" /> */}
    </button>
  )

  const searchInput = useMemo(() => (
    <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-full max-w-48 md:max-w-xs">
      <img src="/admin/search.svg" alt="Search" />
      <input
        type="search"
        placeholder="Search"
        className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
        value={transactionSearch}
        onChange={(e) => setTransactionSearch(e.target.value)}
      />
    </div>
  ), [transactionSearch]);

  const headerActions = (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
      {searchInput}
      {viewAllButton}
    </div>
  );

  return (
    <AdminTableCard
      title="Recent Transactions"
      headerActions={headerActions}
    >
      <div className="overflow-auto">
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
        <div className="max-h-72 overflow-auto">
          {isLoading ? (
            <TableLoader message="Loading transactions..." />
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <div
                key={index}
                className={`grid grid-cols-5 text-sm min-w-[800px] text-[#32475CDE] font-medium ${index < filteredTransactions.length - 1 ? "border-b border-[#32475C1F]" : ""}`}
              >
                <div className="px-4 py-5">{transaction.orderId}</div>
                <div className="px-4 py-5">{transaction.accountId ? transaction.accountId : "DELETED"}</div>
                <div className="px-4 py-5">{transaction.value}</div>
                <div className="px-4 py-5">{transaction.date}</div>
                <div className="px-4 py-5">
                  <span
                    className={`inline-block text-[#0C0C0C] text-sm font-normal px-3 py-1 rounded-md select-none ${transaction.product === "CREDITS" ? "bg-[#FF6200]/50" : "bg-[#FFEECC]"}`}
                  >
                    {transaction.product}
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
    </AdminTableCard>
  );
});

RecentTransactionsTable.displayName = 'RecentTransactionsTable';

export default RecentTransactionsTable;
