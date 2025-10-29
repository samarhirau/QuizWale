"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, BarChart3, Trophy, Users, Zap, ShieldCheck, BrainCircuit } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { QuizTaking } from "./quiz-taking"


interface Quiz {
  imageUrl: string
  rating: string
  _id: string;
  title: string;
  category: string;
  difficulty?: string;
  duration: number;
  questions?: any[];
  createdBy?: { name?: string };
}

interface Category {
  name: string;
  count: number;
  quizzes: Quiz[];
}

interface Stats {
  totalQuizzes: number;
  totalCategories: number;
  recentQuizzes: Quiz[];
  popularQuizzes: Quiz[];
  topRatedQuizzes: Quiz[];
  participants: number;
}



interface LandingPageProps {
  onShowAuthForm: (tab: "login" | "register") => void // New prop to trigger AuthForm visibility and set tab
}

export function LandingPage({ onShowAuthForm }: LandingPageProps) {

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalQuizzes: 0,
    totalCategories: 0,
    recentQuizzes: [],
    popularQuizzes: [],
    topRatedQuizzes: [],
    participants : 0,

  })
   const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
    const [currentView, setCurrentView] = useState("/")

const router = useRouter()



    const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId)
    setCurrentView("quiz")
  }

    const handleQuizComplete = () => {
    setSelectedQuizId(null)
    router.push("/dashboard") 
  
  }

const { user } = useAuth()
 const [stat, setStat] = useState({ participants: 0, totalSubmissions: 0 });



