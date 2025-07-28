export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  profile: {
    sexual_orientation: string | null;
    city: string | null;
  } | null;
}

export interface ProfileFormData {
  name: string;
  sexual_orientation?: string;
  city?: string;
}

export interface ProfileUpdateResult {
  success: boolean;
  error?: {
    message: string;
    details?: string;
  };
}