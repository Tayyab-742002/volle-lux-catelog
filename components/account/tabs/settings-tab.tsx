'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Lock, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { cn } from '@/lib/utils'

interface SettingsTabProps {
  userId: string
}

export function SettingsTab({ userId }: SettingsTabProps) {
  const { user, loading, updateProfile, updatePassword } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Load user profile on mount
  useEffect(() => {
    if (!loading && user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      })
    }
  }, [loading, user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProfileMessage(null)

    try {
      const result = await updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        company: profile.company,
      })

      if (result.success) {
        setProfileMessage({
          type: 'success',
          text: 'Profile updated successfully!',
        })
      } else {
        setProfileMessage({
          type: 'error',
          text: result.error || 'Failed to update profile',
        })
      }
    } catch {
      setProfileMessage({
        type: 'error',
        text: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setPasswordMessage(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      setIsSubmitting(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: 'error',
        text: 'Password must be at least 6 characters',
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await updatePassword(passwordForm.newPassword)

      if (result.success) {
        setPasswordMessage({
          type: 'success',
          text: 'Password updated successfully!',
        })
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        setPasswordMessage({
          type: 'error',
          text: result.error || 'Failed to update password',
        })
      }
    } catch {
      setPasswordMessage({
        type: 'error',
        text: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" strokeWidth={2} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Custom Tabs Navigation */}
      <div className="rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <nav className="flex min-w-max">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2',
                activeTab === 'profile'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-transparent text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-700'
              )}
            >
              <User className="h-4 w-4" strokeWidth={2} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2',
                activeTab === 'password'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-transparent text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-700'
              )}
            >
              <Lock className="h-4 w-4" strokeWidth={2} />
              Password
            </button>
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <User className="h-5 w-5 text-emerald-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  <div className="h-1 w-8 bg-emerald-600 rounded-full" />
                  Profile Information
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Update your personal details
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="p-4 sm:p-6">
            {profileMessage && (
              <Alert
                className={`mb-6 ${profileMessage.type === 'success' ? 'bg-green-50 text-green-900 border-green-200' : 'bg-red-50 text-red-900 border-red-200'}`}
              >
                <CheckCircle className="h-4 w-4" strokeWidth={2} />
                <AlertDescription>{profileMessage.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="mt-2 border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="mt-2 opacity-60 border border-gray-300"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="mt-2 border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="mt-2 border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={2} />}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (user) {
                      setProfile({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        company: user.company || '',
                      })
                    }
                    setProfileMessage(null)
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Lock className="h-5 w-5 text-emerald-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  <div className="h-1 w-8 bg-emerald-600 rounded-full" />
                  Change Password
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-4 sm:p-6">
            {passwordMessage && (
              <Alert
                className={`mb-6 ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-900 border-green-200' : 'bg-red-50 text-red-900 border-red-200'}`}
              >
                <CheckCircle className="h-4 w-4" strokeWidth={2} />
                <AlertDescription>{passwordMessage.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  className="mt-2 border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="mt-2 border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-600">Minimum 6 characters</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  className="mt-2 border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={2} />}
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    })
                    setPasswordMessage(null)
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}


