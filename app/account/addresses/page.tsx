"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Check } from "lucide-react";

interface Address {
  id: string;
  type: "shipping" | "billing";
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "shipping",
      name: "John Doe",
      street: "123 Business Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      type: "billing",
      name: "John Doe",
      street: "123 Business Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      isDefault: true,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
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

      {/* Address List */}
      {addresses.length === 0 && !isAdding ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No addresses saved yet</p>
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
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.name}
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
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
              </div>

              {!address.isDefault && (
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
              <form className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="123 Business Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
