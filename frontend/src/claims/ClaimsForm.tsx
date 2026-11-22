import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {CATEGORY_DEFINITIONS, type Claim, type ClaimCategory, type CreateClaimRequest} from "../types/Claim.ts";
import {useState, type SubmitEvent} from "react";
import { Button, Card, CardHeader, Col, Form, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const createClient = async (request: Omit<CreateClaimRequest, 'id'>): Promise<Claim> => {
    const response = await axios.post<Claim>('/api/claims', request);
    return response.data;
};

function ClaimsForm() {

     const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [category, setCategory] = useState<ClaimCategory>("GENERAL");
    const [url, setUrl] = useState("");

    const queryClient = useQueryClient();

    const addClaimMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['claims'] });
            setTitle("")
            setText("")
            navigate('/browse');
        },
    });

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        addClaimMutation.mutate({
            title: title,
            text: text,
            category: category
        })
    }

    return (

    <Card className="shadow-sm">
        <CardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Create a claim</h4>
        </CardHeader>
   
        <Form onSubmit={handleSubmit} className="p-3">
            <Row>
                <Col md={4}>
                    <FormGroup>
                        <Label for="title" className="fw-semibold">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Title of your claim!"
                            value={title}
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <Label for="url" className="fw-semibold">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            placeholder="https://..."
                            value={url}
                            type="text"
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <Label for="category" className="fw-semibold">Category</Label>
                        <Input
                            id="category"
                            name="category"
                            type="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ClaimCategory)}
                        >
                            {CATEGORY_DEFINITIONS.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                </Col>
            </Row>

            <FormGroup>
                <Label for="text" className="fw-semibold">Description</Label>
                <Input
                    id="text"
                    name="text"
                    type="textarea"
                    rows={4}
                    placeholder="Describe your claim…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </FormGroup>

            <div className="d-flex justify-content-start">
                <Button type="submit" color="primary">
                    Claim!
                </Button>
            </div>
        </Form>
    </Card>
    );
}

export default ClaimsForm