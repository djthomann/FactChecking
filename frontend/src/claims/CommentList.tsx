import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner, UncontrolledDropdown } from "reactstrap";
import type { Comment } from "../types/Claim";

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
                                User
                            </div>

                            <UncontrolledDropdown>
                                <DropdownToggle
                                    color="link"
                                    size="sm"
                                    className="p-0 text-muted"
                                    aria-label="Optionen"
                                >
                                    <i className="bi bi-three-dots-vertical"></i>
                                </DropdownToggle>
                                <DropdownMenu end>
                                    {/*} TODO
                                    <DropdownItem
                                        onClick={() => {}}
                                    >
                                        <i className="bi bi-trash me-2"></i>
                                        Edit
                                    </DropdownItem>*/}
                                    <DropdownItem
                                        className="text-danger"
                                        onClick={() => {
                                            deleteMutation.mutate(comment.id);
                                        }}
                                    >
                                        <i className="bi bi-trash me-2"></i>
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
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