import { TableProps } from "@/lib/types/common/types";
import Image from "next/image";

const GamesTable = <T extends { rank: string; badge?: string }>({
  data,
  columns,
}: TableProps<T>) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-center rtl:text-right text-white border-separate border-spacing-y-2">
        <thead className="text-xs">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rank = row.rank;
            const badge = row.badge;
            return (
              <tr
                key={rowIndex}
                className={`mb-2 ${
                  rank === "1"
                    ? "rank1-bg"
                    : rank === "2"
                      ? "rank2-bg"
                      : rank === "3"
                        ? "rank3-bg"
                        : "ranks-bg"
                }`}
              >
                {columns.map((col, colIndex) => {
                  const value = row[col.accessor];
                  const isRank = col.accessor === "rank";
                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-3 overflow-hidden ${isRank ? "w-20" : ""}`}
                    >
                      {isRank ? (
                        <div className="flex relative">
                          <div
                            className={`absolute w-1 h-12 -left-6 -bottom-3 ${
                              rank === "1"
                                ? "bg-[#F7CB45]"
                                : rank === "2"
                                  ? "bg-[#EEEEEE]"
                                  : rank === "3"
                                    ? "bg-[#BB9986]"
                                    : "bg-[#99C9B854]"
                            }`}
                          />
                          <div>
                            {["1", "2", "3"].includes(rank) && badge ? (
                              <Image
                                src={badge}
                                width={28}
                                height={30}
                                alt="Badge Icon"
                              />
                            ) : (
                              <p className="font-semibold text-xs text-white">
                                {rank}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : col.render ? (
                        col.render(value, row)
                      ) : (
                        (value as React.ReactNode)
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
