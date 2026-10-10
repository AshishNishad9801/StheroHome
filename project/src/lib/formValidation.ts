export type BackgroundType = 'student' | 'professional' | 'student_working' | 'other';

export type GenderPreference = 'any' | 'male' | 'female';

export type BudgetRange =
  | 'under_5000'
  | '5000_8000'
  | '8000_12000'
  | '12000_20000'
  | 'above_20000';

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  locality: string;
  background: BackgroundType | '';
  college: string;
  company: string;
  genderPreference: GenderPreference | '';
  budget: BudgetRange | '';
  moveDate: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;

export const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  locality: '',
  background: '',
  college: '',
  company: '',
  genderPreference: '',
  budget: '',
  moveDate: '',
};

export const backgroundOptions: { value: BackgroundType; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'professional', label: 'Working professional' },
  { value: 'student_working', label: 'Student and working' },
  { value: 'other', label: 'Other' },
];

export const genderOptions: { value: GenderPreference; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const budgetOptions: { value: BudgetRange; label: string }[] = [
  { value: 'under_5000', label: 'Under ₹5,000' },
  { value: '5000_8000', label: '₹5,000 – ₹8,000' },
  { value: '8000_12000', label: '₹8,000 – ₹12,000' },
  { value: '12000_20000', label: '₹12,000 – ₹20,000' },
  { value: 'above_20000', label: 'Above ₹20,000' },
];

export const needsCollege = (bg: BackgroundType | '') =>
  bg === 'student' || bg === 'student_working';

export const needsCompany = (bg: BackgroundType | '') =>
  bg === 'professional' || bg === 'student_working';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}

function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Indian mobile numbers: 10 digits starting with 6-9, with or without +91 prefix
  if (/^[6-9]\d{9}$/.test(normalized)) return true;
  if (/^\+91[6-9]\d{9}$/.test(normalized)) return true;
  if (/^91[6-9]\d{9}$/.test(normalized)) return true;
  return false;
}

export function validateField(field: keyof FormData, data: FormData): string | undefined {
  switch (field) {
    case 'fullName':
      if (!data.fullName.trim()) return 'Please enter your full name';
      if (data.fullName.trim().length < 2) return 'Name seems too short';
      return undefined;

    case 'email':
      if (!data.email.trim()) return 'Please enter your email address';
      if (!EMAIL_REGEX.test(data.email.trim())) return 'Please enter a valid email address';
      return undefined;

    case 'phone':
      if (!data.phone.trim()) return 'Please enter your phone number';
      if (!isValidIndianPhone(data.phone.trim()))
        return 'Enter a valid 10-digit Indian mobile number';
      return undefined;

    case 'city':
      if (!data.city.trim()) return 'Please select or enter your city';
      return undefined;

    case 'background':
      if (!data.background) return 'Please select what best describes you';
      return undefined;

    case 'college':
      if (needsCollege(data.background) && !data.college.trim())
        return 'Please enter your college or university name';
      return undefined;

    case 'company':
      if (needsCompany(data.background) && !data.company.trim())
        return 'Please enter your company name';
      return undefined;

    default:
      return undefined;
  }
}

export function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {};
  const step1Fields: (keyof FormData)[] = ['fullName', 'email', 'phone', 'city'];
  const step2Fields: (keyof FormData)[] = ['background', 'college', 'company'];

  const fields = step === 1 ? step1Fields : step2Fields;

  for (const field of fields) {
    const error = validateField(field, data);
    if (error) errors[field] = error;
  }

  return errors;
}

export function validateAll(data: FormData): FormErrors {
  const errors: FormErrors = {};
  const allFields: (keyof FormData)[] = [
    'fullName',
    'email',
    'phone',
    'city',
    'background',
    'college',
    'company',
  ];

  for (const field of allFields) {
    const error = validateField(field, data);
    if (error) errors[field] = error;
  }

  return errors;
}
