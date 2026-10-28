import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (location.pathname !== '/get-started') {
      navigate('/get-started');
      setTimeout(() => {
        document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-9xl px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <Link
              to="/"
              className="font-display text-3xl font-extrabold tracking-tight-hero text-ivory"
              aria-label="sthero home"
            >
              sthero
            </Link>
            <p className="mt-4 text-ivory/70 text-pretty max-w-sm leading-relaxed">
              Helping you find a place that feels like home — one that fits your life,
              your city, and your next chapter.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-sm font-semibold tracking-wide-nav text-ivory/90 uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-ivory/70 hover:text-ivory transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-ivory/70 hover:text-ivory transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-1.5 text-ivory/70 hover:text-ivory transition-colors duration-300"
                >
                  Share Your Housing Needs
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <h3 className="text-sm font-semibold tracking-wide-nav text-ivory/90 uppercase">
              Ready to begin?
            </h3>
            <p className="mt-4 text-ivory/60 text-sm leading-relaxed">
              Share a few details and we'll help you take the next step.
            </p>
            <button
              onClick={handleGetStarted}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ivory/10 hover:bg-ivory/20 border border-ivory/20 px-5 py-2.5 text-sm font-medium text-ivory transition-all duration-300"
            >
              Share Your Housing Needs
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-ivory/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory/50 text-sm">
            © {new Date().getFullYear()} sthero. All rights reserved.
          </p>
          <p className="text-ivory/40 text-xs tracking-wide-nav">
            Find a place that feels like yours.
          </p>
        </div>
      </div>
    </footer>
  );
}
