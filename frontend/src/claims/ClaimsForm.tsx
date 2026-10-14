import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import type {Claim} from "../types/Claim.ts";
import type {SubmitEvent} from "react";
import { Badge, Button, Card, CardHeader, Form, FormGroup, Input, Label } from 'reactstrap';

const createClient = async (newClaim: Omit<Claim, 'id'>): Promise<Claim> => {
    const response = await axios.post<Claim>('/api/claims', newClaim);
    return response.data;
};

function ClaimsForm() {

    const queryClient = useQueryClient();

    const addClaimMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['claims'] });
        },
    });

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const nameData = formData.get("name");

        if (typeof nameData !== "string") {
            return;
        }

        addClaimMutation.mutate({
            name: nameData,
        })
    }

    return (

    <Card className="shadow-sm">
        <CardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Create a claim</h4>
        </CardHeader>
   

        <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
            <FormGroup>
                <Label for="name">Description</Label>
                <Input 
                    id="name"
                    name="name"
                    placeholder="Your claim goes here!"
                    type="text"
                />
            </FormGroup>
            <FormGroup>
                <Button color="primary">Create</Button>
            </FormGroup>
        </Form>
    </Card>
    );
}

export default ClaimsForm