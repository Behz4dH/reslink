export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-blue-900 text-white">
      {/* User Profile Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium">
            📧
          </div>
          <div>
            <div className="text-white font-medium">behzad</div>
            <div className="text-slate-400 text-sm">Job Seeker</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-4">
        <div className="space-y-2">
          <div className="bg-lime-400 text-gray-900 rounded-lg px-4 py-3 font-medium flex items-center gap-3">
            <span className="text-gray-900">🏠</span>
            Dashboard
          </div>
          <div className="text-white hover:bg-blue-800 rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer">
            <span>📄</span>
            Resources
          </div>
          <div className="text-white hover:bg-blue-800 rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer">
            <span>⚙️</span>
            Account settings
            <span className="ml-auto">▼</span>
          </div>
          <div className="text-white hover:bg-blue-800 rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer">
            <span>❓</span>
            Support
            <span className="ml-auto">▼</span>
          </div>
        </div>
      </nav>

      {/* Referral Section */}
      <div className="mx-4 mt-8 bg-blue-800 rounded-xl p-6">
        <div className="text-center">
          <div className="text-2xl mb-2">🎁</div>
          <div className="text-white font-bold text-sm mb-2">
            GET REWARDED FOR REFERRALS
          </div>
          <div className="text-slate-300 text-xs mb-3">
            Refer friends to Reslink and earn credits when they sign up!
          </div>
          <button className="text-slate-400 text-xs underline hover:text-slate-300">
            More details
          </button>
        </div>
      </div>

      {/* Copy Link Button */}
      <div className="mx-4 mt-4">
        <button className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 flex items-center justify-between font-medium hover:bg-gray-50">
          <span>Copy link</span>
          <span>📋</span>
        </button>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button className="text-white hover:text-gray-300 flex items-center gap-2">
          <span>↗️</span>
          Log out
        </button>
      </div>
    </div>
  );
};