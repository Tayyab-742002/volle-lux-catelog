"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Briefcase,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { CreateB2BRequestInput } from "@/types/b2b-request";

interface FormErrors {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  companyWebsite?: string;
  vatNumber?: string;
  productsInterested?: string;
  estimatedQuantity?: string;
  preferredDeliveryDate?: string;
  deliveryAddress?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export function B2BRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<CreateB2BRequestInput>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    companyWebsite: "",
    vatNumber: "",
    productsInterested: "",
    estimatedQuantity: "",
    budgetRange: "",
    preferredDeliveryDate: "",
    deliveryAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "GB",
    },
    additionalNotes: "",
    isExistingCustomer: false,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Company Name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    }

    // Contact Name validation
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    } else if (formData.contactName.trim().length < 2) {
      newErrors.contactName = "Contact name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      const cleanPhone = formData.phone.replace(/\s/g, "");
      if (!phoneRegex.test(formData.phone) || cleanPhone.length < 10) {
        newErrors.phone = "Please enter a valid phone number (minimum 10 digits)";
      }
    }

    // Company Website validation (optional but if provided, must be valid URL)
    if (formData.companyWebsite && formData.companyWebsite.trim()) {
      try {
        const url = new URL(
          formData.companyWebsite.startsWith("http")
            ? formData.companyWebsite
            : `https://${formData.companyWebsite}`
        );
        if (!url.hostname) {
          newErrors.companyWebsite = "Please enter a valid website URL";
        }
      } catch {
        newErrors.companyWebsite = "Please enter a valid website URL";
      }
    }

    // VAT Number validation (optional but if provided, must be valid format)
    if (formData.vatNumber && formData.vatNumber.trim()) {
      const vatRegex = /^[A-Z]{2}?[A-Z0-9]{2,12}$/i;
      if (!vatRegex.test(formData.vatNumber.trim())) {
        newErrors.vatNumber = "Please enter a valid VAT number (e.g., GB123456789)";
      }
    }

    // Products Interested validation
    if (!formData.productsInterested.trim()) {
      newErrors.productsInterested = "Please describe the products you're interested in";
    } else if (formData.productsInterested.trim().length < 10) {
      newErrors.productsInterested = "Please provide more details (at least 10 characters)";
    }

    // Estimated Quantity validation
    if (!formData.estimatedQuantity.trim()) {
      newErrors.estimatedQuantity = "Estimated quantity is required";
    } else if (formData.estimatedQuantity.trim().length < 1) {
      newErrors.estimatedQuantity = "Please provide an estimated quantity";
    }

    // Preferred Delivery Date validation (optional but if provided, must be in future)
    if (formData.preferredDeliveryDate) {
      const selectedDate = new Date(formData.preferredDeliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDeliveryDate = "Delivery date must be in the future";
      }
    }

    // Delivery Address validation
    newErrors.deliveryAddress = {};
    if (!formData.deliveryAddress.addressLine1.trim()) {
      newErrors.deliveryAddress.addressLine1 = "Address line 1 is required";
    } else if (formData.deliveryAddress.addressLine1.trim().length < 5) {
      newErrors.deliveryAddress.addressLine1 = "Address must be at least 5 characters";
    }

    if (!formData.deliveryAddress.city.trim()) {
      newErrors.deliveryAddress.city = "City is required";
    } else if (formData.deliveryAddress.city.trim().length < 2) {
      newErrors.deliveryAddress.city = "City must be at least 2 characters";
    }

    if (!formData.deliveryAddress.state.trim()) {
      newErrors.deliveryAddress.state = "County/State is required";
    } else if (formData.deliveryAddress.state.trim().length < 2) {
      newErrors.deliveryAddress.state = "County/State must be at least 2 characters";
    }

    if (!formData.deliveryAddress.postalCode.trim()) {
      newErrors.deliveryAddress.postalCode = "Postal code is required";
    } else if (formData.deliveryAddress.postalCode.trim().length < 4) {
      newErrors.deliveryAddress.postalCode = "Postal code must be at least 4 characters";
    }

    if (!formData.deliveryAddress.country) {
      newErrors.deliveryAddress.country = "Country is required";
    }

    // Remove empty deliveryAddress object if no errors
    if (Object.keys(newErrors.deliveryAddress).length === 0) {
      delete newErrors.deliveryAddress;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("deliveryAddress.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [field]: value,
        },
      }));
      // Clear error for this field
      if (errors.deliveryAddress?.[field as keyof typeof errors.deliveryAddress]) {
        setErrors((prev) => ({
          ...prev,
          deliveryAddress: {
            ...prev.deliveryAddress,
            [field]: undefined,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
    // Clear general error message
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      if (name === "deliveryAddress.country") {
        return {
          ...prev,
          deliveryAddress: {
            ...prev.deliveryAddress,
            country: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
    // Clear error for this field
    if (name === "deliveryAddress.country" && errors.deliveryAddress?.country) {
      setErrors((prev) => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          country: undefined,
        },
      }));
    } else if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isExistingCustomer: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    setErrors({});

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage("Please fix the errors below before submitting.");
      // Scroll to first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    try {
      const response = await fetch("/api/b2b-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          companyWebsite: "",
          vatNumber: "",
          productsInterested: "",
          estimatedQuantity: "",
          budgetRange: "",
          preferredDeliveryDate: "",
          deliveryAddress: {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "GB",
          },
          additionalNotes: "",
          isExistingCustomer: false,
        });
        setErrors({});
        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result.error ||
            result.details?.[0]?.message ||
            "Failed to submit request. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting B2B request:", error);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* General Error Message */}
      {submitStatus === "error" && errorMessage && (
        <div className="border-2 border-red-200 bg-red-50 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 mb-1">
              Submission Failed
            </p>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Company Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <Briefcase className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Company Information
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-semibold">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              required
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Acme Corporation Ltd"
              className={`h-11 ${
                errors.companyName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.companyName ? "true" : "false"}
              aria-describedby={errors.companyName ? "companyName-error" : undefined}
            />
            {errors.companyName && (
              <p
                id="companyName-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.companyName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-sm font-semibold">
              Contact Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactName"
              name="contactName"
              type="text"
              required
              value={formData.contactName}
              onChange={handleInputChange}
              placeholder="John Smith"
              className={`h-11 ${
                errors.contactName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.contactName ? "true" : "false"}
              aria-describedby={errors.contactName ? "contactName-error" : undefined}
            />
            {errors.contactName && (
              <p
                id="contactName-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.contactName}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contact@company.com"
              className={`h-11 ${
                errors.email
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="01254 916167"
              className={`h-11 ${
                errors.phone
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyWebsite" className="text-sm font-semibold">
              Company Website
            </Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              type="url"
              value={formData.companyWebsite}
              onChange={handleInputChange}
              placeholder="https://www.company.com"
              className={`h-11 ${
                errors.companyWebsite
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.companyWebsite ? "true" : "false"}
              aria-describedby={errors.companyWebsite ? "companyWebsite-error" : undefined}
            />
            {errors.companyWebsite && (
              <p
                id="companyWebsite-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.companyWebsite}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vatNumber" className="text-sm font-semibold">
              VAT Number (UK)
            </Label>
            <Input
              id="vatNumber"
              name="vatNumber"
              type="text"
              value={formData.vatNumber}
              onChange={handleInputChange}
              placeholder="GB123456789"
              className={`h-11 ${
                errors.vatNumber
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.vatNumber ? "true" : "false"}
              aria-describedby={errors.vatNumber ? "vatNumber-error" : undefined}
            />
            {errors.vatNumber && (
              <p
                id="vatNumber-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.vatNumber}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isExistingCustomer"
            checked={formData.isExistingCustomer}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            htmlFor="isExistingCustomer"
            className="text-sm font-medium cursor-pointer"
          >
            I am an existing customer
          </Label>
        </div>
      </div>

      {/* Request Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <Briefcase className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productsInterested" className="text-sm font-semibold">
            Products Interested In <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="productsInterested"
            name="productsInterested"
            required
            rows={4}
            value={formData.productsInterested}
            onChange={handleInputChange}
            placeholder="e.g., Bubble wrap rolls, packing boxes, protective packaging materials..."
            className={`min-h-[100px] ${
              errors.productsInterested
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            aria-invalid={errors.productsInterested ? "true" : "false"}
            aria-describedby={errors.productsInterested ? "productsInterested-error" : undefined}
          />
          {errors.productsInterested && (
            <p
              id="productsInterested-error"
              className="text-xs text-red-600 flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.productsInterested}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Please describe the products you need in detail
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="estimatedQuantity"
              className="text-sm font-semibold"
            >
              Estimated Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="estimatedQuantity"
              name="estimatedQuantity"
              type="text"
              required
              value={formData.estimatedQuantity}
              onChange={handleInputChange}
              placeholder="e.g., 1000-5000 units or 5000+"
              className={`h-11 ${
                errors.estimatedQuantity
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.estimatedQuantity ? "true" : "false"}
              aria-describedby={errors.estimatedQuantity ? "estimatedQuantity-error" : undefined}
            />
            {errors.estimatedQuantity && (
              <p
                id="estimatedQuantity-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.estimatedQuantity}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetRange" className="text-sm font-semibold">
              Budget Range
            </Label>
            <Select
              value={formData.budgetRange || ""}
              onValueChange={(value) => handleSelectChange("budgetRange", value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="£500-£1,000">£500 - £1,000</SelectItem>
                <SelectItem value="£1,000-£5,000">£1,000 - £5,000</SelectItem>
                <SelectItem value="£5,000-£10,000">£5,000 - £10,000</SelectItem>
                <SelectItem value="£10,000-£25,000">
                  £10,000 - £25,000
                </SelectItem>
                <SelectItem value="£25,000+">£25,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="preferredDeliveryDate"
            className="text-sm font-semibold"
          >
            Preferred Delivery Date
          </Label>
          <Input
            id="preferredDeliveryDate"
            name="preferredDeliveryDate"
            type="date"
            value={formData.preferredDeliveryDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            className={`h-11 ${
              errors.preferredDeliveryDate
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            aria-invalid={errors.preferredDeliveryDate ? "true" : "false"}
            aria-describedby={errors.preferredDeliveryDate ? "preferredDeliveryDate-error" : undefined}
          />
          {errors.preferredDeliveryDate && (
            <p
              id="preferredDeliveryDate-error"
              className="text-xs text-red-600 flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.preferredDeliveryDate}
            </p>
          )}
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <Briefcase className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="deliveryAddress.addressLine1"
            className="text-sm font-semibold"
          >
            Address Line 1 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="deliveryAddress.addressLine1"
            name="deliveryAddress.addressLine1"
            type="text"
            required
            value={formData.deliveryAddress.addressLine1}
            onChange={handleInputChange}
            placeholder="Unit BR16 Blakewater Road"
            className={`h-11 ${
              errors.deliveryAddress?.addressLine1
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            aria-invalid={errors.deliveryAddress?.addressLine1 ? "true" : "false"}
            aria-describedby={errors.deliveryAddress?.addressLine1 ? "addressLine1-error" : undefined}
          />
          {errors.deliveryAddress?.addressLine1 && (
            <p
              id="addressLine1-error"
              className="text-xs text-red-600 flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.deliveryAddress.addressLine1}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="deliveryAddress.addressLine2"
            className="text-sm font-semibold"
          >
            Address Line 2
          </Label>
          <Input
            id="deliveryAddress.addressLine2"
            name="deliveryAddress.addressLine2"
            type="text"
            value={formData.deliveryAddress.addressLine2}
            onChange={handleInputChange}
            placeholder="Blackburn, England"
            className="h-11"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="deliveryAddress.city"
              className="text-sm font-semibold"
            >
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deliveryAddress.city"
              name="deliveryAddress.city"
              type="text"
              required
              value={formData.deliveryAddress.city}
              onChange={handleInputChange}
              placeholder="Blackburn"
              className={`h-11 ${
                errors.deliveryAddress?.city
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.deliveryAddress?.city ? "true" : "false"}
              aria-describedby={errors.deliveryAddress?.city ? "city-error" : undefined}
            />
            {errors.deliveryAddress?.city && (
              <p
                id="city-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.deliveryAddress.city}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="deliveryAddress.state"
              className="text-sm font-semibold"
            >
              County/State <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deliveryAddress.state"
              name="deliveryAddress.state"
              type="text"
              required
              value={formData.deliveryAddress.state}
              onChange={handleInputChange}
              placeholder="Lancashire"
              className={`h-11 ${
                errors.deliveryAddress?.state
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.deliveryAddress?.state ? "true" : "false"}
              aria-describedby={errors.deliveryAddress?.state ? "state-error" : undefined}
            />
            {errors.deliveryAddress?.state && (
              <p
                id="state-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.deliveryAddress.state}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="deliveryAddress.postalCode"
              className="text-sm font-semibold"
            >
              Postal Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deliveryAddress.postalCode"
              name="deliveryAddress.postalCode"
              type="text"
              required
              value={formData.deliveryAddress.postalCode}
              onChange={handleInputChange}
              placeholder="BB1 5QF"
              className={`h-11 ${
                errors.deliveryAddress?.postalCode
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              aria-invalid={errors.deliveryAddress?.postalCode ? "true" : "false"}
              aria-describedby={errors.deliveryAddress?.postalCode ? "postalCode-error" : undefined}
            />
            {errors.deliveryAddress?.postalCode && (
              <p
                id="postalCode-error"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.deliveryAddress.postalCode}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="deliveryAddress.country"
              className="text-sm font-semibold"
            >
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.deliveryAddress.country}
              onValueChange={(value) =>
                handleSelectChange("deliveryAddress.country", value)
              }
            >
              <SelectTrigger className={`h-11 ${
                errors.deliveryAddress?.country
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="IE">Ireland</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
                <SelectItem value="BE">Belgium</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.deliveryAddress?.country && (
              <p
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.deliveryAddress.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="text-sm font-semibold">
          Additional Requirements or Notes
        </Label>
        <Textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={5}
          value={formData.additionalNotes}
          onChange={handleInputChange}
          placeholder="Any special requirements, packaging specifications, delivery instructions, etc."
          className="min-h-[120px]"
        />
      </div>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div className="border-2 border-emerald-200 bg-emerald-50 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800 mb-1">
              Request Submitted Successfully!
            </p>
            <p className="text-sm text-emerald-700">
              Thank you for your interest. Our team will review your request and
              get back to you within 1-2 business days with a custom quote.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full md:w-auto bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-base font-semibold text-white hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting Request...
          </>
        ) : (
          <>
            Submit B2B Request
            <Send className="ml-2 h-5 w-5" strokeWidth={2} />
          </>
        )}
      </Button>
    </form>
  );
}
