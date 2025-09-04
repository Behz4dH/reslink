import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Save, 
  Scissors, 
  Smile, 
  Maximize, 
  Briefcase, 
  Clock,
  Type,
  CheckCircle,
  Info
} from 'lucide-react';

interface GeneratedScriptModalProps {
  script?: string;
  onClose?: () => void;
  onSave?: (script: string) => void;
}

export const GeneratedScriptModal: React.FC<GeneratedScriptModalProps> = ({ 
  script = '', 
  onClose = () => {}, 
  onSave = () => {} 
}) => {
  const [currentScript, setCurrentScript] = useState(script);
  const [customEdit, setCustomEdit] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditAction = async (action: string) => {
    if (!action.trim()) return;
    
    setIsEditing(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/pitch/modify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: currentScript,
          modification: action,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.script) {
        setCurrentScript(data.data.script);
        if (action === customEdit) {
          setCustomEdit(''); // Clear custom input after successful apply
        }
      } else {
        console.error('Failed to modify script:', data.error);
        // Could show an error toast here
      }
    } catch (error) {
      console.error('Error modifying script:', error);
      // Could show an error toast here
    } finally {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    onSave(currentScript);
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getEstimatedDuration = (wordCount: number) => {
    // Average speaking rate is ~150 words per minute
    const minutes = Math.ceil(wordCount / 150);
    return `${minutes} min`;
  };

  const wordCount = getWordCount(currentScript);
  const estimatedDuration = getEstimatedDuration(wordCount);

  const editOptions = [
    {
      id: 'shorten',
      label: 'Shorten it',
      icon: Scissors,
      description: 'Make it more concise'
    },
    {
      id: 'casual',
      label: 'Make it casual',
      icon: Smile,
      description: 'More conversational tone'
    },
    {
      id: 'lengthen',
      label: 'Lengthen it',
      icon: Maximize,
      description: 'Add more details'
    },
    {
      id: 'formal',
      label: 'Make it formal',
      icon: Briefcase,
      description: 'More professional tone'
    }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Your Generated Script
          </DialogTitle>
          <DialogDescription>
            Here's your personalized 60-90 second video script. You can edit it directly or use our AI suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Script Stats */}
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary" className="gap-1">
              <Type className="h-3 w-3" />
              {wordCount} words
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              ~{estimatedDuration} read
            </Badge>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Ready to use
            </Badge>
          </div>

          {/* Script Editor */}
          <Card className="p-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <textarea
                value={currentScript}
                onChange={(e) => setCurrentScript(e.target.value)}
                className="w-full h-40 bg-transparent border-none resize-none focus:outline-none text-sm leading-relaxed"
                placeholder="Your script will appear here..."
                disabled={isEditing}
              />
            </div>
          </Card>

          {/* AI Edit Options */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary" />
              <h3 className="text-sm font-medium text-foreground">AI Script Adjustments</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {editOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleEditAction(option.id)}
                    disabled={isEditing}
                    className="flex flex-col h-auto p-1.5 gap-0.5"
                  >
                    <Icon className={`h-4 w-4 ${isEditing ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Custom Edit Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-3 w-3 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Custom Instructions</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={customEdit}
                onChange={(e) => setCustomEdit(e.target.value)}
                placeholder="Tell us what you want to change in the script..."
                className="flex-1"
                disabled={isEditing}
              />
              <Button 
                onClick={() => handleEditAction(customEdit)}
                disabled={!customEdit.trim() || isEditing}
                variant="outline"
                className="min-w-[70px]"
              >
                {isEditing ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isEditing}
          >
            Back
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isEditing}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save & Use Script
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};