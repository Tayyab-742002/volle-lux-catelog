"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  createSavedAddress,
  deleteSavedAddress,
  getSavedAddresses,
  setDefaultSavedAddress,
  updateSavedAddress,
  type SavedAddress,
} from "@/services/users/user.service";

export default function SavedAddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      console.log("🔍 No user ID, skipping address fetch");
      setLoading(false);
      return;
    }

    console.log("🔍 Loading saved addresses for user:", user.id);
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    // Set timeout to force loading to false if it takes too long
    timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.error(
          "⏰ Address loading timeout (5s) - forcing loading to false"
        );
        setLoading(false);
        setError("Loading timeout - please refresh the page");
      }
    }, 5000); // 5 second timeout

    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📍 Fetching addresses from Supabase...");
        const result = await getSavedAddresses(user.id);
        console.log("📍 Fetched addresses:", result.length, result);
        if (!cancelled) {
          setAddresses(result);
          console.log("✅ Addresses set in state");
        }
      } catch (e) {
        console.error("❌ Error loading addresses:", e);
        if (!cancelled) setError("Failed to load addresses");
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log("🔍 Loading set to false");
        }
        clearTimeout(timeoutId);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    await deleteSavedAddress(user.id, id);
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    if (!user?.id) return;
    await setDefaultSavedAddress(user.id, id);
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Saved Addresses</h2>
          <p className="mt-2 text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Add Address
        </Button>
      </div>

      {/* Debug panel removed for production */}

      {/* Address List */}
      {addresses.length === 0 && !isAdding ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            {loading ? "Loading..." : "No addresses saved yet"}
          </p>
          <Button onClick={() => setIsAdding(true)} className="mt-4">
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="group rounded-lg border bg-card p-6 transition-all hover:border-primary/30"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold capitalize">
                      {address.name}
                    </span>
                    {address.is_default && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.first_name} {address.last_name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(address.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                <p>
                  {address.address_line_1}
                  {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>{address.phone}</p>}
              </div>

              {!address.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(address.id)}
                  className="w-full"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Set as Default
                </Button>
              )}
            </div>
          ))}

          {/* Add New Address Form */}
          {isAdding && (
            <div className="rounded-lg border-2 border-dashed border-primary/30 bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Add New Address</h3>
              <AddressForm
                onCancel={() => setIsAdding(false)}
                onSubmit={async (payload) => {
                  if (!user?.id) return;
                  const created = await createSavedAddress(
                    user.id,
                    payload,
                    payload.is_default
                  );
                  setAddresses((prev) => [
                    created,
                    ...prev.map((a) => ({
                      ...a,
                      is_default: created.is_default ? false : a.is_default,
                    })),
                  ]);
                  setIsAdding(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AddressFormProps {
  initial?: Partial<SavedAddress>;
  onSubmit: (payload: {
    name: string;
    first_name: string;
    last_name: string;
    company?: string | null;
    address_line_1: string;
    address_line_2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
    phone?: string | null;
    is_default?: boolean;
  }) => void | Promise<void>;
  onCancel: () => void;
}

function AddressForm({ initial, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || "Home",
    first_name: initial?.first_name || "",
    last_name: initial?.last_name || "",
    company: initial?.company || "",
    address_line_1: initial?.address_line_1 || "",
    address_line_2: initial?.address_line_2 || "",
    city: initial?.city || "",
    state: initial?.state || "",
    postal_code: initial?.postal_code || "",
    country: initial?.country || "US",
    phone: initial?.phone || "",
    is_default: Boolean(initial?.is_default) || false,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({
          ...form,
          company: form.company || null,
          address_line_2: form.address_line_2 || null,
          phone: form.phone || null,
        });
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Label</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Home, Office, Mom's House"
          />
        </div>
        <div className="flex items-end gap-2">
          <input
            id="is_default"
            type="checkbox"
            checked={form.is_default}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_default: e.target.checked }))
            }
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="is_default">Set as default</Label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            value={form.first_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, first_name: e.target.value }))
            }
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            value={form.last_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, last_name: e.target.value }))
            }
            placeholder="Doe"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address_line_1">Street Address</Label>
        <Input
          id="address_line_1"
          value={form.address_line_1}
          onChange={(e) =>
            setForm((f) => ({ ...f, address_line_1: e.target.value }))
          }
          placeholder="123 Business Street"
        />
      </div>
      <div>
        <Label htmlFor="address_line_2">Unit, Apt, etc.</Label>
        <Input
          id="address_line_2"
          value={form.address_line_2 || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, address_line_2: e.target.value }))
          }
          placeholder="Suite 100"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="New York"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            placeholder="NY"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postal_code">ZIP Code</Label>
          <Input
            id="postal_code"
            value={form.postal_code}
            onChange={(e) =>
              setForm((f) => ({ ...f, postal_code: e.target.value }))
            }
            placeholder="10001"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={form.country}
            onChange={(e) =>
              setForm((f) => ({ ...f, country: e.target.value }))
            }
            placeholder="US"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          value={form.phone || ""}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="(555) 555-5555"
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          Save Address
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
