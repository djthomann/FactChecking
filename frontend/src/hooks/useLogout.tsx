import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => axios.post("/api/auth/logout"),
        onSuccess: () => queryClient.setQueryData(["me"], null),
    });
}