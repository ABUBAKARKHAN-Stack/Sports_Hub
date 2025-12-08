// components/shared/services/ServiceError.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceErrorProps {
  error?: string;
  onRetry?: () => void;
}

const ServiceError: React.FC<ServiceErrorProps> = ({ error, onRetry }) => {
  const defaultError = 'Failed to load service details. Please try again.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/services">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Service Details</h1>
            <p className="text-sm text-gray-500">Error loading service information</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center max-w-md mx-auto space-y-6">
            {/* Error Illustration */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-12 w-12 text-rose-600" />
              </div>
            
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Unable to Load Service</h3>
              <p className="text-sm text-gray-600">
                {error || defaultError}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="gap-2 bg-rose-600 hover:bg-rose-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
              <Link href="/admin/services" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="gap-2 w-full sm:w-auto"
                >
                  <Home className="h-4 w-4" />
                  Back to Services
                </Button>
              </Link>
            </div>

            {/* Troubleshooting Tips */}
            <div className="pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Troubleshooting Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Check your internet connection
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Verify the service ID is correct
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Ensure you have proper permissions
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  Contact support if the issue persists
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Error Display */}
      <Alert variant="destructive" className="animate-pulse">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Service Loading Error</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p>{error || defaultError}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Error Code:</span>
              <code className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-xs">
                SERVICE_LOAD_FAILED
              </code>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ServiceError;