"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Question {
  _id: string
  text: string
  options: string[]
  imageUrl?: string
}

interface Quiz {
  _id: string
  title: string
  duration: number
}

export function QuizInterface() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveQuiz()
  }, [])

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (quizStarted && timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizStarted])

  const fetchActiveQuiz = async () => {
    try {
      const response = await fetch("/api/quiz", {
        headers: {},
      })

      if (response.ok) {
        const data = await response.json()
        setQuiz(data.quiz)
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(-1))
        setTimeLeft(data.quiz.duration * 60)
      }
    } catch (error) {
      console.error("Error fetching quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      const timeSpent = quiz!.duration * 60 - timeLeft

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz!._id,
          answers,
          timeSpent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setQuizCompleted(true)
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading quiz...</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Active Quiz</CardTitle>
          <CardDescription>
            There are no active quizzes available at the moment. Please check back later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (quizCompleted && results) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
          <CardDescription>Here are your results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">
              {results.score}/{results.totalQuestions}
            </div>
            <div className="text-lg text-gray-600">
              Score: {Math.round((results.score / results.totalQuestions) * 100)}%
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Correct Answers:</h3>
            {questions.map((question, index) => (
              <div key={question._id} className="p-3 border rounded">
                <div className="font-medium">{question.text}</div>
                <div
                  className={`mt-1 ${answers[index] === results.correctAnswers[index] ? "text-green-600" : "text-red-600"}`}
                >
                  Your answer: {question.options[answers[index]] || "Not answered"}
                </div>
                <div className="text-green-600">Correct answer: {question.options[results.correctAnswers[index]]}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            Duration: {quiz.duration} minutes | Questions: {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>• You cannot go back to previous questions</p>
              <p>• The quiz will auto-submit when time runs out</p>
              <p>• Make sure you have a stable internet connection</p>
            </div>
            <Button onClick={startQuiz} className="w-full">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <div className="text-lg font-mono text-red-600">{formatTime(timeLeft)}</div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQ.imageUrl && (
          <img
            src={currentQ.imageUrl || "/placeholder.svg"}
            alt="Question"
            className="w-full max-h-64 object-contain rounded"
          />
        )}

        <div className="text-lg font-medium">{currentQ.text}</div>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                answers[currentQuestion] === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        <Button onClick={handleNextQuestion} disabled={answers[currentQuestion] === -1} className="w-full">
          {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next Question"}
        </Button>
      </CardContent>
    </Card>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"

// interface Question {
//   questionText: string
//   options: string[]
//   correctAnswer: number
//   imageUrl?: string
// }

// interface Quiz {
//   _id: string
//   title: string
//   duration: number
// }

// export function QuizInterface() {
//   const [quiz, setQuiz] = useState<Quiz | null>(null)
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [answers, setAnswers] = useState<number[]>([])
//   const [timeLeft, setTimeLeft] = useState(0)
//   const [quizStarted, setQuizStarted] = useState(false)
//   const [quizCompleted, setQuizCompleted] = useState(false)
//   const [results, setResults] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchActiveQuiz()
//   }, [])

//   useEffect(() => {
//     if (quizStarted && timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
//       return () => clearTimeout(timer)
//     } else if (quizStarted && timeLeft === 0) {
//       handleSubmitQuiz()
//     }
//   }, [timeLeft, quizStarted])

//   const fetchActiveQuiz = async () => {
//     try {
//       const res = await fetch("/api/quizzes?limit=1") // get latest active quiz
//       if (res.ok) {
//         const data = await res.json()
//         if (data.quizzes.length === 0) return
//         const activeQuiz = data.quizzes[0]
//         setQuiz(activeQuiz)
//         setQuestions(activeQuiz.questions)
//         setAnswers(new Array(activeQuiz.questions.length).fill(-1))
//         setTimeLeft(activeQuiz.duration * 60)
//       }
//     } catch (err) {
//       console.error("Error fetching quiz:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const startQuiz = () => setQuizStarted(true)

//   const handleAnswerSelect = (answerIndex: number) => {
//     const newAnswers = [...answers]
//     newAnswers[currentQuestion] = answerIndex
//     setAnswers(newAnswers)
//   }

//   const handleNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1)
//     else handleSubmitQuiz()
//   }

//   const handleSubmitQuiz = async () => {
//     try {
//       const timeSpent = quiz!.duration * 60 - timeLeft
//       const res = await fetch(`/api/quizzes/${quiz!._id}/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ answers, timeSpent }),
//       })
//       if (res.ok) {
//         const data = await res.json()
//         setResults(data)
//         setQuizCompleted(true)
//       }
//     } catch (err) {
//       console.error("Error submitting quiz:", err)
//     }
//   }

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60)
//     const s = seconds % 60
//     return `${m}:${s.toString().padStart(2, "0")}`
//   }

//   if (loading) return <div className="flex items-center justify-center py-12 text-lg">Loading quiz...</div>
//   if (!quiz) return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>No Active Quiz</CardTitle>
//         <CardDescription>No active quizzes available right now.</CardDescription>
//       </CardHeader>
//     </Card>
//   )

//   if (quizCompleted && results) {
//     return (
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>Quiz Completed!</CardTitle>
//           <CardDescription>Here are your results</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="text-center">
//             <div className="text-4xl font-bold text-green-600">
//               {results.submission.score}/{results.submission.totalQuestions}
//             </div>
//             <div className="text-lg text-gray-600">
//               Score: {results.submission.percentage}%
//             </div>
//           </div>
//           <div className="space-y-2">
//             <h3 className="font-semibold">Questions & Answers:</h3>
//             {results.quiz.questions.map((q: any, idx: number) => (
//               <div key={idx} className="p-3 border rounded">
//                 <div className="font-medium">{q.questionText}</div>
//                 <div className={`mt-1 ${q.userAnswer === q.correctAnswer ? "text-green-600" : "text-red-600"}`}>
//                   Your answer: {q.userAnswer !== undefined ? q.options[q.userAnswer] : "Not answered"}
//                 </div>
//                 <div className="text-green-600">Correct answer: {q.options[q.correctAnswer]}</div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (!quizStarted) {
//     return (
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>{quiz.title}</CardTitle>
//           <CardDescription>
//             Duration: {quiz.duration} minutes | Questions: {questions.length}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4 text-sm text-gray-600">
//             <p>• You cannot go back to previous questions</p>
//             <p>• Quiz auto-submits when time runs out</p>
//             <p>• Ensure a stable internet connection</p>
//           </div>
//           <Button onClick={startQuiz} className="w-full">Start Quiz</Button>
//         </CardContent>
//       </Card>
//     )
//   }

//   const currentQ = questions[currentQuestion]
//   const progress = ((currentQuestion + 1) / questions.length) * 100

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
//           <div className="text-lg font-mono text-red-600">{formatTime(timeLeft)}</div>
//         </div>
//         <Progress value={progress} className="w-full" />
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {currentQ.imageUrl && (
//           <img src={currentQ.imageUrl} alt="Question" className="w-full max-h-64 object-contain rounded" />
//         )}
//         <div className="text-lg font-medium">{currentQ.questionText}</div>
//         <div className="space-y-3">
//           {currentQ.options.map((option, idx) => (
//             <button
//               key={idx}
//               onClick={() => handleAnswerSelect(idx)}
//               className={`w-full p-4 text-left border rounded-lg transition-colors ${
//                 answers[currentQuestion] === idx ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//             >
//               <span className="font-medium mr-3">{String.fromCharCode(65 + idx)}.</span>{option}
//             </button>
//           ))}
//         </div>
//         <Button
//           onClick={handleNextQuestion}
//           disabled={answers[currentQuestion] === -1}
//           className="w-full"
//         >
//           {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next Question"}
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }
