"use client";

import { getLocations } from "@/helpers/geolocation.helpers";
import useDebounced from "@/hooks/useDebounced";
import { ILocation } from "@/types/main.types";
import { QueryTags } from "@/types/query_tags";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
    InputGroupTextarea,
} from "../ui/input-group";
import { Map, MapPin, Search, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import MapPickWithSearch from "./MapPickWithSearch";
import { Button } from "../ui/button";

const LocationsAndSearchInput = ({
    onSelect,
}: {
    onSelect: (loc: ILocation | null) => void;
}) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounced(search, 750);
    const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
    const [open, setOpen] = useState(false);

    const [isManualTyping, setIsManualTyping] = useState(false);

    const {
        data: results = [],
        isLoading,
        isError,
        error,
    } = useQuery<ILocation[], Error>({
        queryKey: [QueryTags.LOCATIONS, debouncedSearch],
        queryFn: () => getLocations(debouncedSearch),
        enabled: !!debouncedSearch && isManualTyping,
        staleTime: 2 * 60 * 1000,
    });

    const isTyping = search.length >= 2 && search !== debouncedSearch && isManualTyping;

    const handleLocationUpdate = (loc: ILocation) => {
        setSelectedLocation(loc);
        setSearch(loc.address || "");
        setIsManualTyping(false);
        onSelect(loc);
    };

    return (
        <>
            <InputGroup>
                <InputGroupTextarea
                    readOnly
                    placeholder="Search facility location..."
                    value={selectedLocation?.address || ""}
                    onClick={() => setOpen(true)}
                    className="cursor-pointer py-0!"
                />
                <InputGroupAddon align="inline-end" >
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

        
            <CommandDialog className="max-w-5xl! z-999" open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search facility location..."
                        value={search}
                        onValueChange={(val) => {
                            setSearch(val);
                            setIsManualTyping(true);
                        }}
                        className="truncate max-w-[90%]"
                    />

                    <CommandList className="max-h-[90vh]">

                        {/* Loading State */}
                        {(isLoading || isTyping) && (
                            <CommandGroup>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <CommandItem key={idx} disabled>
                                        <Skeleton className="h-6 w-full" />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* Error State */}
                        {isError && (
                            <CommandItem disabled>
                                {error?.message || "Something went wrong"}
                            </CommandItem>
                        )}

                        {/* Helper Text */}
                        {search.length < 2 && !selectedLocation && (
                            <div className="px-2 py-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Type to search or click on the map
                                </p>
                            </div>
                        )}

                        {/* Search Results */}
                        {results.length > 0 && isManualTyping && (
                            <CommandGroup heading="Suggestions">
                                {results.map((loc, idx) => (
                                    <CommandItem
                                        key={`${loc.coordinates.lat}-${loc.coordinates.lng}-${idx}`}
                                        onSelect={() => handleLocationUpdate(loc)}
                                        className="cursor-pointer"
                                    >
                                        <MapPin className="mr-2 size-4" />
                                        {loc.address}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {results.length === 0 && search.length >= 2 && isManualTyping && !isLoading && (
                            <CommandEmpty>No locations found.</CommandEmpty>
                        )}

                        {/* Map */}
                        <div className="p-2 sm:h-120 h-96 w-full mt-2">
                            <MapPickWithSearch
                                location={selectedLocation}
                                onLocationSelect={handleLocationUpdate}
                                autoCenter={true}
                                className="rounded-md h-full w-full"
                                showMarker
                            />
                        </div>

                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
};

export default LocationsAndSearchInput;