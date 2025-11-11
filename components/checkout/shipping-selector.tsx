"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SHIPPING_OPTIONS, type ShippingOption } from "@/types/shipping"
import { Check } from "lucide-react"

interface ShippingSelectorProps {
  selectedShippingId: string
  onShippingChange: (shippingId: string) => void
}

export function ShippingSelector({
  selectedShippingId,
  onShippingChange
}: ShippingSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
      
      <RadioGroup
        value={selectedShippingId}
        onValueChange={onShippingChange}
        className="space-y-3"
      >
        {SHIPPING_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 transition-all ${
              selectedShippingId === option.id
                ? "border-emerald-600 bg-emerald-400"
                : "border-gray-300 bg-white hover:border-gray-500"
            }`}
          >
            <RadioGroupItem
              value={option.id}
              id={option.id}
              className="mt-1"
            />
            <Label
              htmlFor={option.id}
              className="flex-1 cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {option.name}
                  </span>
                  {selectedShippingId === option.id && (
                    <Check className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  {option.price === 0 ? 'Free' : `£${option.price.toFixed(2)}`}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {option.deliveryTime}
              </p>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <p className="text-xs text-gray-500 mt-4">
        * Delivery times are estimates and may vary. Orders are processed Monday-Friday (excluding UK bank holidays).
      </p>
    </div>
  )
}

