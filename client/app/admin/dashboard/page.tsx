"use client";

export default function PendingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-yellow-400 shadow-2xl rounded-2xl p-8 text-center max-w-md">
        {/* Logo */}
<div className="flex justify-center mb-6">
  <img 
    src="/logo.png" 
    alt="CK Club Logo" 
    className="w-24 h-24 object-contain"
  />
        </div>

        {/* Clock Icon */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-black">
          Awaiting Admin Approval
        </h1>
        
        <p className="text-gray-800 mb-6 font-medium">
          Your account is currently under review. You'll be notified via email once your
          registration is approved by the admin.
        </p>

        <div className="bg-white border-3 border-black rounded-lg p-4 mb-6">
          <p className="text-sm text-black font-bold">
            ⏰ This usually takes 24-48 hours. Thank you for your patience!
          </p>
        </div>

        <a
          href="/login"
          className="inline-block w-full bg-black hover:bg-gray-900 text-yellow-400 font-bold py-3 px-4 rounded-lg transition duration-200 border-2 border-black"
        >
          Back to Login
        </a>
      </div>
    </div>
    );
  }