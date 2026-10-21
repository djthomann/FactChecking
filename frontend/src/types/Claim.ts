export interface Claim {
    id: number;
    name: string;
    url: string;
    status: ClaimStatus;
}

export interface CreateClaimRequest {
    name: string
}

export const ClaimStatus = {
    VERIFIED: 'VERIFIED',
    UNVERIFIED: 'UNVERIFIED',
} as const;

export type ClaimStatus = typeof ClaimStatus[keyof typeof ClaimStatus];