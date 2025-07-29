import { Moon, Sun } from "lucide-react"
import { Button } from "@components/ui/button"
import { useTheme } from "@components/ui/theme-provider-utils"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={toggleTheme}>
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}