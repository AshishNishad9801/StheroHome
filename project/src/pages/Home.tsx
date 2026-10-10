import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import ScrollReveal from '@/components/ScrollReveal';
import OnboardingForm from '@/components/OnboardingForm';
import {
  heroImages,
  storyImage,
  galleryImages,
  onboardingImage,
  closingImage,
  imageComposition,
} from '@/lib/images';

export default function Home() {
  const navigate = useNavigate();

  const scrollToOnboarding = useCallback(() => {
    document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const goToAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  return (
    <div className="bg-ivory">
      {/* ===== HERO ===== */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
        <HeroCarousel images={heroImages} />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-ivory leading-[1.05] tracking-tight-hero text-balance">
              Find a place that
              <br className="hidden sm:block" /> feels like yours.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-ivory/85 max-w-xl mx-auto leading-relaxed text-pretty">
              Tell us a little about yourself. We'll help you take the next step
              toward finding your place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={scrollToOnboarding}
              className="group inline-flex items-center gap-2 rounded-full bg-ivory text-charcoal px-7 py-3.5 text-base font-semibold hover:bg-sage hover:text-ivory transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal/40"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={goToAbout}
              className="inline-flex items-center gap-2 rounded-full border border-ivory/40 text-ivory px-7 py-3.5 text-base font-medium hover:bg-ivory/10 transition-all duration-300"
            >
              Discover sthero
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-ivory/60"
        >
          <span className="text-xs tracking-wide-nav uppercase">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ===== IMAGE COMPOSITION ===== */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-9xl">
          <ScrollReveal>
            <div className="mb-12 lg:mb-16 max-w-2xl">
              <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
                Thoughtfully curated
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                Spaces designed for living, not just staying.
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5 auto-rows-[200px] sm:auto-rows-[260px] lg:auto-rows-[340px]">
              {imageComposition.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl group ${img.className}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== LIFESTYLE STORYTELLING ===== */}
      <section className="bg-beige py-20 lg:py-32 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-9xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <ScrollReveal className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[4/3] lg:aspect-[16/11]">
              <img
                src={storyImage.url}
                alt={storyImage.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="lg:col-span-5 order-1 lg:order-2">
            <div>
              <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
                Why sthero
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                Living should feel easier.
              </h2>
              <p className="mt-6 text-lg text-secondary-text leading-relaxed text-pretty">
                Finding the right place shouldn't be overwhelming. We're here to make
                the search feel more personal, more human, and a little less like a
                chore.
              </p>
              <div className="mt-8 h-px w-16 bg-sage" />
              <p className="mt-6 text-base text-secondary-text leading-relaxed">
                Tell us where you'd like to live, what matters to you, and whether
                you're a student or a professional. We'll take it from there.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== LIFESTYLE GALLERY ===== */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-9xl">
          <ScrollReveal>
            <div className="mb-12 lg:mb-16 max-w-2xl">
              <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
                Gallery
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                A place for every next chapter.
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[280px]">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-xl lg:rounded-2xl group ${img.className}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ONBOARDING SECTION ===== */}
      <section id="onboarding" className="bg-beige py-20 lg:py-32 px-5 sm:px-8 lg:px-12 scroll-mt-16">
        <div className="mx-auto max-w-9xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left: image and copy */}
          <ScrollReveal className="flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[5/4] lg:aspect-[4/3] mb-8">
              <img
                src={onboardingImage.url}
                alt={onboardingImage.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
              Onboarding
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
              Let's find your place.
            </h2>
            <p className="mt-5 text-lg text-secondary-text leading-relaxed text-pretty">
              Share a few details so we can understand what you're looking for.
            </p>
            <div className="mt-6 flex items-center gap-3 text-secondary-text">
              <div className="h-px w-12 bg-sage" />
              <span className="text-sm">Takes less than a minute</span>
            </div>
          </ScrollReveal>

          {/* Right: onboarding form */}
          <ScrollReveal delay={0.15}>
            <OnboardingForm />
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={closingImage.url}
          alt={closingImage.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ivory leading-tight tracking-tight-hero text-balance">
              Your next chapter starts here.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <button
              onClick={scrollToOnboarding}
              className="mt-8 group inline-flex items-center gap-2 rounded-full bg-ivory text-charcoal px-7 py-3.5 text-base font-semibold hover:bg-sage hover:text-ivory transition-all duration-300"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
