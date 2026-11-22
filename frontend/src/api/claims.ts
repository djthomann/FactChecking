import axios from "axios";
import type { Claim, ClaimCategory, ClaimStatus } from "../types/Claim";

export interface CreateClaimRequest {
  title: string;
  text: string,
  category: ClaimCategory
}

export const createClaim = async (request: Omit<CreateClaimRequest, 'id'>): Promise<Claim> => 
    (await axios.post<Claim>('/api/claims', request)).data;

export const fetchClaim = async (id: number): Promise<Claim> =>
    (await axios.get<Claim>(`/api/claims/${id}`)).data;

export const fetchClaims = async (): Promise<Claim[]> =>
    (await axios.get<Claim[]>("/api/claims")).data;

export const fetchClaimsByUser = async (username: string): Promise<Claim[]> =>
    (await axios.get<Claim[]>("/api/claims", { params: { author: username } })).data;

export const patchClaimStatus = async (id: number, newStatus: ClaimStatus): Promise<Claim> => 
    (await axios.patch<Claim>(`/api/claims/${id}/status`, { status: newStatus })).data

export const patchClaimUrl = async (id: number, url: string): Promise<Claim> =>
    (await axios.patch<Claim>(`/api/claims/${id}/url`, { url })).data;

export const deleteClaim = async (id: number): Promise<void> => {
    await axios.delete(`/api/claims/${id}`);
};

export const getUrlErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
            case 400: return "The server rejected this URL.";
            case 401: return "Please log in again.";
            case 403: return "Only the author can change the URL.";
            case 404: return "This claim no longer exists.";
        }
    }
    return "Saving failed. Please try again.";
};
