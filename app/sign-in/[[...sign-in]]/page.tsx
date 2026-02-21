import { SignIn } from "@clerk/nextjs";
import ClerkLightLayout from "@/app/components/ClerkLightLayout";

type SearchParams = Record<string, string | string[] | undefined>;

function pickFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isRouteLightFlow(params: SearchParams) {
  const raw = pickFirst(params.redirect_url) ?? pickFirst(params.redirectUrl) ?? "";
  if (!raw) return false;

  const decoded = decodeURIComponent(raw);
  if (decoded.startsWith("/billing") || decoded.startsWith("/enterprise")) {
    return true;
  }

  try {
    const parsed = new URL(decoded);
    return (
      parsed.pathname.startsWith("/billing") ||
      parsed.pathname.startsWith("/enterprise")
    );
  } catch {
    return false;
  }
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const forceLight = isRouteLightFlow(resolvedSearchParams);
  const redirectTarget =
    pickFirst(resolvedSearchParams.redirect_url) ??
    pickFirst(resolvedSearchParams.redirectUrl);
  const signUpUrl = redirectTarget
    ? `/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`
    : "/sign-up";
  const lightAppearance = {
    variables: {
      colorBackground: "#ffffff",
      colorText: "#111827",
      colorInputBackground: "#ffffff",
      colorInputText: "#111827",
    },
    elements: {
      card: "bg-white",
      headerTitle: "text-gray-900",
      headerSubtitle: "text-gray-600",
      formFieldLabel: "text-gray-700",
      formFieldInput: "text-gray-900",
      footerActionText: "text-gray-600",
      footerActionLink: "text-blue-600",
      socialButtonsBlockButtonText: "text-gray-700",
    },
  };

  const content = (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl={signUpUrl}
        appearance={forceLight ? lightAppearance : undefined}
      />
    </div>
  );

  if (forceLight) {
    return <ClerkLightLayout>{content}</ClerkLightLayout>;
  }

  return (
    content
  );
}
