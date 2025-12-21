import { Button } from '@/components/ui/button'
import { FacilityFormDataType } from '@/schemas/facility.schema';
import { ArrowLeft, Loader2 } from 'lucide-react'

type Props = {
    handleGoBack: () => void;
    isLoading: boolean;
    resetForm: () => void;
    initialData?: Partial<FacilityFormDataType>
}

const FormActionButtonsSecton = ({
    handleGoBack,
    isLoading,
    resetForm,
    initialData
}: Props) => {
    return (
        <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                    disabled={isLoading}
                    size="lg"
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                    size="lg"
                >
                    Reset Form
                </Button>
            </div>

            <div className="flex space-x-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="min-w-[150px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : initialData ? 'Update Facility' : 'Create Facility'}
                </Button>
            </div>
        </div>
    )
}

export default FormActionButtonsSecton