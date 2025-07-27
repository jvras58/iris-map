"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UseQueryProviders } from "./queryProviders";
import { Toaster } from "@/components/ui/sonner";


export function RootAppProvider({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <UseQueryProviders>
        <TooltipProvider delayDuration={120}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </UseQueryProviders>
    </NuqsAdapter>
  );
}
