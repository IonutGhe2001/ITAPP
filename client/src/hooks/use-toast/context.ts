import { createContext } from "react"
import type { Action, State } from "./toastTypes"

export const ToastContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

export function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substr(2, 9)
}