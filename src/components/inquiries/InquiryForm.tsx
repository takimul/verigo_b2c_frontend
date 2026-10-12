// "use client";
// import { useEffect, useState, type FormEvent } from "react";
// import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
// import { toast } from "sonner";
// import api from "@/lib/api";
// import { createInquiry } from "@/services/inquiries";
// import type { InquiryInput } from "@/types/inquiry";
// import type { Product } from "@/types/product";

// type Props = {
//   initialProductId?: string;
//   compact?: boolean;
//   onSuccess?: () => void;
// };
// export default function InquiryForm({
//   initialProductId = "",
//   compact = false,
//   onSuccess,
// }: Props) {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [form, setForm] = useState({
//     productId: initialProductId,
//     name: "",
//     companyName: "",
//     email: "",
//     phone: "",
//     country: "",
//     quantity: "",
//     customBranding: false,
//     message: "",
//   });
//   useEffect(() => {
//     let live = true;
//     api
//       .get("/products", { params: { limit: 100 } })
//       .then((r) => {
//         const d = r.data?.data;
//         const list = Array.isArray(d)
//           ? d
//           : Array.isArray(d?.items)
//             ? d.items
//             : [];
//         if (live)
//           setProducts(list.filter((x: Product) => x.status === "ACTIVE"));
//       })
//       .catch((e) => {
//         console.error(e);
//       })
//       .finally(() => {
//         if (live) setLoadingProducts(false);
//       });
//     return () => {
//       live = false;
//     };
//   }, []);
//   useEffect(() => {
//     if (initialProductId)
//       setForm((s) => ({ ...s, productId: initialProductId }));
//   }, [initialProductId]);
//   const product = products.find((p) => p.id === form.productId);
//   const qty = form.quantity.trim() ? Number(form.quantity) : undefined;
//   const tooLow = !!product && qty !== undefined && qty < product.moq;
//   function field<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
//     setForm((s) => ({ ...s, [key]: value }));
//   }
//   const input =
//     "mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-neutral-950";
//   async function submit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (qty !== undefined && (!Number.isInteger(qty) || qty <= 0)) {
//       toast.error("Enter a valid whole-number quantity.");
//       return;
//     }
//     if (product && qty !== undefined && qty < product.moq) {
//       toast.error(`Minimum order quantity is ${product.moq}.`);
//       return;
//     }
//     const payload: InquiryInput = {
//       ...(form.productId ? { productId: form.productId } : {}),
//       name: form.name.trim(),
//       ...(form.companyName.trim()
//         ? { companyName: form.companyName.trim() }
//         : {}),
//       email: form.email.trim(),
//       phone: form.phone.trim(),
//       ...(form.country.trim() ? { country: form.country.trim() } : {}),
//       ...(qty !== undefined ? { quantity: qty } : {}),
//       customBranding: form.customBranding,
//       ...(form.message.trim() ? { message: form.message.trim() } : {}),
//     };
//     setSending(true);
//     try {
//       await createInquiry(payload);
//       setSent(true);
//       toast.success("Inquiry submitted successfully.");
//       onSuccess?.();
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Could not submit inquiry.",
//       );
//     } finally {
//       setSending(false);
//     }
//   }
//   if (sent)
//     return (
//       <div className="border border-neutral-200 bg-white p-8 text-center">
//         <CheckCircle2 size={34} className="mx-auto" />
//         <h2 className="mt-4 text-xl font-semibold">
//           Thank you for your inquiry
//         </h2>
//         <p className="mt-2 text-sm leading-6 text-neutral-600">
//           Your request has been received. Our team will contact you.
//         </p>
//         <button
//           className="mt-5 border border-neutral-300 px-4 py-2 text-sm"
//           onClick={() => {
//             setSent(false);
//             setForm({
//               productId: initialProductId,
//               name: "",
//               companyName: "",
//               email: "",
//               phone: "",
//               country: "",
//               quantity: "",
//               customBranding: false,
//               message: "",
//             });
//           }}
//         >
//           Submit another inquiry
//         </button>
//       </div>
//     );
//   return (
//     <form
//       onSubmit={submit}
//       className={`border border-neutral-200 bg-white ${compact ? "p-4" : "p-5 sm:p-8"}`}
//     >
//       <div className="grid gap-5 sm:grid-cols-2">
//         <label className="text-sm font-medium">
//           Full name *
//           <input
//             required
//             minLength={2}
//             maxLength={100}
//             autoComplete="name"
//             className={input}
//             value={form.name}
//             onChange={(e) => field("name", e.target.value)}
//             placeholder="Your full name"
//           />
//         </label>
//         <label className="text-sm font-medium">
//           Company name
//           <input
//             maxLength={150}
//             autoComplete="organization"
//             className={input}
//             value={form.companyName}
//             onChange={(e) => field("companyName", e.target.value)}
//             placeholder="Business or company"
//           />
//         </label>
//         <label className="text-sm font-medium">
//           Business email *
//           <input
//             required
//             type="email"
//             maxLength={150}
//             autoComplete="email"
//             className={input}
//             value={form.email}
//             onChange={(e) => field("email", e.target.value)}
//             placeholder="you@company.com"
//           />
//         </label>
//         <label className="text-sm font-medium">
//           Phone / WhatsApp *
//           <input
//             required
//             minLength={5}
//             maxLength={30}
//             type="tel"
//             autoComplete="tel"
//             className={input}
//             value={form.phone}
//             onChange={(e) => field("phone", e.target.value)}
//             placeholder="+880..."
//           />
//         </label>
//         <label className="text-sm font-medium">
//           Country
//           <input
//             maxLength={100}
//             autoComplete="country-name"
//             className={input}
//             value={form.country}
//             onChange={(e) => field("country", e.target.value)}
//             placeholder="Your country"
//           />
//         </label>
//         <label className="text-sm font-medium">
//           Product
//           <select
//             className={input}
//             value={form.productId}
//             disabled={loadingProducts}
//             onChange={(e) => field("productId", e.target.value)}
//           >
//             <option value="">General wholesale inquiry</option>
//             {products.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>
//           {product && (
//             <span className="mt-1 block text-xs text-neutral-500">
//               Minimum order: {product.moq.toLocaleString()} units
//             </span>
//           )}
//         </label>
//         <label className="text-sm font-medium">
//           Estimated quantity
//           <input
//             type="number"
//             min={product?.moq ?? 1}
//             step={1}
//             className={input}
//             value={form.quantity}
//             onChange={(e) => field("quantity", e.target.value)}
//             placeholder={product ? `Minimum ${product.moq}` : "e.g. 500"}
//           />
//           {tooLow && (
//             <span className="text-xs text-red-700">
//               Minimum quantity is {product?.moq}.
//             </span>
//           )}
//         </label>
//         <label className="flex items-start gap-3 border border-neutral-200 p-3.5 text-sm sm:col-span-2">
//           <input
//             type="checkbox"
//             className="mt-0.5 size-4 accent-neutral-950"
//             checked={form.customBranding}
//             onChange={(e) => field("customBranding", e.target.checked)}
//           />
//           <span>
//             <span className="font-medium">
//               I'm interested in custom branding
//             </span>
//             <span className="mt-1 block text-xs text-neutral-500">
//               Private labels, printing, embroidery, or custom packaging.
//             </span>
//           </span>
//         </label>
//         <label className="text-sm font-medium sm:col-span-2">
//           Requirements
//           <textarea
//             maxLength={2000}
//             className={`${input} min-h-32 resize-y`}
//             value={form.message}
//             onChange={(e) => field("message", e.target.value)}
//             placeholder="Sizes, colors, delivery expectations, or other requirements..."
//           />
//           <span className="mt-1 block text-right text-xs text-neutral-400">
//             {form.message.length}/2000
//           </span>
//         </label>
//       </div>
//       <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
//         <p className="text-xs text-neutral-500">
//           Fields marked * are required.
//         </p>
//         <button
//           type="submit"
//           disabled={sending || tooLow}
//           className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
//         >
//           {sending ? (
//             <LoaderCircle size={16} className="animate-spin" />
//           ) : (
//             <Send size={16} />
//           )}
//           {sending ? "Submitting..." : "Submit inquiry"}
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { getProducts } from "@/services/products";
import { createInquiry } from "@/services/inquiries";
import type { Product } from "@/types/product";
import type { InquiryInput } from "@/types/inquiry";

