import { Navigate, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import { useMe } from "../hooks/useMe";
import { useLogout } from "../hooks/useLogout";
import ClaimsList from "../claims/ClaimsList";
import { fetchClaimsByUser } from "../api/claims";
import { useQuery } from "@tanstack/react-query";

function AccountPage() {
    const { data: me } = useMe();

    const { data, isPending, error } = useQuery({
        queryKey: ["claims", "user", me?.username],
        queryFn: () => fetchClaimsByUser(me!.username),
        enabled: !!me,
    });

    const logoutMutation = useLogout();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => navigate("/"),
        });
    };

    return (
        <>
        <Card className="">
            <CardBody className="p-4 text-center">
                <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 fs-2 fw-semibold"
                    style={{ width: 80, height: 80 }}
                >
                    <i className="bi bi-person"></i>
                </div>
                <div className="text-muted small">Your account</div>
            </CardBody>

            <ListGroup flush>
                <ListGroupItem className="d-flex justify-content-between align-items-center px-4">
                    <span className="text-muted small">Username</span>
                    <span className="fw-semibold">{me.username}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center px-4">
                    <span className="text-muted small">Status</span>
                    <span className="badge bg-success-subtle text-success-emphasis">
                        Logged in
                    </span>
                </ListGroupItem>
            </ListGroup>

            <CardBody className="p-4">
                <Button
                    color="outline-danger"
                    className="w-100"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    {logoutMutation.isPending ? "Logging out…" : "Logout"}
                </Button>
            </CardBody>
        </Card>
        <ClaimsList
            title="My claims"
            claims={data}
            isPending={isPending}
            error={error}
            emptyMessage="You haven't created any claims yet."
        />
        </>
    );
}

export default AccountPage;