import { useQuery } from "@tanstack/react-query";
import ClaimsList from "../claims/ClaimsList"
import { useClaimsLiveUpdates } from "../hooks/useClaimsLiveUpdates";
import { fetchClaims } from "../api/claims";

function BrowsePage() {

    useClaimsLiveUpdates();

    const { data, isPending, error } = useQuery({ queryKey: ["claims"], queryFn: fetchClaims });

    return(
        <ClaimsList title="Browse all claims" claims={data} isPending={isPending} error={error} />
    )
}

export default BrowsePage