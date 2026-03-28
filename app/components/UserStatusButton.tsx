"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function UserStatusButton() {
  const { isLoaded, user } = useUser();

  const label =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Account";

  return (
    <>
      <SignedIn>
        <div
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--foreground))] shadow-sm transition hover:bg-[rgb(var(--input))]"
          aria-label="Signed in user"
          title="Signed in"
        >
          <UserButton
            appearance={{
              elements: {
                userButtonTrigger:
                  "h-8 w-8 shrink-0 rounded-full border border-[rgb(var(--border))] bg-white shadow-sm hover:shadow transition",
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
          <span className="pr-1 text-sm text-[rgb(var(--foreground))] whitespace-nowrap">
            {isLoaded ? label : "Loading..."}
          </span>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))]"
            aria-label="Signed out"
            title="Signed out"
          >
            Log in
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
