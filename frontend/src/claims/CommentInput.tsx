import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Form, Input, Label, Spinner } from "reactstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/comments";
import { COMMENT_STANCE_LABELS, CommentStance } from "../types/Claim";
import { STANCE_COLORS } from "../components/badges/StanceBadge";

function CommentInput({ claimId }: { claimId: number }) {

    const [newComment, setNewComment] = useState("");
    const [stance, setStance] = useState<CommentStance>(CommentStance.NEUTRAL);
    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: (text: string) => createComment(claimId, { text, stance}),
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
         <Card className="shadow-sm">
    <CardHeader className="fw-semibold">Your comment</CardHeader>
    <CardBody>
        <Form onSubmit={handleSubmit}>
            <Input
                type="textarea"
                rows={3}
                placeholder="Add a comment…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={addCommentMutation.isPending}
            />

            <div className="d-flex justify-content-between align-items-center gap-2 mt-2">
                <div className="d-flex align-items-center gap-2">
                    {Object.values(CommentStance).map((s) => (
                        <Button
                            key={s}
                            type="button"
                            size="sm"
                            color={stance !== s ? ("secondary") : (STANCE_COLORS[s])}
                            outline={stance !== s}
                            onClick={() => setStance(s)}
                            aria-pressed={stance === s}
                            style={
                                {
                                    "--bs-btn-hover-bg": `var(--bs-${STANCE_COLORS[s]})`,
                                    "--bs-btn-hover-border-color": `var(--bs-${STANCE_COLORS[s]})`,
                                    "--bs-btn-hover-color": "#fff",
                                } as React.CSSProperties
                            }
                        >
                            {COMMENT_STANCE_LABELS[s]}
                        </Button>
                    ))}
                </div>

                <Button
                    color="primary"
                    size="sm"
                    type="submit"
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                >
                    {addCommentMutation.isPending 
                        ? 
                        <Spinner size="sm" /> 
                        : 
                        <i className="bi bi-send-fill me-1 d-inline-block"
                            style={{ transform: "rotate(45deg)" }}
                        ></i>
                    }
                </Button>
            </div>
        </Form>
    </CardBody>
</Card>
    )


}

export default CommentInput;