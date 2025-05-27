
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, BookOpen, Search, Upload, MessageSquare, Shield, FileText, Users, Brain } from 'lucide-react';

interface EnhancedStepsListProps {
  steps: string[];
  isSlideMode?: boolean;
}

const EnhancedStepsList: React.FC<EnhancedStepsListProps> = ({ steps, isSlideMode = false }) => {
  // Function to get appropriate icon for each step based on content
  const getStepIcon = (stepText: string, index: number) => {
    const text = stepText.toLowerCase();
    if (text.includes('define') || text.includes('scope')) return BookOpen;
    if (text.includes('prompt') || text.includes('craft')) return MessageSquare;
    if (text.includes('academic') || text.includes('focus')) return Search;
    if (text.includes('upload') || text.includes('pdf')) return Upload;
    if (text.includes('verify') || text.includes('review') || text.includes('critically')) return Shield;
    if (text.includes('organize') || text.includes('findings')) return FileText;
    if (text.includes('human') || text.includes('expertise')) return Brain;
    if (text.includes('conversational') || text.includes('follow-up')) return MessageSquare;
    return ChevronRight;
  };

  // Function to format step text with better structure
  const formatStepText = (text: string) => {
    // Split on colons to separate main instruction from details
    const parts = text.split(':');
    if (parts.length > 1) {
      const title = parts[0].trim();
      const details = parts.slice(1).join(':').trim();
      
      return (
        <div>
          <div className="font-semibold text-gray-900 mb-2">{title}</div>
          <div className="text-gray-700 leading-relaxed">{formatDetailText(details)}</div>
        </div>
      );
    }
    
    return <div className="text-gray-700 leading-relaxed">{formatDetailText(text)}</div>;
  };

  // Function to format detail text with better typography
  const formatDetailText = (text: string) => {
    // Handle quotes and code-like text
    return text.split('\n').map((line, i) => {
      // Check if line contains quotes (likely example text)
      if (line.includes('"') && line.length > 50) {
        return (
          <div key={i} className="bg-gray-50 p-2 rounded mt-2 text-sm font-mono border-l-2 border-blue-200">
            {line}
          </div>
        );
      }
      
      // Handle bullet points or sub-items
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="ml-4 mt-1">
            {line}
          </div>
        );
      }
      
      return <div key={i} className="mt-1">{line}</div>;
    });
  };

  // Check if steps are dense (average length > 200 chars)
  const averageLength = steps.reduce((sum, step) => sum + step.length, 0) / steps.length;
  const isDense = averageLength > 200;

  if (isSlideMode) {
    // Compact slide mode with numbered steps
    return (
      <div className="space-y-2">
        {steps.map((step, index) => {
          const IconComponent = getStepIcon(step, index);
          return (
            <div key={index} className="flex gap-2 text-xs">
              <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">{index + 1}</span>
              </div>
              <div className="flex-1">
                {formatStepText(step)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (isDense && steps.length > 5) {
    // Use accordion for dense content
    return (
      <Accordion type="multiple" className="space-y-2">
        {steps.map((step, index) => {
          const IconComponent = getStepIcon(step, index);
          const parts = step.split(':');
          const title = parts.length > 1 ? parts[0].trim() : `Step ${index + 1}`;
          
          return (
            <AccordionItem key={index} value={`step-${index}`} className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{title}</div>
                    <div className="text-sm text-gray-500">Step {index + 1}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="ml-11">
                  {parts.length > 1 ? formatDetailText(parts.slice(1).join(':').trim()) : formatDetailText(step)}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  // Standard numbered list for normal content
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const IconComponent = getStepIcon(step, index);
        return (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
            </div>
            <div className="flex-1">
              {formatStepText(step)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnhancedStepsList;
