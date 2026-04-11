import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Club Blog Platform
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/blogs"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Read Blogs
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Club Blog Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your ideas, connect with members, and grow together
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/blogs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Read Blogs
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-8 rounded-lg border-2 border-indigo-600 transition duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Blogs</h3>
            <p className="text-gray-600">
              Write and publish engaging blog posts with an easy-to-use editor
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Admin Approval</h3>
            <p className="text-gray-600">
              Secure workflow with admin review before content goes live
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Member Dashboard</h3>
            <p className="text-gray-600">
              Track your blogs, submissions, and engagement in one place
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            New members need admin approval • Secure • Easy to use
          </p>
        </div>
      </div>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2024 Club Blog Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
