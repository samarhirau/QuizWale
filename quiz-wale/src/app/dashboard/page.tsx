
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, BookOpen, Target, Play, TrendingUp, Award } from "lucide-react"
import { Navigation } from "@/components/navigation"
import {QuizTaking} from "@/components/quiz-taking"
import {Leaderboard} from "@/components/leaderboard"
import {AdminDashboard} from "@/components/admin-dashboard"
import {Statistics} from "@/components/statistics"

interface Quiz {
  _id: string
  title: string
  description: string
  category: string
  duration: number
  questions: any[]
  difficulty: string
  tags: string[]
  createdAt: string
}

interface UserStats {
  totalScore: number
  quizzesCompleted: number
  averageScore: number
  rank: number
  recentSubmissions: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, []);




  const fetchDashboardData = async () => {
    try {
      const [quizzesRes, statsRes] = await Promise.all([
        fetch("/api/quizzes"),
        fetch("/api/user/stats"),
      ])

      if (quizzesRes.ok) {
        const quizzesData = await quizzesRes.json()
        setQuizzes(quizzesData.quizzes)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setUserStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId)
    setCurrentView("quiz")
  }

  const handleQuizComplete = () => {
    setCurrentView("dashboard")
    setSelectedQuizId(null)
    fetchDashboardData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }


    if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You must be logged in to view this page.</p>
          <Button className="mt-4" onClick={() => window.location.href = "/"}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }


  return (
    <>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {currentView === "dashboard" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground mt-2">
                Ready to challenge yourself with some quizzes?
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.totalScore || 0}</div>
            <p className="text-xs text-muted-foreground">+{userStats?.recentSubmissions?.length || 0} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.quizzesCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">{quizzes.length - (user?.quizzesCompleted || 0)} remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.averageScore || 0}%</div>
            <p className="text-xs text-muted-foreground">Based on {user?.quizzesCompleted || 0} attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{userStats?.rank || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Global leaderboard</p>
          </CardContent>
        </Card>
      </div>

            {/* Quizzes */}
               <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Available Quizzes</h2>
          <Badge variant="secondary">{quizzes.length} total</Badge>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Quizzes Available</h3>
              <p className="text-muted-foreground">Check back later for new quiz opportunities!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {quiz.questions.length} questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(quiz.duration)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{quiz.category}</Badge>
                      {quiz.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full" onClick={() => onStartQuiz(quiz._id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {userStats?.recentSubmissions && userStats.recentSubmissions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle>Your Latest Attempts</CardTitle>
              <CardDescription>Track your progress and improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.recentSubmissions.slice(0, 5).map((submission, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{submission.quiz?.title || "Quiz"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(submission.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{submission.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(submission.timeSpent / 60)}:
                        {(submission.timeSpent % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
          </div>
        )}

        {currentView === "quiz" && selectedQuizId && (
          <QuizTaking quizId={selectedQuizId} onComplete={handleQuizComplete} />
        )}

        {currentView === "leaderboard" && <Leaderboard />}
        {currentView === "admin" && user?.role === "admin" && <AdminDashboard />}
        {currentView === "statistics" && user?.role === "admin" && <Statistics />}
      </main>
    </>
  )
}
