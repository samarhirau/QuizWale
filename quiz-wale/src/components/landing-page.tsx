"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, BarChart3, Trophy, Users, Zap, ShieldCheck } from "lucide-react"
import Link from "next/link"

interface LandingPageProps {
  onShowAuthForm: (tab: "login" | "register") => void // New prop to trigger AuthForm visibility and set tab
}

export function LandingPage({ onShowAuthForm }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
       
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Challenge Your Knowledge with QuizWale
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
              Dive into a world of engaging quizzes, track your progress, and compete with others on the leaderboard.
              Your ultimate quiz experience starts here.
            </p>
            <div className="space-x-4">
              <Button
                size="lg"
                className="px-8 py-3 text-lg"
                onClick={() => {
                  onShowAuthForm("register") // Show AuthForm and set to register tab
                  document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }) // Scroll to it
                }}
              >
                Get Started
              </Button>
              <Link href="#features-section">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose QuizWale?</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We offer a comprehensive platform designed to make learning fun and competitive.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardHeader className="flex flex-col  items-center">
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl ">Diverse Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore a wide range of categories and difficulties to test your knowledge.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100">
             <CardHeader className="flex flex-col  items-center">
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your performance with in-depth statistics and identify areas for improvement.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                 <CardHeader className="flex flex-col  items-center">
                <Trophy className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Global Leaderboards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Compete with friends and users worldwide to climb the ranks and earn recognition.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader className="flex flex-col  items-center">
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">User Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Personalize your profile, view your quiz history, and manage your achievements.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                 <CardHeader className="flex flex-col  items-center">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Fast & Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Enjoy a seamless experience on any device, from desktop to mobile.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                 <CardHeader className="flex flex-col  items-center">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data and privacy are protected with robust security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="auth-section"
        className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Quizzing?</h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
              Join QuizWale today and embark on your journey to become a true quiz master!
            </p>
            <Button
              size="lg"
              className="px-8 py-3 text-lg"
              onClick={() => {
                onShowAuthForm("register") // Show AuthForm and set to register tab
                document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }) // Scroll to it
              }}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-950">
        <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} QuizWale. All rights reserved.</p>
        <p className="text-xs text-gray-400 ml-auto">Created by <span className="underline text-gray-600">SAMAR HIRAU</span></p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400" href="/privacy">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400" href="/terms">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  )
}
