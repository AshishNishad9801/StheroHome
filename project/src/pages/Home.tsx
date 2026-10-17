
import {
  useCallback,
  useEffect,
  useRef,
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
  ArrowUpRight,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  Building2,
  BedDouble,
  Wallet,
  Navigation,
  Compass,
  Handshake,
  SearchIcon,
  Check,
  Quote,
  MoveRight,
} from 'lucide-react';

import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/lib/supabase';
import journeyImage1 from '@/assets/1.png';
import journeyImage2 from '@/assets/2.png';
import journeyImage3 from '@/assets/3.png';
import journeyImage4 from '@/assets/4.png';
import journeyImage5 from '@/assets/5.png';
const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=85',
    alt: 'Warm and welcoming shared living space',
  },
  {
    src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=2200&q=85',
    alt: 'Comfortable modern bedroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=85',
    alt: 'Cosy bedroom with warm lighting',
  },
  {
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85',
    alt: 'Thoughtfully furnished living space',
  },
];

const searchPhrases = [
  'Looking for a PG near your college?',
  'Moving to Delhi for your first job?',
  'Looking for budget friendly options?',
  'Starting a new chapter in a new city?',
  'Looking for a place to make it home?',
];

const journeySteps = [
  {
    number: '01',
    eyebrow: 'START WITH YOU',
    title: 'Start with you.',
    description:
      'Tell us where you want to live, your budget, lifestyle and what matters most in your next place.',
    image: journeyImage1,
    alt: 'A thoughtfully arranged workspace',
    icon: Users,
    visualLabel: 'Your housing profile',
    visualDetail: 'Your needs. Your budget. Your next chapter.',
  },
  {
    number: '02',
    eyebrow: 'FIND YOUR FIT',
    title: 'Find a place that fits your life.',
    description:
      'Explore accommodation options that align with your budget, preferred location and everyday needs.',
    image: journeyImage2,
    alt: 'A comfortable modern bedroom',
    icon: Search,
    visualLabel: 'Options that fit you',
    visualDetail: 'PGs, rooms and shared accommodation.',
  },
  {
    number: '03',
    eyebrow: 'LOCAL KNOWLEDGE',
    title: 'Get insights from people who know.',
    description:
      'Get practical insights and advices from alumni, people from your region and residents who are familiar with the property and neighbourhood.',
    image: journeyImage3,
    alt: 'Friends connecting and sharing experiences',
    icon: Users,
    visualLabel: 'People who understand',
    visualDetail: 'Local knowledge. Shared experiences.',
  },
  {
    number: '04',
    eyebrow: 'MAKE AN INFORMED CHOICE',
    title: 'Shortlist. Visit. See for yourself.',
    description:
      'Compare suitable options, clarify your questions and visit shortlisted properties before making your choice.',
    image: journeyImage4,
    alt: 'A welcoming furnished room',
    icon: MapPin,
    visualLabel: 'Your shortlist',
    visualDetail: 'Compare options. Ask questions. Visit.',
  },
  {
    number: '05',
    eyebrow: 'YOUR NEXT CHAPTER',
    title: 'Move in with more confidence.',
    description:
      'Make your decision with a clearer understanding of the place, its fit for your needs and the insights available to you.',
    image: journeyImage5,
    alt: 'A comfortable bedroom ready to move into',
    icon: Heart,
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
    alt: 'Young professionals preparing for a new chapter',
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
    alt: 'A workspace representing the effort of planning a move',
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

const darkCard =
  'overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#293129] shadow-[0_12px_40px_rgba(0,0,0,0.12)]';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#252c25] px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#a8ba95] focus:ring-2 focus:ring-[#a8ba95]/15';

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <ScrollReveal>
      <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c3d7ae] sm:text-xs">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-balance text-white sm:text-4xl lg:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base lg:text-lg">
          {description}
        </p>
      </div>
    </ScrollReveal>
  );
}

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

  const mobileJourneyRef = useRef<HTMLDivElement>(null);

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
          challenges: previous.challenges.filter(
            (item) => item !== challenge,
          ),
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

  const scrollJourneyTo = (index: number) => {
    const container = mobileJourneyRef.current;
    const card = container?.querySelectorAll<HTMLElement>(
      '[data-journey-card]',
    )[index];

    if (container && card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
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
    <main className="overflow-hidden bg-[#252c25] text-[#f8f6ef]">
      {/* HERO */}
      <section className="relative isolate flex h-[100svh] min-h-[700px] max-h-[1100px] w-full items-center justify-center overflow-hidden bg-[#211b15]">
        <div className="absolute left-5 top-28 z-30 inline-flex items-center gap-2 rounded-full border border-[#c3d7ae]/30 bg-[#333d31]/90 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur-md sm:left-8 sm:top-28 sm:text-sm lg:left-12">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d9e8c9] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d9e8c9]" />
          </span>
          Early Access
        </div>

        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeHero].src}
              src={heroImages[activeHero].src}
              alt={heroImages[activeHero].alt}
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 1.05,
              }}
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

          <div className="absolute inset-0 bg-[#181b15]/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171b15]/75 via-[#211b15]/35 to-[#211b15]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#252c25] via-[#171b15]/10 to-[#171b15]/30" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pb-28">
          <motion.div
            initial={motionInitial}
            animate={motionVisible}
            className="flex w-full flex-col items-center"
          >
            <h1 className="max-w-4xl font-display text-[39px] font-semibold leading-[1.08] tracking-[-0.045em] text-balance text-white drop-shadow-[0_3px_20px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl lg:text-[76px]">
              Your Next Big Move
              <br className="hidden sm:block" /> Deserves a Better Start
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base md:text-lg">
              Moving for job or college? Tell us what you need and discover a
              more personal, informed way to find your next place to live.
            </p>

            <div className="mt-8 flex w-full max-w-[360px] flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <motion.button
                type="button"
                onClick={scrollToOnboarding}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#f8f6ef] px-6 py-3.5 text-sm font-semibold text-[#252c25] shadow-xl transition-colors hover:bg-white sm:w-auto sm:px-7 sm:text-base"
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
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border border-white/40 bg-black/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15 sm:w-auto sm:px-7 sm:text-base"
              >
                <MessageSquareText className="h-[19px] w-[19px] shrink-0" />
                <span>Share Your Experience</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>

            
          </motion.div>
        </div>

        <motion.div
          initial={motionInitial}
          animate={motionVisible}
          transition={{ delay: 0.25 }}
          className="absolute bottom-20 left-5 z-20 w-[min(340px,calc(100%-40px))] text-left sm:bottom-20 sm:left-8 lg:left-12"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={searchPhrases[activePhrase]}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex min-h-[30px] items-center gap-2 font-display text-xs font-semibold leading-snug text-white drop-shadow-md sm:text-base"
            >
              <SearchIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{searchPhrases[activePhrase]}</span>
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <div className="absolute bottom-7 right-5 z-30 flex items-center gap-2 sm:right-8 lg:right-12">
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
      </section>

      {/* ALL MIDDLE CONTENT USES ONE CONTINUOUS DARK BACKGROUND */}
      <div className="relative isolate overflow-hidden bg-[#252c25] text-white">
        <div className="pointer-events-none absolute -left-40 top-[8%] h-96 w-96 rounded-full bg-[#819475]/10 blur-[110px]" />
        <div className="pointer-events-none absolute -right-40 top-[43%] h-96 w-96 rounded-full bg-[#b9a17c]/[0.07] blur-[110px]" />
        <div className="pointer-events-none absolute -left-40 bottom-[12%] h-96 w-96 rounded-full bg-[#819475]/10 blur-[110px]" />

        {/* FIVE-STEP JOURNEY */}
        <section
          id="how-sthero-works"
          className="relative px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="A more thoughtful approach"
              title="This is how we make the journey better."
              description="New city. New opportunities. A place to call your own. Start with what matters to you and make your next move feel a little more like home."
            />

            {/* Mobile carousel */}
            <div className="sm:hidden">
              <div
                ref={mobileJourneyRef}
                onScroll={(event) => {
                  const container = event.currentTarget;
                  const firstCard = container.querySelector<HTMLElement>(
                    '[data-journey-card]',
                  );

                  if (!firstCard) return;

                  const cardWidth = firstCard.getBoundingClientRect().width;
                  const gap = 16;
                  const index = Math.round(
                    container.scrollLeft / (cardWidth + gap),
                  );

                  setActiveStep(
                    Math.max(0, Math.min(journeySteps.length - 1, index)),
                  );
                }}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {journeySteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <article
                      key={step.number}
                      data-journey-card
                      className={`${darkCard} w-[88%] shrink-0 snap-center`}
                    >
                      {/* Balanced 4:3 image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#343b32]">
                        <img
                          src={step.image}
                          alt={step.alt}
                          loading="lazy"
                          className="h-full w-full object-cover brightness-[0.78]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#171d17]/90" />
                        <div className="absolute inset-0 bg-[#182019]/10" />

                        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-[#202820]/75 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white backdrop-blur-md">
                          STEP {step.number}
                        </span>

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d3dfc5]">
                              {step.eyebrow}
                            </p>
                            <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight text-white">
                              {step.visualLabel}
                            </h3>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md">
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                      </div>

                      <div className="flex min-h-[260px] flex-col p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c9a8]">
                          {step.number} / 05
                        </p>

                        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-white">
                          {step.title}
                        </h3>

                        <p className="mt-3 flex-1 text-sm leading-[1.8] text-white/65">
                          {step.description}
                        </p>

                        <div className="mt-5 border-t border-white/10 pt-4">
                          <p className="text-xs leading-relaxed text-[#c3d7ae]">
                            {step.visualDetail}
                          </p>

                          {index === 0 && (
                            <button
                              type="button"
                              onClick={scrollToOnboarding}
                              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#e5e9dc] px-5 py-3 text-sm font-semibold text-[#252c25] transition hover:bg-white"
                            >
                              Tell us what you need
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => scrollJourneyTo(Math.max(0, activeStep - 1))}
                  aria-label="Previous journey step"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
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
                      onClick={() => scrollJourneyTo(index)}
                      className={`h-1.5 rounded-full transition-all ${activeStep === index
                        ? 'w-8 bg-[#c3d7ae]'
                        : 'w-1.5 bg-white/30'
                        }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    scrollJourneyTo(
                      Math.min(journeySteps.length - 1, activeStep + 1),
                    )
                  }
                  aria-label="Next journey step"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-white/45">
                Swipe to explore · {activeStep + 1} of {journeySteps.length}
              </p>
            </div>

            {/* Desktop cards: larger photos, spacious content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-3 xl:grid-cols-5"
            >
              {journeySteps.map((step) => {
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
                    className={`${darkCard} group flex h-full flex-col transition-colors duration-300 hover:border-[#c3d7ae]/25 hover:bg-[#2d362d]`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#343b32]">
                      <motion.img
                        src={step.image}
                        alt={step.alt}
                        loading="lazy"
                        className="h-full w-full object-cover brightness-[0.78] transition-[filter] duration-500 group-hover:brightness-[0.9]"
                        whileHover={
                          prefersReducedMotion ? undefined : { scale: 1.045 }
                        }
                        transition={{ duration: 0.65 }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#171d17]/90 via-[#171d17]/10 to-black/15" />

                      <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-[#202820]/75 px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                        STEP {step.number}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#d3dfc5]">
                          {step.eyebrow}
                        </p>
                        <p className="mt-1 font-display text-lg font-semibold leading-tight text-white">
                          {step.visualLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 lg:p-5">
                      <h3 className="font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-white">
                        {step.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-[1.8] text-white/60">
                        {step.description}
                      </p>

                      <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="text-xs leading-relaxed text-[#c3d7ae]">
                          {step.visualDetail}
                        </p>

                        {step.number === '01' && (
                          <button
                            type="button"
                            onClick={scrollToOnboarding}
                            className="group/cta mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#c3d7ae]"
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
          </div>
        </section>


        {/* WHY STHERO */}
        <section
          id="why-sthero"
          className="relative border-t border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* SECTION LABEL — ABOVE BOTH COLUMNS */}
            <p className="lg:col-span-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c3d7ae] sm:text-xs">
              Why sthero
            </p>


            {/* IMAGE */}
            <ScrollReveal>
              <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
                {/* Main Image Container */}
                <div className="group relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#30392f] shadow-2xl shadow-black/20 sm:rounded-[32px]">

                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85"
                    alt="A comfortable, thoughtfully arranged bedroom"
                    loading="lazy"
                    className="aspect-[5/5] w-full object-cover object-center brightness-[0.82] transition-transform duration-1000 ease-out group-hover:scale-[1.04] sm:aspect-[5/4] lg:aspect-[4/5]"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#171d17]/90" />

                  {/* Top Label */}
                  <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-2 backdrop-blur-md sm:px-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c3d7ae]" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-[10px]">
                        A better way to find home
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7">
                    <div className="rounded-2xl border border-white/15 bg-[#202820]/75 p-4 shadow-lg backdrop-blur-xl sm:rounded-[22px] sm:p-5">
                      <div className="flex items-center gap-3.5 sm:gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c3d7ae]/20 bg-[#c3d7ae]/10 text-[#c3d7ae] sm:h-12 sm:w-12">
                          <Heart className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                            Your life. Your priorities.
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
                            A more human approach to finding a place to live.
                          </p>
                        </div>

                        <div className="ml-auto hidden shrink-0 text-[#c3d7ae]/80 sm:block">
                          <ArrowUpRight className="h-5 w-5" />
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

                {/* Subtle Decorative Accent */}
                <div className="pointer-events-none absolute -bottom-3 -right-3 -z-10 h-24 w-24 rounded-full bg-[#c3d7ae]/10 blur-2xl sm:-bottom-5 sm:-right-5 sm:h-36 sm:w-36" />
              </div>
            </ScrollReveal>


            {/* CONTENT */}
            <ScrollReveal delay={0.12}>
              <div>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-balance text-white sm:text-4xl lg:text-5xl">
                  Finding a place should feel like a new beginning.
                </h2>

                <p className="mt-5 text-sm leading-[1.9] text-white/65 sm:text-base lg:text-lg">
                  Moving to another city comes with enough changes already.
                  Finding accommodation should not add unnecessary stress. We
                  want to make the journey more thoughtful by understanding
                  your needs, helping you explore suitable options and
                  encouraging informed decisions.
                </p>

                <div className="mt-8 space-y-5">
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
                      <div key={item.title} className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c3d7ae]/15 bg-[#c3d7ae]/[0.08] text-[#c3d7ae]">
                          <Icon className="h-5 w-5" />
                        </span>

                        <div>
                          <h3 className="text-sm font-semibold text-white sm:text-base">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/55">
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
                  className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e5e9dc] px-6 py-3 text-sm font-semibold text-[#252c25] transition-colors hover:bg-white"
                >
                  Share Your Housing Needs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </ScrollReveal>

          </div>
        </section>


        {/* OUR STORY */}
        <section
          id="our-story"
          className="relative border-t border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="The story behind every move"
              title="A story that feels familiar."
              description="A new city brings new possibilities. Finding somewhere to live should help you look forward to them, not make the first step harder."
            />

            {/* Mobile story carousel */}
            <div className="sm:hidden">
              <div className={darkCard}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={activeStory}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, x: 24 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReducedMotion ? undefined : { opacity: 0, x: -24 }
                    }
                    transition={{ duration: 0.35, ease: easing }}
                  >
                    {(() => {
                      const step = storySteps[activeStory];
                      const Icon = step.icon;

                      return (
                        <>
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#343b32]">
                            <img
                              src={step.image}
                              alt={step.alt}
                              loading="lazy"
                              className="h-full w-full object-cover brightness-[0.76]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#171d17]/90 via-transparent to-black/15" />

                            <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-[#202820]/75 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white backdrop-blur-md">
                              CHAPTER {step.number}
                            </span>

                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                              <p className="font-display text-xl font-semibold text-white">
                                {step.label}
                              </p>

                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md">
                                <Icon className="h-5 w-5" />
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-white">
                              {step.title}
                            </h3>

                            <p className="mt-3 text-sm leading-[1.8] text-white/65">
                              {step.description}
                            </p>

                            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c3d7ae]/10 text-[#c3d7ae]">
                                <Quote className="h-4 w-4" />
                              </span>
                              <p className="text-xs leading-relaxed text-white/65">
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
                  onClick={() =>
                    setActiveStory(
                      (current) =>
                        (current - 1 + storySteps.length) % storySteps.length,
                    )
                  }
                  aria-label="Previous story chapter"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
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
                      className={`h-1.5 rounded-full transition-all ${activeStory === index
                        ? 'w-8 bg-[#c3d7ae]'
                        : 'w-1.5 bg-white/30'
                        }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveStory((current) => (current + 1) % storySteps.length)
                  }
                  aria-label="Next story chapter"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-white/45">
                {String(activeStory + 1).padStart(2, '0')} of{' '}
                {String(storySteps.length).padStart(2, '0')} · The journey to a
                place of your own
              </p>
            </div>

            {/* Desktop story cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
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
                    className={`${darkCard} group flex h-full flex-col transition-colors duration-300 hover:border-[#c3d7ae]/20`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#343b32]">
                      <motion.img
                        src={step.image}
                        alt={step.alt}
                        loading="lazy"
                        className="h-full w-full object-cover brightness-[0.76] transition-[filter] duration-500 group-hover:brightness-[0.88]"
                        whileHover={
                          prefersReducedMotion ? undefined : { scale: 1.04 }
                        }
                        transition={{ duration: 0.65 }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#171d17]/90 via-[#171d17]/10 to-black/15" />

                      <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-[#202820]/75 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white backdrop-blur-md">
                        CHAPTER {step.number}
                      </span>

                      <span className="absolute bottom-4 left-4 font-display text-xl font-semibold text-white">
                        {step.label}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 lg:p-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3d7ae]/10 text-[#c3d7ae]">
                        <Icon className="h-5 w-5" />
                      </span>

                      <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-white">
                        {step.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-[1.8] text-white/60">
                        {step.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            <ScrollReveal delay={0.12}>
              <div className="mt-10 flex flex-col items-center gap-4 text-center sm:mt-14">
                <p className="max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                  Because a place is more than four walls. It&apos;s where your
                  next chapter begins.
                </p>

                <button
                  type="button"
                  onClick={scrollToFeedback}
                  className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[#c3d7ae]/35 px-6 py-3 text-sm font-semibold text-[#e5e9dc] transition hover:border-[#c3d7ae] hover:bg-white/5"
                >
                  Share your story with sthero
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>


        {/* WHAT REALLY MATTERS */}
        <section
          id="what-matters"
          className="relative border-t border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="What matters most"
              title="The challenges you face should shape the experience we build."
              description="From finding a place within budget to knowing what to expect before you commit, your challenges help us understand where the housing search needs to get better."
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  icon: ShieldCheck,
                  title: "Trust & Transparency",
                  text: "Experience complete peace of mind at every step. We bring total clarity to your search so you can make decisions with complete confidence.",
                },
                {
                  icon: Wallet,
                  title: "A Budget That Works for You",
                  text: "Discover living options tailored to your life. We help you find the sweet spot between affordability, comfort, and everyday convenience.",
                },
                {
                  icon: Navigation,
                  title: "Locations Built Around Your Life",
                  text: "Seamlessly connect to your work, school, and favorite local spots. Your home should make everyday living effortless.",
                },
                {
                  icon: Handshake,
                  title: "Local Insights, Personal Connections",
                  text: "Settle in with confidence. Discover hidden gems, neighborhood perks, and a community ready to welcome you home.",
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
                    className="group rounded-2xl border border-white/10 bg-[#293129] p-5 transition-colors duration-300 hover:border-[#c3d7ae]/25 hover:bg-[#2e382e] sm:p-6 lg:p-7"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c3d7ae]/10 bg-[#c3d7ae]/10 text-[#c3d7ae] transition group-hover:bg-[#c3d7ae]/15">
                      <Icon className="h-5 w-5" />
                    </span>

                    <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-[1.8] text-white/60">
                      {item.text}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>

            <ScrollReveal delay={0.1}>
              <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-[#293129] p-5 sm:mt-10 sm:flex-row sm:items-center sm:gap-6 sm:p-7 lg:mt-12">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c3d7ae]/10 text-[#c3d7ae]">
                    <Quote className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                      Help shape what comes next.
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                      What was difficult about finding your place? What would
                      have made it easier? Share your experience and help us
                      understand what a better housing journey should look like.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToFeedback}
                  className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#e5e9dc] px-6 py-3 text-sm font-semibold text-[#252c25] transition hover:bg-white sm:w-auto"
                >
                  Share your experience
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SHARE YOUR EXPERIENCE — DARK SECTION AND DARK FORM CARD */}
        <section
          id="share-experience"
          className="scroll-mt-5 relative border-t border-white/[0.08] px-5 py-16 sm:scroll-mt-8 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            <ScrollReveal className="order-1 lg:col-span-7">
              <div className="rounded-[26px] border border-white/10 bg-[#293129] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.15)] sm:rounded-[30px] sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {feedbackStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 18 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: easing }}
                      role="status"
                      className="flex min-h-[480px] flex-col items-center justify-center py-8 text-center"
                    >
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#c3d7ae]/10 text-[#c3d7ae]">
                        <span className="absolute inset-[-7px] rounded-full border border-[#c3d7ae]/20" />
                        <CheckCircle2 className="h-10 w-10" />
                      </div>

                      <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c3d7ae] sm:text-xs">
                        Your voice has been heard
                      </p>

                      <h3 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                        Thanks for sharing your story!
                      </h3>

                      <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                        Your experience will help us understand the real
                        challenges of finding a place to live and build a
                        better housing experience with sthero.
                      </p>

                      <div className="mt-7 w-full max-w-md rounded-2xl border border-white/10 bg-[#252c25] p-5 text-left">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c3d7ae]/10 text-[#c3d7ae]">
                            <Heart className="h-5 w-5" />
                          </span>

                          <div>
                            <p className="text-sm font-semibold text-white">
                              Every experience matters.
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-white/55">
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
                        className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                      >
                        Share another response
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={submitFeedback}
                      className="space-y-7 sm:space-y-8"
                    >
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c3d7ae] sm:text-xs">
                          YOUR EXPERIENCE
                        </span>

                        <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
                          Help us understand your journey.
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-white/60">
                          A few details can help us understand what people
                          experience when searching for a place to live.
                        </p>
                      </div>

                      {/* JOURNEY STAGE */}
                      <fieldset>
                        <legend className="mb-3 text-sm font-semibold text-white">
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
                                onClick={() =>
                                  setFeedback((previous) => ({
                                    ...previous,
                                    journeyStage: stage.value,
                                  }))
                                }
                                className={`flex min-h-[94px] flex-col items-start justify-between rounded-xl border p-3.5 text-left transition ${selected
                                  ? 'border-[#c3d7ae]/60 bg-[#c3d7ae]/10'
                                  : 'border-white/10 bg-[#252c25] hover:border-white/25'
                                  }`}
                              >
                                <Icon
                                  className={`h-5 w-5 ${selected ? 'text-[#c3d7ae]' : 'text-white/45'
                                    }`}
                                />

                                <span className="flex w-full items-center justify-between gap-1 text-xs font-semibold text-white sm:text-sm">
                                  {stage.label}
                                  {selected && (
                                    <Check className="h-4 w-4 shrink-0 text-[#c3d7ae]" />
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      {/* CHALLENGES */}
                      <fieldset>
                        <legend className="text-sm font-semibold text-white">
                          What challenges have you faced?
                          <span className="ml-1 font-normal text-white/45">
                            (Select up to 8)
                          </span>
                        </legend>

                        <p className="mt-1 text-xs leading-relaxed text-white/45">
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
                                className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${checked
                                  ? 'border-[#c3d7ae]/50 bg-[#c3d7ae]/10'
                                  : 'border-white/10 bg-[#252c25] hover:border-white/25'
                                  } ${disabled
                                    ? 'cursor-not-allowed opacity-40'
                                    : 'cursor-pointer'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={() => toggleChallenge(challenge)}
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#c3d7ae]"
                                />
                                <span className="text-sm leading-relaxed text-white/80">
                                  {challenge}
                                </span>
                              </label>
                            );
                          })}
                        </div>

                        <p className="mt-3 text-xs text-white/45">
                          {feedback.challenges.length} of 8 selected
                        </p>
                      </fieldset>

                      {/* CITY */}
                      <div>
                        <label
                          htmlFor="feedback-city"
                          className="mb-2 block text-sm font-semibold text-white"
                        >
                          Which city are you looking in or living in?
                          <span className="ml-1 font-normal text-white/45">
                            (Optional)
                          </span>
                        </label>

                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

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
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>

                      {/* PERSONAL EXPERIENCE */}
                      <div>
                        <label
                          htmlFor="feedback-experience"
                          className="mb-2 block text-sm font-semibold text-white"
                        >
                          What happened? Tell us your story.
                          <span className="ml-1 font-normal text-white/45">
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
                          className={`${inputClass} resize-y leading-relaxed`}
                        />

                        <p className="mt-1 text-right text-xs text-white/40">
                          {feedback.experience.length}/3000
                        </p>
                      </div>

                      {/* SUGGESTIONS */}
                      <div>
                        <label
                          htmlFor="feedback-suggestion"
                          className="mb-2 block text-sm font-semibold text-white"
                        >
                          What would make this experience better?
                          <span className="ml-1 font-normal text-white/45">
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
                          className={`${inputClass} resize-y leading-relaxed`}
                        />

                        <p className="mt-1 text-right text-xs text-white/40">
                          {feedback.suggestion.length}/2000
                        </p>
                      </div>

                      {/* CONSENT */}
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-[#252c25] p-4">
                        <input
                          type="checkbox"
                          checked={feedback.consentAnonymized}
                          onChange={(event) =>
                            setFeedback((previous) => ({
                              ...previous,
                              consentAnonymized: event.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 shrink-0 accent-[#c3d7ae]"
                        />

                        <span className="text-sm leading-relaxed text-white/60">
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
                            className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-relaxed text-red-200"
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
                          className="text-sm font-medium text-[#c3d7ae] underline underline-offset-4"
                        >
                          Try again
                        </button>
                      )}

                      {/* SUBMIT */}
                      <button
                        type="submit"
                        disabled={feedbackStatus === 'loading'}
                        className="group inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#c3d7ae] px-6 py-4 font-semibold text-[#252c25] transition hover:bg-[#e5e9dc] disabled:cursor-not-allowed disabled:opacity-60"
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

                      <p className="text-center text-xs leading-relaxed text-white/40">
                        No name or email is requested in this form. Please
                        avoid including sensitive personal information in your
                        story.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>

            {/* FORM INTRODUCTION */}
            <ScrollReveal delay={0.12} className="order-2 lg:col-span-5 lg:pt-10">
              <div className="lg:sticky lg:top-28">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c3d7ae] sm:text-xs">
                  Your voice matters
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  The next person's journey can be better because of yours.
                </h2>

                <p className="mt-5 text-sm leading-[1.9] text-white/60 sm:text-base">
                  Every housing journey is different. The compromises, the
                  unexpected costs, the unanswered questions — understanding
                  those experiences helps us focus on what really needs to
                  change.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: MessageSquareText,
                      title: 'Your experience, in your words',
                      text: 'Tell us what worked, what did not, and what you wish had been easier.',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'Your privacy matters',
                      text: 'The form does not ask for your name or email. Your feedback is used anonymously with your consent.',
                    },
                    {
                      icon: Heart,
                      title: 'Help make the journey more human',
                      text: 'Your insights help us understand the real priorities of people looking for a place to live.',
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c3d7ae]/10 text-[#c3d7ae]">
                          <Icon className="h-5 w-5" />
                        </span>

                        <div>
                          <h3 className="text-sm font-semibold text-white sm:text-base">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* CLOSING CTA — INTENTIONALLY SEPARATE FROM THE DARK MIDDLE */}
      <section className="relative isolate flex min-h-[540px] w-full items-center justify-center overflow-hidden bg-[#211b15] sm:min-h-[620px]">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85"
          alt="Warm and welcoming living space"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#171d17]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171d17]/80 via-[#171d17]/25 to-[#171d17]/40" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28">
          <ScrollReveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d3dfc5] sm:text-xs">
              Your next chapter
            </p>

            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-balance text-white sm:text-5xl lg:text-7xl">
              Your next chapter starts here.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
              We&apos;re working towards a better housing experience. Help us
              understand what you need, and be part of the journey.
            </p>
          </ScrollReveal>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: easing, delay: 0.12 }}
            className="mt-8 flex w-full flex-col items-center gap-5 sm:mt-9"
          >
            <motion.button
              type="button"
              onClick={scrollToOnboarding}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-[54px] w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#f8f6ef] px-7 py-4 text-sm font-semibold text-[#252c25] transition hover:bg-[#e5e9dc] sm:w-auto sm:max-w-none sm:text-base"
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
