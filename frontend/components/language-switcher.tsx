'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'
import { useLocaleStore } from '@/lib/locale-store'
import { Locale, locales } from '@/lib/i18n'

const languageNames: Record<Locale, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  ar: { name: 'Arabic', nativeName: 'العربية' }
}

export function LanguageSwitcher({ isTransparent = false }: { isTransparent?: boolean }) {
  const { locale, setLocale } = useLocaleStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center space-x-2 language-switcher-btn ${isTransparent ? 'language-switcher-transparent' : ''}`}>
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {languageNames[locale].nativeName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 language-switcher-menu">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className="flex items-center justify-between cursor-pointer language-switcher-item"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {languageNames[lang].nativeName}
              </span>
              <span className="text-xs text-muted-foreground">
                {languageNames[lang].name}
              </span>
            </div>
            {locale === lang && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}