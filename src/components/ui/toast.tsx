"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  durationMs?: number;
}

export function Toast({
  message,
  type = "info",
  onClose,
  durationMs = 3000,
}: ToastProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  // Define colors based on type and theme
  const baseClasses =
    "fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg max-w-sm w-full z-50 flex items-center space-x-3 transition-opacity";

  const typeColors = {
    success: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-800 text-green-100",
    },
    error: {
      light: "bg-red-100 text-red-800",
      dark: "bg-red-800 text-red-100",
    },
    info: {
      light: "bg-blue-100 text-blue-800",
      dark: "bg-blue-800 text-blue-100",
    },
  };

  const colors =
    theme === "dark" || theme === "dark-mode"
      ? typeColors[type].dark
      : typeColors[type].light;

  return (
    <div className={`${baseClasses} ${colors}`} role="alert" aria-live="assertive">
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        aria-label="Close"
        className="text-current font-bold focus:outline-none"
      >
        ×
      </button>
    </div>
  );
}
