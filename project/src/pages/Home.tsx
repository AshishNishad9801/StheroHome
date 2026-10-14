
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';

import ScrollReveal from '@/components/ScrollReveal';
import { storyImage, closingImage } from '@/lib/images';
import { supabase } from '@/lib/supabase';

/* =========================================================
   HERO IMAGES
========================================================= */

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85',
    alt: 'Warm contemporary living room with natural wood and ambient light',
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85',
    alt: 'Sunlit modern home with warm neutral finishes',
  },
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=85',
    alt: 'Elegant and welcoming living space with soft natural light',
  },
  {
    src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2400&q=85',
    alt: 'Comfortable contemporary home with warm interior details',
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=85',
    alt: 'Quiet residential interior with natural materials and soft light',
  },
];

const searchPhrases = [
  'Looking for a room in Delhi?',
  'Looking for a PG in Mumbai?',
  'Looking for a PG in Bangalore?',
  'Moving to Pune for work?',
  'Finding a flat near your college?',
  'Starting a new chapter in Hyderabad?',
];

/* =========================================================
   CHALLENGES
========================================================= */

const challengesList = [
  'Finding a trustworthy PG',
  'Fake or misleading listings',
  'High rent or hidden charges',
  'Finding a place near college or work',
  'Uncomfortable living conditions',
  'Safety and security concerns',
  'Finding compatible flatmates',
  'Feeling lonely in a new city',
  'Unclear rules or restrictions',
  'Difficulty comparing options',
  'Security fee not returned',
];

/* =========================================================
   STORY CHAPTERS
========================================================= */

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

/* =========================================================
   HOW STHERO HELPS
========================================================= */

const helpCards = [
  {
    number: '01',
    title: 'Your Housing Profile',
    label: 'START WITH YOU',
    description:
      'Tell us your preferred location, budget, and the kind of accommodation you need.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    alt: 'Warm, thoughtfully furnished living room',
    icon: MapPin,
  },
  {
    number: '02',
    title: 'Beyond the Listing',
    label: 'EXPLORE OPTIONS',
    description:
      'Look beyond rent and location. Think about your commute, daily needs, and lifestyle.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
    alt: 'Beautiful residential interiors in soft natural light',
    icon: Search,
  },
  {
    number: '03',
    title: 'Get Support',
    label: 'FEEL CONNECTED',
    description:
      'Learn from people familiar with your destination and feel more prepared for your move.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
    alt: 'Friends connecting and enjoying time together',
    icon: Users,
  },
  {
    number: '04',
    title: 'Visit & Move In',
    label: 'YOUR NEXT CHAPTER',
    description:
      'Explore your shortlisted options and choose a place that feels right for you.',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85',
    alt: 'Comfortable modern home with warm neutral interiors',
    icon: Heart,
  },
];

/* =========================================================
   TYPES AND INITIAL STATE
========================================================= */

type JourneyStage = 'searching' | 'found' | 'moved';

