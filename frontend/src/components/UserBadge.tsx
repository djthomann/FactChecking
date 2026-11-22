import { Link } from "react-router-dom"
import { Badge } from "reactstrap"

function UserBadge({ username }: { username: string }) {

    return (
        <Badge
            tag={Link}
            to={`/users/${username}`}
            color="light"
            className="text-dark border text-decoration-none"
            title={`View ${username}'s profile`}
        >
            <i className="bi bi-person me-1"></i>{username}
        </Badge>
    )

}

export default UserBadge