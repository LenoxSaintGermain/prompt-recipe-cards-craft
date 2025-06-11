
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useJsonImport, ImportJob } from '@/hooks/useJsonImport';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ImportJobTrackerProps {
  onRefresh: () => void;
}

const ImportJobTracker: React.FC<ImportJobTrackerProps> = ({ onRefresh }) => {
  const { importJobs, loadImportJobs } = useJsonImport();
  const [showJobHistory, setShowJobHistory] = useState(false);

  useEffect(() => {
    loadImportJobs();
    
    // Poll for updates every 5 seconds for active jobs
    const interval = setInterval(() => {
      const hasActiveJobs = importJobs.some(job => 
        job.status === 'pending' || job.status === 'processing'
      );
      if (hasActiveJobs) {
        loadImportJobs();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [importJobs.length]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getProgress = (job: ImportJob) => {
    if (job.total_cards === 0) return 0;
    return ((job.processed_cards + job.failed_cards) / job.total_cards) * 100;
  };

  const activeJobs = importJobs.filter(job => 
    job.status === 'pending' || job.status === 'processing'
  );

  const recentJobs = importJobs.slice(0, 3);

  if (importJobs.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <RefreshCw className="w-5 h-5" />
              Active Import Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeJobs.map(job => (
              <div key={job.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className="font-medium">{job.name}</span>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {job.processed_cards + job.failed_cards} / {job.total_cards}
                  </span>
                </div>
                <Progress value={getProgress(job)} className="h-2" />
                {job.failed_cards > 0 && (
                  <p className="text-sm text-red-600">
                    {job.failed_cards} cards failed to process
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Jobs Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Import Jobs</CardTitle>
            <Dialog open={showJobHistory} onOpenChange={setShowJobHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Import Job History</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {importJobs.map(job => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          <span className="font-medium">{job.name}</span>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(job.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: {job.total_cards} | Processed: {job.processed_cards} | Failed: {job.failed_cards}
                      </div>
                      {job.error_log && (
                        <details className="mt-2">
                          <summary className="text-sm text-red-600 cursor-pointer">
                            View Errors
                          </summary>
                          <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-x-auto">
                            {job.error_log}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <p className="text-gray-500 text-sm">No import jobs yet</p>
          ) : (
            <div className="space-y-2">
              {recentJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className="text-sm">{job.name}</span>
                    <Badge className={getStatusColor(job.status)} size="sm">
                      {job.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportJobTracker;
