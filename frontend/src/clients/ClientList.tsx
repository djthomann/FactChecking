import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {Client} from "../types/Client.ts";
import { Button, List, ListGroup, ListGroupItem, ListInlineItem } from 'reactstrap';
import { useState } from 'react';

const fetchClients = async (): Promise<Client[]> => {
    const response = await axios.get<Client[]>('/api/clients');
    return response.data;
};

const deleteClient = async(id: number) => {
    const response = await axios.delete<Client>(`/api/clients/${id}`);
    return response.data;
}

export function ClientList() {

    const queryClient = useQueryClient()

    const { data: clients, isPending, isError, error } = useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients,
    });

    const deleteClientQuery = useMutation({
            mutationFn: deleteClient,
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['clients']
                });
            },
        })

    const [selectedId, setSelectedId] = useState<number | null>(null);

    if (isPending) return <p>Lade Clients...</p>;
    if (isError) return <p style={{ color: 'red' }}>Fehler: {error.message}</p>;

    return (
        
        <ListGroup type="inline" className="p-4 border rounded bg-light">
            <h3>Der große Klientenanzeiger</h3>
            {clients.map((client) => (
                    <ListGroupItem 
                        key={client.id} 
                        active={selectedId === client.id} 
                        action
                        onMouseEnter={() => setSelectedId(client.id)}
                        onMouseLeave={() => setSelectedId(null)}
                    >
                        ID: {client.id} Name: {client.name} Mail: {client.email} <Button onClick={() => deleteClientQuery.mutate(client.id)}>Löschen</Button>
                    </ListGroupItem>
                ))}
        </ListGroup>
    );
}

export default ClientList