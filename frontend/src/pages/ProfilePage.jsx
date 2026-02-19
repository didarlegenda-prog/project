import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { usersAPI } from '../api/users';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';
import { User, Upload } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: usersAPI.getProfile,
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
    },
  });

  const resetFormToProfile = (profileData) => {
    if (profileData) {
      setValue('first_name', profileData.first_name || '');
      setValue('last_name', profileData.last_name || '');
      setValue('email', profileData.email || '');
      setValue('phone_number', profileData.phone_number || '');
      setValue('date_of_birth', profileData.date_of_birth || '');
    } else {
      reset();
    }
  };

  useEffect(() => {
    resetFormToProfile(profile);
  }, [profile, setValue]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Update profile
      const updated = await usersAPI.updateProfile(data);
      updateUser(updated);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await usersAPI.uploadImage(file);
      toast.success('Profile image updated!');
      refetch();
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-dark-200 flex items-center justify-center overflow-hidden">
                {profile?.image ? (
                  <img src={profile.image} alt={profile.first_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-dark-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-600">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-dark-900">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-dark-600">{profile?.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="First Name"
                {...register('first_name', { required: 'First name is required' })}
                error={errors.first_name?.message}
                disabled={!isEditing}
                required
              />

              <Input
                label="Last Name"
                {...register('last_name', { required: 'Last name is required' })}
                error={errors.last_name?.message}
                disabled={!isEditing}
                required
              />

              <Input
                label="Email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
                disabled={!isEditing}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                {...register('phone_number')}
                error={errors.phone_number?.message}
                disabled={!isEditing}
              />

              <Input
                label="Date of Birth"
                type="date"
                {...register('date_of_birth')}
                disabled={!isEditing}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="success"
                    loading={isSaving}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      resetFormToProfile(profile);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
