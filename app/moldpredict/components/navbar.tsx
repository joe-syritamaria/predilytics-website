export default function navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[rgb(var(--card))]/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-semibold text-blue-700 dark:text-white">
          MoldPredict™
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#product" className="hover:text-blue-600 transition">
            Product
          </a>
          <a href="#pricing" className="hover:text-blue-600 transition">
            Pricing
          </a>
          <a href="#download" className="hover:text-blue-600 transition">
            Download
          </a>
          <a href="#help" className="hover:text-blue-600 transition">
            Help
          </a>
        </nav>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </header>
  );
}


