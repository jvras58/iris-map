"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Calendar, Plus, Info, Globe } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Home', icon: MapPin },
    { path: '/map', label: 'Mapa', icon: MapPin },
    { path: '/event', label: 'Eventos', icon: Calendar },
    { path: '/sugerir', label: 'Sugerir Local', icon: Plus },
    { path: '/carteirinha', label: 'Carteirinha', icon: Info },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              Conexão Íris
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                asChild
                variant={isActive(path) ? "default" : "ghost"}
                className={`
                  transition-all duration-200
                  ${isActive(path) ? "bg-primary text-primary-foreground" : ""}
                `}
              >
                <Link href={path} className="flex items-center space-x-2">
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="transition-all duration-200"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-sm border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  asChild
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`
                    w-full justify-start transition-all duration-200
                    ${isActive(path) ? "bg-primary text-primary-foreground" : ""}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={path} className="flex items-center space-x-2">
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}