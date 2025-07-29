"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { EventCategory } from "@/types/event";

interface EventFilterProps {
  selectedCategory: string;
  categories: EventCategory[];
}

export default function EventFilter({ selectedCategory, categories }: EventFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categoryKey: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryKey === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryKey);
    }
    router.push(`/event?${newParams.toString()}`);
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("all")}
          className="transition-all duration-200"
        >
          Todos os Eventos
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.key)}
            className="transition-all duration-200"
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}