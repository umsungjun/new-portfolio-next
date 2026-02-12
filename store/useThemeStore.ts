/* 멀티 테마 상태 관리 (URL ?theme= 파라미터로 영속, localStorage 미사용) */
/* Light/Dark: 전체 CSS 변수 독립 정의, Ocean/Rose/Forest: Light 기반 포인트 컬러 오버라이드 */
import { create } from "zustand";

export const THEME_LIGHT = "light" as const;
export const THEME_DARK = "dark" as const;
export const THEME_OCEAN = "ocean" as const;
export const THEME_ROSE = "rose" as const;
export const THEME_FOREST = "forest" as const;

export type ThemeName =
  | typeof THEME_LIGHT
  | typeof THEME_DARK
  | typeof THEME_OCEAN
  | typeof THEME_ROSE
  | typeof THEME_FOREST;

export const THEMES: ThemeName[] = [
  THEME_LIGHT,
  THEME_DARK,
  THEME_OCEAN,
  THEME_ROSE,
  THEME_FOREST,
];

export const THEME_SWATCHES: Record<ThemeName, string> = {
  light: "#f8fafc",
  dark: "#334155",
  ocean: "#0369a1",
  rose: "#be123c",
  forest: "#166534",
};

interface UseThemeStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<UseThemeStore>()((set) => ({
  theme: THEME_LIGHT,
  setTheme: (theme) => set({ theme }),
}));
