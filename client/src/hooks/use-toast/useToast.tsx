"use client";

import { useReducer } from "react";
import type { ReactNode } from "react";
import { reducer, setDispatchRef } from "./toastReducer";
import { ToastContext } from "./context";

import type { State } from "./toastTypes";

const initialState: State = { toasts: [] };

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  setDispatchRef(dispatch);

  return (
    <ToastContext.Provider value={{ state, dispatch }}>
      {children}
    </ToastContext.Provider>
  );
}