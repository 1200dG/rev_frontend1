"use client"

import { UserApiData, UsersTableProps } from "@/lib/types/common/types";
import React, { useEffect, useRef, useState } from "react";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import Dropdown from "../../dropdown";
import Pagination from "../pagination";
import { deleteUserbyId, updateUser } from "@/lib/services/common/adminActions";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import EditUserModal from "./EditUserModal";
import { CheckCircle2, XCircle } from "lucide-react";

type UserData = {
  search: string,
  currentPage: number,
  deleteModal: boolean,
  selectedUserId: number | null,
}

const UsersTable: React.FC<UsersTableProps> = React.memo(({ user, isLoading, fetchUsers, setStatus, status }) => {

  const [userData, setUserData] = useState<UserData>({
    search: "",
    currentPage: 1,
    deleteModal: false,
    selectedUserId: null,
  });

  const [editDataModal, setEditDataModal] = useState<{ openModal: boolean }>({ openModal: false });

  const [selectedUserData, setSelectedUserData] = useState<UserApiData>();
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const userPerPage = 10;
  const filteredUsers = user?.filter((user) =>
    user.email.toLowerCase().includes(userData.search.toLowerCase()) || user.username.toLowerCase().includes(userData.search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / userPerPage);
  const currentUsers = filteredUsers.slice(
    (userData.currentPage - 1) * userPerPage,
    userData.currentPage * userPerPage
  );

  const handleDeleteUser = (id: number) => {
    setUserData((prev) => { return { ...prev, selectedUserId: id, deleteModal: true } })
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const options: Array<"active" | "inactive"> = ["active", "inactive"];


  const handleRowClick = (user: UserApiData) => {
    setEditDataModal((prev) => ({ ...prev, openModal: true }))
    setSelectedUserData(user);
  }

  const handleClose = () => {
    setEditDataModal((prev) => ({ ...prev, openModal: false }));
    setSelectedUserData(undefined);
  };

  const updateAction = async (user: UserApiData, option: string | null) => {
    if (!user?.id || !option) return;

    setActionLoading(true);

    try {
      const payload: Partial<UserApiData> = {
        is_active: option === "Activate" ? true : false,
      };

      await updateUser(user.id, payload);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user status", error);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async (): Promise<boolean> => {
    if (!userData.selectedUserId) return false;
    else {
      try {

        await deleteUserbyId(userData.selectedUserId);
        await fetchUsers();
        setUserData((prev) => ({ ...prev, selectedUserId: null, deleteModal: false }))
      } catch (error) {
        setUserData((prev) => ({ ...prev, selectedUserId: null, deleteModal: false }))
      }
      return true;
    }
  }

  const handlePageChange = (pageNumber: number) => setUserData((prev) => ({ ...prev, currentPage: pageNumber }));
  return (
    <>
      <AdminTableCard
        title="USERS"
        headerActions={
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-[200px]">
              <img src="/admin/search.svg" alt="search icon" />
              <input
                type="search"
                placeholder="Search"
                className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                value={userData.search}
                onChange={(e) => setUserData((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="relative w-[170px]" ref={dropdownRef}>
              <div onClick={() => setIsOpen(!isOpen)} className="w-full border-2 border-[#59616952] border-opacity-30 cursor-pointer rounded-lg bg-transparent flex items-center justify-between px-3 py-2" >
                <span className="text-base font-medium text-[#212B36]">
                  {status === "active" ? "Active" : "Inactive"}
                </span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#919EAB52] border-opacity-30 rounded-lg shadow-lg z-50">
                  {options.map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center"
                      onClick={() => {
                        setStatus?.(option);
                        setIsOpen(false);
                      }}
                    >
                      {option === "active" ? "Active" : "Inactive"}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        }
      >
        <div>
          <div className="overflow-visible">
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1.5fr]  text-xs bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
              <div className="flex justify-between p-4">Id
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Email
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Username
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Is Active
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Account ID
                <i className="border border-[#32475C1F]" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <TableLoader message="Loading Users..." />
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <div key={index} onClick={() => handleRowClick(user)}
                className={`grid grid-cols-[0.5fr_1fr_1fr_1fr_1.5fr] hover:bg-gray-100 transition-colors duration-200 text-sm text-[#32475CDE] font-medium cursor-pointer ${index < currentUsers.length - 1 ? "border-b border-[#32475C1F]" : ""}`}
              >
                <div className="px-4 py-5">{user.id}</div>
                <div className="px-4 py-5">{user.email}</div>
                <div className="px-4 py-5">{user.username}</div>
                <div className="px-4 py-5">{user.is_active ? (
                  <CheckCircle2 className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}</div>
                <div className="flex justify-between items-center">
                  <div className="px-4 py-5">{user.account_id}</div>
                  <div onClick={(e) => e.stopPropagation()} className="pr-1.5">
                    <Dropdown
                      options={[user.is_active ? "Inactivate" : "Activate"]}
                      placeholder=""
                      value=""
                      onChange={(option) => {
                        if (!option) return;
                        updateAction(user, option);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500"> No Users found. </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={userData.currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </AdminTableCard>

      <ConfirmationModal
        isOpen={userData.deleteModal}
        onClose={() => { setUserData((prev) => ({ ...prev, selectedUserId: null, deleteModal: false })) }}
        onConfirm={confirmDelete}
        title="Delete"
        description="Are you sure you want to delete that user ?"
        confirmText="Delete"
        cancelText="Cancel"
      />
      <EditUserModal
        isOpen={editDataModal.openModal == true}
        onClose={handleClose}
        selectedUserData={selectedUserData}
        fetchUsers={fetchUsers}
      />
    </>
  );
})

UsersTable.displayName = 'UsersTable'
export default UsersTable;