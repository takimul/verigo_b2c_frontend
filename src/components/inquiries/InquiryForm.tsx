"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Layers,
  LoaderCircle,
  Package,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getProducts } from "@/services/products";
import { createInquiry } from "@/services/inquiries";
import type { InquiryInput } from "@/types/inquiry";
import type { Product } from "@/types/product";

type Props = {
  initialProductId?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

type FormState = {
  productId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  quantity: string;
  customBranding: boolean;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  quantity?: string;
  message?: string;
};

export default function InquiryForm({
  initialProductId = "",
  compact = false,
  onSuccess,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState<FormState>({
    productId: initialProductId,
    name: "",
    companyName: "",
    email: "",
    phone: "",
    country: "",
    quantity: "",
    customBranding: false,
    message: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Product Dropdown & Hover Preview State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialProductId) {
      setForm((prev) => ({ ...prev, productId: initialProductId }));
    }
  }, [initialProductId]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoadingProducts(true);
      try {
        const response = await getProducts({ limit: 100 });
        const items = response.data?.items ?? [];
        if (active) {
          setProducts(items.filter((p) => p.status === "ACTIVE"));
        }
      } catch (err) {
        console.error("Failed to load products for inquiry:", err);
      } finally {
        if (active) setLoadingProducts(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === form.productId),
    [products, form.productId],
  );

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const query = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category?.name?.toLowerCase().includes(query),
    );
  }, [products, productSearch]);

  // Set default hover product when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setHoveredProduct(selectedProduct || products[0] || null);
    }
  }, [dropdownOpen, selectedProduct, products]);

  // Real-Time Validation
  const validateField = (
    key: keyof FormState,
    value: string | boolean,
    prod = selectedProduct,
  ): string => {
    const stringVal = typeof value === "string" ? value.trim() : "";

    switch (key) {
      case "name":
        if (!stringVal) return "Full name is required.";
        if (stringVal.length < 2) return "Name must be at least 2 characters.";
        return "";

      case "email":
        if (!stringVal) return "Business email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(stringVal)) {
          return "Please enter a valid email address.";
        }
        return "";

      case "phone": {
        const digits = stringVal.replace(/\D/g, "");
        if (!stringVal) return "Phone / WhatsApp number is required.";
        if (digits.length < 7) {
          return "Please enter at least 7 digits with country code.";
        }
        return "";
      }

      case "quantity":
        if (stringVal) {
          const num = Number(stringVal);
          if (!Number.isSafeInteger(num) || num <= 0) {
            return "Please enter a valid positive number.";
          }
          if (prod && num < prod.moq) {
            return `Minimum order quantity is ${prod.moq.toLocaleString()} units.`;
          }
        }
        return "";

      default:
        return "";
    }
  };

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));

    // Instant validation as user types
    const errorMsg = validateField(key, value);
    setErrors((prev) => ({
      ...prev,
      [key]: errorMsg || undefined,
    }));
  };

  const handleBlur = (key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errorMsg = validateField(key, form[key]);
    setErrors((prev) => ({
      ...prev,
      [key]: errorMsg || undefined,
    }));
  };

  // Block alphabet keys in phone input
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "Enter" ||
      e.key === "Escape" ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    // If key is an alphabet letter, block it instantly
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        phone: "Letters are not allowed. Please enter numbers only.",
      }));
      setTouched((prev) => ({ ...prev, phone: true }));
      return;
    }

    // Only allow numbers and valid phone symbols
    if (!/[\d+\s()-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^\d+\s()-]/g, "");
    updateField("phone", sanitized);
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const sanitized = paste.replace(/[^\d+\s()-]/g, "");
    const target = e.currentTarget;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    const current = form.phone;
    const next = current.slice(0, start) + sanitized + current.slice(end);
    updateField("phone", next);
  };

  // Submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      quantity: true,
    });

    const nameErr = validateField("name", form.name);
    const emailErr = validateField("email", form.email);
    const phoneErr = validateField("phone", form.phone);
    const qtyErr = validateField("quantity", form.quantity);

    const newErrors: FormErrors = {
      name: nameErr || undefined,
      email: emailErr || undefined,
      phone: phoneErr || undefined,
      quantity: qtyErr || undefined,
    };

    setErrors(newErrors);

    if (nameErr || emailErr || phoneErr || qtyErr) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (sending) return;

    const parsedQty = form.quantity.trim() ? Number(form.quantity) : undefined;

    const payload: InquiryInput = {
      ...(form.productId ? { productId: form.productId } : {}),
      name: form.name.trim(),
      ...(form.companyName.trim()
        ? { companyName: form.companyName.trim() }
        : {}),
      email: form.email.trim(),
      phone: form.phone.trim(),
      ...(form.country.trim() ? { country: form.country.trim() } : {}),
      ...(parsedQty !== undefined ? { quantity: parsedQty } : {}),
      customBranding: form.customBranding,
      ...(form.message.trim() ? { message: form.message.trim() } : {}),
    };

    setSending(true);

    try {
      await createInquiry(payload);
      setSent(true);
      toast.success("Quote request submitted successfully.");
      onSuccess?.();
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit quote request. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  // Confirmation View
  if (sent) {
    return (
      <div className="border border-neutral-200 bg-white p-8 sm:p-12 text-center animate-in fade-in duration-200">
        <CheckCircle2 size={36} className="mx-auto text-neutral-900" strokeWidth={1.5} />

        <h2 className="mt-4 font-serif text-2xl font-normal text-neutral-950 sm:text-3xl">
          Thank you for your inquiry
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-600 max-w-md mx-auto">
          We have received your requirements. Our merchandising team will review
          your order details and contact you with a formal quote.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setForm({
                productId: "",
                name: "",
                companyName: "",
                email: "",
                phone: "",
                country: "",
                quantity: "",
                customBranding: false,
                message: "",
              });
              setTouched({});
              setErrors({});
              setSent(false);
            }}
            className="border border-neutral-300 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-900 hover:border-neutral-900 transition"
          >
            Submit Another Request
          </button>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-neutral-950 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition"
          >
            Explore Categories <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (fieldKey: keyof FormErrors) => {
    const isError = touched[fieldKey] && errors[fieldKey];
    return `mt-1.5 w-full border ${
      isError ? "border-red-500 bg-red-50/20" : "border-neutral-300 bg-white"
    } px-3.5 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`border border-neutral-200 bg-white ${
        compact ? "p-5" : "p-6 sm:p-10"
      }`}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Full name <span className="text-neutral-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Your full name"
            className={inputClass("name")}
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Company name
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="Business or company"
            className="mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        {/* Business Email */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Business email <span className="text-neutral-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@company.com"
            className={inputClass("email")}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        {/* Phone / WhatsApp */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Phone / WhatsApp <span className="text-neutral-400">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onKeyDown={handlePhoneKeyDown}
            onChange={handlePhoneChange}
            onPaste={handlePhonePaste}
            onBlur={() => handleBlur("phone")}
            placeholder="+880..."
            className={inputClass("phone")}
          />
          {touched.phone && errors.phone && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Country
          </label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
            placeholder="Your country"
            className="mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        {/* Product Dropdown with Hover Image Preview */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Product
          </label>

          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="mt-1.5 flex h-[42px] w-full items-center justify-between border border-neutral-300 bg-white px-3.5 text-left text-sm text-neutral-950 transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none"
          >
            <span className="truncate">
              {selectedProduct ? selectedProduct.name : "General wholesale inquiry"}
            </span>
            <ChevronDown
              size={16}
              className={`text-neutral-500 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu with Hover Preview */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 flex border border-neutral-200 bg-white shadow-2xl animate-in fade-in duration-150 sm:w-[500px]">
              {/* Product List Column */}
              <div className="flex-1 flex flex-col max-h-72 overflow-hidden border-r border-neutral-100">
                {/* Search */}
                <div className="border-b border-neutral-200 p-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search apparel..."
                      className="w-full bg-neutral-50 py-1.5 pl-8 pr-6 text-xs outline-none focus:bg-white focus:border focus:border-neutral-950"
                      autoFocus
                    />
                    {productSearch && (
                      <button
                        type="button"
                        onClick={() => setProductSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* List items */}
                <div className="overflow-y-auto divide-y divide-neutral-100">
                  {/* General Option */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredProduct(null)}
                    onClick={() => {
                      updateField("productId", "");
                      setDropdownOpen(false);
                      setProductSearch("");
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition hover:bg-neutral-50 ${
                      !form.productId ? "bg-neutral-100 font-semibold text-black" : "text-neutral-800"
                    }`}
                  >
                    <span>General wholesale inquiry</span>
                    {!form.productId && <Check size={14} />}
                  </button>

                  {/* Products */}
                  {filteredProducts.map((item) => {
                    const isSelected = form.productId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setHoveredProduct(item)}
                        onClick={() => {
                          updateField("productId", item.id);
                          setDropdownOpen(false);
                          setProductSearch("");
                          // Revalidate quantity against product MOQ
                          if (form.quantity) {
                            const err = validateField("quantity", form.quantity, item);
                            setErrors((prev) => ({ ...prev, quantity: err || undefined }));
                          }
                        }}
                        className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition hover:bg-neutral-50 ${
                          isSelected ? "bg-neutral-100 font-semibold text-black" : "text-neutral-800"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                            MOQ: {item.moq.toLocaleString()} pcs
                          </p>
                        </div>
                        {isSelected && <Check size={14} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hover Image Preview Pane (Desktop) */}
              <div className="hidden sm:flex sm:w-44 flex-col items-center justify-center p-3.5 bg-neutral-50 text-center">
                {hoveredProduct ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[3/4] w-36 overflow-hidden bg-neutral-200 border border-neutral-200 shadow-2xs">
                      {hoveredProduct.images?.[0]?.url ? (
                        <img
                          src={hoveredProduct.images[0].url}
                          alt={hoveredProduct.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 line-clamp-1">
                        {hoveredProduct.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        MOQ: {hoveredProduct.moq.toLocaleString()} pcs
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400 py-6">
                    <Layers size={28} strokeWidth={1.3} />
                    <p className="mt-2 text-[11px] font-medium text-neutral-600">
                      General inquiry
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Hover over any apparel item to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedProduct && (
            <span className="mt-1 block text-[11px] text-neutral-500">
              Minimum order quantity: {selectedProduct.moq.toLocaleString()} units
            </span>
          )}
        </div>

        {/* Estimated Quantity */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Estimated quantity
          </label>
          <input
            type="number"
            min={selectedProduct?.moq ?? 1}
            step={1}
            value={form.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
            onBlur={() => handleBlur("quantity")}
            placeholder={selectedProduct ? `e.g. ${selectedProduct.moq}` : "e.g. 500"}
            className={inputClass("quantity")}
          />
          {touched.quantity && errors.quantity && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.quantity}
            </p>
          )}
        </div>

        {/* Custom Branding Checkbox */}
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 border border-neutral-200 p-3.5 cursor-pointer hover:border-neutral-300 transition">
            <input
              type="checkbox"
              checked={form.customBranding}
              onChange={(e) => updateField("customBranding", e.target.checked)}
              className="mt-0.5 size-4 accent-neutral-950"
            />
            <div>
              <span className="block text-xs font-medium text-neutral-900">
                I&apos;m interested in custom branding
              </span>
              <span className="block text-[11px] text-neutral-500 mt-0.5">
                Private labels, printing, embroidery, or custom packaging.
              </span>
            </div>
          </label>
        </div>

        {/* Requirements */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700">
            Requirements
          </label>
          <textarea
            rows={4}
            maxLength={2000}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Sizes, colors, delivery expectations, or other requirements..."
            className="mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 resize-y"
          />
          <span className="mt-1 block text-right text-[11px] text-neutral-400">
            {form.message.length}/2000
          </span>
        </div>
      </div>

      {/* Submit Section */}
      <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          Fields marked * are required.
        </p>

        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center justify-center gap-3 bg-[#111] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white transition hover:bg-[#292929] disabled:opacity-50"
        >
          {sending ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              REQUEST A QUOTE
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
