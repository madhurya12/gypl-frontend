import { Link } from 'react-router-dom'
import { Sparkles, Mail, Globe, Share2, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-surface-950 text-surface-300 mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.07]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 pt-16 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft-md">
                <Sparkles size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-white text-base tracking-tight">
                  GYPL <span className="text-primary-400">'26</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-surface-500 font-medium -mt-0.5">
                  Yoga Premier League
                </div>
              </div>
            </Link>
            <p className="text-surface-400 max-w-sm leading-relaxed text-sm">
              India's premier yoga competition — celebrating mastery,
              discipline, and the spirit of the practice.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {[
                { Icon: Globe, href: '#', label: 'Website' },
                { Icon: Mail, href: '#', label: 'Email' },
                { Icon: Phone, href: '#', label: 'Phone' },
                { Icon: Share2, href: '#', label: 'Share' },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-surface-800/80 hover:bg-primary-600 border border-surface-700 hover:border-primary-500 flex items-center justify-center text-surface-300 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
              Categories
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between text-surface-400">
                <span>Faceoff League</span>
                <span className="text-primary-400 font-medium">₹2,100</span>
              </li>
              <li className="flex items-center justify-between text-surface-400">
                <span>Talent Showcase</span>
                <span className="text-primary-400 font-medium">₹600</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-surface-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-surface-400 hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="text-surface-400 hover:text-primary-400 transition-colors">
                  My Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
              Account
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/login" className="text-surface-400 hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-surface-400 hover:text-primary-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-surface-400 hover:text-primary-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-surface-500 text-xs">
            © {currentYear} Grand Yoga Premier League. All rights reserved.
          </p>
          <p className="text-surface-500 text-xs">
            Crafted with care for the yoga community.
          </p>
        </div>
      </div>
    </footer>
  )
}
