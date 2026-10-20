export interface Claim {
    id: number;
    name: string;
    status: ClaimStatus;
}

export const ClaimStatus = {
    VERIFIED: 'VERIFIED',
    UNVERIFIED: 'UNVERIFIED',
} as const;

export type ClaimStatus = typeof ClaimStatus[keyof typeof ClaimStatus];