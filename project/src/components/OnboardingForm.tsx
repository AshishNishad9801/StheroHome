
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Home,
} from 'lucide-react';

import TextField from '@/components/form/TextField';
import OptionGroup from '@/components/form/OptionGroup';
import SelectField from '@/components/form/SelectField';
import CitySelector from '@/components/form/CitySelector';
import { indianCities } from '@/lib/cities';
import { supabase } from '@/lib/supabase';

import {
  type FormData,
  type FormErrors,
  type BackgroundType,
  type GenderPreference,
  type BudgetRange,
  initialFormData,
  backgroundOptions,
  genderOptions,
  budgetOptions,
  needsCompany,
  validateStep,
  validateAll,
} from '@/lib/formValidation';

type FormStatus = 'idle' | 'submitting' | 'success';

type AccommodationType =
  | 'PG / Co-living'
  | '1 RK'
  | 'Flat'
  | 'Shared Accommodation'
  | 'Other';

type OnboardingErrors = FormErrors & {
  accommodationType?: string;
};

const accommodationOptions: {
  label: string;
  value: AccommodationType;
}[] = [
  { label: 'PG / Co-living', value: 'PG / Co-living' },
  { label: '1 RK', value: '1 RK' },
  { label: 'Flat', value: 'Flat' },
  { label: 'Shared Accommodation', value: 'Shared Accommodation' },
  { label: 'Other', value: 'Other' },
];

