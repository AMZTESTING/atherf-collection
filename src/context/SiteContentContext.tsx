"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  defaultSiteContent,
  type SiteContent,
  type Testimonial,
  type StoryContent,
  type FooterContent,
  type OfferBanner,
} from "@/data/siteContent";

type SiteContentContextType = {
  content: SiteContent;
  updateLogo: (logo: string) => Promise<void>;
  updateStory: (story: Partial<StoryContent>) => Promise<void>;
  updateFooter: (footer: Partial<FooterContent>) => Promise<void>;
  updateOfferBanner: (banner: Partial<OfferBanner>) => Promise<void>;
  addTestimonial: (t: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshContent: () => Promise<void>;
  isReady: boolean;
};

const SiteContentContext = createContext<SiteContentContextType | null>(null);

export function SiteContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isReady, setIsReady] = useState(false);

  const refreshContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContent({
          logo: data.logo || defaultSiteContent.logo,
          story: { ...defaultSiteContent.story, ...(data.story || {}) },
          testimonials: data.testimonials || defaultSiteContent.testimonials,
          footer: {
            ...defaultSiteContent.footer,
            ...(data.footer || {}),
            social: {
              ...defaultSiteContent.footer.social,
              ...((data.footer?.social as any) || {}),
            },
          },
          offerBanner: {
            ...defaultSiteContent.offerBanner,
            ...(data.offer_banner || {}),
          },
        });
      }
    } catch (e) {
      console.error("SiteContent load failed:", e);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  const saveToDB = async (newContent: SiteContent) => {
    const { error } = await supabase.from("site_content").upsert({
      id: 1,
      logo: newContent.logo,
      story: newContent.story,
      testimonials: newContent.testimonials,
      footer: newContent.footer,
      offer_banner: newContent.offerBanner,
      updated_at: new Date().toISOString(),
    });

    if (error) console.error("Save content failed:", error);
  };

  const updateLogo = async (logo: string) => {
    const updated = { ...content, logo };
    setContent(updated);
    await saveToDB(updated);
  };

  const updateStory = async (storyUpdates: Partial<StoryContent>) => {
    const updated = {
      ...content,
      story: { ...content.story, ...storyUpdates },
    };
    setContent(updated);
    await saveToDB(updated);
  };

  const updateFooter = async (footerUpdates: Partial<FooterContent>) => {
    const updated = {
      ...content,
      footer: {
        ...content.footer,
        ...footerUpdates,
        social: footerUpdates.social
          ? { ...content.footer.social, ...footerUpdates.social }
          : content.footer.social,
      },
    };
    setContent(updated);
    await saveToDB(updated);
  };

  const updateOfferBanner = async (bannerUpdates: Partial<OfferBanner>) => {
    const updated = {
      ...content,
      offerBanner: { ...content.offerBanner, ...bannerUpdates },
    };
    setContent(updated);
    await saveToDB(updated);
  };

  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    const updated = {
      ...content,
      testimonials: [
        ...content.testimonials,
        { ...t, id: Date.now().toString() },
      ],
    };
    setContent(updated);
    await saveToDB(updated);
  };

  const updateTestimonial = async (
    id: string,
    updates: Partial<Testimonial>
  ) => {
    const updated = {
      ...content,
      testimonials: content.testimonials.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    };
    setContent(updated);
    await saveToDB(updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated = {
      ...content,
      testimonials: content.testimonials.filter((t) => t.id !== id),
    };
    setContent(updated);
    await saveToDB(updated);
  };

  const resetToDefaults = async () => {
    setContent(defaultSiteContent);
    await saveToDB(defaultSiteContent);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateLogo,
        updateStory,
        updateFooter,
        updateOfferBanner,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        resetToDefaults,
        refreshContent,
        isReady,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx)
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  return ctx;
}