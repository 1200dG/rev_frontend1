"use client"

import React, { useState } from "react"
import AdminTableCard from "../adminTableCard";
import Pagination from "../pagination";
import Dropdown from "../../dropdown";
import TableLoader from "../dotsLoader";
import { Faqs, FaqTableProps } from "@/lib/types/common/types";
import { addFaqs, deleteFaqs, updateFaqs } from "@/lib/services/faqsAction";
import AddFaqModal from "../modalCards/addFaqModal";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import { handleApiError } from "@/lib/errorHandler";

const FaqTable: React.FC<FaqTableProps> = React.memo(({ faqs, isLoading, fetchFaqs }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faqs | null>(null);
  const [selectedFaqId, setSelectedFaqId] = useState<number | null>();
  const [search, setSearch] = useState("");
  const faqPerPage = 10;

  const filteredFaqs = faqs?.filter((faq) =>
    faq.question?.toLowerCase().includes(search.toLowerCase()) || faq.answer?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaqs.length / faqPerPage);
  const currentFaqs = filteredFaqs.slice(
    (currentPage - 1) * faqPerPage,
    currentPage * faqPerPage
  );

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteFaq = (id: number) => {
    setSelectedFaqId(id);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async (): Promise<boolean> => {
    if (!selectedFaqId) return false;
    else {

      await deleteFaqs(selectedFaqId);
      await fetchFaqs();
      setIsDeleteModalOpen(false);
      setSelectedFaqId(null);
      return true;
    }
  }

  const handleEditFaq = (faq: Faqs) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  }

  const handleAddFaq = async (faq: { question: string; answer: string; active: boolean }) => {
    setIsSubmitting(true);
    try {
      if (selectedFaq) {
        await updateFaqs(selectedFaq.id, faq)
        setSelectedFaq(null);
      } else {
        await addFaqs(faq);
      }
      await fetchFaqs();
      setIsModalOpen(false);
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <AdminTableCard
        title="FAQS"
        headerActions={
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-full max-w-48 md:max-w-xs">
              <img src="/admin/search.svg" alt="search icon" />
              <input
                type="search"
                placeholder="Search"
                className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex justify-center items-center px-2 gap-2 bg-[#22222C] hover:bg-[#454F5B] w-[80%] h-10 cursor-pointer" >
              <img src="/admin/plus.svg" alt="plus icon" />
              <span className="text-white text-sm font-medium">
                ADD FAQ
              </span>
            </button>
          </div>
        }
      >
        <div>
          <div className="overflow-visible">
            <div className="grid grid-cols-[100px_0.5fr_1.5fr_120px] text-xs bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
              <div className="flex justify-between p-4">Id
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Questions
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Answers
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">Is Active</div>
            </div>
          </div>

          {isLoading ? (
            <TableLoader message="Loading Faqs..." />
          ) : currentFaqs.length > 0 ? (
            currentFaqs.map((faq, index) => (
              <div
                key={index}
                className={`grid grid-cols-[100px_0.5fr_1.5fr_120px] text-sm text-[#32475CDE] font-medium ${index < currentFaqs.length - 1
                  ? "border-b border-[#32475C1F]"
                  : ""
                  }`}
              >
                <div className="px-4 py-5">{faq.id}</div>
                <div className="px-4 py-5">{faq.question}</div>
                <div className="px-4 py-5">{faq.answer}</div>
                <div className="flex justify-between items-center">
                  <div className="px-4 py-5">{faq.active ? "Yes" : "No"}</div>
                  <Dropdown
                    options={["Edit", "Delete"]}
                    placeholder=""
                    value=""
                    onChange={(option) => {
                      if (option === "Delete") handleDeleteFaq(faq.id);
                      else handleEditFaq(faq)
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              No Faqs found.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </AdminTableCard>
      <AddFaqModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFaq(null);
        }}
        onSave={handleAddFaq}
        isSubmitting={isSubmitting}
        selectedFaq={selectedFaq}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFaqId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete"
        description="Are you sure you want to delete Faq ?"
        confirmText="Delete"
        cancelText="Cancel"
      />

    </>

  )
});

FaqTable.displayName = "FaqTable"
export default FaqTable;