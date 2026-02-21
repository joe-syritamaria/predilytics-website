"use client";

import { useState } from "react";
import Image from "next/image";

type Tutorial = {
  title: string;
  description: string;
  youtube?: string; // full URL or ID
  product: string;
  comingSoon?: boolean;
};

// Helper: convert any YouTube URL or ID to a video ID
function getYouTubeId(input?: string) {
  if (!input) return "";

  if (!input.includes("http")) return input;

  try {
    const url = new URL(input);
    const v = url.searchParams.get("v");
    if (v) return v;
    if (url.hostname.includes("youtu.be")) return url.pathname.replace("/", "");
  } catch {
    return "";
  }
  return "";
}

// Helper: YouTube thumbnail URL
function getThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function TutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<string>("All");

  const tutorials: Tutorial[] = [
    {
      title: "MoldPredict – Platform Walkthrough",
      description:
        "A full demo of the MoldPredict platform, covering project setup, predictions, and result interpretation.",
      youtube: "https://youtu.be/0m502UbHSXM",
      product: "MoldPredict",
    },
    {
      title: "Upcoming Product Tutorials",
      description:
        "Tutorials for future Predilytics products will appear here as they launch.",
      product: "Future Products",
      comingSoon: true,
    },
  ];

  const products = ["All", ...Array.from(new Set(tutorials.map(t => t.product)))];

  const filteredTutorials =
    activeProduct === "All"
      ? tutorials
      : tutorials.filter(t => t.product === activeProduct);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Tutorials & Guides
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Learn how to get the most out of Predilytics products through
          step-by-step walkthroughs and product demos.
        </p>
      </section>

      {/* Tabs */}
      <section className="mb-10 flex justify-center space-x-4">
        {products.map(product => (
          <button
            key={product}
            className={`px-4 py-2 rounded-full font-medium ${
              activeProduct === product
                ? "bg-blue-600 text-white"
                : "bg-[rgb(var(--input))] text-gray-700"
            }`}
            onClick={() => setActiveProduct(product)}
          >
            {product}
          </button>
        ))}
      </section>

      {/* Tutorial Cards */}
      <section className="grid gap-8 md:grid-cols-2">
        {filteredTutorials.map((tutorial, index) => {
          const videoId = getYouTubeId(tutorial.youtube);

          return (
            <div
              key={index}
              className="relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm transition hover:shadow-md"
            >
              {/* Product Tag */}
              <div className="absolute top-4 left-4 rounded-full bg-[rgb(var(--input))] px-3 py-1 text-sm font-medium text-gray-700">
                {tutorial.product}
              </div>
              {tutorial.comingSoon && (
                <div className="absolute top-4 right-4 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  Coming Soon
                </div>
              )}

              {/* Thumbnail */}
              <div
                className={`relative cursor-pointer aspect-video overflow-hidden rounded-t-2xl ${
                  tutorial.comingSoon ? "opacity-50" : ""
                }`}
                onClick={() =>
                  !tutorial.comingSoon && videoId && setSelectedVideo(videoId)
                }
              >
                {videoId ? (
                  <Image
                    src={getThumbnail(videoId)}
                    alt={tutorial.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[rgb(var(--input))] text-gray-400">
                    Tutorial coming soon
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold">{tutorial.title}</h2>
                <p className="mt-2 text-gray-600">{tutorial.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl">
            <iframe
              className="h-[60vh] w-full rounded-xl"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="Tutorial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              className="absolute top-2 right-2 rounded-full bg-[rgb(var(--card))] px-3 py-1 text-gray-700 font-semibold"
              onClick={() => setSelectedVideo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

