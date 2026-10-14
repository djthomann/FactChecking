import ClaimsForm from "../claims/ClaimsForm";
import ClaimsList from "../claims/ClaimsList";

function ClaimOverviewPage() {

    return (
        <div className="main p-4 d-flex flex-column gap-4">
            <ClaimsForm />
            <ClaimsList />
        </div>
    );
}

export default ClaimOverviewPage