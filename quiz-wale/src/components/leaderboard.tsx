"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, Clock, Target, Download, Filter } from "lucide-react"
import { toast } from 'sonner'
import { useAuth } from "./auth-provider"

interface LeaderboardEntry {
  userId: string
  name: string
  email: string
  avatar?: string
  bestScore: number
  bestPercentage: number
  totalScore: number
  averageScore: number
  totalQuizzes: number
  bestTime: number
  averageTime: number
  lastSubmission: string
  rank: number
}

interface Quiz {
  _id: string
  title: string
  category: string
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("all-time")
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all-quizzes")

  const { user } = useAuth()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [period, selectedQuiz])

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

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        period,
        limit: "50",
      })

      if (selectedQuiz !== "all-quizzes") {
        params.append("quizId", selectedQuiz)
      }

      const response = await fetch(`/api/leaderboard?${params}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error or no JSON response" }))
        console.error("Error fetching leaderboard API:", response.status, errorData)
        toast(
          <>
            <div className="font-bold text-red-600">Error fetching leaderboard</div>
            <div>{errorData.error || `Server responded with status ${response.status}. Please check backend logs.`}</div>
          </>
        )
        setLeaderboard([]) // Clear previous data if error
        return // Stop execution here
      }
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error("Network or parsing error fetching leaderboard:", error)
      toast(
        <div>
          <div className="font-bold text-red-600">Network Error</div>
          <div>
            Could not connect to the server or parse response. Please check your internet connection and server status.
          </div>
        </div>
      )
      setLeaderboard([]) // Clear previous data if error
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Rank", "Name", "Best Score", "Best Percentage", "Total Quizzes", "Average Score", "Best Time"]
    const csvContent = [
      headers.join(","),
      ...leaderboard.map((entry) =>
        [
          entry.rank,
          entry.name,
          entry.bestScore,
          entry.bestPercentage,
          entry.totalQuizzes,
          entry.averageScore,
          formatTime(entry.bestTime),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leaderboard-${period}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-bold">{rank}</span>
          </div>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
    if (rank <= 10) return "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
    return "bg-muted"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other quiz masters</p>
        </div>
       { user?.role == 'admin' && (  
       <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        )}

      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Quizzes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-quizzes">All Quizzes</SelectItem>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchLeaderboard}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            {period === "weekly" ? "Weekly" : period === "monthly" ? "Monthly" : "All-Time"} Champions
            {selectedQuiz !== "all-quizzes" && (
              <Badge variant="secondary" className="ml-2">
                {quizzes.find((q) => q._id === selectedQuiz)?.title}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Top performers {period === "all-time" ? "of all time" : `from the past ${period.replace("-", " ")}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-muted-foreground">Be the first to complete a quiz and claim the top spot!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center">{getRankIcon(entry.rank)}</div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">{entry.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{entry.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.totalQuizzes} quiz{entry.totalQuizzes !== 1 ? "es" : ""} completed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center text-green-600">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="text-xl font-bold">{entry.bestScore}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Best Score</p>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{entry.bestPercentage}%</div>
                      <p className="text-xs text-muted-foreground">Best %</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center text-purple-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-lg font-semibold">{formatTime(entry.bestTime)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Best Time</p>
                    </div>

                    <Badge className={getRankBadgeColor(entry.rank)}>#{entry.rank}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Levels</CardTitle>
          <CardDescription>Unlock badges as you improve your quiz performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 border rounded-lg">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Quiz Master</h4>
              <p className="text-sm text-muted-foreground mb-3">Score 90%+ on 5 quizzes</p>
              <Badge className="bg-yellow-100 text-yellow-800">Legendary</Badge>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <Medal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Speed Demon</h4>
              <p className="text-sm text-muted-foreground mb-3">Complete quiz in under 10 minutes</p>
              <Badge className="bg-blue-100 text-blue-800">Epic</Badge>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Consistent Performer</h4>
              <p className="text-sm text-muted-foreground mb-3">Complete 10 quizzes</p>
              <Badge className="bg-green-100 text-green-800">Rare</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
