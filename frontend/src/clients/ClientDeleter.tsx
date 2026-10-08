import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import "./Clients.css"
import type {Client} from "../types/Client.ts";
import type {SubmitEvent} from "react";

const deleteClient = async(id: number) => {
    const response = await axios.delete<Client>(`/api/clients/${id}`);
    return response.data;
}

function ClientDeleter() {

    const queryClient = useQueryClient()

    const deleteClientQuery = useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['clients']
            });
        },
    })

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const idData = formData.get("id");

        if (typeof idData !== "string") {
            return;
        }

        const id = Number(idData);

        if (!Number.isInteger(id)) {
            return;
        }

        deleteClientQuery.mutate(id)
    }

    return <>

        <form className="client-form" onSubmit={handleSubmit}>
            <h3>Der große Klientenzerstörer</h3>
            <label>ID</label>
            <input type="number" name="id"></input>
            <button>Delete</button>
        </form>
    </>
}

export default ClientDeleter