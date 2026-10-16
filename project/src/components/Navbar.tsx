import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '@/assets/logo.jpg';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Update navbar appearance when scrolling.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Close mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while mobile menu is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Navigate to the onboarding page.
  const handleGetStarted = useCallback(() => {
    setMobileOpen(false);
    navigate('/get-started');
  }, [navigate]);

  // Determine the active navigation link.
  const isActive = (to: string) =>
    to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(to);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-9xl px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Brand logo and name */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="sthero home"
            >
              <img
                src={logo}
                alt=""
                className="h-9 w-auto object-contain sm:h-10"
              />

              <span
                className={`font-display text-2xl font-extrabold tracking-tight-hero transition-colors duration-300 ${
                  scrolled
                    ? 'text-charcoal hover:text-sage'
                    : 'text-ivory hover:text-ivory/80'
                }`}
              >
                Sthero
              </span>
            </Link>

            {/* Desktop navigation links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide-nav transition-colors duration-300 ${
                    isActive(link.to)
                      ? scrolled
                        ? 'text-charcoal'
                        : 'text-ivory'
                      : scrolled
                        ? 'text-secondary-text hover:text-charcoal'
                        : 'text-ivory/75 hover:text-ivory'
                  }`}
                >
                  {link.label}

                  {isActive(link.to) && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute left-4 right-4 bottom-1 h-px ${
                        scrolled ? 'bg-sage' : 'bg-ivory'
                      }`}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Get Started button */}
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={handleGetStarted}
                className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${
                  scrolled
                    ? 'bg-charcoal text-ivory hover:bg-sage focus-visible:ring-offset-ivory'
                    : 'bg-ivory/90 text-charcoal hover:bg-ivory focus-visible:ring-offset-charcoal/40'
                }`}
              >
                Share Your Housing Needs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
                scrolled
                  ? 'text-charcoal hover:bg-beige'
                  : 'text-ivory hover:bg-ivory/15'
              }`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* NEW: Subtle horizontal line beneath the navbar */}
        <div
          aria-hidden="true"
          className={`h-px w-full transition-colors duration-500 ${
            scrolled
              ? 'bg-warm-border/80'
              : 'bg-ivory/30'
          }`}
        />
      </motion.header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            id="mobile-navigation"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute top-16 left-0 right-0 bg-ivory border-b border-warm-border shadow-lg"
            >
              <div className="px-5 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-beige text-charcoal'
                        : 'text-secondary-text hover:bg-beige/60 hover:text-charcoal'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Get Started button */}
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-base font-medium text-ivory hover:bg-sage transition-colors"
                >
                  Share Your Housing Needs
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}