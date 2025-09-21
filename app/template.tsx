"use client";

import { PageTransition } from "@/components/PageTransition";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
