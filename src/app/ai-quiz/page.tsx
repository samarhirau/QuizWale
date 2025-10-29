"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Clock, ChevronRight, ChevronLeft, Flag, Award, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

export default function AIQuizPage() {
  const [topic, setTopic] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json()

      if (!data.quiz || !Array.isArray(data.quiz)) {
        throw new Error("Invalid quiz format received")
      }

      setQuestions(data.quiz)
      setAnswers(new Array(data.quiz.length).fill(""))
      setQuizStarted(true)
      toast.success("Quiz generated successfully!")

      const interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1)
      }, 1000)
      setTimer(interval)
    } catch (err) {
      toast.error("Failed to generate quiz")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1)
  }

  const handleSubmit = () => {
    if (timer) clearInterval(timer)

    let correctCount = 0
    const reviewed = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer
      if (isCorrect) correctCount++
      return {
        questionText: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: answers[i],
        isCorrect,
      }
    })

    setResults({
      submission: {
        score: correctCount,
        totalQuestions: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
        timeSpent,
      },
      quiz: { questions: reviewed },
    })
  }

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60)
    const s = sec % 60
    return `${min}:${s.toString().padStart(2, "0")}`
  }

  // 🔹 Results View Integration
  if (results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results for “{topic}”</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                {results.submission ? (
                  <div className="text-3xl font-bold text-green-600">
                    {results.submission.score}/{results.submission.totalQuestions}
                  </div>
                ) : (
                  <div className="text-red-500 text-sm">No score data found</div>
                )}
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{results.submission.percentage}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(results.submission.timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.location.reload()}>Try Another Quiz</Button>
              <Button variant="outline" onClick={() => (window.location.href = "/leaderboard")}>
                View Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>Review your answers and see the correct solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.quiz.questions.map((question: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    {question.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>

                  <p className="mb-4">{question.questionText}</p>

                  <div className="space-y-2">
                    {question.options.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded border ${
                          option === question.correctAnswer
                            ? "bg-green-50 border-green-200 text-green-800"
                            : option === question.userAnswer && !question.isCorrect
                              ? "bg-red-50 border-red-200 text-red-800"
                              : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {option === question.correctAnswer && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Correct
                            </Badge>
                          )}
                          {option === question.userAnswer && !question.isCorrect && (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Your Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
        <Card>
  <CardHeader>
    <CardTitle>Question Review</CardTitle>
    <CardDescription>
      Review your answers and see the correct solutions
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {results?.quiz?.questions && results.quiz.questions.length > 0 ? (
        results.quiz.questions.map((question: any, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Question {index + 1}</h3>
              {question.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>

            <p className="mb-4 font-medium">{question.questionText}</p>

            <div className="space-y-2">
              {question.options.map((option: string, optIndex: number) => (
                <div
                  key={optIndex}
                  className={`p-3 rounded border transition-all ${
                    option === question.correctAnswer
                      ? "bg-green-50 border-green-200 text-green-800"
                      : option === question.userAnswer && !question.isCorrect
                      ? "bg-red-50 border-red-200 text-red-800"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {option === question.correctAnswer && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Correct
                      </Badge>
                    )}
                    {option === question.userAnswer && !question.isCorrect && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Your Answer
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 🧠 Explanation Section */}
            {question.explanation && (
              <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800">
                <p className="font-medium">Explanation:</p>
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No questions available.</p>
      )}
    </div>
  </CardContent>
</Card>

      </div>
    )
  }

  // 🔹 Input View
  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">AI Quiz Generator</CardTitle>
          <CardDescription>Enter a topic to generate an AI-powered quiz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Artificial Intelligence"
          />
          <Button onClick={generateQuiz} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Quiz"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 🔹 Quiz View
  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-10">
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Question</div>
            <div className="font-semibold">{currentQuestion + 1} / {questions.length}</div>
          </div>
          <Progress value={progress} className="w-32" />
          <div className="text-lg font-mono font-bold text-red-600">
            <Clock className="inline-block mr-2 h-5 w-5" />
            {formatTime(timeSpent)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(opt)}
              className={`w-full text-left p-4 border rounded-lg transition-all ${
                answers[currentQuestion] === opt
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <span className="font-medium mr-2 text-blue-600">{String.fromCharCode(65 + index)}.</span>
              {opt}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {answers.filter((a) => a).length} / {questions.length} answered
          </span>
          <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
            {currentQuestion === questions.length - 1 ? (
              <>
                Submit Quiz <Flag className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
