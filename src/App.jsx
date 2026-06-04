import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DogProvider, useDog } from './contexts/DogContext'
import { TabBar } from './components/layout/TabBar'
import { Sidebar } from './components/layout/Sidebar'
import { UrgentSheet } from './components/UrgentSheet'

import { WelcomeScreen } from './screens/WelcomeScreen'
import { AuthScreen } from './screens/AuthScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { TodayScreen } from './screens/TodayScreen'
import { RecordsScreen } from './screens/RecordsScreen'
import { GuidanceHub } from './screens/GuidanceHub'
import { ProfileScreen } from './screens/ProfileScreen'
import { ShoppingScreen } from './screens/ShoppingScreen'
import { FoodScreen } from './screens/FoodScreen'
import { BehaviourScreen } from './screens/BehaviourScreen'
import { VetScreen } from './screens/VetScreen'
import { RoutineScreen } from './screens/RoutineScreen'

/* ── Protected route wrapper ──────────────────────────────────── */
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const { dog, loading: dogLoading } = useDog()
  const location = useLocation()

  if (loading || dogLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--cream-50)' }}>
        <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-body)' }}>Loading…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace state={{ from: location }} />
  if (!dog) return <Navigate to="/onboarding" replace />
  return children
}

/* ── App shell with layout ────────────────────────────────────── */
function AppShell() {
  const { dog } = useDog()
  const [urgentOpen, setUrgentOpen] = useState(false)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  const tabBar = (
    <TabBar dogName={dog?.name} />
  )

  const screens = (
    <Routes>
      <Route path="today"    element={<TodayScreen tabBar={tabBar} />} />
      <Route path="records"  element={<RecordsScreen tabBar={tabBar} />} />
      <Route path="guidance" element={<GuidanceHub tabBar={tabBar} />} />
      <Route path="profile"  element={<ProfileScreen tabBar={tabBar} />} />
      <Route path="shopping" element={<ShoppingScreen tabBar={tabBar} />} />
      <Route path="food"     element={<FoodScreen tabBar={tabBar} />} />
      <Route path="behaviour" element={<BehaviourScreen tabBar={tabBar} />} />
      <Route path="vet"      element={<VetScreen tabBar={tabBar} />} />
      <Route path="routine"  element={<RoutineScreen tabBar={tabBar} />} />
      <Route path="*"        element={<Navigate to="today" replace />} />
    </Routes>
  )

  return (
    <>
      {/* Mobile layout */}
      <div style={{ display: 'flex', minHeight: '100vh' }} className="app-layout">
        <style>{`
          @media (min-width: 768px) {
            .app-layout .mobile-only { display: none !important; }
            .app-layout .desktop-sidebar { display: flex !important; }
            .app-layout .content-area { max-width: 600px; margin: 0 auto; }
          }
          @media (max-width: 767px) {
            .app-layout .desktop-sidebar { display: none !important; }
          }
        `}</style>

        {/* Desktop sidebar */}
        <div className="desktop-sidebar" style={{ display: 'none' }}>
          <Sidebar dog={dog} onUrgent={() => setUrgentOpen(true)} />
        </div>

        {/* Main content */}
        <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', height: '100vh', overflow: 'hidden' }}>
          {screens}
        </div>
      </div>

      {urgentOpen && <UrgentSheet dog={dog} onClose={() => setUrgentOpen(false)} />}
    </>
  )
}

/* ── Root routes ──────────────────────────────────────────────── */
function AppRoutes() {
  const { user, loading } = useAuth()
  const { dog, loading: dogLoading } = useDog()

  return (
    <Routes>
      <Route path="/"           element={<WelcomeScreen />} />
      <Route path="/auth"       element={<AuthScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route
        path="/app/*"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/* ── App ──────────────────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <DogProvider>
        <AppRoutes />
      </DogProvider>
    </AuthProvider>
  )
}
