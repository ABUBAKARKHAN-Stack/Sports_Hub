"use client"

import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Clock, Plus, Trash2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { FacilityFormDataType } from '@/schemas/facility.schema'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { DAYS } from '@/constants/facility.constants'
import { Switch } from '@/components/ui/switch'

type Props = {
    form: UseFormReturn<FacilityFormDataType>
    addOpeningHour: () => void
    removeOpeningHour: (index: number) => void
    updateOpeningHour: (
        index: number,
        field: 'day' | 'openingTime' | 'closingTime' | 'isClosed',
        value: any
    ) => void
}

const BusinessHoursInformationSection = ({
    form,
    addOpeningHour,
    removeOpeningHour,
    updateOpeningHour,
}: Props) => {
    const openingHours = form.watch('openingHours')!

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Business Hours
                    </CardTitle>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOpeningHour}
                        disabled={openingHours.length >= 7}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {openingHours.map((hour, index) => (
                    <div
                        key={`${hour.day}-${index}`}
                        className="border rounded-lg p-4 space-y-4"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-[200px] space-y-2">
                                <FormLabel>Day</FormLabel>
                                <Select
                                    value={hour.day}
                                    onValueChange={(value) =>
                                        updateOpeningHour(index, 'day', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DAYS.map((day) => (
                                            <SelectItem
                                                key={day}
                                                value={day}
                                                disabled={openingHours.some(
                                                    (h, i) => i !== index && h.day === day
                                                )}
                                            >
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={hour.isClosed || false}
                                        onCheckedChange={(checked) =>
                                            updateOpeningHour(index, 'isClosed', checked)
                                        }
                                    />
                                    <span className="text-sm">Closed</span>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeOpeningHour(index)}
                                    disabled={openingHours.length <= 1}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence mode='wait'>
                            {!hour.isClosed && (
                                <motion.div
                                    key={`time-row-${index}`}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <FormLabel>Opening Time</FormLabel>
                                        <Input
                                            type="time"
                                            value={hour.openingTime}
                                            onChange={(e) =>
                                                updateOpeningHour(
                                                    index,
                                                    'openingTime',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FormLabel>Closing Time</FormLabel>
                                        <Input
                                            type="time"
                                            value={hour.closingTime}
                                            onChange={(e) =>
                                                updateOpeningHour(
                                                    index,
                                                    'closingTime',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {form.formState.errors.openingHours && (
                    <p className="text-sm font- text-destructive">
                        {form.formState.errors.openingHours.message}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export default BusinessHoursInformationSection
