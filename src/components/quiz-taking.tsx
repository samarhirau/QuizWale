
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckCircle, XCircle, Award } from "lucide-react"
import { toast } from "sonner"
interface Question {
  questionText: string
  options: string[]
  correctAnswer: string
  imageUrl?: string
  explanation?: string
}

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  questions: Question[]
}

interface QuizTakingProps {
  quizId: string
  onComplete: () => void
  setCurrentView: (view: string) => void // Declare setCurrentView here
}

interface SubmissionResult {
  submissionId: string
  score?: number
  percentage?: number
  totalQuestions?: number
  timeSpent?: number
  message?: string
}

interface DetailedResults {
  quiz: Quiz
  submission: {
    score: number
    percentage: number
    totalQuestions: number
    timeSpent: number
    answers: Array<{
      questionIndex: number
      selectedAnswer: string
      isCorrect: boolean
      timeSpent: number
    }>
  }
}

export function QuizTaking({ quizId, onComplete, setCurrentView }: QuizTakingProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<SubmissionResult | null>(null)
  const [detailedResults, setDetailedResults] = useState<DetailedResults | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [questionTimes, setQuestionTimes] = useState<number[]>([])

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (quizStarted && timeLeft === 0) {
      handleAutoSubmit()
    }
  }, [timeLeft, quizStarted])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data.quiz)
        setAnswers(new Array(data.quiz.questions.length).fill(""))
        setQuestionTimes(new Array(data.quiz.questions.length).fill(0))
        setTimeLeft(data.quiz.duration)
      } else {
        toast.error("Failed to load quiz")
        onComplete()
      }
    } catch (error) {
      console.error("Error fetching quiz:", error)
      toast.error("Failed to load quiz facing an error")
      onComplete()
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setQuestionStartTime(Date.now())
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const recordQuestionTime = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const newQuestionTimes = [...questionTimes]
    newQuestionTimes[currentQuestion] = timeSpent
    setQuestionTimes(newQuestionTimes)
  }, [currentQuestion, questionStartTime, questionTimes])

  const handleNextQuestion = () => {
    recordQuestionTime()
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setQuestionStartTime(Date.now())
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    recordQuestionTime()
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const handleAutoSubmit = async () => {
    recordQuestionTime()
    await submitQuiz()
    toast.success("Time's up! Quiz has been automatically submitted.")
  }

  const handleSubmitQuiz = async () => {
    recordQuestionTime()
    await submitQuiz()
  }

  const submitQuiz = async () => {
    setSubmitting(true)
    try {
      const totalTimeSpent = quiz!.duration - timeLeft
      const answersWithTime = answers.map((answer, index) => ({
        selectedAnswer: answer,
        timeSpent: questionTimes[index] || 0,
      }))

      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersWithTime,
          timeSpent: totalTimeSpent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)

        // Fetch detailed results for review
        await fetchDetailedResults(data.submissionId)

        toast.success("Quiz submitted successfully!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to submit quiz")
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast.error("Failed to submit quiz")  
    } finally {
      setSubmitting(false)
    }
  }

  const fetchDetailedResults = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`)
      if (response.ok) {
        const data = await response.json()
        setDetailedResults(data)
      }
    } catch (error) {
      console.error("Error fetching detailed results:", error)
    }
  }

  const calculateResults = () => {
    if (!quiz || !answers) return { score: 0, percentage: 0, totalQuestions: 0 }

    let correctAnswers = 0
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index]?.correctAnswer) {
        correctAnswers++
      }
    })

    const totalQuestions = quiz.questions.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)

    return {
      score: correctAnswers,
      percentage,
      totalQuestions,
      timeSpent: quiz.duration - timeLeft,
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeWarningClass = () => {
    if (timeLeft <= 60) return "text-red-600 animate-pulse"
    if (timeLeft <= 300) return "text-orange-600"
    return "text-foreground"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Quiz Not Found</h3>
          <p className="text-muted-foreground mb-4">The requested quiz could not be loaded.</p>
          <Button onClick={onComplete}>Back to Dashboard</Button>
        </CardContent>
      </Card>
    )
  }

  // Results view
  if (results) {
    const calculatedResults = calculateResults()

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results for "{quiz.title}"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {calculatedResults.score}/{calculatedResults.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{calculatedResults.percentage}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(calculatedResults.timeSpent ?? 0)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="text-center mb-6">
              {calculatedResults.percentage >= 90 && (
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">🏆 Excellent Performance!</Badge>
              )}
              {calculatedResults.percentage >= 70 && calculatedResults.percentage < 90 && (
                <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">👍 Good Job!</Badge>
              )}
              {calculatedResults.percentage >= 50 && calculatedResults.percentage < 70 && (
                <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">📚 Keep Learning!</Badge>
              )}
              {calculatedResults.percentage < 50 && (
                <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">💪 Practice More!</Badge>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={onComplete}>Back to Dashboard</Button>
              <Button variant="outline" onClick={() => setCurrentView("leaderboard")}>
                View Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>Review your answers and see the correct solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    {question.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={question.imageUrl || "/placeholder.svg"}
                          alt="Question illustration"
                          className="max-w-full h-auto max-h-48 rounded-lg"
                        />
                      </div>
                    )}

                    <p className="mb-4 font-medium">{question.questionText}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded border ${
                            option === question.correctAnswer
                              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
                              : option === userAnswer && !isCorrect
                                ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                                : "bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                              {option}
                            </span>
                            <div className="flex gap-2">
                              {option === question.correctAnswer && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  ✓ Correct
                                </Badge>
                              )}
                              {option === userAnswer && !isCorrect && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Your Answer
                                </Badge>
                              )}
                              {!userAnswer && index === quiz.questions.findIndex((q) => q === question) && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                  Not Answered
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Explanation:</p>
                            <p className="text-sm text-blue-700 dark:text-blue-400">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pre-quiz start view
  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">{formatTime(quiz.duration)}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Flag className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold">{quiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• You can navigate between questions using the Previous/Next buttons</li>
                <li>• Your progress is automatically saved</li>
                <li>• The quiz will auto-submit when time runs out</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>
            <Button onClick={startQuiz} className="w-full" size="lg">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Quiz taking view
  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with timer and progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-sm text-muted-foreground">Question</div>
                <div className="font-semibold">
                  {currentQuestion + 1} of {quiz.questions.length}
                </div>
              </div>
              <Progress value={progress} className="w-32" />
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Time Remaining</div>
              <div className={`text-2xl font-mono font-bold ${getTimeWarningClass()}`}>{formatTime(timeLeft)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQ.imageUrl && (
            <div className="text-center">
              <img
                src={currentQ.imageUrl || "/placeholder.svg"}
                alt="Question illustration"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
              />
            </div>
          )}
          <div className="text-lg leading-relaxed">{currentQ.questionText}</div>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left border rounded-lg transition-all hover:shadow-md ${
                  answers[currentQuestion] === option
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center">
                  <span className="font-medium mr-3 text-primary">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {answers.filter((a) => a !== "").length} of {quiz.questions.length} answered
              </span>
            </div>
            <Button onClick={handleNextQuestion} disabled={!answers[currentQuestion] || submitting}>
              {submitting ? (
                "Submitting..."
              ) : currentQuestion === quiz.questions.length - 1 ? (
                <>
                  Submit Quiz
                  <Flag className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
