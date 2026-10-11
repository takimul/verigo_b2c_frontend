"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductStatus } from "@/types/product";
import {
  createProduct,
  getAdminProductById,
  getProductCategories,
  updateProduct,
  type ProductCategory,
  type ProductInput,
} from "@/services/products";
import ProductImageManager from "./ProductImageManager";

interface ProductFormProps {
  product?: Product | null;
  onSaved: () => Promise<void> | void;
  onCancel: () => void;
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  fabric: string;
  gsm: string;
  composition: string;
  washingInfo: string;
  sizes: string;
  colors: string;
  moq: string;
  customization: ProductInput["customization"];
  status: ProductStatus;
  isFeatured: boolean;
  customFabric: boolean;
  customColor: boolean;
  customPrinting: boolean;
  customEmbroidery: boolean;
  customNeckLabel: boolean;
  customPackaging: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  fabric: "",
  gsm: "",
  composition: "",
  washingInfo: "",
  sizes: "",
  colors: "",
  moq: "100",
  customization: "AVAILABLE_ON_REQUEST",
  status: "DRAFT",
  isFeatured: false,
  customFabric: false,
  customColor: false,
  customPrinting: false,
  customEmbroidery: false,
  customNeckLabel: false,
  customPackaging: false,
};

const customizationOptions: FormState["customization"][] = [
  "YES",
  "NO",
  "AVAILABLE_ON_REQUEST",
];

const statusOptions: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitList(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function inputFromProduct(product: Product): FormState {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    categoryId: product.category.id,
    fabric: product.fabric ?? "",
    gsm: product.gsm?.toString() ?? "",
    composition: product.composition ?? "",
    washingInfo: product.washingInfo ?? "",
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    moq: String(product.moq),
    customization: product.customization,
    status: product.status,
    isFeatured: product.isFeatured,
    customFabric: product.customFabric,
    customColor: product.customColor,
    customPrinting: product.customPrinting,
    customEmbroidery: product.customEmbroidery,
    customNeckLabel: product.customNeckLabel,
    customPackaging: product.customPackaging,
  };
}

const fieldClass =
  "mt-1.5 w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950";

