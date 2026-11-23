import { Badge } from "reactstrap"
import { CLAIM_STATUS_LABELS, type ClaimStatus } from "../../types/Claim"

const STANCE_COLORS: Record<ClaimStatus, string> = {
    VERIFIED: "success",
    UNVERIFIED: "danger",
};

function StatusBadge({status} : {status: ClaimStatus}) {

    return (
        <Badge
            color={STANCE_COLORS[status]}
            className="border"
            style={{ minWidth: "6rem" }}
        >
            {CLAIM_STATUS_LABELS[status]}
        </Badge>
    )

}

export default StatusBadge