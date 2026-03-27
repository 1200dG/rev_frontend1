"use client";

import React, { Suspense } from "react";
import UserLayout from "@/components/layouts/userLayout";
import GameShopPage from "@/components/payments";
const PaymentsPage: React.FC = () => {

  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <UserLayout>

        <GameShopPage />
      </UserLayout>
    </Suspense>
  );
};

export default PaymentsPage;