export default function OnboardingForm() {
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData | 'accommodationType', boolean>>
  >({});
  const [accommodationType, setAccommodationType] =
    useState<AccommodationType | ''>('');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [launchEmailConsent, setLaunchEmailConsent] = useState(false);

  const reduceMotion = useReducedMotion();

  const successScreenRef = useRef<HTMLDivElement>(null);

  const fieldRefs = useRef<
    Partial<Record<keyof FormData | 'accommodationType', HTMLElement | null>>
  >({});

  // Automatically bring the confirmation screen into view on mobile.
  useEffect(() => {
    if (status !== 'success') return;

    const frame = window.requestAnimationFrame(() => {
      if (window.innerWidth < 640) {
        successScreenRef.current?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [status, reduceMotion]);

  const setField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (touched[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }

      setSubmissionError('');
    },
    [touched],
  );

  const handleBlur = useCallback(
    (field: keyof FormData) => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      setErrors((prev) => {
        const next = { ...prev };
        const error = validateStep(step, data)[field];

        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }

        return next;
      });
    },
    [data, step],
  );

  const focusFirstError = useCallback(
    (stepErrors: OnboardingErrors) => {
      const fieldOrder: (keyof FormData | 'accommodationType')[] =
        step === 1
          ? ['fullName', 'email', 'phone', 'college', 'city']
          : ['background', 'company', 'accommodationType'];

      for (const field of fieldOrder) {
        if (
          stepErrors[field as keyof FormData] ||
          (field === 'accommodationType' && !accommodationType)
        ) {
          const el = fieldRefs.current[field];

          if (el) {
            const input = el.querySelector(
              'input, select, button[role="radio"], button[type="button"]',
            ) as HTMLElement | null;

            (input ?? el).focus();
            break;
          }
        }
      }
    },
    [step, accommodationType],
  );

  // STEP 1 VALIDATION
  const handleContinue = useCallback(() => {
    const stepErrors: OnboardingErrors = {
      ...validateStep(1, data),
    };

    if (!data.college?.trim()) {
      stepErrors.college =
        'Please enter your college or university name.';
    }

    const step1Fields: (keyof FormData)[] = [
      'fullName',
      'email',
      'phone',
      'college',
      'city',
    ];

    setTouched((prev) => {
      const next = { ...prev };

      step1Fields.forEach((field) => {
        next[field] = true;
      });

      return next;
    });

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      focusFirstError(stepErrors);
      return;
    }

    setSubmissionError('');
    setStep(2);
  }, [data, focusFirstError]);

  const handleBack = useCallback(() => {
    if (status === 'submitting') return;

    setStep(1);
    setErrors({});
    setSubmissionError('');
  }, [status]);

  // STEP 2 SUBMISSION
  const handleSubmit = useCallback(async () => {
    if (status === 'submitting') return;

    const allErrors: OnboardingErrors = {
      ...validateAll(data),
    };

    if (!data.college?.trim()) {
      allErrors.college =
        'Please enter your college or university name.';
    }

    if (needsCompany(data.background) && !data.company?.trim()) {
      allErrors.company = 'Please enter your company name.';
    }

    if (!accommodationType) {
      allErrors.accommodationType =
        'Please choose the type of accommodation you need.';
    }

    setTouched((prev) => ({
      ...prev,
      background: true,
      college: true,
      company: true,
      accommodationType: true,
    }));

    setErrors(allErrors);
    setSubmissionError('');

    if (Object.keys(allErrors).length > 0) {
      setStep(2);
      focusFirstError(allErrors);
      return;
    }

    setStatus('submitting');

    try {
      const { error } = await supabase
        .from('early_access_registrations')
        .insert({
          full_name: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          city: data.city.trim(),
          locality: data.locality?.trim() || null,
          background: data.background,
          college: data.college?.trim() || null,
          company: needsCompany(data.background)
            ? data.company?.trim() || null
            : null,
          accommodation_type: accommodationType,
          gender_preference: data.genderPreference || null,
          budget: data.budget || null,
          move_date: data.moveDate || null,
          launch_email_consent: launchEmailConsent,
        });

      if (error) {
        if (error.code === '23505') {
          setSubmissionError(
            'This email address is already registered. Try another email address.',
          );
        } else if (
          error.code === '42501' ||
          error.code === '401'
        ) {
          setSubmissionError(
            'We could not submit your details because of a permissions issue. Please try again later.',
          );
        } else {
          console.error('Supabase registration error:', error);

          setSubmissionError(
            'We could not save your details right now. Please check your connection and try again.',
          );
        }

        setStatus('idle');
        return;
      }

      // Only show confirmation after a successful database insert.
      setStatus('success');
    } catch (error) {
      console.error('Registration submission failed:', error);

      setSubmissionError(
        'Something went wrong while submitting your details. Please try again.',
      );

      setStatus('idle');
    }
  }, [
    data,
    accommodationType,
    focusFirstError,
    launchEmailConsent,
    status,
  ]);

  const isSubmitting = status === 'submitting';

  // SUCCESS SCREEN
  if (status === 'success') {
    return (
      <SuccessScreen
        screenRef={successScreenRef}
        reduceMotion={reduceMotion}
      />
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-warm-border bg-ivory p-6 sm:rounded-3xl sm:p-8 lg:p-10">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {step === 1
              ? 'About you & location'
              : 'Housing preferences'}
          </h3>

          <span className="text-xs font-medium uppercase tracking-wide-nav text-sage">
            Step {step} of 2
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-sage" />

          <div
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              step === 2 ? 'bg-sage' : 'bg-warm-border'
            }`}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 space-y-5"
          >
            {/* About you */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide-nav text-sage">
                About you
              </p>

              <div className="space-y-4">
                <div
                  ref={(el) => {
                    fieldRefs.current.fullName = el;
                  }}
                >
                  <TextField
                    label="Full name"
                    value={data.fullName}
                    onChange={(e) =>
                      setField('fullName', e.target.value)
                    }
                    onBlur={() => handleBlur('fullName')}
                    error={
                      touched.fullName ? errors.fullName : undefined
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>

                <div
                  ref={(el) => {
                    fieldRefs.current.email = el;
                  }}
                >
                  <TextField
                    label="Email address"
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                      setField('email', e.target.value)
                    }
                    onBlur={() => handleBlur('email')}
                    error={touched.email ? errors.email : undefined}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div
                  ref={(el) => {
                    fieldRefs.current.phone = el;
                  }}
                >
                  <TextField
                    label="Phone number"
                    type="tel"
                    value={data.phone}
                    onChange={(e) =>
                      setField('phone', e.target.value)
                    }
                    onBlur={() => handleBlur('phone')}
                    error={touched.phone ? errors.phone : undefined}
                    placeholder="98765 43210"
                    prefix="+91"
                    autoComplete="tel"
                  />
                </div>

                <div
                  ref={(el) => {
                    fieldRefs.current.college = el;
                  }}
                >
                  <TextField
                    label="College or university name"
                    value={data.college ?? ''}
                    onChange={(e) =>
                      setField('college', e.target.value)
                    }
                    onBlur={() => handleBlur('college')}
                    error={
                      touched.college ? errors.college : undefined
                    }
                    placeholder="e.g. Delhi University, IIT Bombay"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pt-2">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide-nav text-sage">
                Where you want to live
              </p>

              <div className="space-y-4">
                <div
                  ref={(el) => {
                    fieldRefs.current.city = el;
                  }}
                >
                  <CitySelector
                    label="Which city are you looking for?"
                    value={data.city}
                    onChange={(value) => setField('city', value)}
                    cities={indianCities}
                    error={touched.city ? errors.city : undefined}
                    required
                  />
                </div>

                <TextField
                  label="Preferred locality or area"
                  optional
                  value={data.locality ?? ''}
                  onChange={(e) =>
                    setField('locality', e.target.value)
                  }
                  placeholder="e.g. Koramangala, Bandra West"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* STEP 2 */
          <motion.div
            key="step2"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 space-y-5"
          >
            {/* Background */}
            <div className="space-y-4">
              <div
                ref={(el) => {
                  fieldRefs.current.background = el;
                }}
              >
                <OptionGroup<BackgroundType>
                  label="What best describes you?"
                  options={backgroundOptions}
                  value={data.background}
                  onChange={(value) => {
                    setField('background', value);

                    if (!needsCompany(value)) {
                      setField(
                        'company',
                        '' as FormData['company'],
                      );

                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.company;
                        return next;
                      });
                    }
                  }}
                  error={
                    touched.background
                      ? errors.background
                      : undefined
                  }
                  columns={2}
                />
              </div>

              {/* Company for working professionals */}
              {needsCompany(data.background) && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="company"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, height: 0 }
                    }
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, height: 0 }
                    }
                    transition={{
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div
                      ref={(el) => {
                        fieldRefs.current.company = el;
                      }}
                    >
                      <TextField
                        label="Company name"
                        value={data.company ?? ''}
                        onChange={(e) =>
                          setField('company', e.target.value)
                        }
                        onBlur={() => handleBlur('company')}
                        error={
                          touched.company
                            ? errors.company
                            : undefined
                        }
                        placeholder="e.g. Infosys, Tata Consultancy Services"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Accommodation type */}
            <div
              ref={(el) => {
                fieldRefs.current.accommodationType = el;
              }}
              className="space-y-2"
            >
              <OptionGroup<AccommodationType>
                label="What kind of accommodation are you looking for?"
                options={accommodationOptions}
                value={accommodationType}
                onChange={(value) => {
                  setAccommodationType(value);

                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.accommodationType;
                    return next;
                  });

                  setTouched((prev) => ({
                    ...prev,
                    accommodationType: true,
                  }));
                }}
                error={
                  touched.accommodationType
                    ? errors.accommodationType
                    : undefined
                }
                columns={2}
              />
            </div>

            {/* Other preferences */}
            <div className="space-y-4 pt-2">
              <OptionGroup<GenderPreference>
                label="Preferred accommodation gender"
                options={genderOptions}
                value={data.genderPreference}
                onChange={(value) =>
                  setField('genderPreference', value)
                }
                optional
                columns={3}
              />

              <SelectField
                label="What's your monthly budget"
                value={data.budget}
                onChange={(value) =>
                  setField('budget', value as BudgetRange)
                }
                options={budgetOptions}
                optional
                placeholder="Select a budget range"
              />

              <TextField
                label="When are you planning to move?"
                optional
                type="date"
                value={data.moveDate}
                onChange={(e) =>
                  setField('moveDate', e.target.value)
                }
                placeholder="Select a date"
              />

              {/* Launch email consent */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-warm-border p-4">
                <input
                  type="checkbox"
                  checked={launchEmailConsent}
                  onChange={(e) =>
                    setLaunchEmailConsent(e.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-[#64775a]"
                />

                <span className="text-sm leading-relaxed text-secondary-text">
                  Keep me updated about the sthero launch and
                  important early-access updates.
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission error */}
      {submissionError && (
        <motion.div
          role="alert"
          aria-live="polite"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submissionError}
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center gap-3 border-t border-warm-border pt-6">
        {step === 2 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full border border-warm-border px-5 py-3 text-sm font-medium text-secondary-text transition-all duration-200 hover:bg-beige/60 hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === 1 ? (
          <button
            type="button"
            onClick={handleContinue}
            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:bg-sage focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:bg-sage focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

type SuccessScreenProps = {
  screenRef: React.RefObject<HTMLDivElement>;
  reduceMotion: boolean | null;
};

// SUCCESS SCREEN
function SuccessScreen({
  screenRef,
  reduceMotion,
}: SuccessScreenProps) {
  return (
    <motion.div
      ref={screenRef}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-live="polite"
      className="flex min-h-[440px] scroll-mt-6 flex-col items-center justify-center rounded-2xl border border-warm-border bg-ivory p-7 text-center sm:rounded-3xl sm:p-10 lg:min-h-[520px] lg:p-14"
    >
      {/* Application received status */}
      <motion.div
        initial={
          reduceMotion ? false : { scale: 0.75, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.55,
          delay: 0.1,
          type: 'spring',
          stiffness: 200,
          damping: 16,
        }}
        className="mb-7 flex flex-col items-center"
      >
        <div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-sage/20 bg-sage/10">
          <Check
            className="h-9 w-9 text-sage"
            strokeWidth={2.5}
          />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-sage/20 bg-sage/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sage sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          APPLICATION RECEIVED
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h2
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="max-w-md font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-charcoal text-balance sm:text-4xl"
      >
        You're part of our beginning.
      </motion.h2>

      {/* Subheading */}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="mt-4 max-w-sm text-base leading-relaxed text-secondary-text"
      >
        Thank you for joining our early community.
      </motion.p>

      {/* Personalised guidance */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.4 }}
        className="mt-7 w-full max-w-md rounded-2xl border border-warm-border bg-white/60 p-5 sm:p-6"
      >
        <p className="text-sm leading-[1.9] text-secondary-text sm:text-base">
          Our team will connect with you to share suitable housing
          options and personalised guidance.
        </p>
      </motion.div>

      {/* Coming soon */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.5 }}
        className="mt-6 max-w-sm"
      >
        <p className="font-display text-base font-semibold text-charcoal">
          A new way to find your place is coming.
        </p>

        <p className="mt-2 text-sm leading-relaxed text-secondary-text">
          Our main website is launching soon. Stay connected!
        </p>
      </motion.div>

      {/* Back to Home */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.6 }}
        className="mt-8 w-full sm:w-auto"
      >
        <a
          href="/"
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:bg-sage focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 sm:w-auto"
        >
          <Home className="h-4 w-4" />
          Back to Home
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </motion.div>
    </motion.div>
  );
}
