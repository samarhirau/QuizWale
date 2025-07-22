// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { useToast } from "@/hooks/use-toast"
// import { Plus, Edit, Trash2, Save, X, BookOpen, Users, BarChart3, Clock, Target } from "lucide-react"

// interface Question {
//   questionText: string
//   options: string[]
//   correctAnswer: string
//   imageUrl?: string
//   explanation?: string
// }

// interface Quiz {
//   _id?: string
//   title: string
//   description: string
//   category: string
//   duration: number
//   questions: Question[]
//   difficulty: "easy" | "medium" | "hard"
//   tags: string[]
//   isActive: boolean
//   maxAttempts: number
// }

// export function AdminDashboard() {
//   const [quizzes, setQuizzes] = useState<Quiz[]>([])
//   const [showCreateForm, setShowCreateForm] = useState(false)
//   const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   const [newQuiz, setNewQuiz] = useState<Quiz>({
//     title: "",
//     description: "",
//     category: "",
//     duration: 1800, // 30 minutes in seconds
//     questions: [],
//     difficulty: "medium",
//     tags: [],
//     isActive: true,
//     maxAttempts: 1,
//   })

//   const [newQuestion, setNewQuestion] = useState<Question>({
//     questionText: "",
//     options: ["", "", "", ""],
//     correctAnswer: "",
//     imageUrl: "",
//     explanation: "",
//   })

//   useEffect(() => {
//     fetchQuizzes()
//   }, [])

//   const fetchQuizzes = async () => {
//     try {
//       const response = await fetch("/api/quizzes", {
//         headers: {}, // Browser will automatically send HTTP-only cookie
//       })
//       if (response.ok) {
//         const data = await response.json()
//         setQuizzes(data.quizzes)
//       }
//     } catch (error) {
//       console.error("Error fetching quizzes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch quizzes",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateQuiz = async () => {
//     if (!newQuiz.title || !newQuiz.description || newQuiz.questions.length === 0) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields and add at least one question",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       const response = await fetch("/api/quizzes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }, // Browser will automatically send HTTP-only cookie
//         body: JSON.stringify(newQuiz),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setQuizzes([data.quiz, ...quizzes])
//         setNewQuiz({
//           title: "",
//           description: "",
//           category: "",
//           duration: 1800,
//           questions: [],
//           difficulty: "medium",
//           tags: [],
//           isActive: true,
//           maxAttempts: 1,
//         })
//         setShowCreateForm(false)
//         toast({
//           title: "Success",
//           description: "Quiz created successfully",
//         })
//       } else {
//         const errorData = await response.json()
//         toast({
//           title: "Error",
//           description: errorData.error || "Failed to create quiz",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error creating quiz:", error)
//       toast({
//         title: "Error",
//         description: "Failed to create quiz",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleUpdateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
//     try {
//       const response = await fetch(`/api/quizzes/${quizId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" }, // Browser will automatically send HTTP-only cookie
//         body: JSON.stringify(updates),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setQuizzes(quizzes.map((q) => (q._id === quizId ? data.quiz : q)))
//         setEditingQuiz(null)
//         toast({
//           title: "Success",
//           description: "Quiz updated successfully",
//         })
//       } else {
//         const errorData = await response.json()
//         toast({
//           title: "Error",
//           description: errorData.error || "Failed to update quiz",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error updating quiz:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update quiz",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteQuiz = async (quizId: string) => {
//     if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
//       return
//     }

//     try {
//       const response = await fetch(`/api/quizzes/${quizId}`, {
//         method: "DELETE",
//         headers: {}, // Browser will automatically send HTTP-only cookie
//       })

//       if (response.ok) {
//         setQuizzes(quizzes.filter((q) => q._id !== quizId))
//         toast({
//           title: "Success",
//           description: "Quiz deleted successfully",
//         })
//       } else {
//         const errorData = await response.json()
//         toast({
//           title: "Error",
//           description: errorData.error || "Failed to delete quiz",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error deleting quiz:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete quiz",
//         variant: "destructive",
//       })
//     }
//   }

