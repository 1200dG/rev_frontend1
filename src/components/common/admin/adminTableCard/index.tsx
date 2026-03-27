"use client";

import React from "react";
import { AdminTableCardProps } from "@/lib/types/common/types";

const AdminTableCard: React.FC<AdminTableCardProps> = ({
  title,
  children,
  headerActions,
}) => {
  return (
    <section
      className="bg-white overflow-visible"
      style={{
        boxShadow:
          "0px 2px 9px 0px rgba(50, 71, 92, 0.06), 0px 4px 9px 1px rgba(50, 71, 92, 0.04), 0px 2px 6px 4px rgba(50, 71, 92, 0.02)",
      }}
    >
      <div className="bg-[#F3F3F3] px-4 py-2 flex justify-between items-center">
        <h4 className="text-[#32475CDD] font-bold text-md uppercase tracking-wide">
          {title}
        </h4>
        {headerActions && <div>{headerActions}</div>}
      </div>
      {children}
    </section>
  );
};

export default AdminTableCard;
