import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import type {Client} from "../types/Client.ts";
import "./Clients.css"
import type {SubmitEvent} from "react";

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

    return <form className="client-form" onSubmit={handleSubmit}>
        <h3>Der große Klientenschöpfer</h3>
        <div>
            <label>Name</label>
            <input name="name"></input>
        </div>
        <div>
            <label>E-Mail</label>
            <input name="email"></input>
        </div>
        <button type="submit">Submit</button>
    </form>
}

export default ClientForm