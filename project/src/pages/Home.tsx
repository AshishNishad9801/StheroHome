import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Heart,
  CheckCircle2,
  LoaderCircle,
  MessageSquareText,
  Send,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  Building2,
  BedDouble,
  Wallet,
  Navigation,
  CalendarDays,
  Sparkles,
  Clock3,
  Check,
  Quote,
  MoveRight,
  House,
  Compass,
  Handshake,
} from 'lucide-react';

import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/lib/supabase';

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=85',
    alt: 'Warm and welcoming shared living space',
  },
  {
    src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=2200&q=85',
    alt: 'Comfortable modern bedroom with natural light',
  },
  {
    src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=85',
    alt: 'Cosy bedroom with a comfortable bed and warm lighting',
  },
  {
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85',
    alt: 'Tastefully furnished shared living area',
  },
];

const searchPhrases = [
  'Looking for a PG near your college?',
  'Moving to Delhi for your first job?',
  'Searching for a room that fits your budget?',
  'Starting a new chapter in a new city?',
  'Looking for a place that feels like home?',
];

const journeySteps = [
  {
    number: '01',
    eyebrow: 'START WITH YOU',
    title: 'Start with you.',
    description:
      'Tell us where you want to live, your budget, lifestyle and what matters most in your next place.',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85',
    alt: 'A thoughtfully arranged desk representing your personal housing profile',
    icon: Users,
    visual: 'profile',
    visualLabel: 'Your housing profile',
    visualDetail: 'Your needs. Your budget. Your next chapter.',
  },
  {
    number: '02',
    eyebrow: 'FIND YOUR FIT',
    title: 'Match your needs to the right places.',
    description:
      'Explore accommodation options that align with your budget, preferred location and everyday needs.',
    image:
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1100&q=85',
    alt: 'A comfortable bedroom suitable for student or professional accommodation',
    icon: Search,
    visual: 'properties',
    visualLabel: 'Options that fit you',
    visualDetail: 'PGs, rooms and shared accommodation.',
  },
  {
    number: '03',
    eyebrow: 'LOCAL KNOWLEDGE',
    title: 'Get insights from people who know.',
    description:
      'Learn from relevant alumni, people from your region or others familiar with the property or neighbourhood, where connections are available.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85',
    alt: 'Friends connecting and sharing their experiences',
    icon: Users,
    visual: 'community',
    visualLabel: 'People who understand',
    visualDetail: 'Local knowledge. Shared experiences.',
  },
  {
    number: '04',
    eyebrow: 'MAKE AN INFORMED CHOICE',
    title: 'Shortlist. Visit. See for yourself.',
    description:
      'Compare suitable options, clarify your questions and visit shortlisted properties before making your choice.',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=85',
    alt: 'A welcoming furnished room to consider during a property visit',
    icon: MapPin,
    visual: 'visit',
    visualLabel: 'Your shortlist',
    visualDetail: 'Compare options. Ask questions. Visit.',
  },
  {
    number: '05',
    eyebrow: 'YOUR NEXT CHAPTER',
    title: 'Move in with more confidence.',
    description:
      'Make your decision with a clearer understanding of the place, its fit for your needs and the insights available to you.',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1100&q=85',
    alt: 'A comfortable bedroom ready for someone to settle into',
    icon: Heart,
    visual: 'home',
    visualLabel: 'A place of your own',
    visualDetail: 'A new beginning, on your terms.',
  },
];

const storySteps = [
  {
    number: '01',
    label: 'A fresh start',
    title: 'The offer letter arrives. A new city awaits.',
    description:
      'After months of hard work, a student lands their first job. There is excitement, a new beginning, and one big question: where will I live?',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
    alt: 'Young professionals preparing for a new chapter in their careers',
    icon: Heart,
  },
  {
    number: '02',
    label: 'The struggle',
    title: 'Finding a room becomes a job of its own.',
    description:
      'Endless listings, confusing prices, distant locations and unanswered questions. Every option seems to come with another compromise.',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    alt: 'A thoughtfully arranged workspace representing the effort of planning a move',
    icon: Search,
  },
  {
    number: '03',
    label: 'A little less alone',
    title: 'Finding a place should feel more human.',
    description:
      'With sthero, the search starts with what matters to you: your location, your budget and the kind of living experience you want.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    alt: 'A welcoming home with warm natural materials',
    icon: Heart,
  },
];

const challengesList = [
  'Security fee not returned',
  'Fake or misleading listings',
  'High rent or hidden charges',
  'Finding a place near college or work',
  'Uncomfortable living conditions',
  'Safety and security concerns',
  'Finding compatible flatmates',
  'Feeling lonely in a new city',
  'Unclear rules or restrictions',
  'Difficulty comparing options',
  'Finding a trustworthy PG',

];

type JourneyStage = 'searching' | 'found' | 'moved';

const initialFeedback = {
  journeyStage: 'searching' as JourneyStage,
  challenges: [] as string[],
  city: '',
  experience: '',
  suggestion: '',
  consentAnonymized: false,
};