//   const addQuestionToQuiz = () => {
//     if (!newQuestion.questionText || newQuestion.options.some((opt) => !opt) || !newQuestion.correctAnswer) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all question fields",
//         variant: "destructive",
//       })
//       return
//     }

//     setNewQuiz({
//       ...newQuiz,
//       questions: [...newQuiz.questions, { ...newQuestion }],
//     })

//     setNewQuestion({
//       questionText: "",
//       options: ["", "", "", ""],
//       correctAnswer: "",
//       imageUrl: "",
//       explanation: "",
//     })

//     toast({
//       title: "Success",
//       description: "Question added to quiz",
//     })
//   }

//   const removeQuestionFromQuiz = (index: number) => {
//     setNewQuiz({
//       ...newQuiz,
//       questions: newQuiz.questions.filter((_, i) => i !== index),
//     })
//   }

//   const formatDuration = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60)
//     return `${minutes} min`
//   }

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "easy":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//       case "hard":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Manage quizzes, questions, and monitor platform activity</p>
//         </div>
//         <Button onClick={() => setShowCreateForm(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Create Quiz
//         </Button>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
//             <BookOpen className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{quizzes.length}</div>
//             <p className="text-xs text-muted-foreground">{quizzes.filter((q) => q.isActive).length} active</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}</div>
//             <p className="text-xs text-muted-foreground">Across all quizzes</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {quizzes.length > 0
//                 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.duration, 0) / quizzes.length / 60)
//                 : 0}{" "}
//               min
//             </div>
//             <p className="text-xs text-muted-foreground">Average quiz length</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Categories</CardTitle>
//             <BarChart3 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{new Set(quizzes.map((q) => q.category)).size}</div>
//             <p className="text-xs text-muted-foreground">Unique categories</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Create Quiz Form */}
//       {showCreateForm && (
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Create New Quiz</CardTitle>
//                 <CardDescription>Build a comprehensive quiz with multiple questions</CardDescription>
//               </div>
//               <Button variant="outline" onClick={() => setShowCreateForm(false)}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Basic Quiz Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Quiz Title *</Label>
//                 <Input
//                   id="title"
//                   value={newQuiz.title}
//                   onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
//                   placeholder="Enter quiz title"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="category">Category *</Label>
//                 <Input
//                   id="category"
//                   value={newQuiz.category}
//                   onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
//                   placeholder="e.g., Science, History, Programming"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 value={newQuiz.description}
//                 onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
//                 placeholder="Describe what this quiz covers"
//                 rows={3}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="duration">Duration (minutes)</Label>
//                 <Input
//                   id="duration"
//                   type="number"
//                   value={Math.floor(newQuiz.duration / 60)}
//                   onChange={(e) => setNewQuiz({ ...newQuiz, duration: Number.parseInt(e.target.value) * 60 })}
//                   min="1"
//                   max="180"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="difficulty">Difficulty</Label>
//                 <Select
//                   value={newQuiz.difficulty}
//                   onValueChange={(value: "easy" | "medium" | "hard") => setNewQuiz({ ...newQuiz, difficulty: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="easy">Easy</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="hard">Hard</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="maxAttempts">Max Attempts</Label>
//                 <Input
//                   id="maxAttempts"
//                   type="number"
//                   value={newQuiz.maxAttempts}
//                   onChange={(e) => setNewQuiz({ ...newQuiz, maxAttempts: Number.parseInt(e.target.value) })}
//                   min="1"
//                   max="10"
//                 />
//               </div>
//             </div>

