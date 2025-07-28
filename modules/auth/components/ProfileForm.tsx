"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Save, X, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useProfileForm } from "@/modules/auth/hooks/useProfileForm";
import { UserProfile } from "@/types/profile";

interface ProfileFormProps {
  userProfile: UserProfile;
  orientationOptions: string[];
}

export default function ProfileForm({ userProfile, orientationOptions }: ProfileFormProps) {
  const {
    form,
    isEditing,
    isLoading,
    handleSubmit,
    handleCancel,
    handleEdit,
  } = useProfileForm({ initialProfile: userProfile });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Gerencie suas informações pessoais</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={form.handleSubmit(handleSubmit)} 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={() => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      value={userProfile.email}
                      disabled
                      className="bg-background"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu nome completo"
                      disabled={!isEditing || isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sexual_orientation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orientação Sexual</FormLabel>
                  {isEditing ? (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua orientação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orientationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input
                        value={field.value || "Não informado"}
                        disabled
                        className="bg-background"
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sua cidade"
                      disabled={!isEditing || isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <div className="pt-6 border-t">
          <Button 
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            Sair da conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}