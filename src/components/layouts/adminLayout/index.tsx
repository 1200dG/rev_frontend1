import React from "react";
import { AdminLayoutProps } from "@/lib/types/admin";
import Sidebar from "../../common/admin/sidebar";
import Header from "../../common/admin/header";
import BaseLayout from "../BaseLayout";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <BaseLayout>
      <div className="h-screen flex flex-col-reverse md:flex-row bg-[#F9FAFC] overflow-hidden">
        <div className="md:w-64">
          <Sidebar />
        </div>
        <main className="flex flex-col flex-grow overflow-auto">
          <Header />
          {children}
        </main>
      </div>
    </BaseLayout>
  );
};

export default AdminLayout;
