import axios from "axios";
import { useState, type SubmitEvent } from "react";
import { Button, Card, CardBody, Form, Input } from "reactstrap";
import type { CreateCommentRequest } from "../types/Claim";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateCommentVariables = {
    claimId: number;
    request: Omit<CreateCommentRequest, "id">;
};

const createComment = async ({ claimId, request }: CreateCommentVariables): Promise<Comment> => {
    const response = await axios.post<Comment>(`/api/claims/${claimId}/comments`, request);
    return response.data;
};

function CommentInput({ claimId }: { claimId: number }) {

    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claims"] });
            setNewComment("");
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = newComment.trim();
        if (!text) return;
        addCommentMutation.mutate({ claimId, request: { text } });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="textarea"
                rows={2}
                placeholder="Add a comment…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="d-flex justify-content-end mt-2">
                <Button color="primary" size="sm" type="submit">
                    Post comment
                </Button>
            </div>    
        </Form>
    )


}

export default CommentInput;