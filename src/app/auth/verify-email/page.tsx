"use client";

import { Suspense } from "react";
import VerifyEmail from "@/components/auth/VerifyEmail";

export default function verifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
