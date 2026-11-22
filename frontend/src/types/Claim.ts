export interface Claim {
    id: number;
    authorUsername: string,
    title: string;
    text: string;
    url: string;
    status: ClaimStatus;
    category: ClaimCategory;
}

export interface Comment {
  id: number;
  authorUsername: string;
  text: string;
}

export interface CreateClaimRequest {
  title: string;
  text: string,
  category: ClaimCategory
}

export interface CreateCommentRequest {
  text: string
}

export const ClaimStatus = {
    VERIFIED: 'VERIFIED',
    UNVERIFIED: 'UNVERIFIED',
} as const;

export type ClaimStatus = typeof ClaimStatus[keyof typeof ClaimStatus];

export const CATEGORY_DEFINITIONS = [
  { value: 'GENERAL', label: 'General' },
  { value: 'CULTURE_ARTS', label: 'Culture & Arts' },
  { value: 'GEOGRAPHY_PLACES', label: 'Geography & Places' },
  { value: 'HEALTH_FITNESS', label: 'Health & Fitness' },
  { value: 'HISTORY_EVENTS', label: 'History & Events' },
  { value: 'HUMAN_ACTIVITIES', label: 'Human Activities' },
  { value: 'MATHEMATICS_LOGIC', label: 'Mathematics & Logic' },
  { value: 'NATURAL_PHYSICAL_SCIENCES', label: 'Natural & Physical Sciences' },
  { value: 'PEOPLE_SELF', label: 'People & Self' },
  { value: 'PHILOSOPHY_THINKING', label: 'Philosophy & Thinking' },
  { value: 'RELIGION_BELIEF_SYSTEMS', label: 'Religion & Belief Systems' },
  { value: 'SOCIETY_SOCIAL_SCIENCES', label: 'Society & Social Sciences' },
  { value: 'TECHNOLOGY_APPLIED_SCIENCES', label: 'Technology & Applied Sciences' },
] as const;

export const CLAIM_CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_DEFINITIONS.map(c => [c.value, c.label])
) as Record<ClaimCategory, string>;

export type ClaimCategory = typeof CATEGORY_DEFINITIONS[number]['value'];