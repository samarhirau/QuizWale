"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Save, X, BookOpen, Users, BarChart3, Clock, Target } from "lucide-react"

interface Question {
  questionText: string
  options: string[]
  correctAnswer: string
  imageUrl?: string
  explanation?: string
}

interface Quiz {
  _id?: string
  title: string
  description: string
  category: string
  duration: number
  questions: Question[]
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  isActive: boolean
  maxAttempts: number
}

export function AdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [newQuiz, setNewQuiz] = useState<Quiz>({
    title: "",
    description: "",
    category: "",
    duration: 1800, // 30 minutes in seconds
    questions: [],
    difficulty: "medium",
    tags: [],
    isActive: true,
    maxAttempts: 1,
  })

  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    imageUrl: "",
    explanation: "",
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes", {
        headers: {}, // Browser will automatically send HTTP-only cookie
      })
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data.quizzes)
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuiz = async () => {
    if (!newQuiz.title || !newQuiz.description || newQuiz.questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one question",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Browser will automatically send HTTP-only cookie
        body: JSON.stringify(newQuiz),
      })

      if (response.ok) {
        const data = await response.json()
        setQuizzes([data.quiz, ...quizzes])
        setNewQuiz({
          title: "",
          description: "",
          category: "",
          duration: 1800,
          questions: [],
          difficulty: "medium",
          tags: [],
          isActive: true,
          maxAttempts: 1,
        })
        setShowCreateForm(false)
        toast({
          title: "Success",
          description: "Quiz created successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create quiz",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive",
      })
    }
  }

  const handleUpdateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // Browser will automatically send HTTP-only cookie
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setQuizzes(quizzes.map((q) => (q._id === quizId ? data.quiz : q)))
        setEditingQuiz(null)
        toast({
          title: "Success",
          description: "Quiz updated successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update quiz",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast({
        title: "Error",
        description: "Failed to update quiz",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {}, // Browser will automatically send HTTP-only cookie
      })

      if (response.ok) {
        setQuizzes(quizzes.filter((q) => q._id !== quizId))
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete quiz",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      })
    }
  }

  const addQuestionToQuiz = () => {
    if (!newQuestion.questionText || newQuestion.options.some((opt) => !opt) || !newQuestion.correctAnswer) {
      toast({
        title: "Validation Error",
        description: "Please fill in all question fields",
        variant: "destructive",
      })
      return
    }

    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { ...newQuestion }],
    })

    setNewQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      imageUrl: "",
      explanation: "",
    })

    toast({
      title: "Success",
      description: "Question added to quiz",
    })
  }

  const removeQuestionFromQuiz = (index: number) => {
    setNewQuiz({
      ...newQuiz,
      questions: newQuiz.questions.filter((_, i) => i !== index),
    })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage quizzes, questions, and monitor platform activity</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
            <p className="text-xs text-muted-foreground">{quizzes.filter((q) => q.isActive).length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizzes.length > 0
                ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.duration, 0) / quizzes.length / 60)
                : 0}{" "}
              min
            </div>
            <p className="text-xs text-muted-foreground">Average quiz length</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(quizzes.map((q) => q.category)).size}</div>
            <p className="text-xs text-muted-foreground">Unique categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Quiz Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Quiz</CardTitle>
                <CardDescription>Build a comprehensive quiz with multiple questions</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Quiz Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={newQuiz.category}
                  onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                  placeholder="e.g., Science, History, Programming"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newQuiz.description}
                onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                placeholder="Describe what this quiz covers"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={Math.floor(newQuiz.duration / 60)}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration: Number.parseInt(e.target.value) * 60 })}
                  min="1"
                  max="180"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={newQuiz.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setNewQuiz({ ...newQuiz, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={newQuiz.maxAttempts}
                  onChange={(e) => setNewQuiz({ ...newQuiz, maxAttempts: Number.parseInt(e.target.value) })}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            {/* Question Builder */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Add Questions</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionText">Question Text *</Label>
                  <Textarea
                    id="questionText"
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                    placeholder="Enter your question here"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`option-${index}`}>Option {String.fromCharCode(65 + index)} *</Label>
                      <Input
                        id={`option-${index}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options]
                          newOptions[index] = e.target.value
                          setNewQuestion({ ...newQuestion, options: newOptions })
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Select
                      value={newQuestion.correctAnswer}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {newQuestion.options
                          .map((option, index) => ({ option, index }))
                          .filter(({ option }) => option.trim() !== "")
                          .map(({ option, index }) => (
                            <SelectItem key={index} value={option}>
                              {String.fromCharCode(65 + index)}. {option}
                            </SelectItem>
                          ))}
                        {newQuestion.options.every((option) => option.trim() === "") && (
                          <SelectItem value="placeholder" disabled>
                            Please fill in the options first
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (optional)</Label>
                    <Input
                      id="imageUrl"
                      value={newQuestion.imageUrl}
                      onChange={(e) => setNewQuestion({ ...newQuestion, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (optional)</Label>
                  <Textarea
                    id="explanation"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer"
                    rows={2}
                  />
                </div>

                <Button onClick={addQuestionToQuiz} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question to Quiz
                </Button>
                {newQuiz.questions.length > 0 && (
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    {newQuiz.questions.length} question{newQuiz.questions.length !== 1 ? "s" : ""} added to this quiz.
                  </div>
                )}
              </div>
            </div>

            {/* Questions Preview */}
            {newQuiz.questions.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Questions Added ({newQuiz.questions.length})</h3>
                <div className="space-y-4">
                  {newQuiz.questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Button variant="outline" size="sm" onClick={() => removeQuestionFromQuiz(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{question.questionText}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              option === question.correctAnswer
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-muted"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuiz}>
                <Save className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Quizzes ({quizzes.length})</CardTitle>
          <CardDescription>View, edit, and manage all your quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Quizzes Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{quiz.title}</h3>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                        <Badge variant={quiz.isActive ? "default" : "secondary"}>
                          {quiz.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{quiz.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{quiz.category}</Badge>
                        {quiz.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingQuiz(quiz)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuiz(quiz._id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      {quiz.questions.length} questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDuration(quiz.duration)}
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                      {quiz.maxAttempts} attempt{quiz.maxAttempts !== 1 ? "s" : ""}
                    </div>
                    {/* <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />0 submissions
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
