'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CounterProps {
  end: number
  duration?: number
  delay?: number
  className?: string
  suffix?: string
}

export function Counter({ end, duration = 2, delay = 0, className = "", suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime: number | null = null
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(progress * end))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [end, duration, delay])

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.2 }}
      viewport={{ once: true }}
      className={className}
    >
      {count}{suffix}
    </motion.span>
  )
}
