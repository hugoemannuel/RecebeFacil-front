"use client";

import { useEffect, useRef } from 'react';
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/types/user";
import { SubscriptionStatus } from "@/components/layout/DashboardLayout/interface";

interface StoreInitializerProps {
  user: User | null;
  subscription: SubscriptionStatus | null;
}

export function StoreInitializer({ user, subscription }: StoreInitializerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useUserStore.setState({ user, subscription });
      initialized.current = true;
    }
  }, [user, subscription]);

  // Sincronização em background quando a janela ganha foco
  useEffect(() => {
    const handleFocus = () => {
      useUserStore.getState().refresh();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return null;
}
