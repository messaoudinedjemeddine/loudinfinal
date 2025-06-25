import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Locale, defaultLocale, getTranslation, isRTL, getDirection } from './i18n'

interface LocaleStore {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getTranslation>
  isRTL: boolean
  direction: 'ltr' | 'rtl'
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      t: getTranslation(defaultLocale),
      isRTL: isRTL(defaultLocale),
      direction: getDirection(defaultLocale),
      setLocale: (locale: Locale) => {
        const t = getTranslation(locale)
        const rtl = isRTL(locale)
        const direction = getDirection(locale)
        
        set({ 
          locale, 
          t, 
          isRTL: rtl, 
          direction 
        })
        
        // Update document direction and lang
        if (typeof document !== 'undefined') {
          document.documentElement.dir = direction
          document.documentElement.lang = locale
        }
      }
    }),
    {
      name: 'locale-storage',
      onRehydrate: (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.dir = state.direction
          document.documentElement.lang = state.locale
        }
      }
    }
  )
)