import { useCallback, useState, type FormEvent,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion,AnimatePresence} from 'framer-motion';
import {
  ArrowRight,
  ArrowDown,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Heart,
  CheckCircle2,
  LoaderCircle,
  MessageSquareText,
  Send,
} from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import ScrollReveal from '@/components/ScrollReveal';

import {
  heroImages,
  storyImage,
  galleryImages,
  onboardingImage,
  closingImage,
} from '@/lib/images';
import { supabase } from '@/lib/supabase';

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
    alt: 'Young professionals starting a new chapter together',
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
    alt: 'A young professional working through the challenges of moving',
    icon: Search,
  },
  {
    number: '03',
    label: 'A little less alone',
    title: 'Finding a place should feel more human.',
    description:
      'With sthero, the search starts with what matters to you: your location, your budget and the kind of living experience you want.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
    alt: 'A welcoming, comfortable living space',
    icon: Heart,
  },
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

const heroCaptions = [
  {
    title: 'A PG in Bangalore',
    subtitle: 'A comfortable space to call your own.',
  },
  {
    title: 'A 3BHK in Delhi',
    subtitle: 'More room to live, connect and grow.',
  },
  {
    title: 'A 1RK in Mumbai',
    subtitle: 'Your own little corner in a big city.',
  },
  {
    title: 'A shared flat in Pune',
    subtitle: 'Find your people, not just a place.',
  },
  {
    title: 'A room near your college',
    subtitle: 'Closer to campus. Closer to your next chapter.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(initialFeedback);
  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [feedbackError, setFeedbackError] = useState('');
  const [activeHeroCaption, setActiveHeroCaption] = useState(0);

useEffect(() => {
  const interval = window.setInterval(() => {
    setActiveHeroCaption((current) => (current + 1) % heroCaptions.length);
  }, 5000);

  return () => window.clearInterval(interval);
}, []);

  
const scrollToOnboarding = useCallback(() => {
  navigate('/get-started');
}, [navigate]);


  const scrollToFeedback = useCallback(() => {
    document
      .getElementById('share-experience')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  const toggleChallenge = (challenge: string) => {
    setFeedback((previous) => {
      const selected = previous.challenges.includes(challenge);

      if (selected) {
        return {
          ...previous,
          challenges: previous.challenges.filter(
            (item) => item !== challenge
          ),
        };
      }

      if (previous.challenges.length >= 8) {
        return previous;
      }

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
        'Please confirm that your feedback can be used anonymously.'
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

      if (error) {
        throw error;
      }

      setFeedback(initialFeedback);
      setFeedbackStatus('success');
    } catch (error) {
      console.error('Unable to submit user feedback:', error);
      setFeedbackStatus('error');
      setFeedbackError(
        'We could not submit your feedback right now. Please try again.'
      );
    }
  };

  return (
    <div className="overflow-hidden bg-ivory text-charcoal">
    
{/* ==================== HERO ==================== */}
<section className="relative h-screen min-h-[600px] w-full overflow-hidden">
  <HeroCarousel images={heroImages} />

  {/* Readability overlay */}
  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/40" />

  {/* Main heading */}
  <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="max-w-3xl"
    >
      <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight-hero text-ivory text-balance sm:text-5xl lg:text-7xl">
        Find a place that
        <br className="hidden sm:block" /> feels like yours.
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/90 text-pretty sm:text-xl">
        Your next home should feel right. Tell us what you&apos;re looking
        for, and take the first step with sthero.
      </p>

      <motion.button
        type="button"
        onClick={scrollToOnboarding}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="group mt-9 inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-base font-semibold text-charcoal shadow-lg transition-all duration-300 hover:bg-sage hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
      >
        Find Your Place
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  </div>

  {/* Animated housing caption — bottom-left */}
  <div
    className="absolute bottom-8 left-5 z-20 max-w-[290px] sm:bottom-12 sm:left-10 sm:max-w-sm lg:bottom-14 lg:left-14"
    aria-live="polite"
    aria-atomic="true"
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={activeHeroCaption}
        initial={{ opacity: 0, x: -14, filter: 'blur(3px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: 10, filter: 'blur(3px)' }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="rounded-xl border border-white/20 bg-black/25 px-4 py-3 shadow-lg backdrop-blur-md sm:px-5 sm:py-4"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-white/80" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-xs">
            A place to call home
          </span>
        </div>

        <h2 className="mt-1.5 font-display text-lg font-bold leading-snug text-white drop-shadow sm:text-xl lg:text-2xl">
          {heroCaptions[activeHeroCaption].title}
        </h2>

        <p className="mt-1 text-xs leading-relaxed text-white/85 sm:text-sm">
          {heroCaptions[activeHeroCaption].subtitle}
        </p>
      </motion.div>
    </AnimatePresence>
  </div>

  {/* Scroll indicator — bottom-right */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.2, duration: 1 }}
    className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-2 text-white/80 sm:right-10 lg:flex"
  >
    <span className="text-xs uppercase tracking-wide-nav">Scroll</span>
    <ArrowDown className="h-4 w-4 animate-bounce" />
  </motion.div>
</section>

            {/* ==================== HOW STHERO HELPS ==================== */}
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

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          >
            {[
              {
                number: '01',
                title: 'Your Housing Profile',
                label: 'START WITH YOU',
                description:
                  'Tell us your preferred location, budget, and the kind of accommodation you need.',
                image:
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
                alt: 'Person researching housing options on a laptop',
                icon: MapPin,
              },
              {
                number: '02',
                title: 'Beyond the Listing',
                label: 'EXPLORE OPTIONS',
                description:
                  'Look beyond rent and location. Think about your commute, daily needs, and lifestyle.',
                image:
                  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80',
                alt: 'City skyline viewed during the evening',
                icon: Search,
              },
              {
                number: '03',
                title: 'Get Support',
                label: 'FEEL CONNECTED',
                description:
                  'Learn from people familiar with your destination and feel more prepared for your move.',
                image:
                  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=700' ,
                alt: 'Young professionals collaborating and connecting',
                icon: Users,
              },
              {
                number: '04',
                title: 'Visit & Move In',
                label: 'YOUR NEXT CHAPTER',
                description:
                  'Explore your shortlisted options and choose a place that feels right for you.',
                image:
                  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=700',
                alt: 'Thoughtfully furnished modern living room',
                icon: Heart,
              },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <motion.article
                  key={card.number}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 24,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  whileHover={{
                    y: -6,
                    transition: {
                      duration: 0.25,
                      ease: 'easeOut',
                    },
                  }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-charcoal/[0.07]"
                >
                  {/* Image */}
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <motion.img
                      src={card.image}
                      alt={card.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.07 }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />

                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/85 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-charcoal backdrop-blur-sm">
                      {card.number}
                    </span>

                    <span className="absolute bottom-3 left-3 text-[10px] font-semibold tracking-[0.16em] text-white">
                      {card.label}
                    </span>
                  </div>

                  {/* Compact content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sage/10 text-sage transition-colors duration-300 group-hover:bg-sage group-hover:text-white">
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
                      className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-charcoal transition-colors duration-300 hover:text-sage"
                    >
                      Find Your Place
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
      {/* ==================== THE STORY: WHY STHERO ==================== */}
      <section className="bg-beige px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-9xl">
          <ScrollReveal>
            <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
              <p className="mb-3 text-sm font-medium uppercase tracking-wide-nav text-sage">
                A story that feels familiar
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
                A new job is exciting. Finding a place to live shouldn&apos;t
                be the hard part.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-secondary-text sm:text-lg">
                Imagine getting your dream offer in another city. The
                opportunity is real, but so is the challenge of finding
                somewhere safe, comfortable and right for you.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-16 lg:space-y-24">
            {storySteps.map((step, index) => {
              const Icon = step.icon;
              const reverse = index % 2 === 1;

              return (
                <ScrollReveal key={step.number} delay={0.08}>
                  <div
                    className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                      reverse ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="group relative">
                      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl lg:rounded-3xl">
                        <img
                          src={step.image}
                          alt={step.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 flex items-center gap-3 text-ivory sm:bottom-7 sm:left-7">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="text-sm font-medium tracking-wide">
                            {step.label}
                          </span>
                        </div>
                      </div>
                      <span className="absolute -left-3 -top-5 font-display text-6xl font-bold text-sage/25 sm:-left-5 sm:text-8xl">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="mb-3 text-sm font-medium uppercase tracking-wide-nav text-sage">
                        Chapter {step.number}
                      </p>
                      <h3 className="font-display text-2xl font-bold leading-tight text-balance sm:text-3xl lg:text-4xl">
                        {step.title}
                      </h3>
                      <p className="mt-5 text-base leading-relaxed text-secondary-text sm:text-lg">
                        {step.description}
                      </p>

                      {index === 1 && (
                        <div className="mt-7 flex flex-wrap gap-2">
                          {[
                            'Where should I live?',
                            'Is it trustworthy?',
                            'Will I fit in?',
                          ].map((question) => (
                            <span
                              key={question}
                              className="rounded-full border border-black/10 bg-ivory/70 px-4 py-2 text-sm text-secondary-text"
                            >
                              {question}
                            </span>
                          ))}
                        </div>
                      )}

                      {index === 2 && (
                        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-sage/20 bg-ivory/70 p-4 sm:p-5">
                          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                          <p className="text-sm leading-relaxed text-secondary-text">
                            Your priorities come first. Tell us what you need,
                            and take the first step toward a place that feels
                            right.
                          </p>
                        </div>
                      )}

                      {index === 2 && (
                        <button
                          onClick={scrollToOnboarding}
                          className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-white transition-colors hover:bg-charcoal"
                        >
                          Start your search
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.1}>
            <div className="mt-20 rounded-3xl bg-ivory px-6 py-10 text-center sm:px-12 lg:mt-28 lg:py-14">
              <Users className="mx-auto h-8 w-8 text-sage" />
              <h3 className="mt-5 font-display text-2xl font-bold sm:text-3xl">
                Because a place is more than four walls.
              </h3>
              <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-secondary-text">
                It&apos;s where your next chapter begins, new friendships
                take shape, and a strange city slowly starts feeling familiar.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== LIFESTYLE STORY ==================== */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-9xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal className="order-2 lg:order-1 lg:col-span-7">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl lg:rounded-3xl">
              <img
                src={storyImage.url}
                alt={storyImage.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal
            delay={0.15}
            className="order-1 lg:order-2 lg:col-span-5"
          >
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-wide-nav text-sage">
                Why sthero
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
                Living should feel easier.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-secondary-text text-pretty">
                Finding the right place shouldn&apos;t be overwhelming.
                We&apos;re here to make the search feel more personal, more
                human, and a little less like a chore.
              </p>
              <div className="mt-8 h-px w-16 bg-sage" />
              <p className="mt-6 text-base leading-relaxed text-secondary-text">
                Tell us where you&apos;d like to live, what matters to you,
                and whether you&apos;re a student or a professional.
                We&apos;ll take it from there.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
          

      {/* ==================== USER FEEDBACK ==================== */}
      <section
        id="share-experience"
        className="scroll-mt-16 bg-beige px-5 py-20 sm:px-8 lg:px-12 lg:py-32"
      >
        <div className="mx-auto grid max-w-9xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal className="lg:sticky lg:top-24 lg:col-span-5">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide-nav text-sage">
              Your voice matters
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
              Tell us what finding a place is really like.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-secondary-text">
              Are you still searching? Have you finally found a place? Or
              have you already experienced the challenges of moving to a
              new city?
            </p>
            <p className="mt-4 leading-relaxed text-secondary-text">
              We want to hear the real stories, frustrations and ideas that
              can help us build a better living experience for students and
              working professionals.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl">
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
                  <p className="mt-3 max-w-md leading-relaxed text-secondary-text">
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
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 font-medium transition-colors hover:bg-beige"
                  >
                    Share another response
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={submitFeedback} className="space-y-8">
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

                  {/* Journey stage */}
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
                            checked={feedback.journeyStage === option.value}
                            onChange={() =>
                              setFeedback((previous) => ({
                                ...previous,
                                journeyStage: option.value as JourneyStage,
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

                  {/* Challenges */}
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
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={
                                !checked && feedback.challenges.length >= 8
                              }
                              onChange={() => toggleChallenge(challenge)}
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

                  {/* City */}
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

                  {/* Personal experience */}
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

                  {/* Suggestions */}
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

                  {/* Consent */}
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
                      I agree that sthero may use my feedback anonymously to
                      understand accommodation challenges and improve its
                      services. I understand that this does not authorize
                      publication of my written story as a personal
                      testimonial.
                    </span>
                  </label>

                  {/* Errors */}
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

                  {/* Submit */}
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
                    No name or email is requested in this form. Please avoid
                    including sensitive personal information in your story.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== CLOSING CTA ==================== */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={closingImage.url}
          alt={closingImage.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight-hero text-ivory text-balance sm:text-5xl lg:text-6xl">
              Your next chapter starts here.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <button
              onClick={scrollToOnboarding}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-sage hover:text-ivory"
            >
              Find Your Place
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </ScrollReveal>
          <button
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