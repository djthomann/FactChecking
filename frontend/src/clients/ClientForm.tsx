import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import type {Client} from "../types/Client.ts";
import "./Clients.css"
import type {SubmitEvent} from "react";
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

const createClient = async (newClient: Omit<Client, 'id'>): Promise<Client> => {
    const response = await axios.post<Client>('/api/clients', newClient);
    return response.data;
};

function ClientForm() {

    const queryClient = useQueryClient();

    const addClientMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const nameData = formData.get("name");
        const emailData = formData.get("email");

        if (typeof nameData !== "string" || typeof emailData !== "string") {
            return;
        }

        addClientMutation.mutate({
            name: nameData,
            email: emailData,
        })
    }

    return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <h3>Der große Klientenschöpfer</h3>
        <FormGroup>
            <Label for="name">Name</Label>
            <Input 
                id="name"
                name="name"
                placeholder="Max Mustermann"
                type="text"
            />
        </FormGroup>
        <FormGroup>
            <Label for="email">E-Mail</Label>
            <Input 
                id="email"
                name="email"
                placeholder="max@mustermann.de"
                type="email"
            />
        </FormGroup>
        <FormGroup>
            <Button color="primary">Erschaffen</Button>
        </FormGroup>
    </Form>
    );
}

export default ClientForm