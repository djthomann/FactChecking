import { useState } from "react";
import { Button, Form, Input } from "reactstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/comments";

function CommentInput({ claimId }: { claimId: number }) {

    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: (text: string) => createComment(claimId, { text }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claims", claimId, "comments"] });
            setNewComment("");
        },
    });

     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = newComment.trim();
        if (!text) return;
        addCommentMutation.mutate(text);
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