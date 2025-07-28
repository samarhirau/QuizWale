"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, BookOpen, TrendingUp, Clock, Target, Award, Download, RefreshCw } from "lucide-react"

interface QuestionStat {
  questionIndex: number
  questionText: string
  correctAnswer: string
  totalAnswers: number
  correctAnswers: number
  correctPercentage: number
  optionCounts: {
    option: string
    count: number
    percentage: number
  }[]
  averageTimeSpent: number
}

interface QuizStats {
  quiz: {
    id: string
    title: string
    totalQuestions: number
  }
  overview: {
    totalParticipants: number
    averageScore: number
    averagePercentage: number
    averageTimeSpent: number
    highestScore: number
    lowestScore: number
  }
  questionStats: QuestionStat[]
  recentSubmissions: any[]
}

interface OverallStats {
  overview: {
    totalUsers: number
    totalQuizzes: number
    totalSubmissions: number
    averageQuizzesPerUser: number
  }
  topQuizzes: any[]
  recentSubmissions: any[]
}

export function Statistics() {
  const [selectedQuiz, setSelectedQuiz] = useState<string>("overview")
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null)
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    fetchStatistics()
  }, [selectedQuiz])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes")
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data.quizzes)
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    }
  }

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const url = selectedQuiz === "overview" ? "/api/statistics" : `/api/statistics?quizId=${selectedQuiz}`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()

        if (selectedQuiz === "overview") {
          setOverallStats(data)
          setQuizStats(null)
        } else {
          setQuizStats(data)
          setOverallStats(null)
        }
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const exportQuizStats = () => {
    if (!quizStats) return

    const headers = ["Question", "Correct Answer", "Total Responses", "Correct Responses", "Correct %", "Average Time"]

    const csvContent = [
      headers.join(","),
      ...quizStats.questionStats.map((stat) =>
        [
          `"${stat.questionText.replace(/"/g, '""')}"`,
          `"${stat.correctAnswer}"`,
          stat.totalAnswers,
          stat.correctAnswers,
          stat.correctPercentage,
          Math.round(stat.averageTimeSpent),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quiz-statistics-${quizStats.quiz.title.replace(/[^a-zA-Z0-9]/g, "-")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Statistics & Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into quiz performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchStatistics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {quizStats && (
            <Button onClick={exportQuizStats}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Quiz Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">View Statistics For:</span>
            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Platform Overview</SelectItem>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : selectedQuiz === "overview" && overallStats ? (
        // Overall Platform Statistics
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.overview.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.overview.totalQuizzes}</div>
                <p className="text-xs text-muted-foreground">Available quizzes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.overview.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">Quiz attempts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Quizzes/User</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.overview.averageQuizzesPerUser}</div>
                <p className="text-xs text-muted-foreground">Engagement rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Quizzes</CardTitle>
              <CardDescription>Quizzes with the highest participation rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overallStats.topQuizzes.map((quiz, index) => (
                  <div key={quiz._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{quiz.totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">Submissions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{quiz.averageScore}</div>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{quiz.averagePercentage}%</div>
                        <p className="text-xs text-muted-foreground">Avg %</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest quiz attempts across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overallStats.recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{submission.user?.name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{submission.quiz?.title || "Quiz"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{submission.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(submission.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : quizStats ? (
        // Individual Quiz Statistics
        <div className="space-y-6">
          {/* Quiz Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{quizStats.quiz.title}</CardTitle>
              <CardDescription>Detailed performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{quizStats.overview.totalParticipants}</div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{quizStats.overview.averageScore.toFixed(1)}</div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {quizStats.overview.averagePercentage.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg %</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatTime(Math.round(quizStats.overview.averageTimeSpent))}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{quizStats.overview.highestScore}</div>
                  <p className="text-sm text-muted-foreground">Highest</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{quizStats.overview.lowestScore}</div>
                  <p className="text-sm text-muted-foreground">Lowest</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Analysis</CardTitle>
              <CardDescription>Detailed breakdown of each question's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quizStats.questionStats.map((stat, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Question {stat.questionIndex + 1}</h3>
                        <p className="text-muted-foreground mb-3">{stat.questionText}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">Correct: {stat.correctAnswer}</Badge>
                          <Badge
                            className={
                              stat.correctPercentage >= 80
                                ? "bg-green-100 text-green-800"
                                : stat.correctPercentage >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {stat.correctPercentage}% correct
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {stat.correctAnswers}/{stat.totalAnswers}
                        </div>
                        <p className="text-sm text-muted-foreground">Correct responses</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-sm text-muted-foreground">{stat.correctPercentage}%</span>
                      </div>
                      <Progress value={stat.correctPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stat.optionCounts.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center justify-between p-3 border rounded">
                          <span
                            className={`font-medium ${option.option === stat.correctAnswer ? "text-green-600" : ""}`}
                          >
                            {option.option}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {option.count} ({option.percentage}%)
                            </span>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${option.option === stat.correctAnswer ? "bg-green-500" : "bg-blue-500"}`}
                                style={{ width: `${option.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Average time spent: {Math.round(stat.averageTimeSpent)} seconds
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions for this Quiz */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest attempts for this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizStats.recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{submission.user?.name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(submission.completedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {submission.score}/{quizStats.quiz.totalQuestions}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {submission.percentage}% • {formatTime(submission.timeSpent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Data Available</h3>
            <p className="text-muted-foreground">No statistics available for the selected quiz yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
