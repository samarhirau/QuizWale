// "use client"

// import { useAuth } from "@/components/auth-provider"
// import { Button } from "@/components/ui/button"
// import { ModeToggle } from "@/components/mode-toggle"
// import { LayoutDashboard, Trophy, Settings, BarChart3, LogOut, BrainCircuit } from "lucide-react"

// interface NavigationProps {
//   currentView: string
//   onViewChange: (view: any) => void
// }

// export function Navigation({ currentView, onViewChange }: NavigationProps) {
//   const { user, logout } = useAuth()

//   const navItems = [
//     { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { id: "leaderboard", label: "Leaderboard", icon: Trophy },
//   ]

//   if (user?.role === "admin") {
//     navItems.push(
//       { id: "admin", label: "Admin", icon: Settings },
//       { id: "statistics", label: "Statistics", icon: BarChart3 },
//     )
//   }

//   return (
//     <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center space-x-8">
//             <div className="flex items-center space-x-2">
         
//               <BrainCircuit className="h-6 w-6 text-primary" />
//               <span className="text-xl font-bold ">QuizWale</span>
//             </div>

//             <div className="hidden md:flex space-x-4">
//               {navItems.map((item) => (
//                 <Button
//                   key={item.id}
//                   variant={currentView === item.id ? "default" : "ghost"}
//                   onClick={() => onViewChange(item.id)}
//                   className="flex items-center space-x-2"
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.label}</span>
//                 </Button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-muted-foreground">Welcome, {user?.name}</div>
//             <ModeToggle />
//             <Button variant="outline" size="sm" onClick={logout}>
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }
"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LogoutConfirmDialog } from "@/components/logout-dialog" // Import the new component
import { LayoutDashboard, Trophy, Settings, BarChart3, LogOut, BookOpen, BrainCircuit } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  currentView: string
  onViewChange: (view: any) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false) // State to control dialog visibility

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ]

  if (user?.role === "admin") {
    navItems.push(
      { id: "admin", label: "Admin", icon: Settings },
      { id: "statistics", label: "Statistics", icon: BarChart3 },
    )
  }

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutConfirm(false) // Close dialog after logout
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
           <Link href="/">
            <div className="flex items-center space-x-2">
               <BrainCircuit className="h-6 w-6 text-primary" />
             <span className="text-xl font-bold ">QuizWale</span>
            </div></Link>

            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">Welcome, {user?.name}</div>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={() => setShowLogoutConfirm(true)}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleLogoutConfirm}
      />
    </nav>
  )
}
