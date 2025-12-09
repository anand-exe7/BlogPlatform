"use client";
<<<<<<< HEAD

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
=======
import { useState } from "react";
import Link from "next/link";

type RegisterPayload = {
  name: string;
  email: string;
  reg_no: string;
  year: string;
  domain: string;
};

export default function RegisterPage() {
  const [payload, setPayload] = useState<RegisterPayload>({
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
    name: "",
    year: "",
<<<<<<< HEAD
    domain: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/users/register", form);
      const { user } = response.data;
      
      setRefCode(user.ref_code);
      toast.success("Registration successful!");
      
      // Show ref code for a moment, then redirect to pending page
      setTimeout(() => {
        router.push("/pending");
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (refCode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <Toaster position="top-right" />
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your account has been created and is awaiting admin approval.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Your Reference Code:</p>
            <p className="text-2xl font-bold text-blue-600">{refCode}</p>
            <p className="text-xs text-gray-500 mt-2">
              Please save this code for your records
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Redirecting to pending page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster position="top-right" />
      
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create your account to get started
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            value={form.name}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            value={form.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            name="reg_no"
            placeholder="2024CS001"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            value={form.reg_no}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            name="year"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            disabled={isLoading}
          >
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain/Interest
          </label>
          <input
            type="text"
            name="domain"
            placeholder="Web Development, AI/ML, etc."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            value={form.domain}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
=======
    domain: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("Form data:", form);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage("Registration successful! Waiting for admin approval...");
      
      setTimeout(() => {
        window.location.href = "/pending";
      }, 2000);
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-yellow-400 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        {/* Logo */}
<div className="flex justify-center mb-6">
  <img 
    src="/logo.png" 
    alt="CK Club Logo" 
    className="w-24 h-24 object-contain"
  />
</div>

        <h1 className="text-3xl font-bold text-center text-black mb-2">
          Sign Up
        </h1>
        <p className="text-gray-800 text-center mb-4 font-medium">Join our club today</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full bg-white border-3 border-black rounded-lg p-3 text-black placeholder-gray-600 focus:ring-4 focus:ring-black outline-none font-medium"
          required
          value={form.name}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full bg-white border-3 border-black rounded-lg p-3 text-black placeholder-gray-600 focus:ring-4 focus:ring-black outline-none font-medium"
          required
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          type="text"
          name="year"
          placeholder="Year (e.g., 1st, 2nd, 3rd, 4th)"
          className="w-full bg-white border-3 border-black rounded-lg p-3 text-black placeholder-gray-600 focus:ring-4 focus:ring-black outline-none font-medium"
          required
          value={form.year}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          type="text"
          name="domain"
          placeholder="Domain (e.g., Computer Science)"
          className="w-full bg-white border-3 border-black rounded-lg p-3 text-black placeholder-gray-600 focus:ring-4 focus:ring-black outline-none font-medium"
          required
          value={form.domain}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          type="text"
          name="reg_no"
          placeholder="Registration Number"
          className="w-full bg-white border-3 border-black rounded-lg p-3 text-black placeholder-gray-600 focus:ring-4 focus:ring-black outline-none font-medium"
          required
          value={form.reg_no}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit">Register</button>
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
      </form>
    </div>
  );
}