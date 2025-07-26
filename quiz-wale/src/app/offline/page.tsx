'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NoInternetPage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  if (isOnline) {
    return null // You can redirect or hide the component if online
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col justify-center items-center text-center bg-white px-6"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-red-500 text-6xl mb-4"
      >
        ⚠️
      </motion.div>

      <motion.h1 className="text-3xl font-bold text-gray-800 mb-2">
        No Internet Connection
      </motion.h1>

      <p className="text-gray-600 mb-6">
        You are currently offline. Please check your internet connection.
      </p>

      <Link
        href="/"
        className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        Retry
      </Link>
    </motion.div>
  )
}
