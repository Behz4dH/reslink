interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  const steps = [
    { number: 1, title: "Title your Reslink" },
    { number: 2, title: "Upload Resume" },
    { number: 3, title: "Video pitch" }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.number <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step.number <= currentStep ? '✓' : step.number}
              </div>
              <span className={`font-medium ${
                step.number <= currentStep 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                step.number < currentStep 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};