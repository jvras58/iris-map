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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, RotateCcw, Send, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocationSuggestionForm } from "@/modules/event/hooks/use-Location-Suggestion";
import { EventCategory } from "@prisma/client";

interface LocationSuggestionFormProps {
  categories: EventCategory[];
  popularTags: string[];
}

export default function LocationSuggestionForm({
  categories,
  popularTags,
}: LocationSuggestionFormProps) {
  const { form, isSubmitting, handleSubmit, handleReset, formatCategoriesForSelect, addTag, removeTag } =
    useLocationSuggestionForm({ categories });

  const [newTag, setNewTag] = useState("");
  const categoriesForSelect = formatCategoriesForSelect();

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle>Compartilhe um local inclusivo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Local *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Café Acolhedor" disabled={isSubmitting} {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rua, número, bairro - cidade"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o local, ambiente, serviços oferecidos..."
                      rows={3}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="https://exemplo.com" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        disabled={isSubmitting}
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
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
                        disabled={isSubmitting}
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

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (características do local)</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar tag personalizada..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
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

                    {field.value.length > 0 && (
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

                    <div className="space-y-2">
                      <FormLabel className="text-sm text-muted-foreground">Sugestões de tags:</FormLabel>
                      <div className="flex flex-wrap gap-1">
                        {popularTags
                          .filter((tag) => !field.value.includes(tag))
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
              <Button asChild variant="outline" className="flex-1" disabled={isSubmitting}>
                <Link href="/map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Voltar ao Mapa
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
                className="flex-1 hover:shadow-glow transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-spin" />
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