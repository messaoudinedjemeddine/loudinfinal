'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react'
import { useLocaleStore } from '@/lib/locale-store'
import { 
  MessageCircle,
  Headphones,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLocaleStore()

  const contactInfo = [
    {
      icon: Phone,
      title: t?.admin?.contactInfo?.phone || 'Phone',
      details: t?.admin?.contactInfo?.details?.phone || ['+213 XXX XXX XXX', '+213 YYY YYY YYY'],
      description: t?.admin?.contactInfo?.phone || 'Phone'
    },
    {
      icon: Mail,
      title: t?.admin?.contactInfo?.email || 'Email',
      details: t?.admin?.contactInfo?.details?.email || ['contact@eshop-algeria.com', 'support@eshop-algeria.com'],
      description: t?.admin?.contactInfo?.email || 'Email'
    },
    {
      icon: MapPin,
      title: t?.admin?.contactInfo?.address || 'Address',
      details: t?.admin?.contactInfo?.details?.address || ['123 Main Street', 'Algiers, Algeria'],
      description: t?.admin?.contactInfo?.address || 'Address'
    },
    {
      icon: Clock,
      title: t?.admin?.contactInfo?.businessHours || 'Business Hours',
      details: t?.admin?.contactInfo?.details?.businessHours || ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      description: t?.admin?.contactInfo?.businessHours || 'Business Hours'
    }
  ]

  const faqItems = [
    {
      question: t?.admin?.faq?.q1 || 'How long does delivery take?',
      answer: t?.admin?.faq?.a1 || 'Delivery typically takes 2-5 business days depending on your location within Algeria.'
    },
    {
      question: t?.admin?.faq?.q2 || 'What payment methods do you accept?',
      answer: t?.admin?.faq?.a2 || 'We accept cash on delivery, bank transfers, and major credit cards.'
    },
    {
      question: t?.admin?.faq?.q3 || 'Can I return or exchange items?',
      answer: t?.admin?.faq?.a3 || 'Yes, we offer a 30-day return policy for most items in original condition.'
    },
    {
      question: t?.admin?.faq?.q4 || 'Do you deliver to all wilayas?',
      answer: t?.admin?.faq?.a4 || 'Yes, we deliver to all 48 wilayas across Algeria.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Message sent successfully!')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        {/* Header */}
        <section className="bg-muted/30 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t?.pages?.contact?.title || 'Contact Us'}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t?.pages?.contact?.subtitle || "We're here to help! Get in touch with us for any questions, concerns, or feedback."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <info.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                      <div className="space-y-1 mb-3">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {t?.pages?.contact?.sendMessage || 'Send us a Message'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t?.common?.fullName || 'Full Name'}</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder={t?.common?.fullName || 'Full Name'}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t?.common?.email || 'Email'}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t?.common?.email || 'Email'}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t?.common?.phoneNumber || 'Phone Number'}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t?.common?.phoneNumber || 'Phone Number'}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t?.common?.subject || 'Subject'}</Label>
                        <Input
                          id="subject"
                          type="text"
                          placeholder={t?.common?.subject || 'Subject'}
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t?.common?.message || 'Message'}</Label>
                        <Textarea
                          id="message"
                          placeholder={t?.common?.message || 'Message'}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t?.common?.loading || 'Loading...' : t?.common?.submit || 'Submit'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* FAQ */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Headphones className="w-5 h-5 mr-2" />
                      {t?.pages?.contact?.faq || 'Frequently Asked Questions'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {faqItems.map((item, index) => (
                        <div key={index} className="border-b border-border pb-4 last:border-b-0">
                          <h4 className="font-semibold mb-2">{item.question}</h4>
                          <p className="text-muted-foreground text-sm">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        {t?.pages?.contact?.stillHaveQuestions || 'Still have questions?'}
                      </p>
                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          {t?.admin?.contactInfo?.callUs || 'Call Us'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          {t?.admin?.contactInfo?.sendUsMessage || 'Send Message'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Follow Us</h2>
              <p className="text-muted-foreground mb-8">
                Stay connected with us on social media for updates and exclusive offers
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="lg" className="rounded-full">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}