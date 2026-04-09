export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-yoga-400">Grand Yoga Premier League</h3>
            <p className="text-gray-400">India's premier yoga competition event</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-yoga-400">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Faceoff League - ₹2100</li>
              <li>Talent Showcase - ₹600</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-yoga-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-yoga-400 transition">Home</a></li>
              <li><a href="/register" className="hover:text-yoga-400 transition">Register</a></li>
              <li><a href="/admin" className="hover:text-yoga-400 transition">Admin</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">© {currentYear} Grand Yoga Premier League 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
