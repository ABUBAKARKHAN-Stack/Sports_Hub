// components/shared/services/ServiceSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ServiceSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        
        {/* Details Tab Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-center">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-6 w-16 mx-auto" />
                </div>
                <div className="space-y-2 text-center">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-6 w-16 mx-auto" />
                </div>
                <div className="space-y-2 text-center">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-6 w-16 mx-auto" />
                </div>
                <div className="space-y-2 text-center">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-6 w-16 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Skeleton */}
      <Card>
        <CardContent className="px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSkeleton;