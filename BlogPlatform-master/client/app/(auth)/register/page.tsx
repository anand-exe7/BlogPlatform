"use client";

import { useState } from "react";
import Link from "next/link";

type RegisterPayload = {
  name: string;
  email: string;
  reg_no: string;
  year: string;
  domain: string;
};

export default function Register() {
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    year: "",
    domain: "",
    reg_no: "",
    email: "",
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-yellow-400 font-bold p-3 rounded-lg transition duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed border-2 border-black"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="text-center text-sm text-black font-bold bg-white p-3 rounded-lg border-2 border-black">
            {message}
          </p>
        )}

        <p className="text-center text-black font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
