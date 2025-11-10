/**
 * Shipping Types and Constants
 * Defines all shipping options available at checkout
 */

export interface ShippingOption {
  id: string
  name: string
  price: number
  deliveryTime: string
  carrier: 'Evri' | 'DHL' | 'Collection'
  description?: string
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'evri-48',
    name: 'Evri Tracked 48',
    price: 0.00,
    deliveryTime: 'Deliver within 3-4 working days',
    carrier: 'Evri',
    description: 'Free'
  },
  {
    id: 'dhl-next-day',
    name: 'DHL Next Day UK',
    price: 5.99,
    deliveryTime: 'Next Working Day Delivery (Monday – Friday Delivery)',
    carrier: 'DHL',
    description: '£5.99'
  },
  {
    id: 'free-collection',
    name: 'Free Collection From Our Manchester Warehouse',
    price: 0.00,
    deliveryTime: 'Collect at your convenience',
    carrier: 'Collection',
    description: 'Free'
  }
]

// Default shipping option
export const DEFAULT_SHIPPING_OPTION = SHIPPING_OPTIONS[0]

// VAT rate (20%)
export const VAT_RATE = 0.20

export interface ShippingCalculation {
  subtotal: number
  shippingCost: number
  vatAmount: number
  total: number
  shippingMethod: string
}

/**
 * Get shipping option by ID
 */
export function getShippingOptionById(id: string): ShippingOption | undefined {
  return SHIPPING_OPTIONS.find(option => option.id === id)
}

/**
 * Get shipping price by ID
 */
export function getShippingPrice(id: string): number {
  const option = getShippingOptionById(id)
  return option?.price || 0
}

/**
 * Format shipping option for display
 */
export function formatShippingOption(option: ShippingOption): string {
  return `${option.name} - £${option.price.toFixed(2)}`
}

