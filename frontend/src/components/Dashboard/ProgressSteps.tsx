import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, User, FileText, Video } from 'lucide-react';

interface ProgressStepsProps {
  currentStep?: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep = 1 
}) => {
  const steps = [
    { 
      number: 1, 
      title: "Create Profile", 
      description: "Add your name and job title",
      icon: User
    },
    { 
      number: 2, 
      title: "Upload Resume", 
      description: "Add your PDF resume", 
      icon: FileText
    },
    { 
      number: 3, 
      title: "Video Pitch", 
      description: "Record your video pitch",
      icon: Video
    }
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-primary text-primary-foreground border-primary',
          title: 'text-foreground font-semibold',
          description: 'text-muted-foreground',
          connector: 'bg-primary'
        };
      case 'current':
        return {
          circle: 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/20',
          title: 'text-primary font-semibold',
          description: 'text-foreground',
          connector: 'bg-muted-foreground/30'
        };
      case 'pending':
      default:
        return {
          circle: 'bg-muted text-muted-foreground border-muted-foreground/30',
          title: 'text-muted-foreground',
          description: 'text-muted-foreground',
          connector: 'bg-muted-foreground/30'
        };
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <Badge variant="outline" className="text-xs">
            {Math.round((currentStep / steps.length) * 100)}%
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            {steps[currentStep - 1]?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      {/* Desktop Step Indicators */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.number);
              const styles = getStepStyles(status);
              const Icon = step.icon;

              return (
                <li key={step.number} className="relative flex-1">
                  <div className="flex flex-col items-center group">
                    {/* Step Circle */}
                    <div className={`
                      relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 
                      ${styles.circle}
                    `}>
                      {status === 'completed' ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="mt-3 text-center max-w-32">
                      <div className={`text-sm transition-colors duration-200 ${styles.title}`}>
                        {step.title}
                      </div>
                      <div className={`text-xs mt-1 transition-colors duration-200 ${styles.description}`}>
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full flex items-center">
                      <div className={`
                        h-0.5 flex-1 transition-colors duration-200 ml-6
                        ${styles.connector}
                      `} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};