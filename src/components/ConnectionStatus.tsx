
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

const ConnectionStatus = () => {
  const { isOnline, isConnecting } = useConnectionStatus();

  if (isOnline && !isConnecting) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert variant={isOnline ? "default" : "destructive"}>
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription>
          {isConnecting 
            ? "Connecting to server..." 
            : isOnline 
              ? "Connected" 
              : "No internet connection. Some features may not work."
          }
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ConnectionStatus;
