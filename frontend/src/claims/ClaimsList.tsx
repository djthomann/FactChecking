import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ClaimStatus, type Claim} from "../types/Claim.ts";
import { Badge, Button, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const fetchClaims = async (): Promise<Claim[]> => {
    const response = await axios.get<Claim[]>('/api/claims');
    return response.data;
};

const deleteClaim = async(id: number) => {
    const response = await axios.delete<Claim>(`/api/claims/${id}`);
    return response.data;
}

export function ClaimsList() {

    const queryClient = useQueryClient()

    const { data: claims, isPending, isError, error } = useQuery({
        queryKey: ['claims'],
        queryFn: fetchClaims,
    });

    const deleteClaimQuery = useMutation({
            mutationFn: deleteClaim,
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['claims']
                });
            },
        })

    const [selectedId, setSelectedId] = useState<number | null>(null);

    if (isPending) return <p>Loading Claims...</p>;
    if (isError) return <p style={{ color: 'red' }}>Fehler: {error.message}</p>;

    return (
        
    <Card className="shadow-sm">
    <CardHeader className="d-flex justify-content-between align-items-center">
    <h4 className="mb-0">Claims</h4>
    <Badge color="secondary" pill>
        {claims.length}
    </Badge>
    </CardHeader>

    {claims.length === 0 ? (
      <CardBody className="text-center text-muted">
        <i className="bi bi-inbox fs-1 d-block mb-2" />
        There are no claims at the moment.
      </CardBody>
    ) : (
      <ListGroup flush>
        {claims.map((claim) => (
          <ListGroupItem
            key={claim.id}
            className="list-group-item-action d-flex justify-content-between align-items-center position-relative"
          >
            <Link
              to={`/claims/${claim.id}`}
              className="stretched-link text-decoration-none text-reset d-flex align-items-center gap-3"
            >
              <Badge color="light" className="text-dark border">#{claim.id}</Badge>
              <span className="fw-semibold">{claim.name}</span>
            </Link>

            <Badge color={claim.status === ClaimStatus.UNVERIFIED ? "danger" : "success"} className="border">{claim.status}</Badge>

            {/*<Button
              color="outline-danger"
              size="sm"
              className="position-relative"
              style={{ zIndex: 2 }}
              onClick={() => deleteClaimQuery.mutate(claim.id)}
            >
              <i className="bi bi-trash" />
            </Button>*/}
          </ListGroupItem>
        ))}
      </ListGroup>
    )}
  </Card>
    );
}

export default ClaimsList