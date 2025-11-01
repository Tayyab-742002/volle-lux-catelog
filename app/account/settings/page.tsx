"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, loading, updateProfile, updatePassword } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load user profile on mount
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProfileMessage(null);

    try {
      const result = await updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        company: profile.company,
      });

      if (result.success) {
        setProfileMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      } else {
        setProfileMessage({
          type: "error",
          text: result.error || "Failed to update profile",
        });
      }
    } catch {
      setProfileMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordMessage(null);

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updatePassword(passwordForm.newPassword);

      if (result.success) {
        setPasswordMessage({
          type: "success",
          text: "Password updated successfully!",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordMessage({
          type: "error",
          text: result.error || "Failed to update password",
        });
      }
    } catch {
      setPasswordMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Account Settings</h2>
        <p className="mt-2 text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your personal details
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6">
              {profileMessage && (
                <Alert
                  className={`mb-6 ${profileMessage.type === "success" ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"}`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{profileMessage.text}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="mt-2"
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
                    className="mt-2 opacity-60"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => {
                      if (user) {
                        setProfile({
                          fullName: user.fullName || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          company: user.company || "",
                        });
                      }
                      setProfileMessage(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6">
              {passwordMessage && (
                <Alert
                  className={`mb-6 ${passwordMessage.type === "success" ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"}`}
                >
                  <CheckCircle className="h-4 w-4" />
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
                    className="mt-2"
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
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
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
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Password
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => {
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setPasswordMessage(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
