"use client";

import * as React from "react";

interface HeroLogoState {
  heroLogoVisible: boolean;
  setHeroLogoVisible: (visible: boolean) => void;
}

// Defaults to true so a fresh homepage load always starts with the logo in the
// hero (not the header) before the Hero component's own observer confirms it.
const HeroLogoContext = React.createContext<HeroLogoState>({
  heroLogoVisible: true,
  setHeroLogoVisible: () => {},
});

export function HeroLogoProvider({ children }: { children: React.ReactNode }) {
  const [heroLogoVisible, setHeroLogoVisible] = React.useState(true);

  const value = React.useMemo(() => ({ heroLogoVisible, setHeroLogoVisible }), [heroLogoVisible]);

  return <HeroLogoContext.Provider value={value}>{children}</HeroLogoContext.Provider>;
}

export function useHeroLogo() {
  return React.useContext(HeroLogoContext);
}
