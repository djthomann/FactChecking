import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type Claim, ClaimStatus} from "../types/Claim";
import axios from 'axios';
import {Link, useNavigate, useParams } from 'react-router-dom';
import {Badge, Button, Card, CardBody, CardHeader, Col, FormFeedback, FormGroup, Input, InputGroup, Label, Row, Spinner} from "reactstrap";
import { useEffect, useState } from "react";

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

const patchClaimUrl = async (id: number, url: string): Promise<Claim> => {
  const response = await axios.patch<Claim>(`/api/claims/${id}/url`, { url });
  return response.data;
};

const deleteClaim = async(id: number) => {
    const response = await axios.delete<Claim>(`/api/claims/${id}`);
    return response.data;
}

function ClaimDetail() {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const claimId = Number(id);

    const { data: claim, isPending, isError, error } = useQuery({
            queryKey: ['claim', claimId],
            queryFn: () => fetchClaim(claimId),
        });

    const [url, setUrl] = useState("");

    useEffect(() => {
        if (claim) {
            setUrl(claim.url ?? "");
        }
    }, [claim]);

    const queryClient = useQueryClient();

    const { mutate: updateUrl, isPending: isUpdating, isError: urlError } = useMutation({
        mutationFn: (url: string) => patchClaimUrl(claimId, url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claim", claimId] });
        },
        onError: (err) => {
            console.error("Fehler beim Aktualisieren der URL:", err);
        }
    });

    const { mutate: updateStatus, isPending: urlPatchPending } = useMutation({
        mutationFn: (newStatus: ClaimStatus) => patchClaim(claimId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claim", claimId] });
        },
        onError: (err) => {
            console.error("Fehler beim Aktualisieren des Status:", err);
        }
    });

    const deleteClaimQuery = useMutation({
        mutationFn: deleteClaim,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['claims']
            });

            navigate('/claims');
        },
    })

    if (isPending) {
        return <div className="text-center p-4 text-muted">Lade Claim...</div>;
    }

    if (isError) {
        return <div className="text-center p-4 text-danger">Fehler beim Laden: {error.message}</div>;
    }

    const isUrlChanged = url.trim() !== (claim.url ?? "");

    function handleSaveUrl() {
        updateUrl(url.trim());
    }

    const handleToggleStatus = () => {
        if (!claim) return;
        const nextStatus = claim.status === ClaimStatus.UNVERIFIED
            ? ClaimStatus.VERIFIED
            : ClaimStatus.UNVERIFIED;

        updateStatus(nextStatus);
    };
    
    return (<>
        {claim ? (
            <Card className="shadow-sm">
                <CardHeader className="d-flex justify-content-between align-items-center gap-4">
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center gap-2">
                            <Button 
                                tag={Link} 
                                to="/" 
                                color="link" 
                                className="p-0 border-0 shadow-none text-decoration-none text-body" 
                                aria-label="Filter"
                            >
                                <i className="bi-chevron-left fs-4"></i>
                            </Button>
                            <Badge color="light" className="text-dark border">#{id}</Badge>
                        </div>
                        <h4 className="mb-0">{claim?.name}</h4>
                    </div>
                    <Badge color={claim.status === ClaimStatus.UNVERIFIED ? "danger" : "success"} className="border">{claim.status}</Badge>
                </CardHeader>
                <CardBody className="d-flex gap-3 align-items-end">
                    <Col xs={12}>
                        <div className="d-flex flex-column gap-3">
                            {/* URL-Bereich */}
                            <FormGroup className="mb-0">
                                <Label for={`claim-url-${claim.id}`} className="small fw-semibold mb-1">
                                    URL
                                </Label>
                                <InputGroup size="sm" className="has-validation">
                                    <Input
                                        id={`claim-url-${claim.id}`}
                                        type="url"
                                        invalid={urlError}
                                        placeholder="https://..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && isUrlChanged) handleSaveUrl();
                                        }}
                                        disabled={isUpdating}
                                    />
                                    <Button
                                        color="primary"
                                        onClick={handleSaveUrl}
                                        disabled={!isUrlChanged || isUpdating}
                                    >
                                        <i className="bi bi-check-lg"></i>
                                    </Button>
                                    
                                    {urlError && (
                                        <FormFeedback tooltip>
                                            Please enter a valid URL
                                        </FormFeedback>
                                    )}
                                </InputGroup>
                            </FormGroup>

                            {/* Aktions-Buttons (Verify & Löschen) */}
                            <div className="d-flex align-items-center gap-4">
                                <Button
                                    color={claim.status === ClaimStatus.UNVERIFIED ? "primary" : "warning"}
                                    onClick={handleToggleStatus}
                                    disabled={isUpdating}
                                    size="sm"
                                    style={{flex: 1}}
                                >
                                    {isUpdating && <Spinner size="sm" className="me-2" />}
                                    {claim.status === ClaimStatus.UNVERIFIED ? "Verify" : "Unverify"}
                                </Button>

                                <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => deleteClaimQuery.mutate(claim.id)}
                                    disabled={deleteClaimQuery.isPending}
                                    title="Claim löschen"
                                    style={{flex: 1}}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Col>

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