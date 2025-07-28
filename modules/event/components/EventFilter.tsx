"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { eventCategoryLabels } from "../actions/mockData";


interface EventFilterProps {
  selectedCategory: string;
  categories: string[];
}

export default function EventFilter({ selectedCategory, categories }: EventFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
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
        {categories.map((key) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(key)}
            className="transition-all duration-200"
          >
            {eventCategoryLabels[key as keyof typeof eventCategoryLabels]}
          </Button>
        ))}
      </div>
    </div>
  );
}