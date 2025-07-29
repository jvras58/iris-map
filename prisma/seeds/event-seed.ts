// npx tsx prisma/seeds/event-seed.ts

import { prisma } from "@/lib/prisma";

const events = [
  {
    title: "Workshop de Diversidade e Inclusão",
    categoryKey: "workshop",
    description: "Workshop sobre práticas inclusivas no ambiente de trabalho e na sociedade.",
    date: new Date("2025-08-15T10:00:00Z"),
    time: "10:00",
    location: "Centro Cultural LGBTQ+ - São Paulo",
    organizer: "Coletivo Diversidade",
    price: 25.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["diversidade", "inclusão", "workplace"])
  },
  {
    title: "Festa Drag Queen Night",
    categoryKey: "festa",
    description: "Noite de apresentações de drag queens com música e performances incríveis.",
    date: new Date("2025-08-20T21:00:00Z"),
    time: "21:00",
    location: "Bar do Arco-Íris - Rio de Janeiro",
    organizer: "Casa das Drags",
    price: 30.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["drag", "festa", "performance", "música"])
  },
  {
    title: "Palestra: Direitos LGBTQ+ no Brasil",
    categoryKey: "palestra",
    description: "Discussão sobre os avanços e desafios dos direitos LGBTQ+ na legislação brasileira.",
    date: new Date("2025-08-25T19:00:00Z"),
    time: "19:00",
    location: "Auditório da Universidade Federal - Brasília",
    organizer: "OAB Diversidade",
    price: null,
    lgbtqFriendly: true,
    tags: JSON.stringify(["direitos", "lgbtq", "legislação", "educativo"])
  },
  {
    title: "Exposição de Arte Queer",
    categoryKey: "arte",
    description: "Mostra de artistas LGBTQ+ contemporâneos com obras que exploram identidade e sexualidade.",
    date: new Date("2025-09-01T14:00:00Z"),
    time: "14:00",
    location: "Galeria de Arte Moderna - Porto Alegre",
    organizer: "Museu da Diversidade",
    price: 15.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["arte", "queer", "exposição", "identidade"])
  },
  {
    title: "Festival de Cinema LGBTQ+",
    categoryKey: "cinema",
    description: "Exibição de filmes nacionais e internacionais com temática LGBTQ+.",
    date: new Date("2025-09-05T18:00:00Z"),
    time: "18:00",
    location: "Cinema Arthouse - Belo Horizonte",
    organizer: "Festival Mix Brasil",
    price: 20.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["cinema", "festival", "filmes", "cultura"])
  },
  {
    title: "Grupo de Apoio para Jovens LGBTQ+",
    categoryKey: "social",
    description: "Encontro mensal para jovens LGBTQ+ compartilharem experiências e receberem apoio.",
    date: new Date("2025-08-30T16:00:00Z"),
    time: "16:00",
    location: "Centro Comunitário Arco-Íris - Recife",
    organizer: "ONG Juventude Livre",
    price: null,
    lgbtqFriendly: true,
    tags: JSON.stringify(["apoio", "jovens", "comunidade", "social"])
  },
  {
    title: "Corrida pela Diversidade",
    categoryKey: "esportivo",
    description: "Corrida beneficente para arrecadar fundos para ONGs LGBTQ+.",
    date: new Date("2025-09-10T07:00:00Z"),
    time: "07:00",
    location: "Parque Ibirapuera - São Paulo",
    organizer: "Runners Pride",
    price: 35.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["corrida", "esporte", "beneficente", "diversidade"])
  },
  {
    title: "Networking LGBTQ+ Profissional",
    categoryKey: "networking",
    description: "Evento de networking para profissionais LGBTQ+ expandirem suas redes de contatos.",
    date: new Date("2025-09-15T18:30:00Z"),
    time: "18:30",
    location: "Hotel Business Center - Curitiba",
    organizer: "Pride Network",
    price: 40.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["networking", "profissional", "carreira", "business"])
  },
  {
    title: "Sarau Literário LGBTQ+",
    categoryKey: "literatura",
    description: "Noite de leitura e declamação de poesias e textos de autores LGBTQ+.",
    date: new Date("2025-09-20T20:00:00Z"),
    time: "20:00",
    location: "Livraria Diversa - Salvador",
    organizer: "Coletivo Palavras Livres",
    price: 10.00,
    lgbtqFriendly: true,
    tags: JSON.stringify(["literatura", "poesia", "sarau", "cultura"])
  },
  {
    title: "Workshop de Saúde Sexual",
    categoryKey: "saude",
    description: "Informações sobre saúde sexual e prevenção voltadas para a comunidade LGBTQ+.",
    date: new Date("2025-09-25T14:00:00Z"),
    time: "14:00",
    location: "Centro de Saúde Comunitária - Fortaleza",
    organizer: "Instituto Saúde Integral",
    price: null,
    lgbtqFriendly: true,
    tags: JSON.stringify(["saúde", "prevenção", "educativo", "bem-estar"])
  }
];

async function seedEvents() {
  try {
    console.log('🌱 Iniciando seed dos eventos...');

    // Primeiro, buscar as categorias existentes
    const categories = await prisma.eventCategory.findMany();
    const categoryMap = new Map(categories.map(cat => [cat.key, cat.id]));

    for (const event of events) {
      const categoryId = categoryMap.get(event.categoryKey);
      
      if (!categoryId) {
        console.warn(`⚠️ Categoria '${event.categoryKey}' não encontrada. Pulando evento: ${event.title}`);
        continue;
      }

      await prisma.eventSuggestion.create({
        data: {
          title: event.title,
          categoryId: categoryId,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          organizer: event.organizer,
          price: event.price,
          lgbtqFriendly: event.lgbtqFriendly,
          tags: event.tags,
          status: "APPROVED" // Eventos já aprovados para visualização
        }
      });
    }

    console.log(`✅ ${events.length} eventos foram criados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao fazer seed dos eventos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents();