export default function FontTest() {
  const sampleText =
    "Predilytics helps engineering teams predict mold behavior, reduce costly trial runs, and make confident decisions using data-driven simulations.";

  const fonts = [
    { name: "Inter", className: "font-inter" },
    { name: "Manrope", className: "font-manrope" },
    { name: "Roboto", className: "font-roboto" },
    { name: "Open Sans", className: "font-openSans" },
    { name: "Aptos", className: "font-aptos" },
  ];

  return (
    <main className="max-w-4xl mx-auto p-10 space-y-12">
      {fonts.map((font) => (
        <div key={font.name} className="space-y-2">
          <h2 className={`text-3xl font-bold ${font.className}`}>{font.name}</h2>
          <p className={`text-lg ${font.className}`}>{sampleText}</p>
        </div>
      ))}
    </main>
  );
}
