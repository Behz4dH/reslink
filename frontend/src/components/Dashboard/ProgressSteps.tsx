import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, User, FileText, Video, Camera } from 'lucide-react';

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
      title: "Create Script", 
      description: "Generate your pitch script",
      icon: Video
    },
    { 
      number: 4, 
      title: "Record Video", 
      description: "Record your video pitch",
      icon: Camera
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
    <div className="w-full max-w-xl mx-auto mb-4">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
            {Math.round((currentStep / steps.length) * 100)}%
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-1.5 text-center">
          <h3 className="text-sm font-semibold text-foreground">
            {steps[currentStep - 1]?.title}
          </h3>
          <p className="text-xs text-muted-foreground">
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
                      relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 
                      ${styles.circle}
                    `}>
                      {status === 'completed' ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Icon className="h-3 w-3" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="mt-2 text-center max-w-28">
                      <div className={`text-sm transition-colors duration-200 ${styles.title}`}>
                        {step.title}
                      </div>
                      <div className={`text-xs mt-0.5 transition-colors duration-200 ${styles.description}`}>
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full flex items-center">
                      <div className={`
                        h-0.5 flex-1 transition-colors duration-200 ml-4
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