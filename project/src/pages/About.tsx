import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, User, Home as HomeIcon, Compass } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import {
  aboutHeroImages,
  aboutStoryImage,
  aboutGalleryImages,
  aboutClosingImage,
} from '@/lib/images';

const values = [
  {
    icon: User,
    title: 'People first',
    description: 'Start with the person, not just the property. We focus on who you are and what you need before anything else.',
  },
  {
    icon: HomeIcon,
    title: 'Comfort matters',
    description: 'A good living environment makes everyday life better. We care about the details that turn a room into a home.',
  },
  {
    icon: Compass,
    title: 'Finding your fit',
    description: 'Help people explore options that align with their needs — their city, their budget, their way of living.',
  },
];

export default function About() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleGetStarted = useCallback(() => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  }, [navigate]);

  return (
    <div className="bg-ivory">
      {/* ===== ABOUT HERO ===== */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: reduceMotion ? 1 : 1.1 }}
          animate={{ scale: reduceMotion ? 1 : 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={aboutHeroImages[0].url}
            alt={aboutHeroImages[0].alt}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/25 to-charcoal/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-ivory leading-[1.05] tracking-tight-hero text-balance">
              More than a place to stay.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-ivory/85 max-w-xl mx-auto leading-relaxed text-pretty">
              Finding a place is about more than four walls. It's about comfort,
              belonging, and the life you build around it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-9xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <ScrollReveal className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[4/3] lg:aspect-[16/11]">
              <img
                src={aboutStoryImage.url}
                alt={aboutStoryImage.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="lg:col-span-5">
            <div>
              <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
                Our story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                A better way to find your place.
              </h2>
              <div className="mt-6 space-y-5 text-lg text-secondary-text leading-relaxed text-pretty">
                <p>
                  sthero exists to make discovering suitable PG accommodation feel
                  more approachable. Not a maze of listings, not a faceless portal —
                  just a simpler way to find somewhere that fits.
                </p>
                <p>
                  We start by understanding your location, your preferences, and your
                  circumstances. Whether you're a student moving to a new city or a
                  professional looking for a change, we want the process to feel
                  human.
                </p>
              </div>
              <div className="mt-8 h-px w-16 bg-sage" />
              <p className="mt-6 text-base text-secondary-text leading-relaxed">
                That's the idea behind sthero — and it's where we're starting.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== OUR VALUES ===== */}
      <section className="bg-beige py-20 lg:py-32 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-9xl">
          <ScrollReveal>
            <div className="mb-14 lg:mb-20 max-w-2xl">
              <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
                What we believe
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                Our values
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.12}>
                  <div className="group">
                    <div className="w-14 h-14 rounded-2xl bg-ivory border border-warm-border flex items-center justify-center mb-6 transition-all duration-500 group-hover:border-sage group-hover:bg-sage/5">
                      <Icon className="h-6 w-6 text-sage" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl lg:text-2xl font-semibold text-charcoal mb-3">
                      {value.title}
                    </h3>
                    <p className="text-secondary-text leading-relaxed text-pretty">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== VISUAL STORYTELLING GALLERY ===== */}
      <section className="py-20 lg:py-32 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-9xl">
          <ScrollReveal>
            <div className="mb-12 lg:mb-16 max-w-2xl">
              <p className="text-sm font-medium tracking-wide-nav text-sage uppercase mb-3">
                Everyday moments
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
                The life around a place.
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[280px]">
              {aboutGalleryImages.map((img, i) => (
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

      {/* ===== CLOSING CTA ===== */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={aboutClosingImage.url}
          alt={aboutClosingImage.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ivory leading-tight tracking-tight-hero text-balance">
              Let's help you find your place.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <button
              onClick={handleGetStarted}
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
