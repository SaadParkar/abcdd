import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

if (typeof window !== "undefined") {
  // Guard against browser extensions or sandbox environments where window.fetch has only a getter
  try {
    const proto = Object.getPrototypeOf(window);
    const desc =
      Object.getOwnPropertyDescriptor(window, "fetch") ||
      (proto ? Object.getOwnPropertyDescriptor(proto, "fetch") : undefined);
    if (desc && !desc.writable && !desc.set) {
      let currentFetch = window.fetch ? window.fetch.bind(window) : undefined;
      Object.defineProperty(window, "fetch", {
        get() {
          return currentFetch;
        },
        set(fn) {
          currentFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignore if window properties cannot be redefined
  }

  window.addEventListener("error", (event) => {
    if (
      typeof event.message === "string" &&
      (event.message.includes("Cannot set property fetch") ||
        event.message.includes("which has only a getter"))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const fetchGetterGuardScript = `
(function() {
  try {
    var win = window;
    var target = win;
    var desc = Object.getOwnPropertyDescriptor(win, 'fetch');
    var proto = Object.getPrototypeOf(win);
    while (!desc && proto) {
      desc = Object.getOwnPropertyDescriptor(proto, 'fetch');
      if (desc) { target = proto; break; }
      proto = Object.getPrototypeOf(proto);
    }
    if (desc && (!desc.set || !desc.writable)) {
      var currentFetch = win.fetch ? win.fetch.bind(win) : undefined;
      try {
        Object.defineProperty(win, 'fetch', {
          get: function() { return currentFetch; },
          set: function(fn) { currentFetch = fn; },
          configurable: true,
          enumerable: true
        });
      } catch(e) {
        try {
          if (typeof Window !== 'undefined' && Window.prototype) {
            Object.defineProperty(Window.prototype, 'fetch', {
              get: function() { return currentFetch; },
              set: function(fn) { currentFetch = fn; },
              configurable: true,
              enumerable: true
            });
          }
        } catch(e2) {}
      }
    }
  } catch(e) {}

  var prevOnError = window.onerror;
  window.onerror = function(msg, url, line, col, err) {
    if (typeof msg === 'string' && msg.indexOf('fetch') !== -1 && msg.indexOf('getter') !== -1) {
      return true;
    }
    if (prevOnError) return prevOnError.apply(this, arguments);
  };

  window.addEventListener('error', function(event) {
    if (event && event.message && event.message.indexOf('fetch') !== -1 && event.message.indexOf('getter') !== -1) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Caesar Cipher Wheel" },
      { name: "description", content: "An interactive Roman history exhibit." },
      { name: "author", content: "The Caesar Cipher Wheel" },
      { property: "og:title", content: "The Caesar Cipher Wheel" },
      { property: "og:description", content: "An interactive Roman history exhibit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        children: fetchGetterGuardScript,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
