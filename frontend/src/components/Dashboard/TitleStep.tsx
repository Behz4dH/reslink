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
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Create Your Reslink
        </h2>
        <p className="text-muted-foreground text-sm">
          Tell us about yourself and the role you're applying for.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="p-3">
        <div className="space-y-2.5">
          {/* Title Input */}
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm font-medium">
              Reslink Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Product Manager - Meta"
              className={`h-8 text-sm ${errors.title ? 'border-destructive' : ''}`}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            <p className="text-xs text-muted-foreground">
              Format: "Position - Company"
            </p>
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="John Doe"
              className={`h-8 text-sm ${errors.name ? 'border-destructive' : ''}`}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <p className="text-xs text-muted-foreground">
              Appears on your public profile
            </p>
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Pro Tips Section */}
          <div className="bg-muted/30 rounded p-2 border border-muted/50">
            <div className="flex items-start gap-1.5">
              <Info className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xs font-medium text-foreground mb-0.5">Pro Tips</h3>
                <ul className="text-xs text-muted-foreground leading-tight">
                  <li>• Include company name in title</li>
                  <li>• Use your professional name</li>
                  <li>• Keep it concise and descriptive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-muted-foreground">
          Step 1 of 4
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          size="sm"
          className="gap-1.5"
        >
          Next
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};