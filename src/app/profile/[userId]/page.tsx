"use client"

import ProfilePage from "@/components/profile";
import { useParams } from "next/navigation";

export default function Profile() {
  const userId = useParams().userId as string | undefined;
  return  <ProfilePage userId={userId}/>
}
