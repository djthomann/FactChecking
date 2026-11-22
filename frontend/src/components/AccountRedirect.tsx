import { Navigate } from "react-router-dom";
import { useMe } from "../hooks/useMe";

function AccountRedirect() {
    const { data: me } = useMe();
    return me ? <Navigate to={`/users/${me.username}`} replace /> : null;
}

export default AccountRedirect