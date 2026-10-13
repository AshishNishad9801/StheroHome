
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import ScrollReveal from '@/components/ScrollReveal';
import OnboardingForm from '@/components/OnboardingForm';
import { onboardingImage } from '@/lib/images';

export default function GetStarted() {
  return (
    <main className="min-h-screen bg-beige px-5 py-10 text-charcoal sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back navigation */}
        <Link
          to="/"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-ivory/80 px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-sage hover:text-sage"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        {/* Main onboarding layout */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image and introduction */}
          <ScrollReveal className="flex flex-col justify-center">
            <div className="mb-8 aspect-[5/4] overflow-hidden rounded-2xl lg:rounded-3xl">
              <img
                src={onboardingImage.url}
                alt={onboardingImage.alt}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>

            <p className="mb-3 text-sm font-medium uppercase tracking-wide-nav text-sage">
              Your next chapter
            </p>

            <h1 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
              Let&apos;s find your place.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-secondary-text text-pretty">
              Share a few details so we can understand what you&apos;re looking
              for and help you take the next step.
            </p>

            <div className="mt-6 flex items-center gap-3 text-secondary-text">
              <div className="h-px w-12 bg-sage" />
              <span className="text-sm">
                Takes less than a minute
              </span>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-sage/20 bg-ivory/70 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
              <p className="text-sm leading-relaxed text-secondary-text">
                Your preferences help us understand what matters most to you,
                from location and budget to the kind of place you want to call home.
              </p>
            </div>
          </ScrollReveal>

          {/* Existing onboarding form */}
          <ScrollReveal delay={0.15}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-3xl border border-black/5 bg-ivory p-4 shadow-sm sm:p-6 lg:p-8"
            >
              <OnboardingForm />
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Footer navigation */}
        <div className="mt-12 border-t border-black/10 pt-6 text-center">
          <p className="text-sm text-secondary-text">
            Not ready yet?{' '}
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-semibold text-sage underline-offset-4 hover:underline"
            >
              Explore sthero
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
