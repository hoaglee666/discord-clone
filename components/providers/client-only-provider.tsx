"use client";

import { useEffect, useState } from "react";
import { ModalProvider } from "@/components/providers/modal-provider";

export const ClientOnlyProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <ModalProvider />;
};
