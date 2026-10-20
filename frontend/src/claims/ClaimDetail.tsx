import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Claim } from "../types/Claim";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const fetchClaim = async (id: number): Promise<Claim> => {
    const response = await axios.get<Claim>(`/api/claims/${id}`);
    return response.data;
};

function ClaimDetail() {

    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { data: claim, isPending, isError, error } = useQuery({
            queryKey: ['claim'],
            queryFn: () => fetchClaim(Number(id)),
        });
    
    return (<>
        <h1>Claim with ID: {id} here</h1>
        <h2>{claim?.name}</h2>
    </>);
}

export default ClaimDetail