//             {/* Question Builder */}
//             <div className="border-t pt-6">
//               <h3 className="text-lg font-semibold mb-4">Add Questions</h3>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="questionText">Question Text *</Label>
//                   <Textarea
//                     id="questionText"
//                     value={newQuestion.questionText}
//                     onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
//                     placeholder="Enter your question here"
//                     rows={2}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {newQuestion.options.map((option, index) => (
//                     <div key={index} className="space-y-2">
//                       <Label htmlFor={`option-${index}`}>Option {String.fromCharCode(65 + index)} *</Label>
//                       <Input
//                         id={`option-${index}`}
//                         value={option}
//                         onChange={(e) => {
//                           const newOptions = [...newQuestion.options]
//                           newOptions[index] = e.target.value
//                           setNewQuestion({ ...newQuestion, options: newOptions })
//                         }}
//                         placeholder={`Option ${String.fromCharCode(65 + index)}`}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="correctAnswer">Correct Answer *</Label>
//                     <Select
//                       value={newQuestion.correctAnswer}
//                       onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select correct answer" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {newQuestion.options
//                           .map((option, index) => ({ option, index }))
//                           .filter(({ option }) => option.trim() !== "")
//                           .map(({ option, index }) => (
//                             <SelectItem key={index} value={option}>
//                               {String.fromCharCode(65 + index)}. {option}
//                             </SelectItem>
//                           ))}
//                         {newQuestion.options.every((option) => option.trim() === "") && (
//                           <SelectItem value="placeholder" disabled>
//                             Please fill in the options first
//                           </SelectItem>
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="imageUrl">Image URL (optional)</Label>
//                     <Input
//                       id="imageUrl"
//                       value={newQuestion.imageUrl}
//                       onChange={(e) => setNewQuestion({ ...newQuestion, imageUrl: e.target.value })}
//                       placeholder="https://example.com/image.jpg"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="explanation">Explanation (optional)</Label>
//                   <Textarea
//                     id="explanation"
//                     value={newQuestion.explanation}
//                     onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
//                     placeholder="Explain why this is the correct answer"
//                     rows={2}
//                   />
//                 </div>

