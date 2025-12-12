import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryTags } from "@/types/query_tags";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    },

})

const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: "cache"
})

persistQueryClient({
    queryClient,
    persister,
    maxAge: Infinity,
    dehydrateOptions: {
        shouldDehydrateQuery: (query) => query.queryKey[0] === QueryTags.ME,
    }
})