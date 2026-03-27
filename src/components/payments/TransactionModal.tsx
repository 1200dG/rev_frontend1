"use client";

import { X, ReceiptText, ArrowUpRight } from "lucide-react";
import React from "react";
import { TransactionModalProps } from "@/lib/types/common/types";

const TransactionModal: React.FC<TransactionModalProps> = React.memo(
  ({ onClose, transactionData }) => {
    const hasData = Array.isArray(transactionData) && transactionData.length > 0;
    const totalTransactions = transactionData?.length || 0;

    return (
      <div className="flex justify-center items-center fixed inset-0 z-[100] p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

        <div className="z-10 flex flex-col border border-[#d4b588]/20 bg-[#0d1010] shadow-2xl rounded-2xl  w-[calc(321/375*100vw)] h-[calc(500/812*100vh)] px-4 gap-3 sm:w-[calc(950.1/1440*100vw)] sm:h-[calc(620/900*100vh)] overflow-hidden relative">

          <div className="sticky top-0 z-50 px-8 py-7 border-b border-[#d4b588]/20 bg-[#0d1010] shadow-2xl">
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#d4b588]/10 rounded-full blur-[80px]" />

            <div className="flex justify-between items-center relative z-10">
              <div className="flex flex-col justify-center">
                <h3 className="text-[#d4b588] text-2xl md:text-3xl font-light tracking-tight leading-none"> Transaction History </h3>
              </div>

              <button onClick={onClose} className=" flex items-center gap-3 cursor-pointer text-white/40 hover:text-[#d4b588] transition-all" >
                  <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
            {hasData ? (
              <table className="w-full text-sm text-left border-separate border-spacing-y-2 px-6 py-4">
                <thead className="sticky top-0 z-20 bg-[#0d1010]/95 backdrop-blur-md">
                  <tr className="text-white/20 text-[10px] uppercase tracking-[0.2em]">
                    <th className="py-4 px-4 font-semibold">Ref ID</th>
                    <th className="py-4 px-4 font-semibold">Asset</th>
                    <th className="py-4 px-4 font-semibold">Amount</th>
                    <th className="py-4 px-4 font-semibold">Provider</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactionData.map((tx, index) => (
                    <tr
                      key={tx.id ?? index}
                      className="bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-200 group"
                    >
                      <td className="p-4 rounded-l-xl border-y border-l border-white/[0.03] text-[#d4b588]/60 font-mono text-[11px]">
                        #{tx.id}
                      </td>
                      <td className="p-4 border-y border-white/[0.03] font-medium text-white/90">
                        {tx.item_purchased}
                      </td>
                      <td className="p-4 border-y border-white/[0.03]">
                        <span className="text-white font-bold tracking-tight">
                          <span className="text-white/30 text-[10px] mr-1">{tx.currency}</span>
                          {tx.amount}
                        </span>
                      </td>
                      <td className="p-4 border-y border-white/[0.03]">
                        <span className="text-white/40 text-[11px] font-medium uppercase tracking-wider">{tx.payment_gateway}</span>
                      </td>
                      <td className="p-4 border-y border-white/[0.03]">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider
                          ${tx.status === "PAID"
                            ? "text-emerald-400 border border-emerald-400/10 bg-emerald-400/5"
                            : "text-amber-400 border border-amber-400/10 bg-amber-400/5"
                          }`}
                        >
                          {tx.status}
                        </div>
                      </td>
                      <td className="p-4 border-y border-r border-white/[0.03] rounded-r-xl text-white/30 text-xs">
                        {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col justify-center items-center h-80 text-white/10">
                <ReceiptText size={60} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-xs uppercase tracking-[0.4em]">Empty Ledger</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TransactionModal.displayName = "TransactionModal";

export default TransactionModal;