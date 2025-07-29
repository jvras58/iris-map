// npx tsx prisma/seeds/category-seed.ts

import { prisma } from "@/lib/prisma";

const categories = [
  { key: "workshop", label: "Workshop" },
  { key: "palestra", label: "Palestra" },
  { key: "festa", label: "Festa" },
  { key: "cultural", label: "Cultural" },
  { key: "esportivo", label: "Esportivo" },
  { key: "social", label: "Social" },
  { key: "educativo", label: "Educativo" },
  { key: "networking", label: "Networking" },
  { key: "arte", label: "Arte" },
  { key: "musica", label: "Música" },
  { key: "danca", label: "Dança" },
  { key: "teatro", label: "Teatro" },
  { key: "cinema", label: "Cinema" },
  { key: "literatura", label: "Literatura" },
  { key: "gastronomia", label: "Gastronomia" },
  { key: "saude", label: "Saúde e Bem-estar" },
  { key: "tecnologia", label: "Tecnologia" },
  { key: "voluntariado", label: "Voluntariado" },
  { key: "debate", label: "Debate" },
  { key: "outros", label: "Outros" },
];

async function seedCategories() {
  try {
    console.log('🌱 Iniciando seed das categorias...');

    // Usar upsert para evitar duplicatas
    for (const category of categories) {
      await prisma.eventCategory.upsert({
        where: { key: category.key },
        update: { label: category.label },
        create: category,
      });
    }

    console.log(`✅ ${categories.length} categorias foram criadas/atualizadas com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao fazer seed das categorias:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();