import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Home,
  RotateCcw,
  Mail,
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
  needsCollege,
  needsCompany,
  validateStep,
  validateAll,
} from '@/lib/formValidation';

type FormStatus = 'idle' | 'submitting' | 'success';
type OnboardingErrors = FormErrors & {
  accommodationType?: string;
};

type AccommodationType =
  | 'PG / Co-living'
  | '1 RK'
  | 'Flat'
  | 'Shared Accommodation'
  | 'Other';

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

  const fieldRefs = useRef<
    Partial<Record<keyof FormData | 'accommodationType', HTMLElement | null>>
  >({});

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

    // College is collected in Step 1.
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

    // College is collected in Step 1 and reused for students.
    if (!data.college?.trim()) {
      allErrors.college =
        'Please enter your college or university name.';
    }

    // Company is required for working professionals
    // and people who are both students and working.
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
        } else if (error.code === '42501' || error.code === '401') {
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

  const handleStartAgain = useCallback(() => {
    setData(initialFormData);

    setErrors({});

    setTouched({});

    setAccommodationType('');

    setStep(1);

    setStatus('idle');

    setSubmissionError('');

    setLaunchEmailConsent(false);
  }, []);

  // SUCCESS SCREEN
  if (status === 'success') {
    return (
      <SuccessScreen
        onReset={handleStartAgain}
        reduceMotion={reduceMotion}
        launchEmailConsent={launchEmailConsent}
      />
    );
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className="bg-ivory rounded-2xl lg:rounded-3xl border border-warm-border p-6 sm:p-8 lg:p-10 h-full flex flex-col">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {step === 1
              ? 'About you & location'
              : 'Background & preferences'}
          </h3>

          <span className="text-xs font-medium tracking-wide-nav text-sage uppercase">
            Step {step} of 2
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-sage" />

          <div
            className={`flex-1 h-1 rounded-full transition-colors duration-500 ${
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
            className="space-y-5 flex-1"
          >
            {/* About you */}
            <div>
              <p className="text-xs font-semibold tracking-wide-nav text-sage uppercase mb-4">
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
                    error={
                      touched.email ? errors.email : undefined
                    }
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
                    error={
                      touched.phone ? errors.phone : undefined
                    }
                    placeholder="98765 43210"
                    prefix="+91"
                    autoComplete="tel"
                    hint="10-digit Indian mobile number"
                  />
                </div>

                {/* College is asked in Step 1 */}
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
                    hint="If you're a student, we'll use this answer later—no need to enter it twice."
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pt-2">
              <p className="text-xs font-semibold tracking-wide-nav text-sage uppercase mb-4">
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
                    onChange={(value) =>
                      setField('city', value)
                    }
                    cities={indianCities}
                    error={
                      touched.city ? errors.city : undefined
                    }
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
            className="space-y-5 flex-1"
          >
            {/* Background */}
            <div>
              <p className="text-xs font-semibold tracking-wide-nav text-sage uppercase mb-4">
                Your background
              </p>

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

                {/* Show existing college; never ask again */}
                {needsCollege(data.background) && (
                  <div className="rounded-xl border border-warm-border bg-beige/40 p-4">
                    <p className="text-sm font-medium text-charcoal">
                      College or university
                    </p>

                    <p className="mt-1 text-sm text-secondary-text">
                      {data.college?.trim() ||
                        'Your college was not entered in Step 1.'}
                    </p>

                    <p className="mt-2 text-xs text-secondary-text">
                      You don't need to enter it again.
                    </p>
                  </div>
                )}

                {/* Company for working or student + working */}
                {needsCompany(data.background) && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="company"
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, height: 0 }
                      }
                      animate={{
                        opacity: 1,
                        height: 'auto',
                      }}
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
            </div>

            {/* Accommodation type */}
            <div>
              <p className="text-xs font-semibold tracking-wide-nav text-sage uppercase mb-4">
                Accommodation preferences
              </p>

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
            </div>

            {/* Other preferences */}
            <div className="pt-2">
              <p className="text-xs font-semibold tracking-wide-nav text-sage uppercase mb-4">
                Your preferences
              </p>

              <div className="space-y-4">
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
                  label="Expected monthly budget"
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
              </div>
            </div>

            {/* Launch email consent */}
            <div className="pt-2">
              <label className="flex items-start gap-3 rounded-xl border border-warm-border p-4 cursor-pointer hover:bg-beige/40 transition-colors">
                <input
                  type="checkbox"
                  checked={launchEmailConsent}
                  onChange={(e) =>
                    setLaunchEmailConsent(e.target.checked)
                  }
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 shrink-0 accent-sage cursor-pointer"
                />

                <span className="text-sm text-secondary-text leading-relaxed">
                  <span className="font-medium text-charcoal">
                    Email me when sthero launches
                  </span>

                  <span className="block mt-1 text-xs">
                    Get an email with a link to our website when it is
                    ready. This is optional, and you can register
                    without opting in.
                  </span>
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
          initial={
            reduceMotion ? false : { opacity: 0, y: 8 }
          }
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submissionError}
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 pt-6 border-t border-warm-border flex items-center gap-3">
        {step === 2 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full border border-warm-border px-5 py-3 text-sm font-medium text-secondary-text hover:bg-beige/60 hover:text-charcoal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === 1 ? (
          <button
            type="button"
            onClick={handleContinue}
            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory hover:bg-sage transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Continue

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory hover:bg-sage transition-all duration-300 disabled:opacity-70 disabled:cursor-wait focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
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

// SUCCESS SCREEN
function SuccessScreen({
  onReset,
  reduceMotion,
  launchEmailConsent,
}: {
  onReset: () => void;
  reduceMotion: boolean | null;
  launchEmailConsent: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-ivory rounded-2xl lg:rounded-3xl border border-warm-border p-8 sm:p-10 lg:p-14 h-full flex flex-col items-center justify-center text-center min-h-[400px]"
    >
      <motion.div
        initial={
          reduceMotion
            ? false
            : { scale: 0, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.15,
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        className="w-16 h-16 rounded-full bg-sage/12 flex items-center justify-center mb-6"
      >
        <Check
          className="h-8 w-8 text-sage"
          strokeWidth={2.5}
        />
      </motion.div>

      <motion.h3
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 15 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-display text-2xl sm:text-3xl font-bold text-charcoal leading-tight text-balance"
      >
        You're one step closer to finding your place.
      </motion.h3>

      <motion.p
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 15 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 text-base text-secondary-text leading-relaxed max-w-sm text-pretty"
      >
        Thanks for sharing your details with sthero. We're glad
        you're here.
      </motion.p>

      <motion.p
        initial={
          reduceMotion
            ? false
            : { opacity: 0 }
        }
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-4 text-xs text-secondary-text/70 max-w-xs"
      >
        {launchEmailConsent ? (
          <span className="inline-flex items-start justify-center gap-2">
            <Mail className="h-4 w-4 shrink-0 mt-0.5" />

            Your details have been saved. You've opted in to receive
            an email when sthero launches.
          </span>
        ) : (
          'Your details have been saved successfully. Thank you for your interest in sthero.'
        )}
      </motion.p>

      <motion.div
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 15 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
      >
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory hover:bg-sage transition-all duration-300"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </a>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-warm-border px-6 py-3 text-sm font-medium text-secondary-text hover:bg-beige/60 hover:text-charcoal transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4" />
          Start again
        </button>
      </motion.div>
    </motion.div>
  );
}