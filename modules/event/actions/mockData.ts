export interface Location {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  safetyRating: "safe" | "neutral" | "unsafe";
  lgbtqOwned: boolean;
  phone?: string;
  website?: string;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  description: string;
  price: number;
  lgbtqFriendly: boolean;
  organizer: string;
  tags: string[];
}

export const categoryLabels: { [key: string]: string } = {
  Restaurantes: "Restaurantes",
  Bares: "Bares",
  Hospedagem: "Hospedagem",
  Saúde: "Saúde",
  Educação: "Educação",
  Entretenimento: "Entretenimento",
  Serviços: "Serviços",
};

export const eventCategoryLabels: { [key: string]: string } = {
  cultural: "Cultural",
  social: "Social",
  educativo: "Educativo",
  festa: "Festa",
  esportivo: "Esportivo",
};

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Café Arco-Íris",
    category: "Restaurantes",
    latitude: -23.5505,
    longitude: -46.6333,
    address: "Rua Augusta, 123, São Paulo, SP",
    description: "Café acolhedor com opções veganas.",
    safetyRating: "safe",
    lgbtqOwned: true,
    phone: "(11) 1234-5678",
    website: "https://cafe-arcoiris.com",
    tags: ["vegano", "acolhedor", "LGBTQIA+"],
  },
  {
    id: "2",
    name: "Bar da Vila",
    category: "Bares",
    latitude: -23.5605,
    longitude: -46.6433,
    address: "Rua Fradique Coutinho, 456, São Paulo, SP",
    description: "Bar com música ao vivo e ambiente inclusivo.",
    safetyRating: "neutral",
    lgbtqOwned: false,
    phone: "(11) 9876-5432",
    tags: ["música ao vivo", "inclusivo"],
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Parada Cultural LGBTQIA+",
    category: "cultural",
    date: "2025-08-15",
    startTime: "14:00",
    endTime: "22:00",
    location: "Avenida Paulista",
    address: "Av. Paulista, São Paulo, SP",
    description: "Celebração da diversidade com apresentações artísticas.",
    price: 0,
    lgbtqFriendly: true,
    organizer: "Coletivo Arco-Íris",
    tags: ["inclusivo", "arte", "diversidade"],
  },
  {
    id: "2",
    title: "Festa da Diversidade",
    category: "festa",
    date: "2025-07-20",
    startTime: "20:00",
    endTime: "04:00",
    location: "Clube da Vila",
    address: "Rua Fradique Coutinho, 789, São Paulo, SP",
    description: "Festa com DJs e performances ao vivo.",
    price: 50,
    lgbtqFriendly: true,
    organizer: "Vila Eventos",
    tags: ["música", "noite", "LGBTQIA+"],
  },
];