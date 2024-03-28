"use client"

import { analytics } from '@/firebase'
import { logEvent } from 'firebase/analytics'

export const useAnalytics = (eventName: string) => {
  return () => {
    if (!analytics) return

    logEvent(analytics, eventName)
  }
}
