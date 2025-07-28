import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';


import { UserProfile } from '@/types/profile';
import { updateProfile } from '../actions/update-profile';
import { ProfileFormSchema, ProfileFormValues } from '../schemas/profile-edit-schema';

interface UseProfileFormProps {
  initialProfile: UserProfile;
}

export function useProfileForm({ initialProfile }: UseProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: initialProfile.name || '',
      sexual_orientation: initialProfile.profile?.sexual_orientation || '',
      city: initialProfile.profile?.city || '',
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await updateProfile(data);
      
      if (result.success) {
        toast.success('Perfil atualizado!', {
          description: 'Suas informações foram salvas com sucesso.',
        });
        setIsEditing(false);
      } else {
        toast.error('Erro ao salvar', {
          description: result.error?.message || 'Erro desconhecido',
        });
      }
    } catch (error) {
      toast.error('Erro ao salvar', {
        description: 'Ocorreu um erro inesperado',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      name: initialProfile.name || '',
      sexual_orientation: initialProfile.profile?.sexual_orientation || '',
      city: initialProfile.profile?.city || '',
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return {
    form,
    isEditing,
    isLoading,
    handleSubmit,
    handleCancel,
    handleEdit,
  };
}