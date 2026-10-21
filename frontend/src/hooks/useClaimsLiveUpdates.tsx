import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useClaimsLiveUpdates() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const source = new EventSource("/api/claims/stream");

        source.addEventListener("claims-changed", () => {
            queryClient.invalidateQueries({ queryKey: ["claims"] });
        });

        return () => source.close();
    }, [queryClient]);
}