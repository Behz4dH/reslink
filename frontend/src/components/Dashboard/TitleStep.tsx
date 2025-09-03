import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowRight, Info } from 'lucide-react';

interface TitleStepProps {
  title?: string;
  name?: string;
  setTitle?: (title: string) => void;
  setName?: (name: string) => void;
  onNext?: () => void;
}

export const TitleStep: React.FC<TitleStepProps> = ({
  title = '',
  name = '',
  setTitle = () => {},
  setName = () => {},
  onNext = () => {},
}) => {
  const [errors, setErrors] = useState<{ title?: string; name?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; name?: string } = {};

    if (!title?.trim()) {
      newErrors.title = 'Reslink title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title should be at least 5 characters';
    }

    if (!name?.trim()) {
      newErrors.name = 'Your name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name should be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle?.(value);
    if (errors.title && value.trim().length >= 5) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName?.(value);
    if (errors.name && value.trim().length >= 2) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const isFormValid = (title?.trim()?.length ?? 0) >= 5 && (name?.trim()?.length ?? 0) >= 2;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create Your Reslink
        </h1>
        <p className="text-muted-foreground text-lg">
          Start by telling us about yourself and the role you're applying for.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="p-8">
        <div className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Reslink Title
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Use format: "Position - Company" (e.g., "Product Manager - Meta")
            </p>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Product Manager - Meta"
              className={`h-12 text-base ${errors.title ? 'border-destructive' : ''}`}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Your Full Name
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              This will appear on your public Reslink profile
            </p>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="John Doe"
              className={`h-12 text-base ${errors.name ? 'border-destructive' : ''}`}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Pro Tips Section */}
          <div className="bg-muted/50 rounded-lg p-4 border border-muted">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">Pro Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Make your title specific and include the company name</li>
                  <li>• Use your professional name as it appears on your resume</li>
                  <li>• Keep it concise but descriptive for better searchability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-muted-foreground">
          Step 1 of 3
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          size="lg"
          className="gap-2"
        >
          Next Step
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};