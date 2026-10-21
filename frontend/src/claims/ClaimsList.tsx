import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ClaimStatus, type Claim} from "../types/Claim.ts";
import { Badge, Card, CardBody, CardHeader, Col, Collapse, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaimsLiveUpdates } from '../hooks/useClaimsLiveUpdates.tsx';

type StatusFilter = ClaimStatus | "";

const fetchClaims = async (): Promise<Claim[]> => {
    const response = await axios.get<Claim[]>('/api/claims');
    return response.data;
};

export function ClaimsList() {

    useClaimsLiveUpdates();

    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [status, setStatus] = useState<StatusFilter>("");
    const [query, setQuery] = useState("");

    const { data: claims, isPending, isError, error } = useQuery({
        queryKey: ['claims'],
        queryFn: fetchClaims,
    });

    const filteredClaims = useMemo(() => {
      if (!claims) return [];

      const normalizedQuery = query.trim().toLowerCase();

      return claims.filter((claim) => {
          const matchesStatus = !status || claim.status === status;
          const matchesQuery =
              !normalizedQuery || claim.name.toLowerCase().includes(normalizedQuery);

          return matchesStatus && matchesQuery;
      });

    }, [claims, query, status]);

    if (isPending) return <p>Loading Claims...</p>;
    if (isError) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

    function toggleFilters() {
      setShowFilterOptions(!showFilterOptions)
    }

    const STATUS_VALUES = Object.values(ClaimStatus);

    function isClaimStatus(value: string): value is ClaimStatus {
      return (STATUS_VALUES as string[]).includes(value);
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setStatus(isClaimStatus(value) ? value : "");
    }

    function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
      setQuery(e.target.value);
    }

    const STATUS_LABELS: Record<ClaimStatus, string> = {
      VERIFIED: "Verified",
      UNVERIFIED: "Not Verified",
    };

    return (
        
    <Card className="shadow-sm">
    <CardHeader className="d-flex justify-content-between align-items-center">
    <h4 className="mb-0">Claims</h4>
    <div className="d-flex gap-2">
      <button onClick={() => {toggleFilters()}} type="button" className="btn p-0 border-0 shadow-none" aria-label="Filter">
        <i className={`bi ${showFilterOptions ? "bi-chevron-down" : "bi-chevron-up"}`}></i>
      </button>
      <Badge color="secondary" pill>
          {filteredClaims.length}
      </Badge>
    </div>
    </CardHeader>

    <Collapse isOpen={showFilterOptions}>
      <div className="border-bottom bg-light px-3 py-2">
        <Row className="g-2">
          <Col md="4">
            <Label for="search">Search</Label>
            <div className="position-relative">
                <i
                    className="bi bi-search position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: 10, fontSize: 14, pointerEvents: "none" }}
                />
                <Input
                    id="search"
                    type="text"
                    bsSize="sm"
                    style={{ paddingLeft: 32 }}
                    onChange={handleQueryChange}
                />
            </div>
        </Col>
          <Col md="4">
            <Label>Status</Label>
            <Input
              type="select"
              bsSize="sm"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">All</option>
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Input>
          </Col>
        </Row>
      </div>
    </Collapse>

    {claims.length === 0 ? (
      <CardBody className="text-center text-muted">
        <i className="bi bi-inbox fs-1 d-block mb-2" />
        There are no claims at the moment.
      </CardBody>
    ) : (
      <ListGroup flush>
        {filteredClaims.map((claim) => (
          <ListGroupItem
            key={claim.id}
            className="list-group-item-action d-flex justify-content-between align-items-center position-relative"
          >
            <Link
              to={`/claims/${claim.id}`}
              className="stretched-link text-decoration-none text-reset d-flex align-items-center gap-3"
            >
              <Badge color="light" className="text-dark border">#{claim.id}</Badge>
              <span className="fw-semibold">{claim.name}</span>
            </Link>

            <Badge color={claim.status === ClaimStatus.UNVERIFIED ? "danger" : "success"} className="border">{claim.status}</Badge>
          </ListGroupItem>
        ))}
      </ListGroup>
    )}
  </Card>
    );
}

export default ClaimsList