interface Props {
  initialProductId?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

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

const createInitialForm = (productId = ""): FormState => ({
  productId,
  name: "",
  companyName: "",
  email: "",
  phone: "",
  country: "",
  quantity: "",
  customBranding: false,
  message: "",
});

export default function InquiryForm({
  initialProductId = "",
  compact = false,
  onSuccess,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productLoadError, setProductLoadError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormState>(() =>
    createInitialForm(initialProductId),
  );

  useEffect(() => {
    setForm((current) => ({
      ...current,
      productId: initialProductId,
    }));
  }, [initialProductId]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoadingProducts(true);
      setProductLoadError(false);

      try {
        const response = await getProducts({ limit: 100 });
        const items = response.data?.items ?? [];

        if (active) {
          setProducts(items.filter((product) => product.status === "ACTIVE"));
        }
      } catch (error) {
        console.error("Failed to load inquiry products:", error);

        if (active) {
          setProductLoadError(true);
          toast.error(
            "Could not load products. You can still submit a general inquiry.",
          );
        }
      } finally {
        if (active) setLoadingProducts(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const product = useMemo(
    () => products.find((item) => item.id === form.productId),
    [products, form.productId],
  );

  const quantity = form.quantity.trim() ? Number(form.quantity) : undefined;

  const invalidQuantity =
    quantity !== undefined &&
    (!Number.isSafeInteger(quantity) || quantity <= 0);

  const tooLow =
    !!product &&
    quantity !== undefined &&
    Number.isSafeInteger(quantity) &&
    quantity > 0 &&
    quantity < product.moq;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const inputClass =
    "mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    if (form.productId && !product) {
      toast.error(
        loadingProducts
          ? "Please wait while products load."
          : "The selected product is unavailable. Please select another product.",
      );
      return;
    }

    if (form.quantity.trim() && invalidQuantity) {
      toast.error("Enter a valid positive whole-number quantity.");
      return;
    }

    if (product && quantity !== undefined && quantity < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq}.`);
      return;
    }

    const payload: InquiryInput = {
      ...(form.productId ? { productId: form.productId } : {}),
      name: form.name.trim(),
      ...(form.companyName.trim()
        ? { companyName: form.companyName.trim() }
        : {}),
      email: form.email.trim(),
      phone: form.phone.trim(),
      ...(form.country.trim() ? { country: form.country.trim() } : {}),
      ...(quantity !== undefined ? { quantity } : {}),
      customBranding: form.customBranding,
      ...(form.message.trim() ? { message: form.message.trim() } : {}),
    };

    setSending(true);

    try {
      await createInquiry(payload);
      setSent(true);
      toast.success("Inquiry submitted successfully.");
      onSuccess?.();
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit inquiry. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-neutral-200 bg-white p-8 text-center">
        <CheckCircle2 size={34} className="mx-auto text-neutral-950" />

        <h2 className="mt-4 text-xl font-semibold text-neutral-950">
          Thank you for your inquiry
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Your request has been received. Our team will contact you.
        </p>

        <button
          type="button"
          className="mt-5 border border-neutral-300 px-4 py-2 text-sm transition-colors hover:border-neutral-950"
          onClick={() => {
            setForm(createInitialForm(initialProductId));
            setSent(false);
          }}
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`border border-neutral-200 bg-white ${
        compact ? "p-4" : "p-5 sm:p-8"
      }`}
    >
      {productLoadError && (
        <p
          role="status"
          className="mb-5 border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700"
        >
          Product options could not be loaded. You can submit a general inquiry,
          or refresh the page to try loading products again.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Full name <span aria-hidden="true">*</span>
          <input
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className={inputClass}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your full name"
          />
        </label>

        <label className="text-sm font-medium">
          Company name
          <input
            maxLength={150}
            autoComplete="organization"
            className={inputClass}
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder="Business or company"
          />
        </label>

        <label className="text-sm font-medium">
          Business email <span aria-hidden="true">*</span>
          <input
            required
            type="email"
            maxLength={150}
            autoComplete="email"
            className={inputClass}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@company.com"
          />
        </label>

        <label className="text-sm font-medium">
          Phone / WhatsApp <span aria-hidden="true">*</span>
          <input
            required
            minLength={5}
            maxLength={30}
            type="tel"
            autoComplete="tel"
            className={inputClass}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+880..."
          />
        </label>

        <label className="text-sm font-medium">
          Country
          <input
            maxLength={100}
            autoComplete="country-name"
            className={inputClass}
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
            placeholder="Your country"
          />
        </label>

        <label className="text-sm font-medium">
          Product
          <select
            className={inputClass}
            value={form.productId}
            disabled={loadingProducts || productLoadError}
            onChange={(event) => {
              updateField("productId", event.target.value);
              updateField("quantity", "");
            }}
          >
            <option value="">General wholesale inquiry</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {product && (
            <span className="mt-1 block text-xs text-neutral-500">
              Minimum order: {product.moq.toLocaleString()} units
            </span>
          )}
          {!loadingProducts &&
            !productLoadError &&
            form.productId &&
            !product && (
              <span className="mt-1 block text-xs text-neutral-600">
                This product is unavailable. Please select another product.
              </span>
            )}
        </label>

        <label className="text-sm font-medium">
          Estimated quantity
          <input
            type="number"
            min={product?.moq ?? 1}
            step={1}
            inputMode="numeric"
            className={inputClass}
            value={form.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
            placeholder={product ? `Minimum ${product.moq}` : "e.g. 500"}
          />
          {tooLow && (
            <span className="mt-1 block text-xs text-red-700">
              Minimum quantity is {product?.moq}.
            </span>
          )}
        </label>

        <label className="flex items-start gap-3 border border-neutral-200 p-3.5 text-sm sm:col-span-2">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-neutral-950"
            checked={form.customBranding}
            onChange={(event) =>
              updateField("customBranding", event.target.checked)
            }
          />

          <span>
            <span className="font-medium">
              I&apos;m interested in custom branding
            </span>
            <span className="mt-1 block text-xs text-neutral-500">
              Private labels, printing, embroidery, or custom packaging.
            </span>
          </span>
        </label>

        <label className="text-sm font-medium sm:col-span-2">
          Requirements
          <textarea
            maxLength={2000}
            className={`${inputClass} min-h-32 resize-y`}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Sizes, colors, delivery expectations, or other requirements..."
          />
          <span className="mt-1 block text-right text-xs text-neutral-400">
            {form.message.length}/2000
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          Fields marked * are required.
        </p>

        <button
          type="submit"
          disabled={
            sending ||
            loadingProducts ||
            !!productLoadError ||
            tooLow ||
            invalidQuantity ||
            (!!form.productId && !product)
          }
          className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {sending ? "Submitting..." : "Submit inquiry"}
        </button>
      </div>
    </form>
  );
}
