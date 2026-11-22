import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CATEGORY_DEFINITIONS, type ClaimCategory, ClaimStatus, type Claim, CLAIM_CATEGORY_LABELS} from "../types/Claim.ts";
import { Badge, Card, CardBody, CardHeader, Col, Collapse, Input, Label, ListGroup, ListGroupItem, Row, Spinner } from 'reactstrap';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaimsLiveUpdates } from '../hooks/useClaimsLiveUpdates.tsx';

type StatusFilter = ClaimStatus | "";
type CategoryFilter = ClaimCategory | ""

const fetchClaims = async (): Promise<Claim[]> => {
    const response = await axios.get<Claim[]>('/api/claims');
    return response.data;
};

export function ClaimsList() {

    useClaimsLiveUpdates();

    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [status, setStatus] = useState<StatusFilter>("");
    const [category, setCategory] = useState<CategoryFilter>("");
    const [query, setQuery] = useState("");

    const { data: claims, isPending, isError, error } = useQuery({
        queryKey: ['claims'],
        queryFn: fetchClaims,
    });

    useEffect(() => {
        if (claims?.length === 0) {
            setShowFilterOptions(false)
        } else {
            setShowFilterOptions(true)
        }
    }, [claims]);

    const filteredClaims = useMemo(() => {
      if (!claims) return [];

      const normalizedQuery = query.trim().toLowerCase();

      return claims.filter((claim) => {
          const matchesStatus = !status || claim.status === status;
          const matchesCategory = !category || claim.category === category;
          const matchesQuery =
              !normalizedQuery || claim.title.toLowerCase().includes(normalizedQuery);

          return matchesStatus && matchesCategory && matchesQuery;
      });

    }, [claims, query, status, category]);

    function toggleFilters() {
      // if(!isPending && !isError) 
      setShowFilterOptions(!showFilterOptions)
    }

    const STATUS_VALUES = Object.values(ClaimStatus);
    const CLAIM_CATEGORY_VALUES = CATEGORY_DEFINITIONS.map(c => c.value);

    const STATUS_LABELS: Record<ClaimStatus, string> = {
      VERIFIED: "Verified",
      UNVERIFIED: "Not Verified",
    };

    function isClaimStatus(value: string): value is ClaimStatus {
      return (STATUS_VALUES as string[]).includes(value);
    }

    function isClaimCategory(value: string): value is ClaimCategory {
      return (CLAIM_CATEGORY_VALUES as string[]).includes(value);
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setStatus(isClaimStatus(value) ? value : "");
    }

    function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
      setQuery(e.target.value);
    }

    function handleCategoryChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setCategory(isClaimCategory(value) ? value : "");
    }

    return (
        
    <Card className="shadow-sm">
    <CardHeader className="d-flex justify-content-between align-items-center">
    <h4 className="mb-0">Browse all claims</h4>
    <div className="d-flex gap-3">
      <button onClick={() => {toggleFilters()}} type="button" className="btn p-0 border-0 shadow-none" aria-label="Filter">
        <i className={`bi ${showFilterOptions ? "bi-funnel-fill" : "bi-funnel"}`}></i>
      </button>
      <Badge color="secondary" pill>
          {filteredClaims.length}
      </Badge>
    </div>
    </CardHeader>

    <Collapse isOpen={showFilterOptions}>
      <div className="p-3">
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
          <Col md="4">
            <Label>Category</Label>
            <Input
              type="select"
              bsSize="sm"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              {CATEGORY_DEFINITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Input>
          </Col>
        </Row>
      </div>
    </Collapse>

    {isPending ? (
     <CardBody className="text-center text-muted">
        <Spinner animation="border" role="status" size="sm" className="me-2" />
        Loading Claims...
      </CardBody>
    ) : isError ? (
      <CardBody className="text-center text-muted">
        <i className="bi bi-exclamation-triangle fs-1 d-block mb-2" />
        Error: {error.message}
      </CardBody>
    ) : claims.length === 0 ? (
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
              <span className="fw-semibold">{claim.title}</span>
            </Link>

            <div className="d-flex gap-2">
              <Badge className="border">{CLAIM_CATEGORY_LABELS[claim.category]}</Badge>
              <Badge 
                  color={claim.status === ClaimStatus.UNVERIFIED ? "danger" : "success"} 
                  className="border" 
                  style={{ minWidth: '6rem' }}
              >
                  {claim.status}
              </Badge>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    )}
  </Card>
    );
}

export default ClaimsList