"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary that catches React hydration errors (commonly caused by
 * browser extensions injecting DOM nodes) and recovers by forcing a
 * client-side re-render.
 */
export class HydrationFix extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Force a clean client-side render
    this.setState({ hasError: true });
    setTimeout(() => this.setState({ hasError: false }), 0);
  }

  render() {
    if (this.state.hasError) {
      // Return null briefly, then re-render children on next tick
      return null;
    }
    return this.props.children;
  }
}
