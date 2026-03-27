"use client"
import ResetPassword from "@/components/auth/ResetPassword";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResetPasword(){

    const searchParams = useSearchParams();
    const token= searchParams.get("token");
    const router = useRouter();

    useEffect(() => {
    if (!token) {
      router.push("/auth/sign-in");
    }
  }, [token, router]);

    if(!token){
        return router.push("/auth/sign-in");
    }

    return <ResetPassword token={token}/>
}