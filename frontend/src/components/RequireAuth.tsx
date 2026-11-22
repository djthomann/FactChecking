import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useMe } from "../hooks/useMe";

function RequireAuth() {
    const { data: me, isPending } = useMe();
    const location = useLocation();

    if (isPending) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner />
            </div>
        );
    }

    if (!me) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default RequireAuth;