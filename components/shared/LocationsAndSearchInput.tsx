"use client";

import { getLocations } from "@/helpers/geolocation.helpers";
import useDebounced from "@/hooks/useDebounced";
import { Location } from "@/types/main.types";
import { QueryTags } from "@/types/query_tags";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
    CommandGroup,
    CommandDialog,
} from "@/components/ui/command";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "../ui/input-group";
import { MapPin, Search, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import MapPickWithSearch from "./MapPickWithSearch";

const LocationsAndSearchInput = ({
    onSelect,
}: {
    onSelect: (loc: Location | null) => void;
}) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounced(search, 750);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [open, setOpen] = useState(false);

    // Prevent search query from firing if we just clicked a map location (and populated the search box)
    // We only want to search if the USER types.
    const [isManualTyping, setIsManualTyping] = useState(false);

    const {
        data: results = [],
        isLoading,
        isError,
        error,
    } = useQuery<Location[], Error>({
        queryKey: [QueryTags.LOCATIONS, debouncedSearch],
        queryFn: () => getLocations(debouncedSearch),
        // Only fetch if debounced search exists AND it was typed manually
        enabled: !!debouncedSearch && isManualTyping,
        staleTime: 2 * 60 * 1000,
    });

    const isTyping = search.length >= 2 && search !== debouncedSearch && isManualTyping;

    // Handle selection from either the List OR the Map
    const handleLocationUpdate = (loc: Location) => {
        setSelectedLocation(loc);
        setSearch(loc.formatted || ""); // Sync Input Text
        setIsManualTyping(false); // Prevent this update from triggering a new API search
        onSelect(loc);
    };

    return (
        <>
            <InputGroup>
                <InputGroupInput
                    readOnly
                    placeholder="Search facility location..."
                    // Show formatted address if selected, otherwise show current search text
                    value={selectedLocation?.formatted || ""}
                    onClick={() => setOpen(true)}
                    className="cursor-pointer"
                />
                <InputGroupAddon align="inline-end">
                    {selectedLocation ? (
                        <InputGroupButton
                            aria-label="Clear location"
                            size="icon-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLocation(null);
                                setSearch("");
                                onSelect(null);
                            }}
                        >
                            <X />
                        </InputGroupButton>
                    ) : (
                        <Search />
                    )}
                </InputGroupAddon>
            </InputGroup>

            <CommandDialog className="max-w-2xl! z-999" open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search facility location..."
                        value={search}
                        onValueChange={(val) => {
                            setSearch(val);
                            setIsManualTyping(true);
                        }}
                    />

                    <CommandList className="max-h-[80vh]"> {/* Increase height for map */}
                        
                        {/* 1. Loading State */}
                        {(isLoading || isTyping) && (
                            <CommandGroup>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <CommandItem key={idx} disabled>
                                        <Skeleton className="h-6 w-full" />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* 2. Error State */}
                        {isError && (
                            <CommandItem disabled>
                                {error?.message || "Something went wrong"}
                            </CommandItem>
                        )}

                        {/* 3. Helper Text */}
                        {search.length < 2 && !selectedLocation && (
                            <div className="px-2 py-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Type to search or click on the map
                                </p>
                            </div>
                        )}

                        {/* 4. Search Results */}
                        {results.length > 0 && isManualTyping && (
                            <CommandGroup heading="Suggestions">
                                {results.map((loc, idx) => (
                                    <CommandItem
                                        key={`${loc.lat}-${loc.lng}-${idx}`}
                                        onSelect={() => handleLocationUpdate(loc)}
                                        className="cursor-pointer"
                                    >
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {loc.formatted}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {results.length === 0 && search.length >= 2 && isManualTyping && !isLoading && (
                            <CommandEmpty>No locations found.</CommandEmpty>
                        )}

                        {/* 5. The Map - Always Rendered at the bottom */}
                        <div className="p-2 h-[350px] w-full mt-2">
                             <MapPickWithSearch
                                location={selectedLocation}
                                onLocationSelect={handleLocationUpdate}
                                autoCenter={true}
                                className="rounded-md border"
                            />
                        </div>

                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
};

export default LocationsAndSearchInput;