'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  Star, 
  Award, 
  Users, 
  ShoppingBag, 
  Truck, 
  Shield, 
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Target
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocaleStore } from '@/lib/locale-store'

// Custom hook for counter animation
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number | null = null
          
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            
            setCount(Math.floor(progress * end))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return { count, ref }
}

export default function AboutPage() {
  // Initialize counters for each stat
  const customerCounter = useCounter(10000, 2000)
  const productCounter = useCounter(50000, 2000)
  const cityCounter = useCounter(58, 2000)
  const yearCounter = useCounter(5, 2000)

  const counters = [customerCounter, productCounter, cityCounter, yearCounter]
  const { t } = useLocaleStore()

  const stats = [
    { label: t?.admin?.stats?.happyCustomers || 'Happy Customers', value: 10000, suffix: '+', icon: Users },
    { label: t?.admin?.stats?.productsSold || 'Products Sold', value: 50000, suffix: '+', icon: Award },
    { label: t?.admin?.stats?.citiesCovered || 'Cities Covered', value: 58, suffix: '', icon: Truck },
    { label: t?.admin?.stats?.yearsExperience || 'Years Experience', value: 5, suffix: '+', icon: Clock }
  ]

  const values = [
    {
      icon: Heart,
      title: t?.admin?.values?.customerFirst || 'Customer First',
      description: t?.admin?.values?.customerFirst || 'Customer First'
    },
    {
      icon: Shield,
      title: t?.admin?.values?.qualityAssurance || 'Quality Assurance',
      description: t?.admin?.values?.qualityAssurance || 'Quality Assurance'
    },
    {
      icon: Truck,
      title: t?.admin?.values?.fastDelivery || 'Fast Delivery',
      description: t?.admin?.values?.fastDelivery || 'Fast Delivery'
    },
    {
      icon: Star,
      title: t?.admin?.values?.excellence || 'Excellence',
      description: t?.admin?.values?.excellence || 'Excellence'
    }
  ]

  const team = [
    {
      name: 'Ahmed Benali',
      role: t?.admin?.team?.founder || 'Founder & CEO',
      image: '/api/upload/images/images-1750886375625-228674510.jpg',
      description: t?.admin?.team?.description1 || 'Passionate about bringing quality products to Algerian customers.'
    },
    {
      name: 'Fatima Khelifi',
      role: t?.admin?.team?.headOfOperations || 'Head of Operations',
      image: '/api/upload/images/images-1750886390313-710777334.jpg',
      description: t?.admin?.team?.description2 || 'Ensures smooth operations and exceptional customer experience.'
    },
    {
      name: 'Mohamed Slimani',
      role: t?.admin?.team?.technologyDirector || 'Technology Director',
      image: '/api/upload/images/images-1750886401381-753593046.jpg',
      description: t?.admin?.team?.description3 || 'Leads our technology initiatives and platform development.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-muted/30 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/api/upload/images/images-1750886442569-442546868.jpg"
              alt="About Us Hero"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60" />
          </div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{t?.pages?.about?.title || 'About E-Shop Algeria'}</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t?.pages?.about?.subtitle || "We're on a mission to revolutionize online shopping in Algeria"}
                </p>
                <Badge variant="secondary" className="text-lg px-6 py-2">
                  {t?.admin?.stats?.yearsExperience || 'Years Experience'} 2019
                </Badge>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-md">
                  <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/api/upload/images/images-1750886442569-442546868.jpg"
                      alt="E-Shop Algeria Team"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                  ref={counters[index].ref}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {counters[index].count.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t?.pages?.about?.ourStory || 'Our Story'}</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>{t?.pages?.about?.subtitle || "We're on a mission to revolutionize online shopping in Algeria"}</p>
                  <p>{t?.pages?.about?.ourMission || 'Our Mission'}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-md">
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/api/upload/images/images-1750886415167-825207562.jpg"
                      alt="E-Shop Algeria Story"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">{t?.pages?.about?.ourValues || 'Our Values'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <Card key={idx} className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">{t?.admin?.team?.meetOurTeam || 'Meet Our Team'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <Card key={idx} className="text-center">
                  <CardContent className="p-8">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Shop with Us?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of satisfied customers who trust E-Shop Algeria for their online shopping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/products">
                    Browse Products
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}