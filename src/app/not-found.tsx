// app/not-found.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6"
    >
      <motion.h1
        className="text-6xl font-extrabold text-gray-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        404
      </motion.h1>

      <motion.p
        className="mt-4 text-xl text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Oops! Page not found.
      </motion.p>

      <motion.p
        className="mt-2 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link
          href="/"
          className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg transition"
        >
          Go Home
        </Link>
      </motion.div>
    </motion.div>
  )
}
