import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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

  const handleGetStarted = useCallback(() => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/85 backdrop-blur-md border-b border-warm-border/60'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-9xl px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              to="/"
              className={`font-display text-2xl font-extrabold tracking-tight-hero transition-colors duration-300 ${
                scrolled ? 'text-charcoal hover:text-sage' : 'text-ivory hover:text-ivory/80'
              }`}
              aria-label="sthero home"
            >
              sthero
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide-nav transition-colors duration-300 ${
                    isActive(link.to)
                      ? scrolled ? 'text-charcoal' : 'text-ivory'
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
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center">
              <button
                onClick={handleGetStarted}
                className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${
                  scrolled
                    ? 'bg-charcoal text-ivory hover:bg-sage focus-visible:ring-offset-ivory'
                    : 'bg-ivory/90 text-charcoal hover:bg-ivory focus-visible:ring-offset-charcoal/40'
                }`}
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage ${
                scrolled ? 'text-charcoal hover:bg-beige' : 'text-ivory hover:bg-ivory/15'
              }`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-16 left-0 right-0 bg-ivory border-b border-warm-border shadow-lg"
            >
              <div className="px-5 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-beige text-charcoal'
                        : 'text-secondary-text hover:bg-beige/60 hover:text-charcoal'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleGetStarted}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-base font-medium text-ivory hover:bg-sage transition-colors"
                >
                  Get Started
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
