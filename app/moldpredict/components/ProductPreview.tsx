// components/ProductPreview.tsx
"use client";

import Panel from "./Panel";

export default function ProductPreview() {
  return (
    <Panel
      title="See MoldPredict in Action"
      description="Real-time predictive analytics for your molding operations. Visualize performance, identify defects, and optimize processes instantly."
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full rounded-xl border border-neutral-200 dark:border-gray-700 shadow-lg"
      >
        <source src="/videos/product-preview.mp4" type="video/mp4" />
      </video>
    </Panel>
  );
}