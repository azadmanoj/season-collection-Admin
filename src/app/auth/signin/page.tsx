"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import jwt_decode from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const expiryDate = decodedToken.exp * 1000;
      const currentDate = new Date().getTime();

      if (currentDate < expiryDate) {
        router.push("/"); // Redirect if token is valid
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
      }
    }
  }, [router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://season-collection-backend.onrender.com/api/auth/login",
        { email, password },
      );

      const tokenData = response.data.token;
      if (tokenData) {
        const decodedToken: any = jwt_decode(tokenData);
        console.log("🚀 ~ handleLogin ~ decodedToken:", decodedToken);
        const { userId, email: userEmail, profile: profile } = decodedToken;

        if (profile === "Admin") {
          localStorage.setItem("token", tokenData);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userEmail", userEmail);

          setLoading(false);
          toast.success(
            "Login successful! Redirecting to your Admin dashboard...",
          );

          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          toast.error("SC: You are not authorized!");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    } catch (error: any) {
      setLoading(false);
      const errorMsg = error.response?.data.message || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 dark:bg-gray-800">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-gray-700">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo/logoNew.png"
              alt="Logo"
              width={176}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/logoNew.png"
              alt="Logo"
              width={176}
              height={32}
              className="hidden dark:block"
            />
          </Link>
        </div>

        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-white">
          Season Collection Admin
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-primary-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-primary-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignIn;
