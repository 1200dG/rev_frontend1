"use client";

import ModalLayout from "@/components/common/Modal";
import { AddFaqModalProps } from "@/lib/types/common/types";
import React, { useEffect, useState } from "react";


const AddFaqModal: React.FC<AddFaqModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isSubmitting,
    selectedFaq,
}) => {
    const [questions, setQuestion] = useState("");
    const [answers, setAnswer] = useState("");
    const [active, setIsActive] = useState(true);
    const isEdit = Boolean(selectedFaq);

    useEffect(() => {
    if (selectedFaq) {
        setQuestion(selectedFaq.question);
        setAnswer(selectedFaq.answer);
        setIsActive(selectedFaq.active);
    } else {
        setQuestion("");
        setAnswer("");
        setIsActive(true);
    }
}, [selectedFaq, isOpen]);

    const handleSave = () => {
        if (!questions.trim() || !answers.trim()) return;

        onSave({
            question: questions,
            answer: answers,
            active,
        });
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
            header={<h2 className="text-[18px] font-bold text-[#16182A]">{isEdit ? "Edit FAQ" : "Add FAQ"}</h2>}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 border cursor-pointer border-black text-[#16182A] font-medium text-sm hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!questions || !answers || isSubmitting}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${questions && answers && !isSubmitting
                                ? "bg-[#22222C] text-white hover:bg-[#454F5B] cursor-pointer"
                                : "bg-[#22222C] text-white opacity-50 cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update" : "Save"}
                    </button>
                </>
            }
        >
            <div className="p-4 bg-[#FAFAFA] space-y-5">
                <div className="bg-white p-4 border border-[#DCDEE4] space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-[#32475CDE] font-medium">Question</label>
                        <input
                            type="text"
                            className="w-full border border-[#DCDEE4] p-3 rounded focus:outline-none"
                            placeholder="Enter FAQ question..."
                            value={questions}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-[#32475CDE] font-medium">Answer</label>
                        <textarea
                            className="w-full border border-[#DCDEE4] p-3 rounded h-28 focus:outline-none resize-none"
                            placeholder="Enter FAQ answer..."
                            value={answers}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="activeCheck"
                            type="checkbox"
                            checked={active}
                            onChange={() => setIsActive((prev) => !prev)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="activeCheck" className="text-sm text-[#32475CDE] font-medium">
                            Mark FAQ
                        </label>
                    </div>
                </div>
            </div>
        </ModalLayout>
    );
};

export default AddFaqModal;
