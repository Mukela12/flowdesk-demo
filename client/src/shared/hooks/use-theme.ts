import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState<string>("light")
  const [resolvedTheme, setResolvedTheme] = useState<string>("light")

  useEffect(() => {
    // Check data-theme attribute on closest parent or document
    const dataTheme = document.documentElement.getAttribute("data-theme")
    if (dataTheme) {
      // Dark themes in our system
      const darkThemes = ["obsidian", "aether", "command"]
      const resolved = darkThemes.includes(dataTheme) ? "dark" : "light"
      setThemeState(dataTheme)
      setResolvedTheme(resolved)
      return
    }

    // Fallback to prefers-color-scheme
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    setResolvedTheme(mq.matches ? "dark" : "light")
    setThemeState(mq.matches ? "dark" : "light")

    const listener = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light")
      setThemeState(e.matches ? "dark" : "light")
    }
    mq.addEventListener("change", listener)
    return () => mq.removeEventListener("change", listener)
  }, [])

  const setTheme = (t: string) => {
    setThemeState(t)
    setResolvedTheme(t)
  }

  return { theme, resolvedTheme, setTheme }
}
