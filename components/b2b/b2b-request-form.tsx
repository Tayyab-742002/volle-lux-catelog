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

export function B2BRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <form onSubmit={handleSubmit} className="space-y-8">
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
              className="h-11"
            />
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
              className="h-11"
            />
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
              className="h-11"
            />
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
              className="h-11"
            />
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
              className="h-11"
            />
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
              className="h-11"
            />
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
            className="min-h-[100px]"
          />
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
              className="h-11"
            />
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
            className="h-11"
          />
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
            placeholder="Unit 3, GBL House"
            className="h-11"
          />
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
            placeholder="Cleaver Street"
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
              className="h-11"
            />
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
              className="h-11"
            />
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
              placeholder="BB1 5DG"
              className="h-11"
            />
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
                setFormData((prev) => ({
                  ...prev,
                  deliveryAddress: {
                    ...prev.deliveryAddress,
                    country: value,
                  },
                }))
              }
            >
              <SelectTrigger className="h-11">
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

      {submitStatus === "error" && (
        <div className="border-2 border-red-200 bg-red-50 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 mb-1">
              Submission Failed
            </p>
            <p className="text-sm text-red-700">
              {errorMessage ||
                "Something went wrong. Please try again later."}
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

