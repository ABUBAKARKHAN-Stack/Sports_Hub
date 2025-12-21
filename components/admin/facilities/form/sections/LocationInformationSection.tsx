import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FacilityFormDataType } from '@/schemas/facility.schema'
import { LocateFixed, MapPin, X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import MapAndLocationCommandBox from '@/components/shared/MapAndLocationCommandBox'
import { Dispatch, SetStateAction } from 'react'
import { ILocation } from '@/types/main.types'

type Props = { 
    form: UseFormReturn<FacilityFormDataType>,
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    selectedLocation: ILocation | null;
    setSelectedLocation: Dispatch<SetStateAction<ILocation | null>>;
    handleRemoveSelectedLocation: () => void;

 }
const LocationInformationSection = ({
     form,
     open,
     selectedLocation,
     setOpen,
     setSelectedLocation,
     handleRemoveSelectedLocation
     }: Props) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className='flex justify-between items-center'>
                    <div className='space-y-2'>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location Details
                        </CardTitle>
                        <CardDescription>
                            Address selection will automatically populate all location fields
                        </CardDescription>
                    </div>
                    <MapAndLocationCommandBox
                        onSelect={(loc) => setSelectedLocation(loc)}
                        setOpen={setOpen}
                        open={open}
                    >

                        <div className='flex items-center gap-x-4 '>
                            <Button
                                disabled={!!selectedLocation}
                                type='button'
                                onClick={() => setOpen(true)}
                            >
                                Locate Your Facility
                                <LocateFixed />
                            </Button>

                            <Button
                                type='button'
                                variant={"outline"}
                                disabled={!selectedLocation}
                                onClick={handleRemoveSelectedLocation}
                            >
                                Remove Location <X />
                            </Button>
                        </div>
                    </MapAndLocationCommandBox>
                </div>

            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="location.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country *</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled
                                        readOnly
                                        placeholder="Will auto-fill when address is selected"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Will auto-fill when address is selected"
                                        readOnly
                                        disabled
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="location.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Address *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Your facility address will appear here after selection"
                                        className="min-h-[100px] resize-none"
                                        disabled
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div>
                            <FormLabel>Coordinates (Auto-filled)</FormLabel>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2">
                                    <FormLabel className="text-sm font-normal">Latitude</FormLabel>
                                    <Input
                                        readOnly
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 33.6844"
                                        value={form.watch('location.coordinates.lat')}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FormLabel className="text-sm font-normal">Longitude</FormLabel>
                                    <Input
                                        readOnly
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 73.0479"
                                        value={form.watch('location.coordinates.lng')}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}

export default LocationInformationSection