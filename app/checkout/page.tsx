"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  MapPin,
  CreditCard,
  Package,
  Plus,
  Check,
} from "lucide-react";
import {
  getSavedAddresses,
  type SavedAddress as SavedAddressType,
} from "@/services/users/user.service";

// Use SavedAddress type from user service
type SavedAddress = SavedAddressType;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartSummary } = useCartStore();
  const { user } = useAuth();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if addresses have been loaded for this page load to prevent infinite loop
  const addressesLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const currentLoadPromiseRef = useRef<Promise<void> | null>(null);

  // New address form state (shipping only - billing collected by Stripe)
  const [shippingForm, setShippingForm] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    phone: "",
  });

  const summary = getCartSummary();

  // Reset address loading state on component mount (allows fresh loading on new checkout)
  useEffect(() => {
    console.log("Checkout page mounted - resetting address loading state");
    addressesLoadedRef.current = false;
    lastUserIdRef.current = null;
    currentLoadPromiseRef.current = null;
  }, []); // Empty dependency array = runs only on mount

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Load saved addresses for authenticated users (with infinite loop protection)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    async function loadAddresses() {
      const userId = user?.id;

      console.log("🔍 CHECKOUT: loadAddresses called, userId:", userId);
      console.log(
        "🔍 CHECKOUT: addressesLoadedRef:",
        addressesLoadedRef.current
      );
      console.log("🔍 CHECKOUT: lastUserIdRef:", lastUserIdRef.current);

      // If no user, set loading to false and exit
      if (!userId) {
        console.log("🔍 CHECKOUT: No user ID, setting loading to false");
        setIsLoadingAddresses(false);
        addressesLoadedRef.current = true;
        return;
      }

      // If already loaded for this exact user ID in this page load, skip
      if (addressesLoadedRef.current && lastUserIdRef.current === userId) {
        console.log(
          "🔍 CHECKOUT: Addresses already loaded for this page load, skipping..."
        );
        return;
      }

      // Set timeout to force loading to false if it takes too long
      timeoutId = setTimeout(() => {
        if (!isCancelled) {
          console.error(
            "⏰ CHECKOUT: Address loading timeout (5s) - forcing loading to false"
          );
          setIsLoadingAddresses(false);
          addressesLoadedRef.current = true;
        }
      }, 5000); // 5 second timeout

      // Mark as loading
      console.log("🔍 CHECKOUT: Starting address loading...");
      setIsLoadingAddresses(true);
      lastUserIdRef.current = userId;

      try {
        console.log("🔍 CHECKOUT: Fetching saved addresses for user:", userId);
        const addresses = await getSavedAddresses(userId);

        if (isCancelled) return; // Don't update state if cancelled

        console.log(
          "✅ CHECKOUT: Loaded addresses:",
          addresses.length,
          addresses
        );
        setSavedAddresses(addresses);

        // Auto-select default address
        const defaultAddr = addresses.find((a) => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          console.log(
            "✅ CHECKOUT: Auto-selected default address:",
            defaultAddr.id
          );
        } else {
          console.log("🔍 CHECKOUT: No default address found");
        }
      } catch (err) {
        console.error("❌ CHECKOUT: Failed to load addresses:", err);
        if (!isCancelled) {
          // Set empty array on error to prevent retry loops
          setSavedAddresses([]);
        }
      } finally {
        if (!isCancelled) {
          console.log("🔍 CHECKOUT: Setting isLoadingAddresses to false");
          setIsLoadingAddresses(false);
          addressesLoadedRef.current = true;
        }
        clearTimeout(timeoutId);
      }
    }

    loadAddresses();

    // Cleanup
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [user?.id]);

  // Handle checkout submission
  async function handleCheckout() {
    setError(null);
    setIsLoading(true);

    try {
      let shippingAddress;

      // Determine shipping address
      if (user?.id && selectedAddressId && !useNewAddress) {
        // Use saved address
        const selectedAddr = savedAddresses.find(
          (a) => a.id === selectedAddressId
        );
        if (!selectedAddr) {
          throw new Error("Selected address not found");
        }

        shippingAddress = {
          fullName: `${selectedAddr.first_name} ${selectedAddr.last_name}`,
          address: selectedAddr.address_line_1,
          address2: selectedAddr.address_line_2 || "",
          city: selectedAddr.city,
          state: selectedAddr.state,
          zipCode: selectedAddr.postal_code,
          country: selectedAddr.country,
          phone: selectedAddr.phone || "",
        };
      } else if (useNewAddress || !user?.id) {
        // Use new address form (for guests or new address)
        if (
          !shippingForm.first_name ||
          !shippingForm.last_name ||
          !shippingForm.address_line_1 ||
          !shippingForm.city ||
          !shippingForm.state ||
          !shippingForm.postal_code
        ) {
          throw new Error("Please fill in all required shipping fields");
        }

        shippingAddress = {
          fullName: `${shippingForm.first_name} ${shippingForm.last_name}`,
          address: shippingForm.address_line_1,
          address2: shippingForm.address_line_2 || "",
          city: shippingForm.city,
          state: shippingForm.state,
          zipCode: shippingForm.postal_code,
          country: shippingForm.country,
          phone: shippingForm.phone || "",
        };
      } else {
        throw new Error("Please select or enter a shipping address");
      }

      // Create Stripe checkout session
      // Note: Billing address will be collected by Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          // billingAddress will be collected by Stripe checkout
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe hosted checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        {/* Debug panel removed for production */}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Shipping & Billing */}
          <div className="lg:col-span-2">
            {/* Shipping Address Section */}
            <Card className="mb-6 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>

              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="ml-2 text-sm text-muted-foreground">
                    Loading addresses...
                  </p>
                </div>
              ) : user?.id && savedAddresses.length > 0 && !useNewAddress ? (
                <>
                  <RadioGroup
                    value={selectedAddressId || ""}
                    onValueChange={setSelectedAddressId}
                  >
                    {savedAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <RadioGroupItem
                          value={address.id}
                          id={address.id}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={address.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-semibold">
                              {address.first_name} {address.last_name}
                            </span>
                            {address.is_default && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.address_line_1}
                            {address.address_line_2 && (
                              <>, {address.address_line_2}</>
                            )}
                            <br />
                            {address.city}, {address.state}{" "}
                            {address.postal_code}
                            <br />
                            {address.country}
                            {address.phone && (
                              <>
                                <br />
                                {address.phone}
                              </>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => setUseNewAddress(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Use a New Address
                  </Button>
                </>
              ) : (
                <>
                  {user?.id && savedAddresses.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="mb-4 w-full"
                      onClick={() => setUseNewAddress(false)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Use Saved Address
                    </Button>
                  )}

                  {/* New Address Form */}
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="first_name">
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="first_name"
                          value={shippingForm.first_name}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              first_name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="last_name"
                          value={shippingForm.last_name}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              last_name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={shippingForm.company}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line_1">
                        Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address_line_1"
                        value={shippingForm.address_line_1}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            address_line_1: e.target.value,
                          })
                        }
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line_2">
                        Apartment, suite, etc. (Optional)
                      </Label>
                      <Input
                        id="address_line_2"
                        value={shippingForm.address_line_2}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            address_line_2: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="city">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={shippingForm.city}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              city: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">
                          State <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="state"
                          value={shippingForm.state}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              state: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">
                          ZIP Code <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="postal_code"
                          value={shippingForm.postal_code}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              postal_code: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Note about billing address */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Billing Address</h3>
                  <p className="text-sm text-muted-foreground">
                    Your billing address will be collected securely on the next
                    page during payment processing.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              <Separator className="my-4" />

              {/* Cart Items */}
              <div className="mb-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.pricePerUnit * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${summary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Calculated at next step</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </>
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Secure checkout powered by Stripe
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
