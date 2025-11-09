'use client'

import { useState, useOptimistic } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Check, MapPin } from 'lucide-react'
import {
  createSavedAddress,
  deleteSavedAddress,
  setDefaultSavedAddress,
  updateSavedAddress,
  type SavedAddress,
} from '@/services/users/user.service'

interface AddressesClientProps {
  initialAddresses: SavedAddress[]
  userId: string
}

export function AddressesClient({
  initialAddresses,
  userId,
}: AddressesClientProps) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    await deleteSavedAddress(userId, id)
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultSavedAddress(userId, id)
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex items-center gap-3">
            <div className="h-1 w-8 bg-emerald-600 rounded-full" />
            Saved Addresses
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="self-start sm:self-auto bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-5 w-5" strokeWidth={2} />
          Add Address
        </Button>
      </div>

      {/* Address List */}
      {addresses.length === 0 && !isAdding ? (
        <div className="flex items-center justify-center py-12 sm:py-16 rounded-2xl border border-gray-300 bg-white shadow-lg">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4 border border-emerald-200">
                <MapPin className="h-8 w-8 text-emerald-600" strokeWidth={2} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
              <p className="text-lg font-semibold text-gray-900">
                No addresses saved yet
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Add your first address to speed up checkout
              </p>
            </div>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
              Add Your First Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {addresses.map((address) =>
            editingId === address.id ? (
              <div
                key={address.id}
                className="rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-4 sm:p-6 shadow-lg"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-3">
                  <div className="h-1 w-8 bg-emerald-600 rounded-full" />
                  Edit Address
                </h3>
                <AddressForm
                  initial={address}
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (payload) => {
                    const updated = await updateSavedAddress(
                      userId,
                      address.id,
                      payload
                    )
                    setAddresses((prev) =>
                      prev.map((a) =>
                        a.id === address.id
                          ? updated
                          : {
                              ...a,
                              is_default: updated.is_default
                                ? false
                                : a.is_default,
                            }
                      )
                    )
                    setEditingId(null)
                  }}
                />
              </div>
            ) : (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => setEditingId(address.id)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
            )
          )}

          {/* Add New Address Form */}
          {isAdding && (
            <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-4 sm:p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-emerald-600 rounded-full" />
                Add New Address
              </h3>
              <AddressForm
                onCancel={() => setIsAdding(false)}
                onSubmit={async (payload) => {
                  const created = await createSavedAddress(
                    userId,
                    payload,
                    payload.is_default
                  )
                  setAddresses((prev) => [
                    created,
                    ...prev.map((a) => ({
                      ...a,
                      is_default: created.is_default ? false : a.is_default,
                    })),
                  ])
                  setIsAdding(false)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Address Card Component
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: SavedAddress
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
}) {
  return (
    <div className="group rounded-2xl border border-gray-300 bg-white p-4 sm:p-6 shadow-lg transition-all hover:border-emerald-300 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2 flex-wrap">
            <span className="font-semibold capitalize truncate text-gray-900">
              {address.name}
            </span>
            {address.is_default && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {address.first_name} {address.last_name}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Edit className="h-4 w-4" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <p>
          {address.address_line_1}
          {address.address_line_2 ? `, ${address.address_line_2}` : ''}
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
          onClick={onSetDefault}
          className="w-full border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
        >
          <Check className="mr-2 h-4 w-4" strokeWidth={2} />
          Set as Default
        </Button>
      )}
    </div>
  )
}

// Address Form Component
interface AddressFormProps {
  initial?: Partial<SavedAddress>
  onSubmit: (payload: {
    name: string
    first_name: string
    last_name: string
    company?: string | null
    address_line_1: string
    address_line_2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    phone?: string | null
    is_default?: boolean
  }) => void | Promise<void>
  onCancel: () => void
}

function AddressForm({ initial, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || 'Home',
    first_name: initial?.first_name || '',
    last_name: initial?.last_name || '',
    company: initial?.company || '',
    address_line_1: initial?.address_line_1 || '',
    address_line_2: initial?.address_line_2 || '',
    city: initial?.city || '',
    state: initial?.state || '',
    postal_code: initial?.postal_code || '',
    country: initial?.country || 'US',
    phone: initial?.phone || '',
    is_default: Boolean(initial?.is_default) || false,
  })

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        await onSubmit({
          ...form,
          company: form.company || null,
          address_line_2: form.address_line_2 || null,
          phone: form.phone || null,
        })
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-sm">
            Label
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Home, Office, Mom's House"
            className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            id="is_default"
            type="checkbox"
            checked={form.is_default}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_default: e.target.checked }))
            }
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="is_default" className="text-sm">
            Set as default
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="text-sm">
            First name
          </Label>
          <Input
            id="first_name"
            value={form.first_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, first_name: e.target.value }))
            }
            placeholder="John"
            className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name" className="text-sm">
            Last name
          </Label>
          <Input
            id="last_name"
            value={form.last_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, last_name: e.target.value }))
            }
            placeholder="Doe"
            className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address_line_1" className="text-sm">
          Street Address
        </Label>
        <Input
          id="address_line_1"
          value={form.address_line_1}
          onChange={(e) =>
            setForm((f) => ({ ...f, address_line_1: e.target.value }))
          }
          placeholder="123 Business Street"
          className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="address_line_2" className="text-sm">
          Unit, Apt, etc. (optional)
        </Label>
        <Input
          id="address_line_2"
          value={form.address_line_2 || ''}
          onChange={(e) =>
            setForm((f) => ({ ...f, address_line_2: e.target.value }))
          }
          placeholder="Suite 100"
          className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" className="text-sm">
            City
          </Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="New York"
            className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-sm">
            State
          </Label>
          <Input
            id="state"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            placeholder="NY"
            className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <Label htmlFor="postal_code" className="text-sm">
            ZIP
          </Label>
          <Input
            id="postal_code"
            value={form.postal_code}
            onChange={(e) =>
              setForm((f) => ({ ...f, postal_code: e.target.value }))
            }
            placeholder="10001"
            className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm">
          Phone (optional)
        </Label>
        <Input
          id="phone"
          value={form.phone || ''}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="(555) 555-5555"
          className="mt-1.5 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Save Address
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}


