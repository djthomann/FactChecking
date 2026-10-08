import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type {Client} from "../types/Client.ts";

const fetchClients = async (): Promise<Client[]> => {
    const response = await axios.get<Client[]>('/api/clients');

    console.log(response.data)

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
        <div>
            <h2>Client-Liste</h2>
            <ul>
                {clients.map((client) => (
                    <li key={client.id}>
                        {client.name} ({client.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientList