import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Badge, Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner, UncontrolledDropdown } from "reactstrap";
import type { Comment } from "../types/Claim";
import OptionsMenu from "../components/OptionsMenu";
import { useMe } from "../hooks/useMe";

const fetchComments = async (claimId: number): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`/api/claims/${claimId}/comments`);

    console.log(response);

    return response.data;
};

const deleteComment = async (commentId: number): Promise<void> => {
    await axios.delete(`/api/comments/${commentId}`);
};

function CommentList({ claimId }: { claimId: number }) {

    const queryClient = useQueryClient();
    const { data: me, isPending: isMePending } = useMe();

    const { data: comments, isPending, isError, error } = useQuery({
        queryKey: ['claims', claimId, "comments"],
        queryFn: () => fetchComments(claimId),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["claims", claimId, "comments"],
            });
        },
    });

    return (
        <Card className="shadow-sm">
            <CardHeader>Comments</CardHeader>
            
            {isPending ? (
                <CardBody className="text-center text-muted">
                    <Spinner animation="border" role="status" size="sm" className="me-2" />
                    Loading Comments...
                </CardBody>
            ) : isError ? (
                <CardBody className="text-center text-muted">
                    <i className="bi bi-exclamation-triangle fs-1 d-block mb-2" />
                    Error: {error.message}
                </CardBody>
            ) : comments?.length == 0 ? (
                <CardBody className="text-center text-muted">
                    <i className="bi bi-chat-square fs-1 d-block mb-2" />
                    There are no comments at the moment.
                </CardBody>
            ) : (
                <ListGroup flush className="border-0">
                {comments?.map((comment) => (
                    <ListGroupItem key={comment.id}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <div className="fw-semibold small text-muted">
                                <Badge color="light" className="text-dark border"><i className="bi bi-person me-1"></i>{comment.authorUsername}</Badge>
                            </div>

                            {!!me && me.username === comment?.authorUsername && (
                                <OptionsMenu
                                items={[
                                    {
                                        label: "Delete",
                                        icon: "bi-trash",
                                        danger: true,
                                        disabled: deleteMutation.isPending,
                                        onClick: () => deleteMutation.mutate(comment.id),
                                    },
                                ]}
                            />
                            )}
                        </div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{comment.text}</div>
                    </ListGroupItem>
                ))}
            </ListGroup>
            )} 
        </Card>
    )
}

export default CommentList