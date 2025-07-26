

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trophy,
  Clock,
  BookOpen,
  Target,
  Play,
  TrendingUp,
  Award,
  Search,
  Filter,
  Star,
  Users,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { QuizTaking } from "@/components/quiz-taking"
import { Leaderboard } from "@/components/leaderboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Statistics } from "@/components/statistics"

interface Quiz {
  _id: string
  title: string
  description: string
  category: string
  duration: number
  questions: any[]
  difficulty: string
  tags: string[]
  rating: number
  createdAt: string
  createdBy?: {
    name: string
  }
}

interface UserStats {
  totalScore: number
  quizzesCompleted: number
  averageScore: number
  rank: number
  recentSubmissions: any[]
}

// interface DashboardProps {
//   onStartQuiz: (id: string, viewType?: "quiz" | "submission-details") => void
// }

export default function DashboardPage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    filterQuizzes()
  }, [quizzes, searchQuery, selectedCategory, selectedDifficulty])

  const fetchDashboardData = async () => {
    try {
      const [quizzesRes, statsRes] = await Promise.all([fetch("/api/quizzes"), fetch("/api/user/stats")])

      if (quizzesRes.ok) {
        const quizzesData = await quizzesRes.json()
        setQuizzes(quizzesData.quizzes)

        // Extract unique categories
        const uniqueCategories = [...new Set(quizzesData.quizzes.map((quiz: Quiz) => quiz.category))] as string[]
        setCategories(uniqueCategories)
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

  const filterQuizzes = () => {
    let filtered = quizzes

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((quiz) => quiz.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((quiz) => quiz.difficulty === selectedDifficulty)
    }

    setFilteredQuizzes(filtered)
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

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
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
          <Button className="mt-4" onClick={() => (window.location.href = "/")}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ">
        {currentView === "dashboard" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome back, {user?.name}! 👋</h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-8">
                    Ready to challenge yourself with some amazing quizzes?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100"
                     
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Continue Learning
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                      onClick={() => setCurrentView("leaderboard")}
                    >
                      <Trophy className="h-5 w-5 mr-2" />
                      View Leaderboard
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <div className="container mx-auto px-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  mb-12 mt-2">
                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user?.totalScore || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{userStats?.recentSubmissions?.length || 0} this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user?.quizzesCompleted || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {quizzes.length - (user?.quizzesCompleted || 0)} remaining
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats?.averageScore || 0}%</div>
                    <p className="text-xs text-muted-foreground">Based on {user?.quizzesCompleted || 0} attempts</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">#{userStats?.rank || "N/A"}</div>
                    <p className="text-xs text-muted-foreground">Global leaderboard</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter Section */}
              <Card className="mb-8 bg-white dark:bg-gray-800 shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Find Your Perfect Quiz
                      </CardTitle>
                      <CardDescription>
                        Search through {quizzes.length} available quizzes and filter by your preferences
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {filteredQuizzes.length} results
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search quizzes by title, category, or tags..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all") && (
                        <Button variant="outline" onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quizzes Grid */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">Available Quizzes</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                    </span>
                  </div>
                </div>

                {filteredQuizzes.length === 0 ? (
                  <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all"
                          ? "No quizzes match your filters"
                          : "No Quizzes Available"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all"
                          ? "Try adjusting your search criteria or filters"
                          : "Check back later for new quiz opportunities!"}
                      </p>
                      {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all") && (
                        <Button onClick={clearFilters}>Clear Filters</Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                      <Card
                        key={quiz._id}
                        className="bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 border-0 group"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                              {quiz.difficulty.toUpperCase()}
                            </Badge>
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm ml-1">
                                {(quiz.rating <= 0) ? "No ratings yet" : quiz.rating.toFixed(1)}
      
                              </span>
                            </div>
                          </div>
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {quiz.title}
                          </CardTitle>
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

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                            
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {quiz.category}
                              </Badge>
                              {quiz.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Button
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                              onClick={() => handleStartQuiz(quiz._id)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Quiz
                              <ChevronRight className="h-4 w-4 ml-2" />
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
                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription>Track your progress and improvement over time</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userStats.recentSubmissions.slice(0, 5).map((submission, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <Award className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{submission.quiz?.title || "Quiz"}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(submission.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-lg">{submission.percentage}%</div>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
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
              )}
            </div>
          </div>
        )}

        {currentView === "quiz" && selectedQuizId && (
          <div className="container mx-auto px-4 py-8">
            <QuizTaking quizId={selectedQuizId} onComplete={handleQuizComplete} />
          </div>
        )}

        {currentView === "leaderboard" && (
          <div className="container mx-auto px-4 py-8">
            <Leaderboard />
          </div>
        )}

        {currentView === "admin" && user?.role === "admin" && (
          <div className="container mx-auto px-4 py-8">
            <AdminDashboard />
          </div>
        )}

        {currentView === "statistics" && user?.role === "admin" && (
          <div className="container mx-auto px-4 py-8">
            <Statistics />
          </div>
        )}
      </main>
    </>
  )
}
