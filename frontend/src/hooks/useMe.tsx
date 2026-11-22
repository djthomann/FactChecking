import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMe = async () => {
    const res = await axios.get<{ username: string }>("/api/auth/me");
    return res.data;
};

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}