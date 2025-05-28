
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { getAvailableAIProviders } from '@/services/aiService';
import { toast } from 'sonner';

const APIKeyStatus: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkProviders = async () => {
    setIsLoading(true);
    try {
      const availableProviders = await getAvailableAIProviders();
      setProviders(availableProviders);
    } catch (error) {
      console.error('Error checking providers:', error);
      toast.error('Failed to check API key status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkProviders();
  }, []);

  return (
    <Card className="mb-4 border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
          <Key className="w-4 h-4" />
          AI Provider Status
          <Button
            variant="ghost"
            size="sm"
            onClick={checkProviders}
            disabled={isLoading}
            className="ml-auto h-6 w-6 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {providers.map((provider) => (
          <div key={provider.name} className="flex items-center justify-between">
            <span className="text-sm font-medium">{provider.displayName}</span>
            <Badge variant={provider.available ? "default" : "secondary"} className="flex items-center gap-1">
              {provider.available ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Available
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Not Configured
                </>
              )}
            </Badge>
          </div>
        ))}
        {providers.length === 0 && !isLoading && (
          <p className="text-sm text-gray-600">No provider information available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default APIKeyStatus;
