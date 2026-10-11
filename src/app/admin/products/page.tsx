"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Edit3,
  LoaderCircle,
  Package,
  Search,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductStatus } from "@/types/product";
import {
  archiveProduct,
  getAdminProducts,
  getProductCategories,
  type ProductCategory,
  type ProductPagination,
} from "@/services/products";
import ProductForm from "@/components/admin/products/ProductForm";

type ViewMode = "list" | "create" | "edit";

const statuses: Array<{ label: string; value: ProductStatus | "" }> = [
  { label: "All statuses", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

const initialPagination: ProductPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function statusClass(status: ProductStatus) {
  if (status === "ACTIVE") return "bg-neutral-950 text-white";
  if (status === "ARCHIVED") return "bg-neutral-200 text-neutral-600";
  return "border border-neutral-300 bg-white text-neutral-700";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [pagination, setPagination] =
    useState<ProductPagination>(initialPagination);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState("");
  const [page, setPage] = useState(1);

  const [mode, setMode] = useState<ViewMode>("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const [archiving, setArchiving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await getAdminProducts({
        page,
        limit: 20,
        search: search.trim() || undefined,
        status: status || undefined,
        categoryId: categoryId || undefined,
        featured: featured === "" ? undefined : featured === "true",
      });

      setProducts(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);
      setLoadError(
        "Could not load products. Check your admin session and API connection.",
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, categoryId, featured]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    getProductCategories()
      .then(setCategories)
      .catch((error) => {
        console.error(error);
        toast.error("Could not load categories.");
      });
  }, []);

  function resetFilters() {
    setSearch("");
    setStatus("");
    setCategoryId("");
    setFeatured("");
    setPage(1);
  }

  function openCreate() {
    setSelectedProduct(null);
    setMode("create");
  }

  function openEdit(product: Product) {
    setSelectedProduct(product);
    setMode("edit");
  }

  async function handleSaved() {
    await loadProducts();
  }

  async function handleArchive() {
    if (!archiveTarget) return;

    setArchiving(true);
    try {
      await archiveProduct(archiveTarget.id);
      toast.success("Product archived.");
      setArchiveTarget(null);
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast.error(
        "Could not archive this product. This action may require Super Admin permission.",
      );
    } finally {
      setArchiving(false);
    }
  }

  if (mode !== "list") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <ProductForm
          key={selectedProduct?.id ?? "new-product"}
          product={mode === "edit" ? selectedProduct : null}
          onSaved={handleSaved}
          onCancel={() => {
            setMode("list");
            setSelectedProduct(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
            Catalogue management
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Products
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Manage your wholesale catalogue, product specifications, visibility,
            and images.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <CirclePlus size={17} />
          Add product
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <Package size={16} />
            <span className="text-xs uppercase tracking-wider">
              Products found
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-neutral-950">
            {pagination.total}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <Star size={16} />
            <span className="text-xs uppercase tracking-wider">
              Featured filter
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-neutral-950">
            {featured === "true"
              ? "Featured only"
              : featured === "false"
                ? "Not featured"
                : "All products"}
          </p>
        </div>

        <div className="col-span-2 border border-neutral-200 bg-white p-4 lg:col-span-1">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Current page
          </p>
          <p className="mt-3 text-sm font-medium text-neutral-950">
            {pagination.totalPages
              ? `${pagination.page} of ${pagination.totalPages}`
              : "No pages"}
          </p>
        </div>
      </div>

      <section className="mt-6 border border-neutral-200 bg-white">
        <div className="grid gap-3 border-b border-neutral-200 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))_auto]">
          <label className="relative block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="w-full border border-neutral-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-950"
            />
          </label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ProductStatus | "");
              setPage(1);
            }}
            className="border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            {statuses.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setPage(1);
            }}
            className="border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={featured}
            onChange={(event) => {
              setFeatured(event.target.value);
              setPage(1);
            }}
            className="border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            <option value="">All featured states</option>
            <option value="true">Featured</option>
            <option value="false">Not featured</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <X size={15} />
            Reset
          </button>
        </div>

        {loadError && (
          <div className="m-4 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{loadError}</p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16">
              <LoaderCircle
                size={24}
                className="animate-spin text-neutral-700"
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-200 border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">MOQ</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {!loading && products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Package size={25} className="mx-auto text-neutral-300" />
                      <p className="mt-3 text-sm font-medium text-neutral-800">
                        No products found
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Try changing your filters or create a product.
                      </p>
                    </td>
                  </tr>
                )}

                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-neutral-50/70"
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-60 items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">
                          {product.images[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].altText || product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-neutral-400">
                              <Package size={20} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-xs truncate text-sm font-semibold text-neutral-950">
                            {product.name}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-neutral-500">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-neutral-700">
                      {product.category?.name || "Uncategorised"}
                    </td>

                    <td className="px-4 py-3 text-sm tabular-nums text-neutral-700">
                      {product.moq.toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusClass(product.status)}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {product.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900">
                          <Star size={14} fill="currentColor" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-800 hover:border-neutral-950 hover:bg-neutral-50"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        {product.status !== "ARCHIVED" && (
                          <button
                            type="button"
                            aria-label={`Archive ${product.name}`}
                            onClick={() => setArchiveTarget(product)}
                            className="border border-neutral-300 p-2 text-neutral-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                          >
                            <Archive size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Showing {products.length ? (page - 1) * pagination.limit + 1 : 0}
            {"–"}
            {(page - 1) * pagination.limit + products.length} of{" "}
            {pagination.total} products
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={15} />
              Previous
            </button>
            <span className="min-w-16 text-center text-xs tabular-nums text-neutral-600">
              {pagination.totalPages
                ? `${page} / ${pagination.totalPages}`
                : "0 / 0"}
            </span>
            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination.totalPages, current + 1),
                )
              }
              className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {archiveTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !archiving) {
              setArchiveTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-product-title"
            className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 items-center justify-center bg-neutral-100">
                <Archive size={19} className="text-neutral-800" />
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                disabled={archiving}
                onClick={() => setArchiveTarget(null)}
                className="p-1 text-neutral-500 hover:text-neutral-950 disabled:opacity-40"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="archive-product-title"
              className="mt-5 text-lg font-semibold text-neutral-950"
            >
              Archive this product?
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              <span className="font-medium text-neutral-950">
                {archiveTarget.name}
              </span>{" "}
              will be marked as archived and removed from the active catalogue.
              This action requires Super Admin permission.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={archiving}
                onClick={() => setArchiveTarget(null)}
                className="border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={archiving}
                onClick={() => void handleArchive()}
                className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {archiving && (
                  <LoaderCircle size={15} className="animate-spin" />
                )}
                Archive product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
