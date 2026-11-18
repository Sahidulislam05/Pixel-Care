"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { publicEnv } from "@/config/env";
import { getErrorMessage } from "@/lib/api-client";
import { useGoogleLogin } from "../hooks";

// Minimal typing for Google Identity Services (https://accounts.google.com/gsi/client).
type GsiButtonOptions = {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large";
  text: "continue_with" | "signup_with";
  shape: "rectangular";
  logo_alignment: "center";
  width: number;
};
type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        ux_mode: "popup";
        use_fedcm_for_button?: boolean;
      }) => void;
      renderButton: (element: HTMLElement, options: GsiButtonOptions) => void;
    };
  };
};
declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GSI_SRC = "https://accounts.google.com/gsi/client";
let gsiPromise: Promise<GoogleIdentity> | null = null;

/** Loads the Google script once per page, shared by every button. */
function loadGsi(): Promise<GoogleIdentity> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  gsiPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () =>
      window.google
        ? resolve(window.google)
        : reject(new Error("Google sign-in unavailable"));
    script.onerror = () => {
      gsiPromise = null;
      reject(new Error("Couldn't load Google sign-in. Check your connection."));
    };
    document.head.appendChild(script);
  });
  return gsiPromise;
}

type GoogleSignInButtonProps = {
  redirectTo?: string | null;
  mode?: "signin" | "signup";
};

/** Patient-only Google sign-in (spec 3.3). Hidden when no client ID is configured. */
export function GoogleSignInButton({
  redirectTo,
  mode = "signin",
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const login = useGoogleLogin(redirectTo);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep the latest mutate in a ref so the Google callback never goes stale.
  const mutateRef = useRef(login.mutate);
  mutateRef.current = login.mutate;

  useEffect(() => {
    const container = containerRef.current;
    if (!publicEnv.googleClientId || !container) return;
    let isCancelled = false;

    loadGsi()
      .then((google) => {
        if (isCancelled) return;
        google.accounts.id.initialize({
          client_id: publicEnv.googleClientId,
          ux_mode: "popup",
          use_fedcm_for_button: true,
          callback: ({ credential }) => {
            if (credential) mutateRef.current(credential);
          },
        });
        container.replaceChildren();
        google.accounts.id.renderButton(container, {
          theme: resolvedTheme === "dark" ? "filled_black" : "outline",
          size: "large",
          text: mode === "signup" ? "signup_with" : "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: Math.min(Math.max(container.offsetWidth, 200), 400),
        });
      })
      .catch((error: Error) => !isCancelled && setLoadError(error.message));

    return () => {
      isCancelled = true;
    };
  }, [resolvedTheme, mode]);

  if (!publicEnv.googleClientId) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or{" "}
        <span className="h-px flex-1 bg-border" />
      </div>
      <div
        ref={containerRef}
        aria-busy={login.isPending}
        className="flex min-h-11 w-full justify-center [color-scheme:normal]"
      />
      {login.isPending && (
        <p className="text-center text-sm text-muted-foreground">
          Signing you in with Google…
        </p>
      )}
      {(login.isError || loadError) && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {loadError ?? getErrorMessage(login.error)}
        </p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Google sign-in is for patients. Doctors and admins use email.
      </p>
    </div>
  );
}
