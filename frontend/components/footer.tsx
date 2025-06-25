'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send
} from 'lucide-react'
import { useLocaleStore } from '@/lib/locale-store'

export function Footer() {
  const { t, isRTL } = useLocaleStore()

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
    console.log('Subscribed with:', email.value)
  }

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section with Newsletter */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1">
            <div className={`flex items-center space-x-2 ${isRTL ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
              <div className="relative w-24 h-24">
                <img
                  src="/logos/logo-light.png"
                  alt="Site Logo"
                  className="w-full h-full object-contain dark:hidden"
                  width={96}
                  height={96}
                />
                <img
                  src="/logos/logo-dark.png"
                  alt="Site Logo"
                  className="w-full h-full object-contain hidden dark:block"
                  width={96}
                  height={96}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className={`text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
              <h3 className="text-lg font-semibold">{t.footer.subscribeNewsletter}</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">{isRTL ? 'احصل على آخر التحديثات والعروض مباشرة في بريدك الإلكتروني.' : 'Get the latest updates and offers right in your inbox.'}</p>
              <form onSubmit={handleSubscribe} className="flex items-center max-w-md mx-auto lg:mx-0 relative">
                <Mail className={`w-5 h-5 text-muted-foreground absolute ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder={t.footer.enterEmail}
                  className={`h-12 ${isRTL ? 'pr-10' : 'pl-10'} rounded-full w-full`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <Button type="submit" className={`absolute ${isRTL ? 'left-1' : 'right-1'} h-10 w-10 p-0 rounded-full`}>
                  <Send className="w-5 h-5"/>
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t"></div>

        {/* Middle Section with Links */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-4">{t.footer.contactInfo}</h3>
            <div className="space-y-4 text-muted-foreground">
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+213 XXX XXX XXX</span>
              </div>
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>contact@eshop-algeria.com</span>
              </div>
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{isRTL ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'}</span>
              </div>
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{isRTL ? 'الإثنين-الجمعة: 9ص-6م' : 'Mon-Fri: 9AM-6PM'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">{t.nav.products}</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">{t.nav.categories}</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">{isRTL ? 'عروض خاصة' : 'Special Deals'}</Link></li>
              <li><Link href="/wishlist" className="text-muted-foreground hover:text-primary transition-colors">{t.nav.wishlist}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t.footer.customerService}</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t.nav.contact}</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">{t.nav.faq}</Link></li>
              <li><Link href="/track-order" className="text-muted-foreground hover:text-primary transition-colors">{t.nav.trackOrder}</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">{isRTL ? 'سياسة الإرجاع' : 'Return Policy'}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{isRTL ? 'تابعنا' : 'Follow Us'}</h3>
            <ul className="space-y-3">
              <li><a href="#" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} text-muted-foreground hover:text-primary transition-colors`}><Facebook className="w-5 h-5" /><span>Facebook</span></a></li>
              <li><a href="#" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} text-muted-foreground hover:text-primary transition-colors`}><Instagram className="w-5 h-5" /><span>Instagram</span></a></li>
              <li><a href="#" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} text-muted-foreground hover:text-primary transition-colors`}><Twitter className="w-5 h-5" /><span>Twitter</span></a></li>
              <li><a href="#" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} text-muted-foreground hover:text-primary transition-colors`}><Youtube className="w-5 h-5" /><span>Youtube</span></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 py-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} E-Shop Algeria. {t.footer.allRightsReserved}.
          </p>
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.footer.privacyPolicy}</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.footer.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}