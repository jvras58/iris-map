"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, MapPin, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { LocationSuggestionFormValues, locationSuggestionSchema } from "../schemas/location-suggestion-schema";


interface LocationSuggestionFormProps {
  categories: [string, string][];
  popularTags: string[];
}

export default function LocationSuggestionForm({ categories, popularTags }: LocationSuggestionFormProps) {
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LocationSuggestionFormValues>({
    resolver: zodResolver(locationSuggestionSchema),
    defaultValues: {
      name: "",
      category: "",
      address: "",
      description: "",
      phone: "",
      website: "",
      lgbtqOwned: false,
      safetyRating: "safe",
      publicVisible: true,
      tags: [],
    },
  });

  const addTag = (tag: string) => {
    if (tag.trim() && !form.getValues("tags").includes(tag.trim())) {
      form.setValue("tags", [...form.getValues("tags"), tag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue("tags", form.getValues("tags").filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: LocationSuggestionFormValues) => {
    setIsSubmitting(true);
    // TODO: Implementar criação de local
    console.log("Form data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock submission
    toast.success("Sugestão enviada com sucesso! 🎉", {
      description: "Obrigado por contribuir com nossa comunidade. Sua sugestão será analisada em breve.",
    });
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary" />
          <span>Informações do Local</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Local *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Café Acolhedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro - cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o local, ambiente, serviços oferecidos..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 9999-9999" {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com" {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Characteristics */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="lgbtqOwned"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      🏳️‍🌈 Negócio LGBTQIA+ Owned
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="safetyRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Segurança</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="safe">🛡️ Espaço Seguro</SelectItem>
                        <SelectItem value="neutral">⚡ Neutro</SelectItem>
                        <SelectItem value="unsafe">⚠️ Requer Atenção</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicVisible"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      Tornar visível publicamente após aprovação
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <FormLabel>Tags (características do local)</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && (e.preventDefault(), addTag(newTag))}
                />
                <Button type="button" size="sm" onClick={() => addTag(newTag)}>
                  <Plus size={16} />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-muted flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeTag(tag);
                              }}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="text-sm text-muted-foreground">Sugestões de tags:</FormLabel>
                <div className="flex flex-wrap gap-1">
                  {popularTags
                    .filter((tag) => !form.getValues("tags").includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => addTag(tag)}
                      >
                        <Plus size={12} className="mr-1" />
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/mapa">
                  <MapPin className="mr-2 h-4 w-4" />
                  Voltar ao Mapa
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 hover:shadow-glow transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Sugestão
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}