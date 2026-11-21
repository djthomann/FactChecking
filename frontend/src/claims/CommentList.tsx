import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardBody, CardHeader, ListGroup, ListGroupItem } from "reactstrap";
import type { Comment } from "../types/Claim";

const fetchComments = async (claimId: number): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`/api/claims/${claimId}/comments`);

    console.log(response);

    return response.data;
};

function CommentList({ claimId }: { claimId: number }) {

    const queryClient = useQueryClient();

    const { data: comments } = useQuery({
        queryKey: ['claims', claimId, "comments"],
        queryFn: () => fetchComments(claimId),
    });

    return (
        <Card className="shadow-sm">
            <CardHeader>Comments</CardHeader>
            
            <CardBody className="p-0">
                <ListGroup flush>
                    {comments?.map((comment, index) => (
                        <ListGroupItem key={index}>
                            <div className="fw-semibold small text-muted mb-1">
                                User
                            </div>
                            <div style={{ whiteSpace: "pre-wrap" }}>{comment.text}</div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </CardBody>
        </Card>
    )
}

export default CommentList