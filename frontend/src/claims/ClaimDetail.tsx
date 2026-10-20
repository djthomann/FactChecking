import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type Claim, ClaimStatus} from "../types/Claim";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Badge, Button, Card, CardBody, CardHeader, Spinner} from "reactstrap";

const fetchClaim = async (id: number): Promise<Claim> => {
    const response = await axios.get<Claim>(`/api/claims/${id}`);
    return response.data;
};

const patchClaim = async (id: number, newStatus: ClaimStatus): Promise<Claim> => {
    const response = await axios.patch<Claim>(`/api/claims/${id}/status`, `"${newStatus}"`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.data;
};

function ClaimDetail() {

    const { id } = useParams<{ id: string }>();
    const claimId = Number(id);
    const queryClient = useQueryClient();

    const { data: claim, isPending, isError, error } = useQuery({
            queryKey: ['claim', claimId],
            queryFn: () => fetchClaim(claimId),
        });

    const { mutate: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: (newStatus: ClaimStatus) => patchClaim(claimId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claim", claimId] });
        },
        onError: (err) => {
            console.error("Fehler beim Aktualisieren des Status:", err);
        }
    });

    const handleToggleStatus = () => {
        if (!claim) return;
        const nextStatus = claim.status === ClaimStatus.UNVERIFIED
            ? ClaimStatus.VERIFIED
            : ClaimStatus.UNVERIFIED;

        updateStatus(nextStatus);
    };

    if (isPending) {
        return <div className="text-center p-4 text-muted">Lade Claim...</div>;
    }

    if (isError) {
        return <div className="text-center p-4 text-danger">Fehler beim Laden: {error.message}</div>;
    }
    
    return (<>
        {claim ? (
            <Card className="shadow-sm">
                <CardHeader className="d-flex justify-content-between align-items-center gap-4">
                    <div className="d-flex align-items-center gap-4">
                        <Badge color="light" className="text-dark border">#{id}</Badge>
                        <h4 className="mb-0">{claim?.name}</h4>
                    </div>
                    <Badge color={claim.status === ClaimStatus.UNVERIFIED ? "danger" : "success"}
                           className="border">{claim.status}</Badge>

                </CardHeader>
                <CardBody className="d-flex gap-2 align-items-center">
                    <Button
                        color={claim.status === ClaimStatus.UNVERIFIED ? "primary" : "warning"}
                        onClick={handleToggleStatus}
                        disabled={isUpdating}
                    >
                        {claim.status === ClaimStatus.UNVERIFIED ? "Verify" : "Unverify"}

                    </Button>
                    {isUpdating ? (
                        <div>
                            <Spinner size="sm" className="me-2" />
                        </div>
                    ) : (
                        <></>
                    )}
                </CardBody>
            </Card>) : (
            <div className="p-4 text-center text-muted">
                Keine Daten zu diesem Claim gefunden.
            </div>
        )
        }
    </>);
}

export default ClaimDetail