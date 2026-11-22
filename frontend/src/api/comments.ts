import axios from "axios";
import type { Comment } from "../types/Claim";

export interface CreateCommentRequest {
    text: string;
}

export const fetchComments = async (claimId: number): Promise<Comment[]> =>
    (await axios.get<Comment[]>(`/api/claims/${claimId}/comments`)).data;

export const deleteComment = async (commentId: number): Promise<void> => {
    await axios.delete(`/api/comments/${commentId}`);
};

export const createComment = async (claimId: number, request: CreateCommentRequest): Promise<Comment> =>
    (await axios.post<Comment>(`/api/claims/${claimId}/comments`, request)).data;