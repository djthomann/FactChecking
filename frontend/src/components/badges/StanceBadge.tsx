import { Badge } from "reactstrap"
import { COMMENT_STANCE_LABELS, type CommentStance } from "../../types/Claim"

export const STANCE_COLORS: Record<CommentStance, string> = {
    NEUTRAL: "secondary",
    PRO: "success",
    CONTRA: "danger",
};

function StanceBadge({ stance }: { stance: CommentStance }) {
    return (
        <Badge 
            color={STANCE_COLORS[stance]} className="border"
            style={{ minWidth: "4rem" }}
            >
            {COMMENT_STANCE_LABELS[stance]}
        </Badge>
    );
}

export default StanceBadge