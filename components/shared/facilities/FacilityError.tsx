"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, Building } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FacilityError = () => {
  return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Building className="h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">Facility Not Found</h2>
        <p className="text-gray-500 max-w-md">
          The facility you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/admin/facilities">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Facilities
          </Button>
        </Link>
      </div>
  )
}

export default FacilityError