
import { useCallback, useRef, type ReactNode, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Heart,
  Compass,
  ShieldCheck,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Handshake,
  Target,
  Network,
  type LucideIcon,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import {
  aboutHeroImages,
  aboutStoryImage,
  aboutClosingImage,
} from '@/lib/images';

type Mission = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type TeamMember = {
  name: string;
  role: string;
  education: string;
  experience?: string;
  responsibility: string;
  icon: LucideIcon;
};

const missions: Mission[] = [
  {
    icon: Heart,
    title: 'Make Housing More Human',
    description:
      'We believe finding a place to live should begin with people, not property listings.',
  },
  {
    icon: ShieldCheck,
    title: 'Build Trust Through Community',
    description:
      'We want to make every housing decision easier with real people, real experiences, and meaningful community connections.',
  },
  {
    icon: Network,
    title: 'Create a Better Housing Ecosystem',
    description:
      'Our vision is to build a connected ecosystem where residents, communities, and property owners grow together.',
  },
];

const values: Mission[] = [
  {
    icon: Users,
    title: 'People First',
    description:
      'Every housing journey starts with a person. We put individual needs, preferences, and circumstances at the heart of finding a place to live.',
  },
  {
    icon: Handshake,
    title: 'Trust Through Community',
    description:
      'Finding a home is easier when you have people you can relate to. We bring housing seekers closer to relevant communities and real connections.',
  },
  {
    icon: Compass,
    title: 'A Better Housing Ecosystem',
    description:
      'We want residents, students, working professionals, and property owners to discover opportunities and grow together.',
  },
];

const teamMembers: TeamMember[] = [
  {
    name: 'Manoj Singh',
    role: 'Co-founder · Marketing & Fundraising',
    education: 'IIT Bombay',
    experience: 'Ex-Investment Analyst, Opulence',
    responsibility: 'Leads marketing and fundraising.',
    icon: Target,
  },
  {
    name: 'Tejaswi Raj',
    role: 'Co-founder · Business & Growth Strategy',
    education: 'MNNIT Allahabad',
    experience: 'Ex-Team Lead, GetWork',
    responsibility: 'Leads business development and growth strategy.',
    icon: BriefcaseBusiness,
  },
  {
    name: 'Ashish Kumar',
    role: 'Co-founder · Technology & Product',
    education: 'MNNIT Allahabad',
    experience: 'Ex-Software Engineer, Oracle',
    responsibility: 'Leads technology and product development.',
    icon: Building2,
  },
  {
    name: 'Satyam Kumar',
    role: 'Co-founder · Operations & Partnerships',
    education: 'BIT Sindri',
    responsibility: 'Leads operations and partnerships.',
    icon: Handshake,
  },
];

/**
 * The horizontal scroller is the IntersectionObserver root.
 * Therefore, cards animate when they enter view during a horizontal swipe,
 * rather than relying only on the page's vertical scroll position.
 */
function HorizontalCard({
  children,
  index,
  root,
  className = '',
  reduceMotion,
}: {
  children: ReactNode;
  index: number;
  root: RefObject<HTMLDivElement | null>;
  className?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 36, y: 8 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ root, once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const missionScroller = useRef<HTMLDivElement>(null);
  const valuesScroller = useRef<HTMLDivElement>(null);
  const teamScroller = useRef<HTMLDivElement>(null);

  const handleGetStarted = useCallback(() => {
    navigate('/');

    window.setTimeout(() => {
      document.getElementById('onboarding')?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 400);
  }, [navigate, reduceMotion]);

  return (
    <main className="overflow-hidden bg-ivory text-charcoal">
      {/* ABOUT HERO */}
      <section className="relative h-[76svh] min-h-[540px] max-h-[800px] w-full overflow-hidden sm:min-h-[580px]">
        <motion.div
          initial={{ scale: reduceMotion ? 1 : 1.06 }}
          animate={{ scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 7,
            ease: 'easeOut',
          }}
          className="absolute inset-0"
        >
          <img
            src={aboutHeroImages[0].url}
            alt={aboutHeroImages[0].alt}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-charcoal/25" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-10 pt-24 text-center sm:px-8 sm:pb-14 sm:pt-28 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              delay: reduceMotion ? 0 : 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-4xl"
          >
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/85 sm:mb-6 sm:text-xs sm:tracking-[0.24em]">
              A community-driven housing platform
            </p>

            <h1 className="font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              More than a place to stay.
              <span className="mt-2 block font-medium italic text-ivory/85">
                A place to belong.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ivory/90 sm:mt-6 sm:text-base lg:text-lg">
              sthero helps students and working professionals find suitable
              housing and discover the communities that make a new place feel
              like home.
            </p>

            <button
              type="button"
              onClick={handleGetStarted}
              className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-ivory px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-300 hover:bg-sage hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal sm:mt-8 sm:px-7 sm:py-3.5 sm:text-base"
            >
              Find your place
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-ivory/20" />
      </section>

      {/* ABOUT US */}

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-9 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal delay={0.12} className="lg:col-span-12">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                About us
              </p>

              <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                Finding a home should feel more human.
              </h2>

              <div className="mx-auto mt-5 max-w-3xl space-y-4 text-sm leading-7 text-secondary-text sm:mt-6 sm:text-base sm:leading-8">
                <p>
                  sthero is an IIT Bombay-based, community-driven housing
                  platform that helps students and working professionals find
                  suitable PGs, rooms, and flats based on their budget,
                  location, and preferences.
                </p>

                <p>
                  We also help housing seekers discover relevant communities,
                  including college alumni, colleagues, and residents, so they
                  can build meaningful connections around where they live.
                </p>

                <p>
                  With a growing network across 30+ colleges and 900+ students
                  and working professionals, sthero helps property owners reach
                  relevant housing seekers.
                </p>
              </div>

              <div className="mx-auto mt-7 h-px w-14 bg-sage" />

              <p className="mx-auto mt-5 max-w-3xl font-display text-base font-semibold leading-relaxed text-charcoal sm:text-lg">
                A good place to live is about more than four walls. It is about
                the people and possibilities around you.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* OUR MISSION */}
      <section className="bg-beige px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                Why we exist
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Our mission
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-text sm:mt-5 sm:text-base lg:text-lg">
                We are building a more connected housing experience, where
                people come first and communities make all the difference.
              </p>
            </div>
          </ScrollReveal>

          <div
            ref={missionScroller}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:gap-6"
            aria-label="Our mission cards; swipe horizontally on mobile"
          >
            {missions.map((mission, index) => {
              const Icon = mission.icon;

              return (
                <HorizontalCard
                  key={mission.title}
                  index={index}
                  root={missionScroller}
                  reduceMotion={reduceMotion}
                  className="w-[84%] min-w-[84%] snap-start md:w-auto md:min-w-0"
                >
                  <article className="group h-full min-h-[250px] rounded-2xl border border-warm-border bg-ivory p-6 transition-all duration-300 hover:border-sage/60 hover:shadow-lg sm:rounded-3xl sm:p-7 lg:p-8">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-warm-border bg-beige transition-colors duration-300 group-hover:border-sage/40 group-hover:bg-sage/10 sm:mb-6 sm:h-12 sm:w-12">
                      <Icon
                        className="h-5 w-5 text-sage"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-sage">
                      0{index + 1}
                    </p>

                    <h3 className="font-display text-lg font-semibold leading-snug sm:text-xl lg:text-2xl">
                      {mission.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-secondary-text sm:mt-4 sm:text-base">
                      {mission.description}
                    </p>
                  </article>
                </HorizontalCard>
              );
            })}
          </div>

          <p className="mt-1 text-center text-xs text-secondary-text md:hidden">
            Swipe to explore <span aria-hidden="true">→</span>
          </p>
        </div>
      </section>

      {/* WHAT WE BELIEVE IN */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mb-10 max-w-2xl sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                What guides us
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                What we believe in.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary-text sm:mt-5 sm:text-base lg:text-lg">
                The principles behind every connection, every housing search,
                and every step towards a better living experience.
              </p>
            </div>
          </ScrollReveal>

          <div
            ref={valuesScroller}
            className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0 lg:gap-10"
            aria-label="Our values; swipe horizontally on mobile"
          >
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <HorizontalCard
                  key={value.title}
                  index={index}
                  root={valuesScroller}
                  reduceMotion={reduceMotion}
                  className="w-[84%] min-w-[84%] snap-start md:w-auto md:min-w-0"
                >
                  <article className="group h-full min-h-[245px] border-t border-warm-border bg-ivory/40 pt-6 sm:pt-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-warm-border bg-beige transition-all duration-300 group-hover:border-sage/50 group-hover:bg-sage/10 sm:mb-6 sm:h-14 sm:w-14">
                      <Icon
                        className="h-5 w-5 text-sage sm:h-6 sm:w-6"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="font-display text-xl font-semibold sm:text-2xl">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-secondary-text sm:mt-4 sm:text-base">
                      {value.description}
                    </p>
                  </article>
                </HorizontalCard>
              );
            })}
          </div>

          <p className="mt-1 text-center text-xs text-secondary-text md:hidden">
            Swipe to explore <span aria-hidden="true">→</span>
          </p>
        </div>
      </section>

      {/* MEET THE TEAM */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                The people behind sthero
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Meet the team.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-text sm:mt-5 sm:text-base lg:text-lg">
                Different strengths, one shared vision: making the housing
                experience more connected, trustworthy, and human.
              </p>
            </div>
          </ScrollReveal>

          <div
            ref={teamScroller}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:gap-5 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-6"
            aria-label="Meet the team; swipe horizontally on mobile"
          >
            {teamMembers.map((member, index) => {
              const Icon = member.icon;

              return (
                <HorizontalCard
                  key={member.name}
                  index={index}
                  root={teamScroller}
                  reduceMotion={reduceMotion}
                  className="w-[88%] min-w-[88%] snap-start sm:w-[78%] sm:min-w-[78%] md:w-auto md:min-w-0"
                >
                  <article className="group flex h-full min-h-[300px] flex-col rounded-2xl border border-warm-border bg-ivory p-5 transition-all duration-300 hover:border-sage/60 hover:shadow-lg sm:rounded-3xl sm:p-7 lg:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warm-border bg-beige transition-colors duration-300 group-hover:border-sage/40 group-hover:bg-sage/10 sm:h-14 sm:w-14">
                        <Icon
                          className="h-5 w-5 text-sage sm:h-6 sm:w-6"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl font-semibold sm:text-2xl">
                          {member.name}
                        </h3>

                        <p className="mt-1.5 text-sm font-medium leading-relaxed text-sage">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-warm-border pt-5">
                      <div className="flex items-start gap-3">
                        <GraduationCap
                          className="mt-0.5 h-4 w-4 shrink-0 text-secondary-text"
                          aria-hidden="true"
                        />

                        <p className="text-sm leading-relaxed text-secondary-text">
                          {member.education}
                        </p>
                      </div>

                      {member.experience && (
                        <div className="flex items-start gap-3">
                          <BriefcaseBusiness
                            className="mt-0.5 h-4 w-4 shrink-0 text-secondary-text"
                            aria-hidden="true"
                          />

                          <p className="text-sm leading-relaxed text-secondary-text">
                            {member.experience}
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-secondary-text sm:text-base">
                      {member.responsibility}
                    </p>
                  </article>
                </HorizontalCard>
              );
            })}
          </div>

          <p className="mt-1 text-center text-xs text-secondary-text md:hidden">
            Swipe to meet everyone <span aria-hidden="true">→</span>
          </p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative h-[54vh] min-h-[400px] max-h-[600px] w-full overflow-hidden">
        <img
          src={aboutClosingImage.url}
          alt={aboutClosingImage.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-charcoal/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-12 text-center sm:px-8 sm:py-14">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/80 sm:mb-5 sm:text-xs sm:tracking-[0.22em]">
                Your next chapter starts here
              </p>

              <h2 className="font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                Let's find more than a place.
                <span className="mt-2 block font-medium italic text-ivory/85">
                  Let's find your people.
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/85 sm:mt-5 sm:text-base lg:text-lg">
                Discover housing that fits your life and communities that make
                a new city feel a little more like home.
              </p>

              <button
                type="button"
                onClick={handleGetStarted}
                className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-ivory px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-300 hover:bg-sage hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal sm:mt-7 sm:px-7 sm:py-3.5 sm:text-base"
              >
                Find your place
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