const labelClass = "block text-sm font-medium text-neutral-800";

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  min?: number;
}) {
  return (
    <label className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-600">*</span>}
      <input
        type={type}
        min={min}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

export default function ProductForm({
  product,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(
    product ? inputFromProduct(product) : emptyForm,
  );
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [savedProduct, setSavedProduct] = useState<Product | null>(
    product ?? null,
  );
  const [slugEdited, setSlugEdited] = useState(Boolean(product));

  useEffect(() => {
    let active = true;

    getProductCategories()
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Could not load product categories.");
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function change<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "name" && !slugEdited) {
        next.slug = toSlug(String(value));
      }

      return next;
    });
  }

  async function refreshSavedProduct(id: string) {
    const response = await getAdminProductById(id);
    setSavedProduct(response.data);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.categoryId) {
      toast.error("Please select a product category.");
      return;
    }

    const moq = Number(form.moq);
    const gsm = form.gsm.trim() === "" ? null : Number(form.gsm);

    if (!Number.isInteger(moq) || moq <= 0) {
      toast.error("MOQ must be a positive whole number.");
      return;
    }

    if (gsm !== null && (!Number.isInteger(gsm) || gsm <= 0)) {
      toast.error("GSM must be a positive whole number.");
      return;
    }

    const payload: ProductInput = {
      name: form.name.trim(),
      slug: toSlug(form.slug),
      description: form.description.trim() || null,
      categoryId: form.categoryId,
      fabric: form.fabric.trim() || null,
      gsm,
      composition: form.composition.trim() || null,
      washingInfo: form.washingInfo.trim() || null,
      sizes: splitList(form.sizes),
      colors: splitList(form.colors),
      moq,
      customization: form.customization,
      customFabric: form.customFabric,
      customColor: form.customColor,
      customPrinting: form.customPrinting,
      customEmbroidery: form.customEmbroidery,
      customNeckLabel: form.customNeckLabel,
      customPackaging: form.customPackaging,
      isFeatured: form.isFeatured,
      status: form.status,
    };

    if (payload.slug.length < 2) {
      toast.error("Please enter a valid product slug.");
      return;
    }

    setSaving(true);

    try {
      if (savedProduct) {
        await updateProduct(savedProduct.id, payload);
        await refreshSavedProduct(savedProduct.id);
        toast.success("Product updated.");
      } else {
        const response = await createProduct(payload);
        const created = response.data;
        setSavedProduct(created);
        toast.success("Product created. You can now add images.");
      }

      await onSaved();
    } catch (error) {
      console.error(error);
      toast.error(
        "Could not save the product. Check the fields and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const checkboxOptions: {
    key: keyof Pick<
      FormState,
      | "customFabric"
      | "customColor"
      | "customPrinting"
      | "customEmbroidery"
      | "customNeckLabel"
      | "customPackaging"
      | "isFeatured"
    >;
    label: string;
  }[] = [
    { key: "customFabric", label: "Custom fabric" },
    { key: "customColor", label: "Custom color" },
    { key: "customPrinting", label: "Custom printing" },
    { key: "customEmbroidery", label: "Custom embroidery" },
    { key: "customNeckLabel", label: "Custom neck label" },
    { key: "customPackaging", label: "Custom packaging" },
    { key: "isFeatured", label: "Feature this product" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Product catalogue
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
            {savedProduct ? "Edit product" : "Create product"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {savedProduct
              ? "Update product details and manage its images."
              : "Add a product to your wholesale catalogue."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Back to products
        </button>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Basic information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Product name"
            value={form.name}
            required
            placeholder="e.g. Premium Cotton T-Shirt"
            onChange={(value) => change("name", value)}
          />

          <TextField
            label="Product slug"
            value={form.slug}
            required
            placeholder="premium-cotton-t-shirt"
            onChange={(value) => {
              setSlugEdited(true);
              change("slug", toSlug(value));
            }}
          />

          <label className={labelClass}>
            Category <span className="text-red-600">*</span>
            <select
              required
              disabled={loadingCategories}
              value={form.categoryId}
              onChange={(event) => change("categoryId", event.target.value)}
              className={fieldClass}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                change("status", event.target.value as ProductStatus)
              }
              className={fieldClass}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          Description
          <textarea
            rows={4}
            maxLength={5000}
            value={form.description}
            onChange={(event) => change("description", event.target.value)}
            placeholder="Describe the product, fit, use case, and wholesale details..."
            className={fieldClass}
          />
          <span className="mt-1 block text-right text-xs font-normal text-neutral-400">
            {form.description.length}/5000
          </span>
        </label>
      </section>

      <section className="space-y-4 border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Specifications
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Fabric"
            value={form.fabric}
            placeholder="100% cotton"
            onChange={(value) => change("fabric", value)}
          />
          <TextField
            label="GSM"
            value={form.gsm}
            type="number"
            min={1}
            placeholder="180"
            onChange={(value) => change("gsm", value)}
          />
          <TextField
            label="Composition"
            value={form.composition}
            placeholder="95% cotton, 5% elastane"
            onChange={(value) => change("composition", value)}
          />
          <TextField
            label="Minimum order quantity (MOQ)"
            value={form.moq}
            type="number"
            min={1}
            required
            onChange={(value) => change("moq", value)}
          />
          <TextField
            label="Available sizes"
            value={form.sizes}
            placeholder="S, M, L, XL, XXL"
            onChange={(value) => change("sizes", value)}
          />
          <TextField
            label="Available colors"
            value={form.colors}
            placeholder="Black, White, Navy"
            onChange={(value) => change("colors", value)}
          />
        </div>

        <label className={labelClass}>
          Washing information
          <textarea
            rows={2}
            maxLength={1000}
            value={form.washingInfo}
            onChange={(event) => change("washingInfo", event.target.value)}
            placeholder="Care instructions"
            className={fieldClass}
          />
        </label>
      </section>

      <section className="space-y-4 border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Customization
        </h3>

        <label className={labelClass}>
          Customization availability
          <select
            value={form.customization}
            onChange={(event) =>
              change(
                "customization",
                event.target.value as FormState["customization"],
              )
            }
            className={fieldClass}
          >
            {customizationOptions.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checkboxOptions.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 border border-neutral-200 px-3 py-3 text-sm text-neutral-800 transition hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                checked={form[key] as boolean}
                onChange={(event) => change(key, event.target.checked)}
                className="size-4 accent-neutral-950"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving
            ? "Saving..."
            : savedProduct
              ? "Save changes"
              : "Create product"}
        </button>
      </div>

      {savedProduct && (
        <ProductImageManager
          product={savedProduct}
          onChange={() => refreshSavedProduct(savedProduct.id)}
        />
      )}
    </form>
  );
}
