"use client"
import { BadgeCheck, CircleAlert, TriangleAlert } from "lucide-react";
import React from "react";
import { ToastContainer } from "react-toastify";
const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      icon={({ type }) => {
        switch (type) {
          case "error":
            return <CircleAlert className="stroke-red-500" />;
          case "success":
            return <BadgeCheck className="stroke-[#d38321]" />;
          case "warning":
            return <TriangleAlert className="stroke-yellow-500" />;
          default:
            return null;
        }
      }}
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};

export default ToastProvider;
