"use client";

import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <div className="mb-4 text-6xl">⏳</div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Registration Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your account has been created and is waiting for admin approval. Once approved, you can login with your password.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 font-medium mb-2">What happens next?</p>
          <ol className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Admin reviews your registration</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Once approved, login with your email and password</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Start creating and submitting blogs</span>
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Login
          </Link>
          
          <Link
            href="/blogs"
            className="block w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Browse Blogs (No login required)
          </Link>
          
          <Link
            href="/"
            className="block w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
