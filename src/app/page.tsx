"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { PromptInput, type DurationId } from "@/components/PromptInput";
import { PageLayout } from "@/components/PageLayout";

const Home: NextPage = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = (prompt: string, duration: DurationId) => {
    setIsNavigating(true);
    const params = new URLSearchParams({ prompt, duration });
    router.push(`/generate?${params.toString()}`);
  };

  return (
    <PageLayout>
      <PromptInput
        variant="landing"
        onNavigate={handleNavigate}
        isNavigating={isNavigating}
        showCodeExamplesLink
      />
    </PageLayout>
  );
};

export default Home;
