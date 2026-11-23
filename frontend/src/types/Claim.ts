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
  stance: CommentStance;
}

export interface CreateCommentRequest {
  text: string
}

export const CommentStance = {
  NEUTRAL: "NEUTRAL",
  PRO: "PRO",
  CONTRA: "CONTRA",
} as const;

export type CommentStance = typeof CommentStance[keyof typeof CommentStance];

export const COMMENT_STANCE_LABELS: Record<CommentStance, string> = {
  NEUTRAL: "Neutral",
  PRO: "Pro",
  CONTRA: "Contra",
};



export const ClaimStatus = {
    VERIFIED: "VERIFIED",
    UNVERIFIED: "UNVERIFIED",
} as const;

export type ClaimStatus = typeof ClaimStatus[keyof typeof ClaimStatus];

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
    VERIFIED: "Verified",
    UNVERIFIED: "Unverified",
};




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