//                 <Button onClick={addQuestionToQuiz} className="w-full">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Question to Quiz
//                 </Button>
//                 {newQuiz.questions.length > 0 && (
//                   <div className="text-sm text-muted-foreground text-center mt-2">
//                     {newQuiz.questions.length} question{newQuiz.questions.length !== 1 ? "s" : ""} added to this quiz.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Questions Preview */}
//             {newQuiz.questions.length > 0 && (
//               <div className="border-t pt-6">
//                 <h3 className="text-lg font-semibold mb-4">Questions Added ({newQuiz.questions.length})</h3>
//                 <div className="space-y-4">
//                   {newQuiz.questions.map((question, index) => (
//                     <div key={index} className="border rounded-lg p-4">
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-medium">Question {index + 1}</h4>
//                         <Button variant="outline" size="sm" onClick={() => removeQuestionFromQuiz(index)}>
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-2">{question.questionText}</p>
//                       <div className="grid grid-cols-2 gap-2 text-xs">
//                         {question.options.map((option, optIndex) => (
//                           <div
//                             key={optIndex}
//                             className={`p-2 rounded ${
//                               option === question.correctAnswer
//                                 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                                 : "bg-muted"
//                             }`}
//                           >
//                             {String.fromCharCode(65 + optIndex)}. {option}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-end space-x-2">
//               <Button variant="outline" onClick={() => setShowCreateForm(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCreateQuiz}>
//                 <Save className="h-4 w-4 mr-2" />
//                 Create Quiz
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Existing Quizzes */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Manage Quizzes ({quizzes.length})</CardTitle>
//           <CardDescription>View, edit, and manage all your quizzes</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {quizzes.length === 0 ? (
//             <div className="text-center py-12">
//               <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-medium mb-2">No Quizzes Yet</h3>
//               <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
//               <Button onClick={() => setShowCreateForm(true)}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Your First Quiz
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {quizzes.map((quiz) => (
//                 <div key={quiz._id} className="border rounded-lg p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="text-xl font-semibold">{quiz.title}</h3>
//                         <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
//                         <Badge variant={quiz.isActive ? "default" : "secondary"}>
//                           {quiz.isActive ? "Active" : "Inactive"}
//                         </Badge>
//                       </div>
//                       <p className="text-muted-foreground mb-3">{quiz.description}</p>
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         <Badge variant="outline">{quiz.category}</Badge>
//                         {quiz.tags?.map((tag) => (
//                           <Badge key={tag} variant="outline" className="text-xs">
//                             {tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Button variant="outline" size="sm" onClick={() => setEditingQuiz(quiz)}>
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={() => handleDeleteQuiz(quiz._id!)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                     <div className="flex items-center">
//                       <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
//                       {quiz.questions.length} questions
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
//                       {formatDuration(quiz.duration)}
//                     </div>
//                     <div className="flex items-center">
//                       <Target className="h-4 w-4 mr-2 text-muted-foreground" />
//                       {quiz.maxAttempts} attempt{quiz.maxAttempts !== 1 ? "s" : ""}
//                     </div>
//                     {/* <div className="flex items-center">
//                       <Users className="h-4 w-4 mr-2 text-muted-foreground" />0 submissions
//                     </div> */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
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
import { Plus, Edit, Trash2, Save, X, BookOpen, Users, BarChart3, Clock, Target, Star } from "lucide-react"

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
  expectedRating?: number
  createdBy?: {
    _id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

interface Stats {
  totalQuizzes: number
  totalSubmissions: number
  totalCategories: number
  recentQuizzes: Quiz[]
  popularQuizzes: any[]
  categoryStats: any[]
}

export function AdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [newQuiz, setNewQuiz] = useState<Quiz>({
    title: "",
    description: "",
    category: "",
    duration: 1800,
    questions: [],
    difficulty: "medium",
    tags: [],
    isActive: true,
    maxAttempts: 1,
    expectedRating: 4.0,
  })

  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    imageUrl: "",
    explanation: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch quizzes and stats in parallel
      const [quizzesResponse, statsResponse] = await Promise.all([fetch("/api/quizzes?limit=100"), fetch("/api/stats")])

      if (quizzesResponse.ok) {
        const quizzesData = await quizzesResponse.json()
        setQuizzes(quizzesData.quizzes || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuiz = async () => {
    if (!newQuiz.title || !newQuiz.description || !newQuiz.category || newQuiz.questions.length === 0) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz),
      })

      if (response.ok) {
        const data = await response.json()
        setQuizzes([data.quiz, ...quizzes])
        resetNewQuiz()
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
        headers: { "Content-Type": "application/json" },
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
    if (!newQuestion.questionText || newQuestion.options.some((opt) => !opt.trim()) || !newQuestion.correctAnswer) {
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

  const resetNewQuiz = () => {
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
      expectedRating: 4.0,
    })
    setNewQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      imageUrl: "",
      explanation: "",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
            <div className="text-2xl font-bold">{stats?.totalQuizzes || quizzes.length}</div>
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
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
            <p className="text-xs text-muted-foreground">Quiz attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCategories || new Set(quizzes.map((q) => q.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Quiz Form */}
      {showCreateForm && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Create New Quiz
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Build a comprehensive quiz with multiple questions and engage your audience
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  resetNewQuiz()
                }}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {/* Basic Quiz Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium flex items-center gap-1">
                    Quiz Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="Enter an engaging quiz title"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium flex items-center gap-1">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category"
                    value={newQuiz.category}
                    onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                    placeholder="e.g., Science, History, Programming"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  placeholder="Describe what this quiz covers and what learners will gain"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={Math.floor(newQuiz.duration / 60)}
                    onChange={(e) => setNewQuiz({ ...newQuiz, duration: Number.parseInt(e.target.value) * 60 })}
                    min="1"
                    max="180"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </Label>
                  <Select
                    value={newQuiz.difficulty}
                    onValueChange={(value: "easy" | "medium" | "hard") => setNewQuiz({ ...newQuiz, difficulty: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Easy
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="hard">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Hard
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts" className="text-sm font-medium">
                    Max Attempts
                  </Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={newQuiz.maxAttempts}
                    onChange={(e) => setNewQuiz({ ...newQuiz, maxAttempts: Number.parseInt(e.target.value) })}
                    min="1"
                    max="10"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedRating" className="text-sm font-medium">
                    Expected Rating
                  </Label>
                  <Select
                    value={newQuiz.expectedRating?.toString() || "4"}
                    onValueChange={(value) => setNewQuiz({ ...newQuiz, expectedRating: Number.parseFloat(value) })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          5.0 - Excellent
                        </div>
                      </SelectItem>
                      <SelectItem value="4.5">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />
                          </div>
                          4.5 - Very Good
                        </div>
                      </SelectItem>
                      <SelectItem value="4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-3 w-3 text-gray-300" />
                          </div>
                          4.0 - Good
                        </div>
                      </SelectItem>
                      <SelectItem value="3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />
                            <Star className="h-3 w-3 text-gray-300" />
                          </div>
                          3.5 - Average
                        </div>
                      </SelectItem>
                      <SelectItem value="3">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-gray-300" />
                            ))}
                          </div>
                          3.0 - Fair
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={newQuiz.tags.join(", ")}
                  onChange={(e) =>
                    setNewQuiz({
                      ...newQuiz,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag),
                    })
                  }
                  placeholder="e.g., javascript, programming, web development"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Add relevant tags to help users find your quiz</p>
              </div>
            </div>

            {/* Question Builder */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <h3 className="text-lg font-semibold">Add Questions</h3>
                {newQuiz.questions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {newQuiz.questions.length} question{newQuiz.questions.length !== 1 ? "s" : ""} added
                  </Badge>
                )}
              </div>

              <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="questionText" className="text-sm font-medium flex items-center gap-1">
                      Question Text <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="questionText"
                      value={newQuestion.questionText}
                      onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                      placeholder="Enter your question here..."
                      rows={3}
                      className="resize-none bg-white dark:bg-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`option-${index}`} className="text-sm font-medium flex items-center gap-1">
                          Option {String.fromCharCode(65 + index)} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`option-${index}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options]
                            newOptions[index] = e.target.value
                            setNewQuestion({ ...newQuestion, options: newOptions })
                          }}
                          placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                          className="bg-white dark:bg-gray-900 h-11"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer" className="text-sm font-medium flex items-center gap-1">
                        Correct Answer <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newQuestion.correctAnswer}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-900 h-11">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {newQuestion.options
                            .map((option, index) => ({ option, index }))
                            .filter(({ option }) => option.trim() !== "")
                            .map(({ option, index }) => (
                              <SelectItem key={index} value={option}>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-medium text-xs">
                                      {String.fromCharCode(65 + index)}
                                    </span>
                                  </div>
                                  {option}
                                </div>
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
                      <Label htmlFor="imageUrl" className="text-sm font-medium">
                        Image URL (optional)
                      </Label>
                      <Input
                        id="imageUrl"
                        value={newQuestion.imageUrl}
                        onChange={(e) => setNewQuestion({ ...newQuestion, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="bg-white dark:bg-gray-900 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explanation" className="text-sm font-medium">
                      Explanation (optional)
                    </Label>
                    <Textarea
                      id="explanation"
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      placeholder="Explain why this is the correct answer (helps with learning)"
                      rows={2}
                      className="resize-none bg-white dark:bg-gray-900"
                    />
                  </div>

                  <Button onClick={addQuestionToQuiz} className="w-full h-12 text-base">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Question to Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Questions Preview */}
            {newQuiz.questions.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <h3 className="text-lg font-semibold">Questions Preview</h3>
                  <Badge variant="outline" className="ml-2">
                    {newQuiz.questions.length} question{newQuiz.questions.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {newQuiz.questions.map((question, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-xs">{index + 1}</span>
                            </div>
                            <h4 className="font-medium">Question {index + 1}</h4>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestionFromQuiz(index)}
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 font-medium">{question.questionText}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                option === question.correctAnswer
                                  ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                {option}
                                {option === question.correctAnswer && (
                                  <div className="ml-auto">
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  resetNewQuiz()
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateQuiz}
                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!newQuiz.title || !newQuiz.description || !newQuiz.category || newQuiz.questions.length === 0}
              >
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
                      {quiz.createdAt && (
                        <p className="text-xs text-muted-foreground">
                          Created on {formatDate(quiz.createdAt)} by {quiz.createdBy?.name || "Admin"}
                        </p>
                      )}
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
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      View submissions
                    </div>
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
