import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ListGroup } from "reactstrap";
import type { Comment } from "../types/Claim";

const fetchComments = async (claimId: number): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`/api/claims/${claimId}/comments`);

    console.log(response);

    return response.data;
};

function CommentList({ claimId }: { claimId: number }) {

     const { data: comments } = useQuery({
        queryKey: ['claims', claimId, "comments"],
        queryFn: () => fetchComments(claimId),
    });

    return (
        <div>
            Comments! {claimId}

            <ListGroup>

                {comments?.map((comment) => (
                    <div>{comment.text}</div>
                ))}

            </ListGroup>
        </div>
    )
}

export default CommentList