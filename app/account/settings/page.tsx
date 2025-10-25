"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock } from "lucide-react";

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "ABC Corporation",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update profile in Supabase
    alert("Profile updated successfully!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update password in Supabase
    alert("Password updated successfully!");
  };

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
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
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
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="mt-2"
                  />
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
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose how you want to be notified
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: checked as boolean,
                      })
                    }
                  />
                  <Label
                    htmlFor="emailNotifications"
                    className="cursor-pointer font-normal"
                  >
                    Email Notifications
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsNotifications"
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        smsNotifications: checked as boolean,
                      })
                    }
                  />
                  <Label
                    htmlFor="smsNotifications"
                    className="cursor-pointer font-normal"
                  >
                    SMS Notifications
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="marketingEmails"
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        marketingEmails: checked as boolean,
                      })
                    }
                  />
                  <Label
                    htmlFor="marketingEmails"
                    className="cursor-pointer font-normal"
                  >
                    Marketing Emails
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="orderUpdates"
                      checked={preferences.orderUpdates}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          orderUpdates: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="orderUpdates"
                      className="cursor-pointer font-normal"
                    >
                      Order Updates
                    </Label>
                  </div>

                  <div className="pt-4">
                    <Button>Save Preferences</Button>
                  </div>
                </div>
              </div>
            </div>
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
              <div className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit">Update Password</Button>
                  <Button type="button" variant="outline">
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
