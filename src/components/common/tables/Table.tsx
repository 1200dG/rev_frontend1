import { TableProps } from "@/lib/types/common/types";
import { BeatLoader } from "react-spinners";

const Table = <T extends object>({ data, columns, mode, loading, onRowClick }: TableProps<T>) => {
  return (
    <>
      <div className="hidden sm:block w-full">
        <div className="relative overflow-hidden w-full">
          {loading && (
            <div className="absolute inset-0 bg-black/50 w-full h-full flex flex-col justify-center items-center">
              <BeatLoader color="#D4B588" size={15} />
              {/* <p className="text-[#D4B588]">Loading...</p> */}
            </div>
          )}
          <div className="border border-[#D4B588]">
            <table className={`w-full text-sm ${mode === "tournament" ? "text-left" : "text-center"}`}>
              <thead className="h-11 items-center uppercase border-b border-[#D4B588] bg-[#335754]/30 font-medium text-sm text-white">
                <tr>
                  {columns.map((col, index) => (
                    <th scope="col" key={index} className={`px-6 py-4 text-center ${col.accessor === "username" && mode === "tournament" ? "w-[950px] text-left" : col.accessor === "username" ? "w-[421px]" : ""}`} >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#171A20]/70 aspect-[1089/509] cursor-pointer">
                {data.length === 0 ? (
                  <tr >
                    <td colSpan={columns.length} className="px-6 py-3 text-white text-center"> No records found </td>
                  </tr>
                ) : (
                  data.map((row: T & { is_current_user?: boolean }, rowIndex) => (
                    <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row)} className={`${rowIndex === data.length - 1 ? "" : "border-b border-[#828282]/12"} ${row.is_current_user ? "bg-[#D4B588]" : "hover:bg-[#D4B588]/10"}`}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className={`px-6 py-3 ${row.is_current_user ? "font-bold text-black" : "text-[#b5b5b5]"} ${col.accessor !== "username" && mode === "tournament" ? "text-center" : ""}`} >
                          {col.render
                            ? col.render(row[col.accessor], row)
                            : String(row[col.accessor])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="block sm:hidden">
        <div className="relative overflow-hidden w-[calc(321/375*100vw)] h-[calc(436/812*100vh)]">
          {loading && (
            <div className="absolute inset-0 bg-black/50 w-full h-full flex flex-col justify-center items-center">
              <BeatLoader color="#D4B588" size={15} />
              {/* <p className="text-[#D4B588]">Loading...</p> */}
            </div>
          )}
          <div className="border border-[#D4B588] bg-[#64422d]/50 rounded-md w-[calc(321/375*100vw)] h-[calc(436/812*100vh)]">
            <table className="w-full text-sm text-center table-fixed">
              <thead className="h-[calc(30/812*100vh)] uppercase border-b border-[#D4B588] bg-[#451910] font-medium text-white">
                <tr>
                  {columns.slice(0, 3).map((col, index, arr) => (
                    <th scope="col" key={index} className={` text-center  ${col.accessor === "username" ? "w-[40%]" : "w-[30%]"} ${index === 0 ? "rounded-tl-md" : ""} ${index === arr.length - 1 ? "rounded-tr-md" : ""}`} >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="cursor-pointer">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-white"> No records found </td>
                  </tr>
                ) : (
                  data.map((row: T & { is_current_user?: boolean }, rowIndex) => (
                    <tr key={rowIndex} onClick={() => onRowClick?.(row)} className={`bg-[url('/clash/rowBg.png')] bg-cover bg-center h-[calc(34/812*100vh)] w-full bg-no-repeat ${rowIndex === data.length - 1 ? "" : "border-b border-[#828282]/12"} ${row.is_current_user ? "bg-[#D4B588]" : "hover:bg-[#D4B588]/10"}`} >
                      {columns.slice(0, 3).map((col, colIndex) => {
                        const value = row[col.accessor];
                        const isUsernameCol = col.accessor === "username";
                        const isLongUsername = typeof value === "string" && value.length > 12;

                        return (
                          <td key={colIndex} className={`px-4 py-2 ${row.is_current_user ? "font-bold text-black" : "text-white font-bold"} ${col.accessor !== "username" && mode === "tournament" ? "text-center" : ""}`} >
                            {isUsernameCol ? (
                              <div className="relative overflow-hidden w-full">
                                <div className={`whitespace-nowrap ${isLongUsername ? "animate-marquee" : ""}`}>
                                  <span className="uppercase text-[12px] ">
                                    {col.render ? col.render(value, row) : String(value)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              col.render ? col.render(value, row) : String(value)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
