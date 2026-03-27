"use client"

import UsersTable from "@/components/common/admin/users";
import { handleApiError } from "@/lib/errorHandler";
import { getAllUsers } from "@/lib/services/common/adminActions";
import { UserApiData } from "@/lib/types/common/types";
import React, { useEffect, useState } from "react";
import AdminMobile from "../mobileAdmin";

const UsersData: React.FC = React.memo(() => {
  const [user, setUser] = useState<UserApiData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers(status);
      if (Array.isArray(res)) {
        setUser(res);
      } else {
        setUser([]);
      }
    } catch (error) {
      handleApiError(error, "Error in fetching Users Data");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, [status])

  return (
    <>
      <div className="sm:hidden block">
        <AdminMobile />
      </div>
      <div className="sm:flex flex-col hidden gap-4 p-4">
        < UsersTable user={user} isLoading={isLoading} fetchUsers={fetchUsers} setStatus={setStatus} status={status} />
      </div>
    </>
  );
})

UsersData.displayName = 'UsersData'
export default UsersData;