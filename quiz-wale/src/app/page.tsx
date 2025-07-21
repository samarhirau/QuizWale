"use client"

import { useAuth } from "@/components/auth-provider"
import { AuthForm } from "@/components/auth-form"

import { LandingPage } from "@/components/landing-page"
import { useState } from "react"



export default function Home() {
  const { user, loading, refreshUser } = useAuth()
  
  const [showAuthFormSection, setShowAuthFormSection] = useState(false) // State to control AuthForm visibility
  const [authFormInitialTab, setAuthFormInitialTab] = useState<"login" | "register">("login") // State for initial tab

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="relative">
        <LandingPage
          onShowAuthForm={(tab) => {
            setShowAuthFormSection(true)
            setAuthFormInitialTab(tab)
          }}
        />
        {showAuthFormSection && ( // Conditionally render AuthForm as an overlay
          <div
            id="auth-form-overlay" // Added ID for potential future use
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => {
              // Close overlay if clicking outside the card
              if (e.target === e.currentTarget) {
                setShowAuthFormSection(false)
              }
            }}
          >
            <AuthForm
              initialTab={authFormInitialTab}
              onClose={() => setShowAuthFormSection(false)} // Pass onClose prop
            />
          </div>
        )}
        
      </div>
    )
  }





  return (
    <div className="min-h-screen bg-background">
   
    </div>
  )
}
