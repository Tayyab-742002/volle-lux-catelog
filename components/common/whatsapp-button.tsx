"use client";

import { useState } from "react";

interface WhatsAppButtonProps {
  phoneNumber: string; // Format: +1234567890 (with country code)
  message?: string; // Pre-filled message
  position?: "left" | "right";
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi! I'm interested in your products.",
  position = "left",
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Format phone number (remove any spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp Web URL (works on desktop and mobile)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Open in new window
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`fixed ${position === "left" ? "left-4 sm:left-6 md:left-8" : "right-4 sm:right-6 md:right-8"} bottom-6 sm:bottom-8 md:bottom-10 z-40 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip - Shows on hover (desktop only) */}
      <div
        className={`absolute ${position === "left" ? "left-full ml-4" : "right-full mr-4"} top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap pointer-events-none transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-x-0"
            : `opacity-0 ${position === "left" ? "-translate-x-2" : "translate-x-2"}`
        } hidden md:block`}
      >
        Chat with us on WhatsApp
        {/* Arrow */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${position === "left" ? "-left-2" : "-right-2"} w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${position === "left" ? "border-r-8 border-r-slate-900" : "border-l-8 border-l-slate-900"}`}
        />
      </div>

      {/* Main Button */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16  bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 active:scale-95 min-h-[28px] min-w-[28px] touch-manipulation"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        {/* WhatsApp Logo SVG */}
        <svg
          className="h-7 w-7 sm:h-8 sm:w-8 relative z-10"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4575 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4575 4.15385 17C4.15385 19.5328 4.9308 21.8749 6.29001 23.7741L5.23077 27.7692L9.35809 26.7569C11.2155 27.9954 13.5217 28.8462 16 28.8462Z"
            fill="white"
          />
          <path
            d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
            fill="white"
          />
        </svg>

        {/* Badge (optional - can show "New" or number of unread messages) */}
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white animate-bounce">
          !
        </span>
      </button>
    </div>
  );
}
