'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TrackingComponent } from '@/components/tracking-component'

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Package</h1>
              <p className="text-lg text-muted-foreground">
                Enter your Yalidine tracking number to track your package and see real-time updates
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tracking Component */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <TrackingComponent />
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}