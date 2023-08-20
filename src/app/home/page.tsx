"use client";

import AppCard from "@/components/AppCard";
import MainScreenLoader from "@/components/MainScreenLoader";
import NavBar from "@/components/NavBar";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { appCards } from "@/helpers/appCards";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function HomePage() {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface>();
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [toastError, setToastError] = useState<string>("");
  const [toastSuccess, setToastSuccess] = useState<string>("");

  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (toastError.length) {
      toast.error(toastError);
    }

    return () => {
      setToastError("");
    };
  }, [toastError]);

  useEffect(() => {
    if (toastSuccess.length) {
      toast.success(toastSuccess);
    }

    return () => {
      setToastSuccess("");
    };
  }, [toastSuccess]);

  // ---- useEffects Region End ---- //

  // ---- Handler Functions & API Calls ---- //
  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/auth/authuser");
      if (response.data.success) {
        setUser(response.data.data);
        setUserLoading(false);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      router.push("/login");
    }
  };

  const handleSigningOut = async () => {
    setUserLoading(true);
    try {
      const response = await axios.post("api/auth/signout");
      if (response.data.success) {
        router.push("/login");
      } else {
        toast.error("Error occured while signing out");
      }
    } catch (error) {
      toast.error("Error occured while signing out");
    }
  };

  // ---- Handler Functions & API Calls End ---- //

  return !userLoading && user ? (
    <div
      className={`w-full h-full min-h-screen bg-gradient-to-b from-slate-500 to-slate-800`}
    >
      <NavBar
        user={user!}
        onPasswordChange={() => setPasswordModalOpen(true)}
        isSigningOut={handleSigningOut}
      />

      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={() => {
          setPasswordModalOpen(false);
          setToastSuccess("Password updated !");
        }}
        username={user.username!}
      />

      {/* Cards Container */}
      <div
        className={`w-full p-6 flex flex-col flex-wrap md:flex-row justify-center items-center md:justify-evenly gap-4`}
      >
        <Toaster />

        {/* App Cards */}
        {appCards.map((card, i) => {
          return (
            <AppCard
              key={i}
              title={card.title}
              description={card.description}
              path={card.path}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <MainScreenLoader />
  );
}

export default HomePage;
