import { AddressesClient } from '../addresses-client'
import type { SavedAddress } from '@/services/users/user.service'

interface AddressesTabProps {
  userId: string
  initialAddresses: SavedAddress[]
}

export function AddressesTab({ userId, initialAddresses }: AddressesTabProps) {
  return <AddressesClient initialAddresses={initialAddresses} userId={userId} />
}