useEffect(() => {
  const fetchStat = async () => {
    const res = await fetch("/api/user/stats");
    const data = await res.json();
    setStat(data);
  };

  fetchStat();
}, []);


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch all quizzes
      const quizzesResponse = await fetch("/api/quizzes?limit=50")
      const quizzesData = await quizzesResponse.json()

      if (quizzesData.quizzes) {
        const allQuizzes = quizzesData.quizzes
        setQuizzes(allQuizzes)

        // Extract unique categories
        const uniqueCategories = [...new Set(allQuizzes.map((quiz: { category: any }) => quiz.category))]
        const categoryData = uniqueCategories.map((cat) => ({
          name: String(cat),
          count: allQuizzes.filter((quiz: { category: unknown }) => quiz.category === cat).length,
          quizzes: allQuizzes.filter((quiz: { category: unknown }) => quiz.category === cat),
        }))
        setCategories(categoryData)

        // Calculate stats
        const recentQuizzes = allQuizzes.slice(0, 5)
        const popularQuizzes = [...allQuizzes]
          .sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0))
          .slice(0, 5)
     // You can add rating logic here
        const topRatedQuizzes = [...allQuizzes]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5)
     

        setStats({
          totalQuizzes: allQuizzes.length,
          totalCategories: uniqueCategories.length,
          recentQuizzes,
          popularQuizzes,
          topRatedQuizzes,
          participants: allQuizzes.reduce((acc: any, quiz: { questions: string | any[] }) => acc + (quiz.questions?.length || 0), 0),
     
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

   const getDifficultyColor = (difficulty: string | undefined) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-orange-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const getDifficultyBadge = (difficulty: string | undefined) => {
    return difficulty?.toUpperCase() || "MEDIUM"
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

   


  
  

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (currentView === "quiz") {
    return (
      <QuizTaking
        quizId={selectedQuizId!}
        onComplete={handleQuizComplete}
      />
    )
  }
  if (currentView === "dashboard") {
    router.push("/dashboard")
    return null 
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      
      {/* Hero Section */}
      
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          
        <div className="container px-4 md:px-6 text-center">
          <div className="flex items-center space-x-2 fixed top-4 left-4 z-50">
              
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold ">QuizWale</span>
            </div>

           
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>

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
                  user ? window.location.href = "/dashboard" : onShowAuthForm("register") 
                }}
                // ref removed; handle navigation in onClick if needed
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Button>
              <Link href="#features-section">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

          {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalQuizzes}+</div>
                <div className="text-muted-foreground">Active Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
               {stat.participants ?? 0}
                  +</div>
                <div className="text-muted-foreground">Happy Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.totalSubmissions}+</div>
                <div className="text-muted-foreground">Quiz Attempts</div>
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
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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

       {/* Quiz Categories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Popular Categories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Explore Quiz Categories</h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover quizzes across various topics and challenge yourself in your favorite subjects.
            </p>
          </div>

          {/* Recently Published */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Recently Published</h3>
              <Link href="/quizzes" className="text-primary hover:underline text-sm font-medium">
                See all ({stats.totalQuizzes})
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {stats.recentQuizzes.map((quiz) => (
  <div key={quiz._id} className="flex-shrink-0 w-64">
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer py-0 gap-1"
      onClick={ user ? () => handleStartQuiz(quiz._id) : () => onShowAuthForm("login") } 
    >
      <div className="relative">
        <img
          src={
            quiz.imageUrl ||
            `/placeholder.svg?height=120&width=256&text=${encodeURIComponent(quiz.title)}`
          }
          alt={quiz.title}
          className="w-full h-50 object-fill"
                                     
        />
        <Badge
          className={`absolute top-2 left-2 ${getDifficultyColor(quiz.difficulty)} text-white text-xs`}
        >
          {getDifficultyBadge(quiz.difficulty)}
        </Badge>
      </div>
      <CardContent className="py-2 px-4">
        <h4 className="font-semibold text-sm mb-2 truncate">{quiz.title}</h4>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{quiz.rating || "N/A"}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {quiz.questions?.length || 0} questions • {formatDuration(quiz.duration)}
        </div>
      </CardContent>
    </Card>
  </div>
))}   

              {stats.recentQuizzes.length === 0 && (
                <div className="text-center text-gray-500 w-full py-8">No quizzes available yet.</div>
              )}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Popular Categories</h3>
              <Link href="/categories" className="text-primary hover:underline text-sm font-medium">
                See all ({stats.totalCategories})
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <Card key={category.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer py-0 gap-1">
                  <div className="relative">
                    <img
                      src={category.quizzes[0]?.imageUrl || `/placeholder.svg?height=120&width=256&text=${encodeURIComponent(category.name)}`}
                      alt={category.name}
                      className="w-full h-50 object-fill"
                    />
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-white text-xs">CATEGORY</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{category.name}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{(category.quizzes.reduce((acc, quiz) => acc + (Number(quiz.rating) || 0), 0) / category.count).toFixed(1) || "N/A"}</span>
                      </div>
                      <span>{category.count} quizzes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {categories.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">No categories available yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Voting Banner */}
      <section className="w-full py-8 bg-gradient-to-r from-teal-700 to-teal-600 dark:from-teal-800 dark:to-teal-700">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Can't decide? Let players vote</h3>
            </div>
            <Button className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-6 py-3 rounded-full">
              Start vote mode
            </Button>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="w-full py-8 bg-white dark:bg-gray-950 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center gap-8 overflow-x-auto pb-4">
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Start</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Art & Literature</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Entertainment</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium">Geography</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium">History</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm font-medium">Languages</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-sm font-medium">Science & Nature</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Sports</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-fit cursor-pointer hover:text-primary">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-pink-600" />
              </div>
              <span className="text-sm font-medium">Trivia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Create Quiz Feature Cards */}
      <section className="w-full py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-200 to-blue-300 border-0 overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Create a quiz</h3>
                  <p className=" mb-4">Play for free with 300 participants</p>
                  <Button className="bg-green-500 hover:bg-green-600  font-semibold px-6 py-2 rounded-full">
                    Quiz editor
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-700 to-teal-800 border-0 overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <BrainCircuit className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">A.I.</h3>
                  <p className="text-teal-100 mb-4">Generate a quiz from any subject or pdf</p>
                  {/* <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-2 rounded-full">
                    Quiz generator
                  </Button> */}
                  <Link href="/ai-quiz">
  <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-2 rounded-full">
    Quiz generator
  </Button>
</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Rating Right Now */}
      <section className="w-full py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Best rating right now</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {stats.topRatedQuizzes.map((quiz) => (
              <div key={quiz._id} className="flex-shrink-0 w-64">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer py-0 gap-1">
                  <div className="relative">
                    <img
                      src={quiz.imageUrl || `/placeholder.svg?height=120&width=256&text=${encodeURIComponent(quiz.title)}`}
                      alt={quiz.title}
                      className="w-full h-50 object-fill"
                    />
                    <Badge
                      className={`absolute top-2 left-2 ${getDifficultyColor(quiz.difficulty)} text-white text-xs`}
                    >
                      {getDifficultyBadge(quiz.difficulty)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2 truncate">{quiz.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{quiz.rating || "N/A"}</span>
                      </div>
                      <span>By {quiz.createdBy?.name || "Admin"}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {quiz.category} • {quiz.questions?.length || 0} questions
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Right Now */}
      <section className="w-full py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Popular right now</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {stats.popularQuizzes.map((quiz) => (
              <div key={quiz._id} className="flex-shrink-0 w-64">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer py-0 gap-1">
                  <div className="relative">
                    <img
                      src={`${quiz.imageUrl || `/placeholder.svg?height=120&width=256&text=${encodeURIComponent(quiz.title)}`}`}
                      alt={quiz.title}
                      className="w-full h-50 object-fill"
                    />
                    <Badge
                      className={`absolute top-2 left-2 ${getDifficultyColor(quiz.difficulty)} text-white text-xs`}
                    >
                      {getDifficultyBadge(quiz.difficulty)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2 truncate">{quiz.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★ {quiz.rating}</span>
                        
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {quiz.category} • {formatDuration(quiz.duration)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
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

