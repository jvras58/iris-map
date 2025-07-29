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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, RotateCcw, X } from "lucide-react";
import { useEventSuggestionForm } from "@/modules/event/hooks/use-Event-Suggestion";
import { EventCategory } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";


interface EventSuggestionFormProps {
  categories: EventCategory[];
  onSuccess?: () => void;
}

export default function EventSuggestionForm({ 
  categories, 
  onSuccess 
}: EventSuggestionFormProps) {
  const {
    form,
    isSubmitting,
    handleSubmit,
    handleReset,
    formatCategoriesForSelect,
    getMinDate,
    addTag,
    removeTag,
  } = useEventSuggestionForm({ categories, onSuccess });

  const categoriesForSelect = formatCategoriesForSelect();
  // [REFACTOR] Considerar usar o usewatch?
  const [newTag, setNewTag] = useState("");

  const tags = form.getValues("tags") || [];
  const popularTags = [
    "workshop", "festa", "discussão", "arte", "música", 
    "teatro", "cinema", "literatura", "política", "saúde",
    "educação", "esporte", "gastronomia", "tecnologia", "networking"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compartilhe um evento inclusivo</CardTitle>
        <CardDescription>
          Ajude a fortalecer nossa comunidade compartilhando eventos acolhedores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Evento *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Workshop de inclusão LGBTQIA+"
                        disabled={isSubmitting}
                        {...field} 
                      />
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
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesForSelect.map(([key, label]) => (
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o evento, atividades, público-alvo..."
                      disabled={isSubmitting}
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        min={getMinDate()}
                        disabled={isSubmitting}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        disabled={isSubmitting}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Centro Cultural ABC, Rua das Flores, 123"
                      disabled={isSubmitting}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizador *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome da pessoa ou organização"
                        disabled={isSubmitting}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00 para gratuito"
                        disabled={isSubmitting}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lgbtqFriendly"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Evento LGBTQIA+ Friendly</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Este evento é acolhedor para pessoas LGBTQIA+
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="space-y-3">
                    {/* Input para adicionar tag personalizada */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar tag personalizada..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newTag.trim()) {
                              addTag(newTag);
                              setNewTag("");
                            }
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (newTag.trim()) {
                            addTag(newTag);
                            setNewTag("");
                          }
                        }}
                        disabled={isSubmitting || !newTag.trim()}
                      >
                        Adicionar
                      </Button>
                    </div>

                    {/* Tags selecionadas */}
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeTag(index);
                              }}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                              disabled={isSubmitting}
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Tags sugeridas */}
                    <div className="space-y-2">
                      <FormLabel className="text-sm text-muted-foreground">Sugestões de tags:</FormLabel>
                      <div className="flex flex-wrap gap-1">
                        {popularTags
                          .filter((tag) => !field.value?.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => addTag(tag)}
                              disabled={isSubmitting}
                            >
                              <Plus size={12} className="mr-1" />
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-6">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar aos Eventos
                </Link>
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-shrink-0"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Sugerir Evento'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}