const initialFeedback = {
  journeyStage: 'searching' as JourneyStage,
  challenges: [] as string[],
  city: '',
  experience: '',
  suggestion: '',
  consentAnonymized: false,
};

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
  const navigate = useNavigate();

  const [activeHero, setActiveHero] = useState(0);
  const [activePhrase, setActivePhrase] = useState(0);
  const [activeHelpCard, setActiveHelpCard] = useState(0);
  const [activeStory, setActiveStory] = useState(0);

  const [feedback, setFeedback] = useState(initialFeedback);

  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [feedbackError, setFeedbackError] = useState('');

  /* =======================================================
     HERO SLIDESHOW
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHero(
        (current) => (current + 1) % heroImages.length,
      );
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  /* =======================================================
     ROTATING CITY PROMPTS
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePhrase(
        (current) => (current + 1) % searchPhrases.length,
      );
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const scrollToOnboarding = useCallback(() => {
    navigate('/get-started');
  }, [navigate]);

  const scrollToFeedback = useCallback(() => {
    document.getElementById('share-experience')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  /* =======================================================
     HELP CARD CAROUSEL
  ======================================================= */

  const showNextHelpCard = useCallback(() => {
    setActiveHelpCard(
      (current) => (current + 1) % helpCards.length,
    );
  }, []);

  const showPreviousHelpCard = useCallback(() => {
    setActiveHelpCard(
      (current) =>
        (current - 1 + helpCards.length) % helpCards.length,
    );
  }, []);

  /* =======================================================
     STORY CAROUSEL
  ======================================================= */

  const showNextStory = useCallback(() => {
    setActiveStory(
      (current) => (current + 1) % storySteps.length,
    );
  }, []);

  const showPreviousStory = useCallback(() => {
    setActiveStory(
      (current) =>
        (current - 1 + storySteps.length) % storySteps.length,
    );
  }, []);

  /* =======================================================
     MOBILE CAROUSEL AUTOPLAY
  ======================================================= */

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');

    if (!mediaQuery.matches) return;

    const interval = window.setInterval(() => {
      setActiveHelpCard(
        (current) => (current + 1) % helpCards.length,
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');

    if (!mediaQuery.matches) return;

    const interval = window.setInterval(() => {
      setActiveStory(
        (current) => (current + 1) % storySteps.length,
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  /* =======================================================
     FEEDBACK CHALLENGES
  ======================================================= */

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

  /* =======================================================
     SUBMIT FEEDBACK TO SUPABASE
  ======================================================= */

  const submitFeedback = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFeedbackError('');

    if (feedback.challenges.length === 0) {
      setFeedbackError(
        'Please select at least one challenge.',
      );
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
      const { error } = await supabase
        .from('user_feedback')
        .insert({
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
      console.error(
        'Unable to submit user feedback:',
        error,
      );

      setFeedbackStatus('error');

      setFeedbackError(
        'We could not submit your feedback right now. Please try again.',
      );
    }
  };

  return (
    <div className="overflow-hidden bg-ivory text-charcoal">

      {/* =====================================================
          HERO — WARM GOLDEN-HOUR BACKGROUND
      ===================================================== */}

      <section className="relative isolate flex h-[100svh] min-h-[900px] max-h-[1100px] w-full items-center justify-center overflow-hidden bg-[#302016] sm:h-[92svh] sm:min-h-[740px] sm:max-h-[1000px]">

        {/* FULL-SCREEN RESIDENTIAL SLIDESHOW */}

        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeHero].src}
              src={heroImages[activeHero].src}
              alt={heroImages[activeHero].alt}
              initial={{ opacity: 0, scale: 1.045 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: {
                  duration: 1.5,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 6.5,
                  ease: 'linear',
                },
              }}
              fetchPriority={
                activeHero === 0 ? 'high' : 'auto'
              }
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-[#9a5b2e]/20 mix-blend-multiply" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#1b140f]/55 via-[#24170e]/20 to-[#24170e]/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1b120d]/70 via-transparent to-[#24170e]/25" />

          <div className="absolute inset-0 bg-[#6f421f]/10" />
        </div>

        {/* CENTERED HEADLINE AND CTA BUTTONS */}

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-56 pt-8 text-center sm:px-8 sm:pb-28 sm:pt-12">

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex w-full flex-col items-center"
          >
            <h1 className="max-w-4xl font-display text-[38px] font-semibold leading-[1.1] tracking-[-0.04em] text-balance text-white drop-shadow-[0_3px_20px_rgba(0,0,0,0.25)] sm:text-5xl md:text-6xl lg:text-[72px]">
              Your Next Big Move
              <br className="hidden sm:block" /> Deserves a Better Start.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/95 drop-shadow-md sm:mt-6 sm:text-base md:text-lg">
              Moving for college or work? Find suitable accommodation
              with less hassle, personalised guidance and community insights.
            </p>

            <div className="mt-8 flex w-full max-w-[360px] flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">

              <motion.button
                type="button"
                onClick={scrollToOnboarding}
                whileHover={{ y: -3 }}
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
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border border-white/65 bg-black/15 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15 sm:w-auto sm:px-7 sm:text-base"
              >
                <MessageSquareText className="h-[19px] w-[19px] shrink-0" />
                <span>Share Your Experience</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </motion.button>

            </div>

            <p className="mt-4 max-w-sm text-xs leading-relaxed tracking-wide text-white/85 sm:mt-5 sm:max-w-none sm:text-sm">
              Looking for a PG, room or flat? Start with what matters to you.
            </p>
          </motion.div>
        </div>

        {/* YOUR NEXT MOVE — NO BOX, NO BACKGROUND, NO BORDER */}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute bottom-[76px] left-5 z-20 w-[min(310px,calc(100%-40px))] text-left sm:bottom-24 sm:left-8 sm:w-[320px] lg:bottom-24 lg:left-12 xl:left-[max(48px,calc((100vw-1400px)/2))]"
        >

          

          <AnimatePresence mode="wait">
            <motion.p
              key={searchPhrases[activePhrase]}
              initial={{
                opacity: 0,
                y: 10,
                filter: 'blur(3px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                y: -8,
                filter: 'blur(2px)',
              }}
              transition={{ duration: 0.4 }}
              className="min-h-[30px] font-display text-lg font-semibold leading-snug text-white drop-shadow-md sm:text-xl"
            >
              {searchPhrases[activePhrase]}
            </motion.p>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-2 text-xs text-white/75">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>PGs, rooms and flats</span>
            <span className="ml-2 text-white/50">01 — 06</span>
          </div>

        </motion.div>

        {/* HERO SLIDESHOW CONTROLS */}

        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 sm:bottom-7 sm:right-8 lg:right-12">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
              aria-current={
                activeHero === index ? 'true' : undefined
              }
              onClick={() => setActiveHero(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeHero === index
                  ? 'w-8 bg-white'
                  : 'w-1.5 bg-white/55 hover:bg-white/90'
              }`}
            />
          ))}
        </div>

      </section>

      {/* =====================================================
          HOW STHERO HELPS
      ===================================================== */}

      <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                A more thoughtful way to find home
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
                Find your place, with a little more confidence.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-secondary-text sm:text-base">
                Finding a place to live is about more than a room.
                Discover a more personal way to find your next home.
              </p>
            </div>
          </ScrollReveal>

          {/* MOBILE HELP CAROUSEL */}

          <div className="sm:hidden">
            <div className="relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={activeHelpCard}
                  initial={{ opacity: 0, x: 45 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -45 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden rounded-2xl border border-[#76634d]/10 bg-white shadow-md"
                >
                  {(() => {
                    const card = helpCards[activeHelpCard];
                    const Icon = card.icon;

                    return (
                      <>
                        <div className="relative aspect-[5/3] overflow-hidden bg-[#e7d6c0]">
                          <motion.img
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7 }}
                            src={card.image}
                            alt={card.alt}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#291c12]/65 via-[#291c12]/5 to-transparent" />

                          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#433326] backdrop-blur-sm">
                            {card.number}
                          </span>

                          <span className="absolute bottom-4 left-4 text-[10px] font-semibold tracking-[0.18em] text-white">
                            {card.label}
                          </span>
                        </div>

                        <div className="p-5">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8e0d2] text-[#71816b]">
                            <Icon className="h-5 w-5" />
                          </div>

                          <h3 className="font-display text-xl font-bold text-charcoal">
                            {card.title}
                          </h3>

                          <p className="mt-2 min-h-[60px] text-sm leading-relaxed text-secondary-text">
                            {card.description}
                          </p>
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
                onClick={showPreviousHelpCard}
                aria-label="Previous card"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-beige"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {helpCards.map((card, index) => (
                  <button
                    key={card.number}
                    type="button"
                    aria-label={`Show card ${index + 1}`}
                    aria-current={
                      activeHelpCard === index ? 'true' : undefined
                    }
                    onClick={() => setActiveHelpCard(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeHelpCard === index
                        ? 'w-7 bg-sage'
                        : 'w-1.5 bg-sage/30'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={showNextHelpCard}
                aria-label="Next card"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-beige"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-secondary-text">
              {String(activeHelpCard + 1).padStart(2, '0')} of{' '}
              {String(helpCards.length).padStart(2, '0')} · Explore the journey
            </p>
          </div>

          {/* DESKTOP HELP GRID */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.13 },
              },
            }}
            className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-4 lg:gap-6"
          >
            {helpCards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.article
                  key={card.number}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  whileHover={{ y: -6 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#76634d]/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#e7d6c0]">
                    <motion.img
                      src={card.image}
                      alt={card.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.7 }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#291c12]/55 via-transparent to-transparent" />

                    <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-[#fffaf2]/90 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#433326] backdrop-blur-sm">
                      {card.number}
                    </span>

                    <span className="absolute bottom-3 left-3 text-[10px] font-semibold tracking-[0.16em] text-white">
                      {card.label}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8e0d2] text-[#71816b] transition-colors duration-300 group-hover:bg-sage group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>

                    <h3 className="font-display text-lg font-bold leading-snug text-charcoal sm:text-xl">
                      {card.title}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary-text">
                      {card.description}
                    </p>

                    <button
                      type="button"
                      onClick={scrollToOnboarding}
                      aria-label={`Get started: ${card.title}`}
                      className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-charcoal transition-colors hover:text-sage"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* =====================================================
          THE STORY — MOBILE CAROUSEL, DESKTOP EDITORIAL LAYOUT
      ===================================================== */}

      <section className="bg-beige px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-16 lg:mb-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                A story that feels familiar
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
                A new job is exciting. Finding a place to live shouldn&apos;t
                be the hard part.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-secondary-text sm:text-lg">
                Imagine getting your dream offer in another city. The
                opportunity is real, but so is the challenge of finding
                somewhere safe, comfortable and right for you.
              </p>
            </div>
          </ScrollReveal>

          {/* MOBILE STORY CAROUSEL */}

          <div className="sm:hidden">
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={activeStory}
                  initial={{ opacity: 0, x: 45 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -45 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden rounded-2xl border border-[#76634d]/10 bg-ivory shadow-md"
                >
                  {(() => {
                    const step = storySteps[activeStory];
                    const Icon = step.icon;

                    return (
                      <>
                        <div className="relative aspect-[5/3] overflow-hidden bg-[#e7d6c0]">
                          <motion.img
                            src={step.image}
                            alt={step.alt}
                            loading="lazy"
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7 }}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#291c12]/70 via-transparent to-[#291c12]/5" />

                          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#433326] backdrop-blur-sm">
                            CHAPTER {step.number}
                          </span>

                          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
                              <Icon className="h-5 w-5" />
                            </span>

                            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                              {step.label}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-display text-xl font-bold leading-snug text-charcoal">
                            {step.title}
                          </h3>

                          <p className="mt-3 text-sm leading-relaxed text-secondary-text">
                            {step.description}
                          </p>

                          {activeStory === 1 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {[
                                'Where should I live?',
                                'Is it trustworthy?',
                                'Will I fit in?',
                              ].map((question) => (
                                <span
                                  key={question}
                                  className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs text-secondary-text"
                                >
                                  {question}
                                </span>
                              ))}
                            </div>
                          )}

                          {activeStory === 2 && (
                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-sage/20 bg-beige/70 p-3.5">
                              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />

                              <p className="text-sm leading-relaxed text-secondary-text">
                                Your priorities come first. Tell us what
                                you need, and take the first step toward a
                                place that feels right.
                              </p>
                            </div>
                          )}

                          {/* FIND YOUR PLACE BUTTON REMOVED FROM MOBILE */}
                        </div>
                      </>
                    );
                  })()}
                </motion.article>
              </AnimatePresence>
            </div>

            {/* STORY CAROUSEL CONTROLS */}

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={showPreviousStory}
                aria-label="Previous story chapter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-ivory transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {storySteps.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    aria-label={`Show story chapter ${index + 1}`}
                    aria-current={
                      activeStory === index ? 'true' : undefined
                    }
                    onClick={() => setActiveStory(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStory === index
                        ? 'w-7 bg-sage'
                        : 'w-1.5 bg-sage/30'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={showNextStory}
                aria-label="Next story chapter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-ivory transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-secondary-text">
              {String(activeStory + 1).padStart(2, '0')} of{' '}
              {String(storySteps.length).padStart(2, '0')} · The journey to
              feeling at home
            </p>
          </div>

          {/* DESKTOP STORY LAYOUT */}

          <div className="hidden space-y-16 sm:block lg:space-y-24">
            {storySteps.map((step, index) => {
              const Icon = step.icon;
              const reverse = index % 2 === 1;

              return (
                <ScrollReveal key={step.number} delay={0.08}>
                  <div
                    className={`grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16 ${
                      reverse
                        ? 'lg:[&>*:first-child]:order-2'
                        : ''
                    }`}
                  >
                    <div className="group relative mx-auto w-full max-w-[560px] lg:mx-0">
                      <div className="relative aspect-[5/3] overflow-hidden rounded-2xl bg-[#e7d6c0] lg:rounded-3xl">
                        <motion.img
                          src={step.image}
                          alt={step.alt}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          whileHover={{ scale: 1.045 }}
                          transition={{ duration: 0.65 }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#291c12]/60 via-transparent to-transparent" />

                        <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white sm:bottom-6 sm:left-6">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
                            <Icon className="h-5 w-5" />
                          </span>

                          <span className="text-sm font-medium tracking-wide">
                            {step.label}
                          </span>
                        </div>
                      </div>

                      <span className="absolute -left-2 -top-4 font-display text-5xl font-bold text-sage/40 sm:-left-4 sm:-top-5 sm:text-7xl">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sage sm:text-sm">
                        Chapter {step.number}
                      </p>

                      <h3 className="max-w-xl font-display text-2xl font-bold leading-tight text-balance sm:text-3xl lg:text-4xl">
                        {step.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary-text sm:mt-5 sm:text-lg">
                        {step.description}
                      </p>

                      {index === 1 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {[
                            'Where should I live?',
                            'Is it trustworthy?',
                            'Will I fit in?',
                          ].map((question) => (
                            <span
                              key={question}
                              className="rounded-full border border-black/10 bg-ivory/70 px-3.5 py-2 text-xs text-secondary-text sm:text-sm"
                            >
                              {question}
                            </span>
                          ))}
                        </div>
                      )}

                      {index === 2 && (
                        <>
                          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sage/20 bg-ivory/70 p-4 sm:mt-7 sm:p-5">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />

                            <p className="text-sm leading-relaxed text-secondary-text">
                              Your priorities come first. Tell us what you
                              need, and take the first step toward a place
                              that feels right.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={scrollToOnboarding}
                            className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-white transition-colors hover:bg-charcoal sm:mt-7"
                          >
                            Start your search
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* CLOSING STORY STATEMENT */}

          <ScrollReveal delay={0.1}>
            <div className="mt-14 rounded-3xl border border-[#76634d]/10 bg-ivory px-5 py-9 text-center sm:mt-20 sm:px-12 sm:py-12 lg:mt-24 lg:py-14">
              <Users className="mx-auto h-8 w-8 text-sage" />

              <h3 className="mt-5 font-display text-2xl font-bold sm:text-3xl">
                Because a place is more than four walls.
              </h3>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-text sm:text-base">
                It&apos;s where your next chapter begins, new friendships
                take shape, and a strange city slowly starts feeling familiar.
              </p>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =====================================================
          LIFESTYLE STORY
      ===================================================== */}

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-16">

          <ScrollReveal className="order-2 lg:order-1 lg:col-span-7">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl lg:rounded-3xl">
              <img
                src={storyImage.url}
                alt={storyImage.alt}
                loading="lazy"
                className="aspect-[5/4] h-full w-full object-cover sm:aspect-[4/3]"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal
            delay={0.15}
            className="order-1 lg:order-2 lg:col-span-5"
          >
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                Why sthero
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
                Living should feel easier.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-secondary-text sm:mt-6 sm:text-lg">
                Finding the right place shouldn&apos;t be overwhelming.
                We&apos;re here to make the search feel more personal, more
                human, and a little less like a chore.
              </p>

              <div className="mt-7 h-px w-16 bg-sage" />

              <p className="mt-5 text-sm leading-relaxed text-secondary-text sm:mt-6 sm:text-base">
                Tell us where you&apos;d like to live, what matters to you,
                and whether you&apos;re a student or a professional.
                We&apos;ll take it from there.
              </p>

              <button
                type="button"
                onClick={scrollToOnboarding}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-white transition-colors hover:bg-charcoal"
              >
                Tell us what you need
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =====================================================
          USER FEEDBACK
      ===================================================== */}

      <section
        id="share-experience"
        className="scroll-mt-16 bg-beige px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">

          {/* FEEDBACK INTRO */}

          <ScrollReveal className="lg:sticky lg:top-24 lg:col-span-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
              Your voice matters
            </p>

            <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
              Tell us what finding a place is really like.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-secondary-text sm:mt-6 sm:text-lg">
              Are you still searching? Have you finally found a place? Or
              have you already experienced the challenges of moving to a
              new city?
            </p>

            <p className="mt-4 text-sm leading-relaxed text-secondary-text sm:text-base">
              We want to hear the real stories, frustrations and ideas that
              can help us build a better living experience for students and
              working professionals.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl bg-[#e7d6c0]">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85"
                alt="Young people spending time together and building friendships"
                loading="lazy"
                className="aspect-[5/3] w-full object-cover"
              />
            </div>

            <div className="mt-6 flex items-start gap-3">
              <MessageSquareText className="mt-1 h-5 w-5 shrink-0 text-sage" />

              <p className="text-sm leading-relaxed text-secondary-text">
                Your feedback helps us understand what matters most. We
                won&apos;t publish your written experience as a testimonial
                without obtaining your permission separately.
              </p>
            </div>
          </ScrollReveal>

          {/* FEEDBACK FORM */}

          <ScrollReveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-3xl border border-black/5 bg-ivory p-5 shadow-sm sm:p-8 lg:p-10">

              {feedbackStatus === 'success' ? (
                <div
                  role="status"
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/10">
                    <CheckCircle2 className="h-8 w-8 text-sage" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
                    Thank you for sharing.
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary-text sm:text-base">
                    Your experience has been received. Every honest response
                    helps us understand how to make finding a place a little
                    easier.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackStatus('idle');
                      setFeedbackError('');
                    }}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium transition-colors hover:bg-beige"
                  >
                    Share another response
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={submitFeedback}
                  className="space-y-7 sm:space-y-8"
                >
                  <div>
                    <span className="text-sm font-medium text-sage">
                      YOUR EXPERIENCE
                    </span>

                    <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                      Let&apos;s start with you.
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-secondary-text">
                      A few quick questions. Share only what you&apos;re
                      comfortable sharing.
                    </p>
                  </div>

                  {/* JOURNEY STAGE */}

                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold">
                      Where are you in your journey?
                    </legend>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        {
                          value: 'searching',
                          label: 'Still searching',
                          description: 'Looking for a place',
                        },
                        {
                          value: 'found',
                          label: 'Found a place',
                          description: 'Recently settled',
                        },
                        {
                          value: 'moved',
                          label: 'Already moved',
                          description: 'Have lived the experience',
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                            feedback.journeyStage === option.value
                              ? 'border-sage bg-sage/10 ring-1 ring-sage'
                              : 'border-black/10 hover:border-sage/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="journeyStage"
                            value={option.value}
                            checked={
                              feedback.journeyStage === option.value
                            }
                            onChange={() =>
                              setFeedback((previous) => ({
                                ...previous,
                                journeyStage:
                                  option.value as JourneyStage,
                              }))
                            }
                            className="sr-only"
                          />

                          <span className="text-sm font-semibold">
                            {option.label}
                          </span>

                          <span className="mt-1 text-xs leading-relaxed text-secondary-text">
                            {option.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* CHALLENGES */}

                  <fieldset>
                    <legend className="text-sm font-semibold">
                      What challenges have you faced?
                    </legend>

                    <p className="mb-4 mt-1 text-sm text-secondary-text">
                      Select all that apply, up to 8.
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {challengesList.map((challenge) => {
                        const checked =
                          feedback.challenges.includes(challenge);

                        return (
                          <label
                            key={challenge}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                              checked
                                ? 'border-sage bg-sage/10'
                                : 'border-black/10 hover:border-sage/50'
                            } ${
                              !checked &&
                              feedback.challenges.length >= 8
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={
                                !checked &&
                                feedback.challenges.length >= 8
                              }
                              onChange={() =>
                                toggleChallenge(challenge)
                              }
                              className="mt-0.5 h-4 w-4 shrink-0 accent-sage"
                            />

                            <span className="text-sm leading-relaxed">
                              {challenge}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs text-secondary-text">
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

                      <span className="ml-1 font-normal text-secondary-text">
                        (Optional)
                      </span>
                    </label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />

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
                        className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/15"
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

                      <span className="ml-1 font-normal text-secondary-text">
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
                      className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm leading-relaxed outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/15"
                    />

                    <p className="mt-1 text-right text-xs text-secondary-text">
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

                      <span className="ml-1 font-normal text-secondary-text">
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
                      className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm leading-relaxed outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/15"
                    />

                    <p className="mt-1 text-right text-xs text-secondary-text">
                      {feedback.suggestion.length}/2000
                    </p>
                  </div>

                  {/* CONSENT */}

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-beige/70 p-4">
                    <input
                      type="checkbox"
                      checked={feedback.consentAnonymized}
                      onChange={(event) =>
                        setFeedback((previous) => ({
                          ...previous,
                          consentAnonymized: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-sage"
                    />

                    <span className="text-sm leading-relaxed text-secondary-text">
                      I agree that sthero may use my feedback anonymously
                      to understand accommodation challenges and improve
                      its services. I understand that this does not
                      authorize publication of my written story as a
                      personal testimonial.
                    </span>
                  </label>

                  {/* ERROR MESSAGE */}

                  {feedbackError && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-700"
                    >
                      {feedbackError}
                    </p>
                  )}

                  {feedbackStatus === 'error' && (
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackStatus('idle');
                        setFeedbackError('');
                      }}
                      className="text-sm font-medium text-sage underline underline-offset-4"
                    >
                      Try again
                    </button>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={feedbackStatus === 'loading'}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
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

                  <p className="text-center text-xs leading-relaxed text-secondary-text">
                    No name or email is requested in this form. Please
                    avoid including sensitive personal information in
                    your story.
                  </p>
                </form>
              )}

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =====================================================
          CLOSING CTA
      ===================================================== */}

      <section className="relative h-[65vh] min-h-[460px] w-full overflow-hidden sm:h-[70vh] sm:min-h-[500px]">

        <img
          src={closingImage.url}
          alt={closingImage.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#291c12]/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">

          <ScrollReveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/85 sm:text-sm">
              Your next chapter awaits
            </p>

            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight-hero text-balance text-ivory sm:text-5xl lg:text-6xl">
              Your next chapter starts here.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <button
              type="button"
              onClick={scrollToOnboarding}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-sage hover:text-ivory sm:mt-8 sm:text-base"
            >
              Find Your Place
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </ScrollReveal>

          <button
            type="button"
            onClick={scrollToFeedback}
            className="mt-5 text-sm font-medium text-ivory/85 underline decoration-ivory/40 underline-offset-4 transition-colors hover:text-white"
          >
            Share your experience
          </button>

        </div>
      </section>

    </div>
  );
}
