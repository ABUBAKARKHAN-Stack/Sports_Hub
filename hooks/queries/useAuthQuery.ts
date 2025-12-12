import { getUser } from "@/helpers/auth.helpers"
import { QueryTags } from "@/types/query_tags"
import { useQuery } from "@tanstack/react-query"
import { Session } from "next-auth"

export const useAuthQuery = () => {

    const getUserDetails = (session: Session | null) => {
        return useQuery({
            queryFn: getUser,
            queryKey: [QueryTags.ME, session?.user.userId],
            staleTime: Infinity,
            gcTime: Infinity,
            retry: 2,
            retryDelay: 1000,
            enabled: !!session
        })
    }

    return {
        getUserDetails
    }
}