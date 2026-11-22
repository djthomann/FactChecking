import { Navigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, Col, ListGroup, ListGroupItem, Row, Spinner } from "reactstrap";
import { useMe } from "../hooks/useMe";
import ClaimsList from "../claims/ClaimsList";
import { fetchClaimsByUser } from "../api/claims";
import { useQuery } from "@tanstack/react-query";

function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { data: me } = useMe();

    const isOwnProfile = !!me && me.username === username;

    const { data: claims, isPending, error } = useQuery({
        queryKey: ["claims", "user", username],
        queryFn: () => fetchClaimsByUser(username!),
        enabled: !!username,
    });

    const claimCount = claims?.length ?? 0;

    if (!username) return null;

    if (isPending) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner />
            </div>
        );
    }

    if (!me) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
        <Card className="shadow-sm">
            <CardBody className="p-4">
                <Row className="align-items-center g-4">
                    <Col xs={12} md="auto" className="text-center">
                        <div
                            className="rounded-circle bg-primary-subtle text-primary-emphasis d-flex align-items-center justify-content-center mx-auto"
                            style={{ width: 96, height: 96, fontSize: 44 }}
                        >
                            <i className="bi bi-person"></i>
                        </div>
                    </Col>

                    <Col xs={12} md className="text-center text-md-start">
                        <h3 className="mb-1">{username}</h3>
                        <div className="text-muted small mb-3">
                            {isOwnProfile ? "This is your account" : "Member profile"}
                        </div>

                        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                            <span className="badge rounded-pill bg-body-secondary text-body border">
                                <i className="bi bi-chat-square-quote me-1"></i>
                                {claimCount} {claimCount === 1 ? "claim" : "claims"}
                            </span>
                            {isOwnProfile && (
                                <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">
                                    <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }}></i>
                                    Logged in
                                </span>
                            )}
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
        <ClaimsList
            title={isOwnProfile ? "My claims" : `Claims by ${username}`}
            claims={claims}
            isPending={isPending}
            error={error}
            emptyMessage={
                isOwnProfile
                    ? "You haven't created any claims yet."
                    : `${username} hasn't created any claims yet.`
            }
        />
        </>
    );
}

export default ProfilePage;