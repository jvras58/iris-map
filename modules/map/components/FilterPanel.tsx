"use client";

import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterPanelProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  showLgbtqOnly: boolean;
  onLgbtqOnlyChange: (value: boolean) => void;
  showSafeOnly: boolean;
  onSafeOnlyChange: (value: boolean) => void;
}

export default function FilterPanel({
  selectedCategories,
  onCategoryChange,
  showLgbtqOnly,
  onLgbtqOnlyChange,
  showSafeOnly,
  onSafeOnlyChange,
}: FilterPanelProps) {
  const categories = ["Restaurantes", "Bares", "Hospedagem", "Saúde", "Educação", "Entretenimento", "Serviços"];

  const handleCategoryToggle = useCallback(
    (category: string, checked: boolean) => {
      if (checked) {
        onCategoryChange([...selectedCategories, category]);
      } else {
        onCategoryChange(selectedCategories.filter((c) => c !== category));
      }
    },
    [selectedCategories, onCategoryChange]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Categorias</Label>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryToggle(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Filtros Adicionais</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="lgbtq-only"
              checked={showLgbtqOnly}
              onCheckedChange={onLgbtqOnlyChange}
            />
            <Label htmlFor="lgbtq-only">Apenas LGBTQIA+</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="safe-only"
              checked={showSafeOnly}
              onCheckedChange={onSafeOnlyChange}
            />
            <Label htmlFor="safe-only">Apenas Seguros</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}