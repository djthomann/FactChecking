import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CLAIM_CATEGORY_LABELS, ClaimStatus} from "../types/Claim";
import {Link, useNavigate, useParams } from 'react-router-dom';
import {Badge, Button, Card, CardBody, CardHeader, Col, FormFeedback, FormGroup, Input, InputGroup, Label } from "reactstrap";
import { useEffect, useState } from "react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { useMe } from "../hooks/useMe";
import OptionsMenu from "../components/OptionsMenu";
import { deleteClaim, fetchClaim, getUrlErrorMessage, patchClaimStatus, patchClaimUrl } from "../api/claims";

function ClaimDetail() {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: me, isPending: isMePending } = useMe();
    const claimId = Number(id);

    const { data: claim, isPending, isError, error } = useQuery({
            queryKey: ['claim', claimId],
            queryFn: () => fetchClaim(claimId),
        });

    const isOwnClaim = !!me && me.username === claim?.authorUsername;

    const [url, setUrl] = useState("");

    
    useEffect(() => {
        if (claim) {
            setUrl(claim.url ?? "no url");
        } else {
            setUrl("no url")
        }
    }, [claim]);

    useEffect(() => {
        if (claim) {
            setUrl(claim.url ?? "");
        }
    }, [claim]);

    const queryClient = useQueryClient();

    const { mutate: updateUrl, reset, isPending: isUpdating, isError: urlError, error: urlErrorMessage, isSuccess: urlSuccess } = useMutation({
        mutationFn: (url: string) => patchClaimUrl(claimId, url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claim", claimId] });
        },
        onError: (err) => {
            console.error("Fehler beim Aktualisieren der URL:", err);
        }
    });

    useEffect(() => {
        if (!urlSuccess) return;

        const timer = setTimeout(() => reset(), 3000);
        return () => clearTimeout(timer);
    }, [urlSuccess, reset]);

    const { mutate: updateStatus, isPending: urlPatchPending } = useMutation({
        mutationFn: (newStatus: ClaimStatus) => patchClaimStatus(claimId, newStatus),
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

            navigate('/browse');
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
            <>
            <Card className="shadow-sm">
                <CardHeader className="d-flex justify-content-between align-items-center gap-4">
                    <div className="d-flex align-items-center gap-2">
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
                        </div>
                        <h4 className="mb-0">{claim.title}</h4>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <Badge color="light" className="text-dark border"># {id}</Badge>
                        <Badge color="light" className="text-dark border">
                            <i className="bi bi-person me-1"></i>{claim.authorUsername}
                        </Badge>
                        <Badge className="border">{CLAIM_CATEGORY_LABELS[claim.category]}</Badge>
                        <Badge
                            color={claim.status === ClaimStatus.UNVERIFIED ? "danger" : "success"}
                            className="border"
                            style={{ minWidth: "6rem" }}
                        >
                            {claim.status}
                        </Badge>

                        {isOwnClaim && <div className="ms-auto">
                            <OptionsMenu
                                items={[
                                    {
                                        label: claim.status === ClaimStatus.UNVERIFIED ? "Verify" : "Unverify",
                                        icon: "bi-check",
                                        danger: false,
                                        onClick: handleToggleStatus,
                                    },
                                    {
                                        label: "Delete",
                                        icon: "bi-trash",
                                        danger: true,
                                        disabled: deleteClaimQuery.isPending,
                                        onClick: () => deleteClaimQuery.mutate(claim.id),
                                    },
                                ]}
                            />
                        </div>}
                    </div>
                </CardHeader>
                <CardBody className="d-flex gap-3 align-items-end">
                    <Col xs={12}>
                        <div className="d-flex flex-column gap-3">
                            {/* URL-Bereich */}
                            <FormGroup noMargin className="mb-0">
                                <div
                                    className=" rounded py-3 fs-3"
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    » {claim.text} «
                                </div>
                                {isOwnClaim ? ( 
                                    <div className="mt-3">
                                        <Label for={`claim-url-${claim.id}`} className="small fw-semibold mb-1">
                                            URL
                                        </Label>
                                        <InputGroup size="sm" className="has-validation">
                                            <Input
                                                id={`claim-url-${claim.id}`}
                                                type="url"
                                                valid={urlSuccess}
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
                                                <FormFeedback className="d-block">
                                                    {getUrlErrorMessage(urlErrorMessage)}
                                                </FormFeedback>
                                            )}
                                        </InputGroup>
                                    </div>
                                ) : (
                                    claim.url && (
                                        <div className="mt-3">
                                            <div className="small fw-semibold mb-1">URL</div>
                                            <a
                                                href={claim.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="small text-break"
                                            >
                                                <i className="bi bi-box-arrow-up-right me-1"></i>
                                                {claim.url}
                                            </a>
                                        </div>
                                    )
                                )}
                            </FormGroup>
                        </div>
                    </Col>

                </CardBody>
            </Card>
            <CommentInput claimId={claimId}></CommentInput>
            <CommentList claimId={claimId}></CommentList>
            </>
            ) : (
            <div className="p-4 text-center text-muted">
                Keine Daten zu diesem Claim gefunden.
            </div>
        )
        }
    </>);
}

export default ClaimDetail