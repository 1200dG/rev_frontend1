"use client"

import FaqTable from "@/components/common/admin/faqs";
import { handleApiError } from "@/lib/errorHandler";
import { getFaqs } from "@/lib/services/faqsAction";
import { Faqs } from "@/lib/types/common/types";
import React, { useEffect, useState } from "react"
import AdminMobile from "../mobileAdmin";

const Faq: React.FC = React.memo(() => {

  const [faqs, setFaqs] = useState<Faqs[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await getFaqs();

      if (Array.isArray(response) && response.length > 0) {
        setFaqs(response)
      }
    } catch (error) {
      handleApiError(error, "Error in fetching Faqs")

    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    fetchFaqs();
  }, [])

  return (
    <>
      <div className="block sm:hidden">
        <AdminMobile />

      </div>

      <div className="sm:flex flex-col gap-4 p-4 hidden">
        < FaqTable faqs={faqs} isLoading={isLoading} fetchFaqs={fetchFaqs} />
      </div>
    </>
  );
});

Faq.displayName = 'Faq';
export default Faq;