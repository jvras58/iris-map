import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
// import { ChatBot } from "@/components/ChatBot";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Mapa de espaços",
      description: "Descubra e compartilhe locais que sejam seguros e acolhedores.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Lista de eventos",
      description: "Encontre e organize eventos que promovam diversidade e inclusão.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Comunidade exclusiva",
      description: "A participação se dá através de convites enviados pela comunidade.",
    },
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Acolhimento",
      description: "Criamos espaços onde cada pessoa pode ser autêntica.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Segurança",
      description: "Priorizamos a segurança física e emocional de nossa comunidade.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Comunidade",
      description: "Fortalecemos os laços entre pessoas diversas.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="/hero-image.jpg"
          alt="Conexão Íris Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-pink-600/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Conexão Íris
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              Descubra espaços e eventos seguros para a comunidade LGBTQIAPN+
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/mapa">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explorar Mapa
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/eventos">
                  <Calendar className="mr-2 h-5 w-5" />
                  Explorar Eventos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">Nossa Missão</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Construir uma rede de espaços seguros e acolhedores onde a comunidade LGBTQIA+ possa existir livremente, conectar-se e prosperar em um ambiente de respeito e diversidade.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Como Funciona
          </h3>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Construindo Juntes uma Comunidade Mais Segura
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Cada local mapeado e cada avaliação compartilhada fortalece nossa rede de apoio e segurança.
          </p>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Faça Parte da Mudança
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sua contribuição faz a diferença. Ajude-nos a mapear mais espaços seguros e a construir uma comunidade mais forte.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/mapa">
                <MapPin className="mr-2 h-5 w-5" />
                Explorar Mapa
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/eventos">
                <Calendar className="mr-2 h-5 w-5" />
                Explorar Eventos
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* <ChatBot /> */}
    </div>
  );
}