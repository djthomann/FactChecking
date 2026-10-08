import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type {Client} from "../types/Client.ts";

const fetchClients = async (): Promise<Client[]> => {
    const response = await axios.get<Client[]>('/api/clients');

    return response.data;
};

export function ClientList() {
    const { data: clients, isPending, isError, error } = useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients,
    });

    if (isPending) return <p>Lade Clients...</p>;
    if (isError) return <p style={{ color: 'red' }}>Fehler: {error.message}</p>;

    return (
        <div className="client-list">
            <h3>Der große Klientenzeiger</h3>
            <ul>
                {clients.map((client) => (
                    <li key={client.id}>
                        ID: {client.id} Name: {client.name} Mail: {client.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientList