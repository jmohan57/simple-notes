"use client";

import MainScreenLoader from "@/components/MainScreenLoader";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/auth/authuser");
      if (response.data.success) {
        router.push("/mynotes");
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      router.push("/login");
    }
  };

  return <MainScreenLoader />;
}
