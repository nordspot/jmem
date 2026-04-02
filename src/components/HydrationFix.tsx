"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: boolean;
  retries: number;
}

/**
 * Error boundary that catches hydration errors (React #310) caused by
 * browser extensions modifying the DOM, and recovers with a clean render.
 * Limited to 3 retries to prevent infinite loops.
 */
export class HydrationFix extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: false, retries: 0 };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { error: true };
  }

  componentDidCatch() {
    if (this.state.retries < 3) {
      // Brief delay then retry render
      setTimeout(() => {
        this.setState((s) => ({ error: false, retries: s.retries + 1 }));
      }, 100);
    }
  }

  render() {
    if (this.state.error && this.state.retries >= 3) {
      // After 3 retries, render without the interactive shell
      return this.props.fallback || (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Ein Browser-Plugin verhindert das Laden der Seite.</p>
          <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>
            Bitte versuche es im Inkognito-Modus oder deaktiviere Browser-Erweiterungen.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              background: "#1F8BC7",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Seite neu laden
          </button>
        </div>
      );
    }

    if (this.state.error) {
      return null; // Brief null during retry
    }

    return this.props.children;
  }
}
