
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
 * Cards animate when they enter view during a horizontal swipe.
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
      <section className="group relative isolate min-h-[760px] w-full overflow-hidden bg-charcoal sm:min-h-[780px] lg:min-h-[820px]">
        {/* Background Image */}
        <motion.div
          initial={{ scale: reduceMotion ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 8,
            ease: 'easeOut',
          }}
          className="absolute inset-0"
        >
          <img
            src={aboutHeroImages[0].url}
            alt={aboutHeroImages[0].alt}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        {/* Layered Image Treatment */}
        <div className="absolute inset-0 bg-charcoal/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/45 to-charcoal/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-transparent" />

        {/* Decorative Detail */}
        <div
          aria-hidden="true"
          className="absolute left-5 top-0 h-20 w-px bg-ivory/30 sm:left-10 sm:h-28 lg:left-16"
        />

        {/* Main Content */}
        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[780px] sm:px-8 sm:py-24 lg:min-h-[820px] lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto w-full max-w-5xl"
          >
            {/* Eyebrow */}
            <div className="mb-7 flex items-center justify-center gap-3 sm:mb-9">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-ivory/65 sm:w-10"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ivory/85 sm:text-xs sm:tracking-[0.32em]">
                The story behind sthero
              </p>

              <span
                aria-hidden="true"
                className="h-px w-7 bg-ivory/65 sm:w-10"
              />
            </div>

            {/* Heading */}
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-7xl">
              Finding a home
              <span className="mt-1 block font-medium italic text-ivory/75 sm:mt-2">
                should feel more human.
              </span>
            </h1>

            {/* Accent */}
            <div className="mx-auto mt-7 flex items-center justify-center gap-2 sm:mt-9">
              <span className="h-1 w-1 rounded-full bg-ivory/60" />
              <span className="h-px w-12 bg-ivory/70 sm:w-16" />
              <span className="h-1 w-1 rounded-full bg-ivory/60" />
            </div>

            {/* Story Copy */}
            <div className="mx-auto mt-7 max-w-3xl space-y-4 text-sm leading-7 text-ivory/85 sm:mt-9 sm:space-y-5 sm:text-base sm:leading-8 lg:text-[17px]">
              <p>
                sthero is an IIT Bombay-based, community-driven housing
                platform helping students and working professionals find
                PGs, rooms, and flats that fit their budget, location,
                and preferences.
              </p>

              <p>
                Because finding a place is only the beginning. We help
                people discover communities through college alumni,
                colleagues, and residents, making it easier to feel
                connected in a new place.
              </p>

              <p>
                We are building a better housing experience for seekers
                and property owners, bringing relevant people and housing
                opportunities closer together.
              </p>
            </div>

            {/* Community Stats */}
            <div className="mx-auto mt-9 flex max-w-xl items-center justify-center sm:mt-11">
              <div className="flex-1 px-4 py-1 sm:px-8">
                <p className="font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
                  30<span className="text-ivory/65">+</span>
                </p>
                <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.18em] text-ivory/70 sm:text-[10px] sm:tracking-[0.22em]">
                  Colleges
                </p>
              </div>

              <div
                aria-hidden="true"
                className="h-12 w-px bg-ivory/30 sm:h-14"
              />

              <div className="flex-1 px-4 py-1 sm:px-8">
                <p className="font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
                  2k<span className="text-ivory/65">+</span>
                </p>
                <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.18em] text-ivory/70 sm:text-[10px] sm:tracking-[0.22em]">
                  Community members
                </p>
              </div>
            </div>

            {/* Closing Statement */}
            <p className="mx-auto mt-8 max-w-2xl font-display text-base font-medium italic leading-relaxed text-ivory sm:mt-10 sm:text-lg lg:text-xl">
              “A good place to live is about more than four walls. It is
              about the people and possibilities around you.”
            </p>
          </motion.div>
        </div>

        {/* Bottom Edge */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-ivory/45 to-transparent"
        />
      </section>

      {/* OUR MISSION — SOFT SAGE BACKGROUND */}
      <section className="relative border-t border-[#dce5d3] bg-[#edf2e7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Subtle Decorative Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#dce8d2]/35 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                Why we exist
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Our mission
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-text sm:mt-5 sm:text-base lg:text-lg">
                We are building a more connected housing experience,
                where people come first and communities make all the
                difference.
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
                  <article className="group h-full min-h-[250px] rounded-2xl border border-[#e6e9df] bg-ivory p-6 transition-all duration-300 hover:border-sage/60 hover:shadow-lg sm:rounded-3xl sm:p-7 lg:p-8">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-warm-border bg-[#f0f3e9] transition-colors duration-300 group-hover:border-sage/40 group-hover:bg-sage/10 sm:mb-6 sm:h-12 sm:w-12">
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

      {/* MEET THE TEAM — LIGHTER GREEN CONTRAST */}
      <section className="relative border-t border-[#e4e9dc] bg-[#f6f8f2] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Soft Background Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#e5eddd]/45 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sage sm:text-sm">
                The people behind sthero
              </p>

              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Meet the team.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-text sm:mt-5 sm:text-base lg:text-lg">
                Different strengths, one shared vision: making the
                housing experience more connected, trustworthy, and human.
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
                  <article className="group flex h-full min-h-[300px] flex-col rounded-2xl border border-[#e6e9df] bg-ivory p-5 transition-all duration-300 hover:border-sage/60 hover:shadow-lg sm:rounded-3xl sm:p-7 lg:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warm-border bg-[#f0f3e9] transition-colors duration-300 group-hover:border-sage/40 group-hover:bg-sage/10 sm:h-14 sm:w-14">
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
                Discover housing that fits your life and communities
                that make a new city feel a little more like home.
              </p>

              <button
                type="button"
                onClick={handleGetStarted}
                className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-ivory px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-300 hover:bg-sage hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal sm:mt-7 sm:px-7 sm:py-3.5 sm:text-base"
              >
                Share Your Housing Needs
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
