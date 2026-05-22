import { createContext, useContext, useLayoutEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  // useLayoutEffect = DOM paint se PEHLE class lagao → zero flicker/lag
  useLayoutEffect(() => {
    if (isDark) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}