const easing = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [activeHero, setActiveHero] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [activePhrase, setActivePhrase] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [feedbackError, setFeedbackError] = useState('');

  const scrollToOnboarding = useCallback(() => {
    navigate('/get-started');
  }, [navigate]);

  const scrollToFeedback = useCallback(() => {
    window.setTimeout(() => {
      document.getElementById('share-experience')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 50);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActivePhrase((current) => (current + 1) % searchPhrases.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');

    if (!mediaQuery.matches || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % journeySteps.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const nextStep = useCallback(() => {
    setActiveStep((current) => (current + 1) % journeySteps.length);
  }, []);

  const previousStep = useCallback(() => {
    setActiveStep(
      (current) => (current - 1 + journeySteps.length) % journeySteps.length,
    );
  }, []);

  const showNextStory = useCallback(() => {
    setActiveStory((current) => (current + 1) % storySteps.length);
  }, []);

  const showPreviousStory = useCallback(() => {
    setActiveStory(
      (current) => (current - 1 + storySteps.length) % storySteps.length,
    );
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    if (!mediaQuery.matches || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % storySteps.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const toggleChallenge = (challenge: string) => {
    setFeedback((previous) => {
      const selected = previous.challenges.includes(challenge);

      if (selected) {
        return {
          ...previous,
          challenges: previous.challenges.filter((item) => item !== challenge),
        };
      }

      if (previous.challenges.length >= 8) return previous;

      return {
        ...previous,
        challenges: [...previous.challenges, challenge],
      };
    });

    setFeedbackError('');
  };

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackError('');

    if (feedback.challenges.length === 0) {
      setFeedbackError('Please select at least one challenge.');
      return;
    }

    if (!feedback.consentAnonymized) {
      setFeedbackError(
        'Please confirm that your feedback can be used anonymously.',
      );
      return;
    }

    setFeedbackStatus('loading');

    try {
      const { error } = await supabase.from('user_feedback').insert({
        journey_stage: feedback.journeyStage,
        challenges: feedback.challenges,
        city: feedback.city.trim() || null,
        experience: feedback.experience.trim() || null,
        suggestion: feedback.suggestion.trim() || null,
        consent_anonymized: feedback.consentAnonymized,
      });

      if (error) throw error;

      setFeedback(initialFeedback);
      setFeedbackStatus('success');
    } catch (error) {
      console.error('Unable to submit user feedback:', error);
      setFeedbackStatus('error');
      setFeedbackError(
        'We could not submit your feedback right now. Please try again.',
      );
    }
  };

  const motionInitial = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 24 };

  const motionVisible = {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easing },
  };

  return (
    <main className="overflow-hidden bg-[#faf8f2] text-[#30291f]">
      {/* HERO */}

      <section className="relative isolate flex min-h-[760px] h-[100svh] max-h-[1100px] w-full items-center justify-center overflow-hidden bg-[#302016]">
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeHero].src}
              src={heroImages[activeHero].src}
              alt={heroImages[activeHero].alt}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: prefersReducedMotion ? 0 : 1.2 },
                scale: { duration: 6.5, ease: 'linear' },
              }}
              fetchPriority={activeHero === 0 ? 'high' : 'auto'}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-[#24190f]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b140f]/70 via-[#24170e]/35 to-[#24170e]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b120d]/75 via-transparent to-[#24170e]/25" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-24 pt-12 text-center sm:px-8 sm:pb-28">
          <motion.div
            initial={motionInitial}
            animate={motionVisible}
            className="flex w-full flex-col items-center"
          >

            <h1 className="max-w-4xl font-display text-[39px] font-semibold leading-[1.08] tracking-[-0.045em] text-balance text-white drop-shadow-[0_3px_20px_rgba(0,0,0,0.25)] sm:text-5xl md:text-6xl lg:text-[76px]">
              Your Next Big Move
              <br className="hidden sm:block" /> Deserves a Better Start.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base md:text-lg">
              Moving for college or work? Tell us what you need and discover
              a more personal, informed way to find your next place to live.
            </p>

            <div className="mt-8 flex w-full max-w-[360px] flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <motion.button
                type="button"
                onClick={scrollToOnboarding}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#fffaf0] px-6 py-3.5 text-sm font-semibold text-[#30251b] shadow-xl transition-colors hover:bg-white sm:w-auto sm:px-7 sm:text-base"
              >
                <HomeIcon className="h-[19px] w-[19px] shrink-0" />
                <span>Share Your Housing Needs</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                type="button"
                onClick={scrollToFeedback}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border border-white/50 bg-black/15 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15 sm:w-auto sm:px-7 sm:text-base"
              >
                <MessageSquareText className="h-[19px] w-[19px] shrink-0" />
                <span>Share Your Experience</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/80 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <BedDouble className="h-4 w-4" />
                PGs and rooms
              </span>
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Shared accommodation
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                College and work
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={motionInitial}
          animate={motionVisible}
          transition={{ delay: 0.25 }}
          className="absolute bottom-[72px] left-5 z-20 w-[min(320px,calc(100%-40px))] text-left sm:bottom-20 sm:left-8 lg:bottom-24 lg:left-12 xl:left-[max(48px,calc((100vw-1400px)/2))]"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={searchPhrases[activePhrase]}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="min-h-[30px] font-display text-lg font-semibold leading-snug text-white drop-shadow-md sm:text-xl"
            >
              {searchPhrases[activePhrase]}
            </motion.p>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-2 text-xs text-white/75">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>Find a place that fits your life</span>
          </div>
        </motion.div>

        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 sm:bottom-7 sm:right-8 lg:right-12">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
              aria-current={activeHero === index ? 'true' : undefined}
              onClick={() => setActiveHero(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${activeHero === index
                  ? 'w-8 bg-white'
                  : 'w-1.5 bg-white/55 hover:bg-white/90'
                }`}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf8f2] to-transparent" />
      </section>

      {/* SECOND SECTION — FIVE STEPS */}

      <section
        id="how-sthero-works"
        className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="pointer-events-none absolute -left-32 top-28 h-72 w-72 rounded-full bg-[#dfe5d7]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#eee1cd]/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#78866b] sm:text-xs">
                A better way to find your place
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] text-balance sm:text-4xl lg:text-6xl">
                Find your place.
                <br className="hidden sm:block" /> Feel more at home.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#756d61] sm:text-base lg:text-lg">
                Finding accommodation shouldn't feel like guesswork. Start
                with your needs, explore your options and make your next move
                with more clarity.
              </p>
            </div>
          </ScrollReveal>

          {/* MOBILE STEP CAROUSEL */}

          <div className="sm:hidden">
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={activeStep}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, x: 36, scale: 0.985 }
                  }
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 0, x: -36, scale: 0.985 }
                  }
                  transition={{ duration: 0.35, ease: easing }}
                  className="overflow-hidden rounded-[26px] border border-[#76634d]/10 bg-white shadow-[0_18px_60px_rgba(54,43,29,0.08)]"
                >
                  {(() => {
                    const step = journeySteps[activeStep];
                    const Icon = step.icon;

                    return (
                      <>
                        <div className="relative aspect-[5/4] overflow-hidden bg-[#e7d6c0]">
                          <motion.img
                            key={step.image}
                            src={step.image}
                            alt={step.alt}
                            initial={
                              prefersReducedMotion ? false : { scale: 1.04 }
                            }
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7 }}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#241a12]/70 via-transparent to-[#241a12]/5" />

                          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-[#433326] backdrop-blur-md">
                            STEP {step.number}
                          </span>

                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                                {step.eyebrow}
                              </p>
                              <p className="mt-1 font-display text-xl font-semibold">
                                {step.visualLabel}
                              </p>
                            </div>
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md">
                              <Icon className="h-5 w-5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#78866b]">
                            {step.number} / 05
                          </p>

                          <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.025em] text-[#30291f]">
                            {step.title}
                          </h3>

                          <p className="mt-3 text-sm leading-relaxed text-[#756d61]">
                            {step.description}
                          </p>

                          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f3f2e9] p-3.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#78866b]">
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            </span>
                            <p className="text-xs leading-relaxed text-[#625e52]">
                              {step.visualDetail}
                            </p>
                          </div>

                          {activeStep === 0 && (
                            <button
                              type="button"
                              onClick={scrollToOnboarding}
                              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#78866b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#30291f]"
                            >
                              Tell us what you need
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={previousStep}
                aria-label="Previous step"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#30291f] transition hover:bg-[#f0eee5]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {journeySteps.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    aria-label={`Show step ${index + 1}`}
                    aria-current={activeStep === index ? 'step' : undefined}
                    onClick={() => setActiveStep(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === index
                        ? 'w-8 bg-[#78866b]'
                        : 'w-1.5 bg-[#78866b]/30'
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextStep}
                aria-label="Next step"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#30291f] transition hover:bg-[#f0eee5]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-[#82796c]">
              Swipe through the journey · {activeStep + 1} of 5
            </p>
          </div>

          {/* DESKTOP FIVE-STEP GRID */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.11 },
              },
            }}
            className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-3 xl:grid-cols-5"
          >
            {journeySteps.map((step) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  variants={{
                    hidden: { opacity: 0, y: 28 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: easing },
                    },
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -7 }}
                  className="group flex h-full flex-col overflow-hidden rounded-[23px] border border-[#76634d]/10 bg-white shadow-[0_8px_30px_rgba(54,43,29,0.035)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(54,43,29,0.11)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e7d6c0]">
                    <motion.img
                      src={step.image}
                      alt={step.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={
                        prefersReducedMotion ? undefined : { scale: 1.06 }
                      }
                      transition={{ duration: 0.65 }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#241a12]/65 via-transparent to-transparent" />

                    <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-[#fffaf2]/90 px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-[#433326] backdrop-blur-md">
                      STEP {step.number}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.13em]">
                        {step.eyebrow}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 lg:p-5">
                    <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.025em] text-[#30291f]">
                      {step.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#756d61]">
                      {step.description}
                    </p>

                    <div className="mt-5 border-t border-[#76634d]/10 pt-4">
                      <p className="text-xs font-medium leading-relaxed text-[#78866b]">
                        {step.visualDetail}
                      </p>

                      {step.number === '01' && (
                        <button
                          type="button"
                          onClick={scrollToOnboarding}
                          className="group/cta mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#30291f] transition-colors hover:text-[#78866b]"
                        >
                          Get started
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <ScrollReveal delay={0.12}>
            <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[24px] border border-[#78866b]/15 bg-[#f0f0e7] px-5 py-6 sm:mt-16 sm:flex-row sm:px-8 sm:py-7">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#78866b] shadow-sm">
                  <Heart className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold sm:text-xl">
                    Because a place is more than four walls.
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#756d61]">
                    It is where your next chapter begins. We want your
                    accommodation search to feel more personal, informed and
                    human.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToOnboarding}
                className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#78866b] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#30291f] sm:w-auto"
              >
                Share Your Housing Needs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COMING SOON — AFTER THE FIVE-STEP SECTION */}

      <section
        id="coming-soon"
        className="relative isolate overflow-hidden bg-[#252c23] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12 lg:py-32"
      >
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#829477]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#d9b88b]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <ScrollReveal>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d5dfca] sm:text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b7cba4] opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b7cba4]" />
                  </span>
                  The next chapter is coming
                </span>

                <h2 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-balance sm:text-5xl lg:text-[64px]">
                  Your housing search is about to feel different.
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg">
                  We're building sthero to make finding accommodation less
                  confusing and more personal. A place to start with your
                  needs, explore relevant options and feel better prepared
                  before you move.
                </p>

                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: easing, delay: 0.12 }}
                  className="mt-9 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-3"
                >
                  <motion.button
                    type="button"
                    onClick={scrollToOnboarding}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#e5e9dc] px-6 py-3.5 text-sm font-semibold text-[#252c23] transition-all hover:bg-white"
                  >
                    Tell us what you need
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={scrollToFeedback}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
                  >
                    Help us build better
                    <MessageSquareText className="h-4 w-4" />
                  </motion.button>
                </motion.div>

                <p className="mt-5 text-xs leading-relaxed text-white/45">
                  Your needs and real experiences will help inform the
                  experience we're building.
                </p>
              </div>
            </ScrollReveal>

            {/* ANIMATED HOUSING EXPERIENCE VISUAL */}

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: easing }}
              className="relative mx-auto w-full max-w-[540px]"
            >
              <div className="absolute -inset-5 rounded-[36px] bg-[#a3b295]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#343c30] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:rounded-[34px] sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div>
                    <p className="font-display text-xl font-semibold tracking-tight">
                      Your next place
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      Designed around what matters to you
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e1e8d7]/10 text-[#d9e5cc]">
                    <House className="h-5 w-5" />
                  </span>
                </div>

                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { y: [0, -4, 0] }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="mt-5 rounded-2xl border border-white/10 bg-[#41483b] p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4e9db] text-[#3d4937]">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Your priorities</p>
                      <p className="mt-0.5 text-xs text-white/50">
                        Start with your everyday needs
                      </p>
                    </div>
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-[#c3d7ae]" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: 'My budget', icon: Wallet },
                      { label: 'My location', icon: MapPin },
                      { label: 'My lifestyle', icon: Heart },
                    ].map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <motion.span
                          key={item.label}
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, y: 8 }
                          }
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: prefersReducedMotion ? 0 : index * 0.12,
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] text-white/80"
                        >
                          <Icon className="h-3.5 w-3.5 text-[#c3d7ae]" />
                          {item.label}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>

                <div className="my-4 flex items-center justify-center gap-3 text-[#c3d7ae]/75">
                  <div className="h-px flex-1 bg-white/10" />
                  <motion.div
                    animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.17em]">
                    A better way forward
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#41483b]"
                  >
                    <div className="relative h-28 overflow-hidden sm:h-36">
                      <img
                        src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=650&q=80"
                        alt="Comfortable bedroom for student accommodation"
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#20261f]/75 to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-[#30382c]">
                        YOUR KIND OF SPACE
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold">A place that fits</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-white/50">
                        Accommodation aligned with your needs
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#41483b]"
                  >
                    <div className="relative h-28 overflow-hidden sm:h-36">
                      <img
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=650&q=80"
                        alt="People connecting and sharing local knowledge"
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#20261f]/75 to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-[#30382c]">
                        LOCAL INSIGHTS
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold">More than a listing</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-white/50">
                        Understand the place and its surroundings
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#c3d7ae]/15 bg-[#c3d7ae]/[0.07] p-3.5 sm:p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c3d7ae]/10 text-[#c3d7ae]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold sm:text-sm">
                      More clarity. Better decisions.
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/50 sm:text-xs">
                      Know more about your options before you take the next
                      step.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                animate={
                  prefersReducedMotion ? undefined : { y: [0, -8, 0] }
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -right-2 top-16 hidden rounded-2xl border border-white/15 bg-[#f6f4eb] p-3 text-[#30382c] shadow-xl sm:-right-5 sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0e6d6]">
                    <MapPin className="h-4 w-4 text-[#78866b]" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Your location</p>
                    <p className="mt-0.5 text-[10px] text-[#817a6e]">
                      Your priorities, first
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={
                  prefersReducedMotion ? undefined : { y: [0, 7, 0] }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4,
                }}
                className="absolute -bottom-4 -left-2 hidden rounded-2xl border border-[#e7e4d8] bg-[#faf8f2] p-3 text-[#30382c] shadow-xl sm:-left-5 sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0e6d6]">
                    <Heart className="h-4 w-4 text-[#78866b]" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Your next chapter</p>
                    <p className="mt-0.5 text-[10px] text-[#817a6e]">
                      Find a place to belong
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* THE PROBLEMS WE WANT TO SOLVE */}

          <div className="mt-20 border-t border-white/10 pt-14 sm:mt-28 sm:pt-20">
            <ScrollReveal>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c3d7ae] sm:text-xs">
                  Built around real needs
                </p>
                <h3 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">
                  The challenges you face should shape the experience we build.
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                  Everyone's housing search is different. We want to
                  understand what gets in your way so sthero can focus on the
                  things that matter most.
                </p>
              </div>
            </ScrollReveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
            >
              {[
                {
                  icon: ShieldCheck,
                  title: 'Trust and transparency',
                  text: 'Make it easier to understand what you are considering before committing.',
                },
                {
                  icon: Wallet,
                  title: 'Budget that works',
                  text: 'Keep your rent, budget and everyday costs in the picture.',
                },
                {
                  icon: Navigation,
                  title: 'A location that fits',
                  text: 'Consider the places you need to reach and your daily routine.',
                },
                {
                  icon: Handshake,
                  title: 'People and local insight',
                  text: 'Learn from relevant community connections where available.',
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <motion.article
                    key={item.title}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.55, ease: easing },
                      },
                    }}
                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition-colors hover:bg-white/[0.075] sm:p-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c3d7ae]/10 text-[#c3d7ae]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {item.text}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>

            <ScrollReveal delay={0.1}>
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:flex-row sm:p-7">
                <div className="flex items-start gap-3">
                  <Quote className="mt-1 h-5 w-5 shrink-0 text-[#c3d7ae]" />
                  <p className="max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                    Your experience matters. Tell us what was difficult,
                    what helped and what you wish existed. It will help us
                    understand what a better housing experience should look
                    like.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={scrollToFeedback}
                  className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#e5e9dc] px-6 py-3 text-sm font-semibold text-[#252c23] transition-colors hover:bg-white sm:w-auto"
                >
                  Share your experience
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHY STHERO */}

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[26px] bg-[#e6dece]">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1300&q=85"
                alt="A comfortable, thoughtfully arranged bedroom"
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21180f]/45 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/30 bg-white/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e4e8dc] text-[#78866b]">
                    <Heart className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-base font-bold sm:text-lg">
                      Your life. Your priorities.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#756d61] sm:text-sm">
                      A more human approach to finding a place to live.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#78866b] sm:text-xs">
                Why sthero
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl">
                Finding a place should feel like a new beginning.
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-[#756d61] sm:text-base lg:text-lg">
                Moving to another city comes with enough changes already.
                Finding accommodation should not add unnecessary stress.
                We want to make the journey more thoughtful by understanding
                your needs, helping you explore suitable options and
                encouraging informed decisions.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  {
                    icon: Search,
                    title: 'Start with what matters to you',
                    text: 'Your budget, location and everyday needs come first.',
                  },
                  {
                    icon: Compass,
                    title: 'Explore with more clarity',
                    text: 'Consider your options before deciding where to live.',
                  },
                  {
                    icon: Users,
                    title: 'Feel more connected',
                    text: 'Benefit from relevant local insights where connections are available.',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9ebdf] text-[#78866b]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#30291f] sm:text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-[#756d61]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={scrollToOnboarding}
                className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#78866b] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#30291f]"
              >
                Share Your Housing Needs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* THE STORY — RESTORED MOBILE CAROUSEL + DESKTOP EDITORIAL LAYOUT */}

      <section className="bg-[#f0ede4] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14 lg:mb-16">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#78866b] sm:text-xs">
                The story behind every move
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] text-balance sm:text-4xl lg:text-6xl">
                A story that feels familiar.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#756d61] sm:text-base lg:text-lg">
                A new city brings new possibilities. Finding somewhere to live
                should help you look forward to them, not make the first step harder.
              </p>
            </div>
          </ScrollReveal>

          {/* MOBILE STORY CAROUSEL */}

          <div className="sm:hidden">
            <div className="overflow-hidden rounded-[26px] border border-[#76634d]/10 bg-white shadow-[0_18px_60px_rgba(54,43,29,0.08)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={activeStory}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: -28 }}
                  transition={{ duration: 0.35, ease: easing }}
                >
                  {(() => {
                    const step = storySteps[activeStory];
                    const Icon = step.icon;

                    return (
                      <>
                        <div className="relative aspect-[5/4] overflow-hidden bg-[#e7d6c0]">
                          <motion.img
                            src={step.image}
                            alt={step.alt}
                            initial={prefersReducedMotion ? false : { scale: 1.04 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7 }}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#241a12]/70 via-transparent to-transparent" />

                          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-[#433326] backdrop-blur-md">
                            CHAPTER {step.number}
                          </span>

                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                            <p className="font-display text-xl font-semibold">
                              {step.label}
                            </p>

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md">
                              <Icon className="h-5 w-5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.025em] text-[#30291f]">
                            {step.title}
                          </h3>

                          <p className="mt-3 text-sm leading-relaxed text-[#756d61]">
                            {step.description}
                          </p>

                          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f3f2e9] p-3.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#78866b]">
                              <Quote className="h-4 w-4" />
                            </span>

                            <p className="text-xs leading-relaxed text-[#625e52]">
                              Every move deserves a more thoughtful beginning.
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={showPreviousStory}
                aria-label="Previous story chapter"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#30291f] transition hover:bg-[#e7e3d8]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {storySteps.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    aria-label={`Show story chapter ${index + 1}`}
                    aria-current={activeStory === index ? 'step' : undefined}
                    onClick={() => setActiveStory(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeStory === index
                        ? 'w-8 bg-[#78866b]'
                        : 'w-1.5 bg-[#78866b]/30'
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={showNextStory}
                aria-label="Next story chapter"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#30291f] transition hover:bg-[#e7e3d8]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-[#82796c]">
              {String(activeStory + 1).padStart(2, '0')} of 03 · The journey to a
              place of your own
            </p>
          </div>

          {/* DESKTOP STORY CARDS */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="hidden gap-5 sm:grid sm:grid-cols-3"
          >
            {storySteps.map((step) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: easing },
                    },
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  className="group overflow-hidden rounded-[24px] border border-[#76634d]/10 bg-white shadow-[0_8px_30px_rgba(54,43,29,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(54,43,29,0.10)]"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#e7d6c0]">
                    <motion.img
                      src={step.image}
                      alt={step.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={
                        prefersReducedMotion ? undefined : { scale: 1.05 }
                      }
                      transition={{ duration: 0.65 }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#241a12]/70 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-[#433326] backdrop-blur-md">
                      CHAPTER {step.number}
                    </span>

                    <span className="absolute bottom-4 left-4 font-display text-xl font-semibold text-white">
                      {step.label}
                    </span>
                  </div>

                  <div className="p-5 lg:p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8e0d2] text-[#78866b]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold leading-snug tracking-[-0.025em] text-[#30291f]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#756d61]">
                      {step.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <ScrollReveal delay={0.12}>
            <div className="mt-10 flex flex-col items-center gap-3 text-center sm:mt-14">
              <p className="max-w-xl text-sm leading-relaxed text-[#756d61] sm:text-base">
                Because a place is more than four walls. It&apos;s where your next
                chapter begins.
              </p>

              <motion.button
                type="button"
                onClick={scrollToFeedback}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[#78866b]/35 px-6 py-3 text-sm font-semibold text-[#394333] transition-all duration-300 hover:border-[#78866b] hover:bg-white"
              >
                Share your story with sthero
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SHARE YOUR EXPERIENCE FORM */}


      <section
        id="share-experience"
        className="scroll-mt-5 bg-[#efeee5] px-5 py-16 sm:scroll-mt-8 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">

          {/* FORM CARD — FIRST ON MOBILE, LEFT ON DESKTOP */}

          <ScrollReveal
            className="order-1 lg:col-span-7"
          >
            <div className="rounded-[26px] border border-black/5 bg-[#faf8f2] p-5 shadow-[0_12px_50px_rgba(54,43,29,0.05)] sm:rounded-[30px] sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {feedbackStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 18 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: easing }}
                    role="status"
                    className="flex min-h-[480px] flex-col items-center justify-center py-8 text-center"
                  >
                    <motion.div
                      initial={
                        prefersReducedMotion
                          ? false
                          : { scale: 0.65, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.55,
                        ease: easing,
                        delay: prefersReducedMotion ? 0 : 0.08,
                      }}
                      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#e4e9db]"
                    >
                      <span className="absolute inset-[-7px] rounded-full border border-[#78866b]/20" />
                      <CheckCircle2 className="h-10 w-10 text-[#78866b]" />
                    </motion.div>

                    <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#78866b] sm:text-xs">
                      Your voice has been heard
                    </p>

                    <h3 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-[#30291f] sm:text-4xl">
                      Thanks for sharing your story!
                    </h3>

                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[#756d61] sm:text-base">
                      Your experience will help us understand the real
                      challenges of finding a place to live and build a
                      better housing experience with Sthero.
                    </p>

                    <div className="mt-7 w-full max-w-md rounded-2xl border border-[#78866b]/15 bg-[#f0f0e7] p-5 text-left">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#78866b]">
                          <Heart className="h-5 w-5" />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-[#30291f]">
                            Every experience matters.
                          </p>

                          <p className="mt-1 text-sm leading-relaxed text-[#756d61]">
                            Thank you for helping us make the search for
                            accommodation more thoughtful and human.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackStatus('idle');
                        setFeedbackError('');
                      }}
                      className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#efeee5]"
                    >
                      Share another response
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 12 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={submitFeedback}
                    className="space-y-7 sm:space-y-8"
                  >
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78866b] sm:text-xs">
                        YOUR EXPERIENCE
                      </span>

                      <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
                        Help us understand your journey.
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[#756d61]">
                        A few details can help us understand what people
                        experience when searching for a place to live.
                      </p>
                    </div>

                    {/* JOURNEY STAGE */}

                    <fieldset>
                      <legend className="mb-3 text-sm font-semibold">
                        Where are you in your housing journey?
                      </legend>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                          {
                            value: 'searching' as const,
                            label: 'Still searching',
                            icon: Search,
                          },
                          {
                            value: 'found' as const,
                            label: 'Found a place',
                            icon: CheckCircle2,
                          },
                          {
                            value: 'moved' as const,
                            label: 'Already moved',
                            icon: HomeIcon,
                          },
                        ].map((stage) => {
                          const Icon = stage.icon;
                          const selected =
                            feedback.journeyStage === stage.value;

                          return (
                            <button
                              key={stage.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                setFeedback((previous) => ({
                                  ...previous,
                                  journeyStage: stage.value,
                                }));
                              }}
                              className={`flex min-h-[94px] flex-col items-start justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${selected
                                  ? 'border-[#78866b] bg-[#e9eddf] shadow-sm'
                                  : 'border-black/10 bg-white hover:border-[#78866b]/50'
                                }`}
                            >
                              <Icon
                                className={`h-5 w-5 ${selected
                                    ? 'text-[#78866b]'
                                    : 'text-[#918779]'
                                  }`}
                              />

                              <span className="flex w-full items-center justify-between gap-1 text-xs font-semibold sm:text-sm">
                                {stage.label}

                                {selected && (
                                  <Check className="h-4 w-4 shrink-0 text-[#78866b]" />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* CHALLENGES */}

                    <fieldset>
                      <legend className="text-sm font-semibold">
                        What challenges have you faced?
                        <span className="ml-1 font-normal text-[#82796c]">
                          (Select up to 8)
                        </span>
                      </legend>

                      <p className="mt-1 text-xs leading-relaxed text-[#82796c]">
                        Choose all the issues that apply to your experience.
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {challengesList.map((challenge) => {
                          const checked =
                            feedback.challenges.includes(challenge);

                          const disabled =
                            !checked && feedback.challenges.length >= 8;

                          return (
                            <label
                              key={challenge}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${checked
                                  ? 'border-[#78866b] bg-[#e9eddf]'
                                  : 'border-black/10 bg-white hover:border-[#78866b]/50'
                                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
                                onChange={() => toggleChallenge(challenge)}
                                className="mt-0.5 h-4 w-4 shrink-0 accent-[#78866b]"
                              />

                              <span className="text-sm leading-relaxed">
                                {challenge}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <p className="mt-3 text-xs text-[#82796c]">
                        {feedback.challenges.length} of 8 selected
                      </p>
                    </fieldset>

                    {/* CITY */}

                    <div>
                      <label
                        htmlFor="feedback-city"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Which city are you looking in or living in?
                        <span className="ml-1 font-normal text-[#82796c]">
                          (Optional)
                        </span>
                      </label>

                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#82796c]" />

                        <input
                          id="feedback-city"
                          type="text"
                          maxLength={100}
                          value={feedback.city}
                          onChange={(event) =>
                            setFeedback((previous) => ({
                              ...previous,
                              city: event.target.value,
                            }))
                          }
                          placeholder="e.g. Delhi, Bengaluru, Pune"
                          className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#78866b] focus:ring-2 focus:ring-[#78866b]/15"
                        />
                      </div>
                    </div>

                    {/* PERSONAL EXPERIENCE */}

                    <div>
                      <label
                        htmlFor="feedback-experience"
                        className="mb-2 block text-sm font-semibold"
                      >
                        What happened? Tell us your story.
                        <span className="ml-1 font-normal text-[#82796c]">
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        id="feedback-experience"
                        value={feedback.experience}
                        onChange={(event) =>
                          setFeedback((previous) => ({
                            ...previous,
                            experience: event.target.value,
                          }))
                        }
                        maxLength={3000}
                        rows={5}
                        placeholder="What was difficult, frustrating or different from what you expected?"
                        className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm leading-relaxed outline-none transition focus:border-[#78866b] focus:ring-2 focus:ring-[#78866b]/15"
                      />

                      <p className="mt-1 text-right text-xs text-[#82796c]">
                        {feedback.experience.length}/3000
                      </p>
                    </div>

                    {/* SUGGESTIONS */}

                    <div>
                      <label
                        htmlFor="feedback-suggestion"
                        className="mb-2 block text-sm font-semibold"
                      >
                        What would make this experience better?
                        <span className="ml-1 font-normal text-[#82796c]">
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        id="feedback-suggestion"
                        value={feedback.suggestion}
                        onChange={(event) =>
                          setFeedback((previous) => ({
                            ...previous,
                            suggestion: event.target.value,
                          }))
                        }
                        maxLength={2000}
                        rows={3}
                        placeholder="What do you wish existed when you were looking for a place?"
                        className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm leading-relaxed outline-none transition focus:border-[#78866b] focus:ring-2 focus:ring-[#78866b]/15"
                      />

                      <p className="mt-1 text-right text-xs text-[#82796c]">
                        {feedback.suggestion.length}/2000
                      </p>
                    </div>

                    {/* CONSENT */}

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#efeee5] p-4">
                      <input
                        type="checkbox"
                        checked={feedback.consentAnonymized}
                        onChange={(event) =>
                          setFeedback((previous) => ({
                            ...previous,
                            consentAnonymized: event.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-[#78866b]"
                      />

                      <span className="text-sm leading-relaxed text-[#756d61]">
                        I agree that sthero may use my feedback anonymously
                        to understand accommodation challenges and improve
                        its services. I understand that this does not
                        authorize publication of my written story as a
                        personal testimonial.
                      </span>
                    </label>

                    {/* ERRORS */}

                    <AnimatePresence>
                      {feedbackError && (
                        <motion.p
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, y: -5 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          role="alert"
                          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-700"
                        >
                          {feedbackError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {feedbackStatus === 'error' && (
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackStatus('idle');
                          setFeedbackError('');
                        }}
                        className="text-sm font-medium text-[#78866b] underline underline-offset-4"
                      >
                        Try again
                      </button>
                    )}

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={feedbackStatus === 'loading'}
                      className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#78866b] px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#30291f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {feedbackStatus === 'loading' ? (
                        <>
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          Sending your feedback...
                        </>
                      ) : (
                        <>
                          Share your experience
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs leading-relaxed text-[#82796c]">
                      No name or email is requested in this form. Please
                      avoid including sensitive personal information in
                      your story.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>

          {/* FORM INTRO — SECOND ON MOBILE, RIGHT ON DESKTOP */}

          <ScrollReveal
            delay={0.1}
            className="order-2 lg:sticky lg:top-8 lg:col-span-5"
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#78866b] sm:text-xs">
              Your voice matters
            </p>

            <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl">
              Tell us what finding a place is really like.
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-[#756d61] sm:text-base lg:text-lg">
              Are you still searching? Have you found a place? Or have you
              already experienced the challenges of moving to a new city?
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#756d61] sm:text-base">
              We want to hear the real stories, frustrations and ideas that
              can help us build a better housing experience for students and
              working professionals.
            </p>

            <div className="mt-6 flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#78866b]" />

              <p className="text-sm leading-relaxed text-[#756d61]">
                Your feedback helps us understand what matters most. We
                won't publish your written experience as a testimonial
                without obtaining your permission separately.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#78866b]/15 bg-white/70 p-4">
                <MessageSquareText className="h-5 w-5 text-[#78866b]" />

                <p className="mt-3 text-sm font-semibold">
                  Real experiences
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[#756d61]">
                  Tell us what actually happened.
                </p>
              </div>

              <div className="rounded-2xl border border-[#78866b]/15 bg-white/70 p-4">
                <Heart className="h-5 w-5 text-[#78866b]" />

                <p className="mt-3 text-sm font-semibold">
                  Better housing
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[#756d61]">
                  Help shape what comes next.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* CLOSING CTA */}

      <section className="relative isolate flex min-h-[540px] w-full items-center justify-center overflow-hidden sm:min-h-[620px]">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85"
          alt="Warm and welcoming living space"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#241a12]/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241a12]/65 via-transparent to-[#241a12]/30" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28">
          <ScrollReveal>
            

            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-balance text-white sm:text-5xl lg:text-7xl">
              Your next chapter starts here.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
              We're working towards a better housing experience. Help us
              understand what you need, and be part of the journey.
            </p>
          </ScrollReveal>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: easing, delay: 0.12 }}
            className="mt-8 flex w-full flex-col items-center gap-6 sm:mt-9 sm:gap-5"
          >
            <motion.button
              type="button"
              onClick={scrollToOnboarding}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-[54px] w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#faf8f2] px-7 py-4 text-sm font-semibold text-[#30291f] transition-all hover:bg-[#e2e7d8] sm:w-auto sm:max-w-none sm:text-base"
            >
              Share Your Housing Needs
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              type="button"
              onClick={scrollToFeedback}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-white/85 underline decoration-white/35 underline-offset-4 transition-colors hover:text-white"
            >
              Or share your experience
              <MoveRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}