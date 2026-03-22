import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://next-umsungjun.vercel.app";

  return [
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          ko: `${baseUrl}/home`,
          en: `${baseUrl}/en/home`,
        },
      },
    },
    {
      url: `${baseUrl}/en/home`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          ko: `${baseUrl}/home`,
          en: `${baseUrl}/en/home`,
        },
      },
    },
  ];
}
