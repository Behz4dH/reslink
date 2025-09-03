import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  UserIcon, 
  CameraIcon, 
  SaveIcon, 
  KeyIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';
import { apiService } from '../../services/api';

interface UserProfileData {
  username: string;
  email: string;
  linkedin_url: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserProfileSheetProps {
  children: React.ReactNode;
}

export const UserProfileSheet = ({ children }: UserProfileSheetProps) => {
  const { user, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserProfileData>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      linkedin_url: user?.linkedin_url || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Avatar file size must be less than 5MB' });
        return;
      }
      
      setAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const onSubmitProfile = async (data: UserProfileData) => {
    try {
      setLoading(true);
      setMessage(null);

      console.log('🔍 Profile update started');
      console.log('📝 Form data:', data);
      console.log('👤 Current user:', user);

      // Only send fields that have changed from the original user data
      const profileUpdates: { [key: string]: any } = {};
      
      if (data.username !== user?.username) {
        console.log(`📝 Username changed: "${user?.username}" -> "${data.username}"`);
        profileUpdates.username = data.username;
      }
      if (data.email !== user?.email) {
        console.log(`📧 Email changed: "${user?.email}" -> "${data.email}"`);
        profileUpdates.email = data.email;
      }
      if (data.linkedin_url !== (user?.linkedin_url || '')) {
        console.log(`🔗 LinkedIn changed: "${user?.linkedin_url || ''}" -> "${data.linkedin_url}"`);
        profileUpdates.linkedin_url = data.linkedin_url;
      }

      console.log('🚀 Profile updates to send:', profileUpdates);

      // Update profile if any fields changed
      if (Object.keys(profileUpdates).length > 0) {
        console.log('🌐 Sending API request...');
        const result = await apiService.updateProfile(profileUpdates);
        console.log('✅ API response:', result);
      } else {
        console.log('⚠️ No fields changed, skipping API call');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh user data to show updates
      console.log('🔄 Refreshing user data...');
      await refreshUser();
      console.log('✅ User data refreshed');
      
      // Reset form
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setAvatar(null);
      setAvatarPreview('');

    } catch (error) {
      console.error('❌ Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: UserProfileData) => {
    try {
      setLoading(true);
      setMessage(null);

      // Validate required fields for password change
      if (!data.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required' });
        return;
      }

      if (!data.newPassword) {
        setMessage({ type: 'error', text: 'New password is required' });
        return;
      }

      if (data.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
        return;
      }

      if (!data.confirmPassword) {
        setMessage({ type: 'error', text: 'Please confirm your new password' });
        return;
      }

      if (data.newPassword !== data.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      await apiService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      
      // Reset password fields
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const onUploadAvatar = async () => {
    if (!avatar) return;
    
    try {
      setLoading(true);
      setMessage(null);

      const result = await apiService.uploadAvatar(avatar);

      setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
      
      setAvatar(null);
      setAvatarPreview('');

      // Refresh user data to show new avatar
      await refreshUser();

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload avatar' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarPreview || user?.avatar_url} />
              <AvatarFallback>
                {user?.username ? getUserInitials(user.username) : <UserIcon className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            Profile Settings
          </SheetTitle>
          <SheetDescription>
            Manage your account settings and profile information
          </SheetDescription>
        </SheetHeader>

        {message && (
          <Alert className={`mt-4 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircleIcon className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm">
                    {user?.role === 'superuser' ? 'Admin' : 'User'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date().getFullYear()}
                  </span>
                </div>

                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...register('username', { 
                          required: 'Username is required',
                          minLength: { value: 3, message: 'Username must be at least 3 characters' }
                        })}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                        })}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      {...register('linkedin_url', { 
                        pattern: { 
                          value: /^https?:\/\/(www\.)?linkedin\.com\/in\/.*/, 
                          message: 'Please enter a valid LinkedIn profile URL' 
                        }
                      })}
                    />
                    {errors.linkedin_url && (
                      <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CameraIcon className="h-5 w-5" />
                  Profile Avatar
                </CardTitle>
                <CardDescription>
                  Upload a profile picture to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={avatarPreview || user?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {user?.username ? getUserInitials(user.username) : <UserIcon className="h-12 w-12" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <CameraIcon className="h-4 w-4" />
                        Choose Image
                      </div>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="sr-only"
                      />
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>

                {avatar && (
                  <Button onClick={onUploadAvatar} disabled={loading} className="w-full">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Uploading...' : 'Upload Avatar'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyIcon className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        {...register('currentPassword')}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...register('newPassword')}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('confirmPassword')}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};