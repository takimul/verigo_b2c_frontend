"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CirclePlus,
  CornerDownRight,
  FolderTree,
  HelpCircle,
  ImagePlus,
  Info,
  Layers,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  deleteCategoryImage,
  getCategories,
  getCategoryById,
  updateCategory,
  uploadCategoryImage,
  type CategoryInput,
} from "@/services/categories";
import {
  getAdminProducts,
  getProducts,
  updateProduct,
} from "@/services/products";
import type { Category } from "@/types/category";

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string;
  sortOrder: string;
  isActive: boolean;
};

type ViewMode = "list" | "create" | "edit";

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  parentId: "",
  sortOrder: "0",
  isActive: true,
};

const inputClass =
  "mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-950 disabled:bg-neutral-100 transition";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-neutral-700";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toForm(category: Category): CategoryFormState {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    imageUrl: category.imageUrl ?? "",
    parentId: category.parentId ?? category.parent?.id ?? "",
    sortOrder: String(category.sortOrder ?? 0),
    isActive: category.isActive ?? true,
  };
}

function categoryInput(form: CategoryFormState): CategoryInput {
  return {
    name: form.name.trim(),
    slug: toSlug(form.slug),
    description: form.description.trim() || undefined,
    imageUrl: form.imageUrl.trim() || null,
    parentId: form.parentId || null,
    sortOrder: Number(form.sortOrder),
    isActive: form.isActive,
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [mode, setMode] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<Category | null>(null);

  // Delete modal states
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteResolution, setDeleteResolution] = useState<
    "reassign" | "cascade"
  >("reassign");
  const [reassignTargetId, setReassignTargetId] = useState<string>("");
  const [confirmCascade, setConfirmCascade] = useState<boolean>(false);

  // Form states
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const clearImageSelection = useCallback(() => {
    setSelectedImage(null);
    setImagePreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return "";
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load categories. Check your admin session.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // Available parent options for create/edit
  const parentOptions = useMemo(() => {
    return categories.filter((item) => {
      // Cannot choose self as parent
      if (selected && item.id === selected.id) return false;
      // Cannot choose children as parent
      if (selected && item.parentId === selected.id) return false;
      return true;
    });
  }, [categories, selected]);

  // Categories available for reassigning items
  const reassignOptions = useMemo(() => {
    if (!deleteTarget) return [];
    return categories.filter((item) => item.id !== deleteTarget.id);
  }, [categories, deleteTarget]);

  // Automatically default reassignTargetId to first available category
  useEffect(() => {
    if (deleteTarget && reassignOptions.length > 0 && !reassignTargetId) {
      setReassignTargetId(reassignOptions[0].id);
    }
  }, [deleteTarget, reassignOptions, reassignTargetId]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        (category.description ?? "").toLowerCase().includes(query);
      const matchesStatus =
        activeFilter === "all" ||
        (activeFilter === "active" && category.isActive) ||
        (activeFilter === "inactive" && !category.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, activeFilter]);

  const topLevelCount = categories.filter(
    (item) => !item.parentId && !item.parent,
  ).length;
  const subcategoryCount = categories.length - topLevelCount;

  function resetImageState() {
    clearImageSelection();
    setRemoveExistingImage(false);
  }

  function startCreate(preselectedParentId?: string) {
    resetImageState();
    setSelected(null);
    setForm({
      ...emptyForm,
      parentId: preselectedParentId || "",
    });
    setSlugManuallyEdited(false);
    setMode("create");
  }

  function startEdit(category: Category) {
    resetImageState();
    setSelected(category);
    setForm(toForm(category));
    setSlugManuallyEdited(true);
    setMode("edit");
  }

  function openDeleteModal(category: Category) {
    setDeleteTarget(category);
    setDeleteResolution("reassign");
    setConfirmCascade(false);
    const available = categories.filter((c) => c.id !== category.id);
    setReassignTargetId(available.length > 0 ? available[0].id : "");
  }

  function updateField<K extends keyof CategoryFormState>(
    key: K,
    value: CategoryFormState[K],
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugManuallyEdited) {
        next.slug = toSlug(String(value));
      }
      return next;
    });
  }

  function cancelForm() {
    resetImageState();
    setMode("list");
    setSelected(null);
  }

  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Choose a JPG, PNG, WebP, or AVIF image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("The image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    clearImageSelection();
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);
    setRemoveExistingImage(false);
  }

  function handleRemoveImageClick() {
    clearImageSelection();
    setRemoveExistingImage(true);
    updateField("imageUrl", "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sortOrder = Number(form.sortOrder);
    const slug = toSlug(form.slug);

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      toast.error("Sort order must be a non-negative whole number.");
      return;
    }
    if (form.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters.");
      return;
    }
    if (slug.length < 2) {
      toast.error("Slug must be at least 2 characters.");
      return;
    }
    if (
      form.imageUrl.trim() &&
      !/^https?:\/\/\S+$/i.test(form.imageUrl.trim())
    ) {
      toast.error("Enter a valid image URL.");
      return;
    }
    if (selected && form.parentId === selected.id) {
      toast.error("A category cannot be its own parent.");
      return;
    }

    setSaving(true);
    try {
      let categoryId = selected?.id;
      const payload = categoryInput(form);

      if (selected && removeExistingImage && !selectedImage) {
        setRemovingImage(true);
        try {
          await deleteCategoryImage(selected.id);
        } finally {
          setRemovingImage(false);
        }
      }

      if (selected) {
        await updateCategory(selected.id, payload);
      } else {
        const response = await createCategory(payload);
        categoryId = response.data.id;
      }

      if (selectedImage && categoryId) {
        setUploadingImage(true);
        try {
          await uploadCategoryImage(categoryId, selectedImage);
        } catch (uploadError) {
          console.error(uploadError);
          toast.error(
            "Category saved, but image upload failed. Edit to retry.",
          );
        } finally {
          setUploadingImage(false);
        }
      }

      toast.success(selected ? "Category updated." : "Category created.");
      resetImageState();
      setMode("list");
      setSelected(null);
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error(
        "Could not save category. Ensure slug is unique and fields are valid.",
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
      setRemovingImage(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    const productsCount = deleteTarget._count?.products ?? 0;
    const childrenCount = deleteTarget._count?.children ?? 0;
    const hasItems = productsCount > 0 || childrenCount > 0;

    let deleteOptions: { reassignToId?: string; cascade?: boolean } | undefined;

    if (hasItems) {
      if (deleteResolution === "reassign") {
        if (!reassignTargetId) {
          toast.error("Please select a category to reassign products to.");
          return;
        }
        deleteOptions = { reassignToId: reassignTargetId };
      } else {
        if (!confirmCascade) {
          toast.error("Please confirm deletion of all items in this category.");
          return;
        }
        deleteOptions = { cascade: true };
      }
    }

    setDeleting(true);
    try {
      if (hasItems && deleteResolution === "reassign" && reassignTargetId) {
        // Step 1: Collect all products assigned to this category
        const [catDetailRes, adminProdsRes, publicProdsRes] = await Promise.all(
          [
            getCategoryById(deleteTarget.id).catch(() => null),
            getAdminProducts({ categoryId: deleteTarget.id, limit: 100 }).catch(
              () => null,
            ),
            getProducts({ categoryId: deleteTarget.id, limit: 100 }).catch(
              () => null,
            ),
          ],
        );

        const productIds = new Set<string>();

        if (catDetailRes?.data?.products) {
          for (const p of catDetailRes.data.products) {
            productIds.add(p.id);
          }
        }

        if (adminProdsRes?.data?.items) {
          for (const p of adminProdsRes.data.items) {
            productIds.add(p.id);
          }
        }

        if (publicProdsRes?.data?.items) {
          for (const p of publicProdsRes.data.items) {
            productIds.add(p.id);
          }
        }

        // Step 2: Proactively reassign every product to the target category
        if (productIds.size > 0) {
          for (const prodId of productIds) {
            await updateProduct(prodId, { categoryId: reassignTargetId }).catch(
              (err) => {
                console.warn(`Could not reassign product ${prodId}:`, err);
              },
            );
          }
        }

        // Step 3: Reassign any subcategories whose parent was deleteTarget
        const childrenToMove = new Set<string>();
        if (catDetailRes?.data?.children) {
          for (const c of catDetailRes.data.children) {
            childrenToMove.add(c.id);
          }
        }
        for (const c of categories) {
          if (c.parentId === deleteTarget.id) {
            childrenToMove.add(c.id);
          }
        }

        for (const childId of childrenToMove) {
          await updateCategory(childId, { parentId: reassignTargetId }).catch(
            (err) => {
              console.warn(
                `Could not reassign child category ${childId}:`,
                err,
              );
            },
          );
        }
      } else if (hasItems && deleteResolution === "cascade") {
        // Cascade delete: if target category has items, clear them to prevent foreign key errors
        const [catDetailRes, adminProdsRes] = await Promise.all([
          getCategoryById(deleteTarget.id).catch(() => null),
          getAdminProducts({ categoryId: deleteTarget.id, limit: 100 }).catch(
            () => null,
          ),
        ]);

        const productIds = new Set<string>();
        if (catDetailRes?.data?.products) {
          for (const p of catDetailRes.data.products) productIds.add(p.id);
        }
        if (adminProdsRes?.data?.items) {
          for (const p of adminProdsRes.data.items) productIds.add(p.id);
        }

        if (reassignOptions.length > 0 && productIds.size > 0) {
          const fallbackCatId = reassignOptions[0].id;
          for (const prodId of productIds) {
            await updateProduct(prodId, { categoryId: fallbackCatId }).catch(
              () => null,
            );
          }
        }
      }

      // Step 4: Delete the category (which now has 0 products/children assigned)
      await deleteCategory(deleteTarget.id, deleteOptions);
      const targetCategoryName = categories.find(
        (c) => c.id === reassignTargetId,
      )?.name;
      toast.success(
        deleteResolution === "reassign" && targetCategoryName
          ? `Category "${deleteTarget.name}" deleted and items moved to "${targetCategoryName}".`
          : `Category "${deleteTarget.name}" deleted successfully.`,
      );
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Could not delete category.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  if (mode !== "list") {
    const displayedImage =
      imagePreview || (removeExistingImage ? "" : form.imageUrl);

    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Catalogue Management
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {selected ? `Edit: ${selected.name}` : "Create New Category"}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Organize top-level season collections or specific product
              subcategories.
            </p>
          </div>
          <button
            type="button"
            onClick={cancelForm}
            className="border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition"
          >
            ← Back to Categories
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Info */}
          <section className="space-y-4 border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
              Category Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Category Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Winter Essentials, Jackets, TEES"
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                URL Slug <span className="text-red-500">*</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    updateField("slug", toSlug(e.target.value));
                  }}
                  placeholder="e.g. winter-essentials, jackets"
                  className={inputClass}
                />
                <span className="mt-1 block text-[11px] font-normal text-neutral-400">
                  Used in URL: /categories/{form.slug || "slug"}
                </span>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <label className={labelClass}>
                Parent Category (Hierarchy)
                <select
                  value={form.parentId}
                  onChange={(e) => updateField("parentId", e.target.value)}
                  className={inputClass}
                >
                  <option value="">None (Top-Level Season Collection)</option>
                  {parentOptions.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      Under: {parent.name}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-[11px] font-normal text-neutral-500">
                  Select a parent to make this a subcategory (e.g. Jackets
                  inside Winter Essentials).
                </span>
              </label>

              <label className={labelClass}>
                Sort Order (Position)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.sortOrder}
                  onChange={(e) => updateField("sortOrder", e.target.value)}
                  className={inputClass}
                />
                <span className="mt-1 block text-[11px] font-normal text-neutral-500">
                  Lower numbers display first (e.g. Winter = 1, Summer = 2).
                </span>
              </label>
            </div>

            <label className={labelClass}>
              Description (Optional)
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief summary of what this category offers..."
                className={inputClass}
              />
            </label>
          </section>

          {/* Category Image */}
          <section className="space-y-4 border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
              Category Cover Image
            </h2>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative size-24 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">
                {displayedImage ? (
                  <Image
                    src={displayedImage}
                    alt="Category preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-neutral-400">
                    <ImagePlus size={24} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50">
                    <span className="flex items-center gap-1.5">
                      <Upload size={14} /> Upload image
                    </span>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleImageSelect}
                      className="sr-only"
                    />
                  </label>

                  {displayedImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImageClick}
                      className="border border-red-200 bg-white px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove image
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500">
                  JPG, PNG, WebP or AVIF up to 5MB. Displayed on homepage and
                  category cards.
                </p>
              </div>
            </div>
          </section>

          {/* Visibility */}
          <section className="border border-neutral-200 bg-white p-5 shadow-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="size-4 mt-0.5 accent-neutral-950"
              />
              <div>
                <span className="block text-sm font-semibold text-neutral-900">
                  Active in storefront
                </span>
                <span className="block text-xs text-neutral-500">
                  When enabled, this category and its items appear for website
                  visitors.
                </span>
              </div>
            </label>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cancelForm}
              className="border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage || removingImage}
              className="inline-flex items-center gap-2 bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {(saving || uploadingImage || removingImage) && (
                <LoaderCircle size={15} className="animate-spin" />
              )}
              {saving
                ? "Saving..."
                : selected
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Catalogue Management
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-neutral-950">
            Categories & Collections
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600">
            Manage Top-Level Collections (e.g. Winter Essentials, Summer
            Essentials) and their product subcategories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => startCreate()}
          className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Helpful Client Guidance Banner */}
      <div className="mt-5 border border-amber-200 bg-amber-50/70 p-4 rounded-xs text-xs text-amber-950 leading-5">
        <div className="flex items-start gap-2.5">
          <Info size={16} className="text-amber-700 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-amber-900 block mb-0.5">
              How Categories Work on the Storefront:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-900/90">
              <li>
                <strong>Top-Level Seasons:</strong> Set <em>Parent Category</em>{" "}
                to <u>None</u> (e.g. <strong>Winter Essentials</strong> with
                Sort Order 1, and <strong>Summer Essentials</strong> with Sort
                Order 2).
              </li>
              <li>
                <strong>Subcategories:</strong> Set <em>Parent Category</em> to
                the season (e.g. <strong>Jackets</strong> inside Winter
                Essentials, or <strong>TEES</strong> inside Summer Essentials).
              </li>
              <li>
                Use the <strong>+ Subcategory</strong> button on any row below
                to quickly add items inside that collection.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border border-neutral-200 bg-white p-4">
          <Layers size={16} className="text-neutral-500" />
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-950">
            {categories.length}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            Total Categories
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4">
          <FolderTree size={16} className="text-neutral-500" />
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-950">
            {topLevelCount}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            Top-Level Seasons
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4">
          <CornerDownRight size={16} className="text-neutral-500" />
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-950">
            {subcategoryCount}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            Subcategories
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4">
          <Check size={16} className="text-neutral-500" />
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-950">
            {categories.filter((c) => c.isActive).length}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            Active on Store
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border border-neutral-200 bg-white p-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug or description..."
            className="w-full pl-9 pr-3 py-1.5 text-xs outline-none bg-neutral-50 border border-neutral-200 focus:border-neutral-950 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-neutral-950"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>

          {(search || activeFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <div className="mt-3 border border-neutral-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Category Name</th>
                <th className="px-4 py-3">Hierarchy Level</th>
                <th className="px-4 py-3 text-center">Products</th>
                <th className="px-4 py-3 text-center">Sort Order</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-neutral-100">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xs bg-neutral-200" />
                        <div className="space-y-1.5">
                          <div className="h-4 w-36 rounded-xs bg-neutral-200" />
                          <div className="h-2.5 w-20 rounded-xs bg-neutral-200" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-3.5 w-32 rounded-xs bg-neutral-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="mx-auto h-5 w-8 rounded-xs bg-neutral-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="mx-auto h-3.5 w-6 rounded-xs bg-neutral-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="mx-auto h-5 w-16 rounded-xs bg-neutral-200" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto h-8 w-28 rounded-xs bg-neutral-200" />
                    </td>
                  </tr>
                ))}

              {!loading && filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-neutral-500"
                  >
                    No categories found. Click &quot;Add Category&quot; to get
                    started.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCategories.map((category) => {
                  const isTopLevel = !category.parentId && !category.parent;
                  const parentName =
                    category.parent?.name ||
                    categories.find((c) => c.id === category.parentId)?.name;
                  const prodCount = category._count?.products ?? 0;
                  const childCount = category._count?.children ?? 0;

                  return (
                    <tr
                      key={category.id}
                      className="transition hover:bg-neutral-50/80"
                    >
                      {/* Name & Cover */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">
                            {category.imageUrl ? (
                              <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-neutral-400">
                                <FolderTree size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-950 flex items-center gap-1.5">
                              {category.name}
                              {isTopLevel && (
                                <span className="rounded-xs bg-neutral-900 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                                  Top Level
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              /{category.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Hierarchy Level */}
                      <td className="px-4 py-3 text-xs">
                        {isTopLevel ? (
                          <span className="text-neutral-700 font-medium">
                            Season Collection ({childCount} subcategories)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-neutral-600">
                            <CornerDownRight
                              size={13}
                              className="text-neutral-400"
                            />
                            Subcategory of{" "}
                            <strong>{parentName || "Parent"}</strong>
                          </span>
                        )}
                      </td>

                      {/* Products Count */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-neutral-800">
                          {prodCount}
                        </span>
                      </td>

                      {/* Sort Order */}
                      <td className="px-4 py-3 text-center text-xs tabular-nums text-neutral-700">
                        {category.sortOrder ?? 0}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            category.isActive
                              ? "bg-neutral-950 text-white"
                              : "border border-neutral-300 text-neutral-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isTopLevel && (
                            <button
                              type="button"
                              onClick={() => startCreate(category.id)}
                              title="Add subcategory inside this season"
                              className="inline-flex items-center gap-1 border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-950 hover:bg-neutral-50"
                            >
                              <Plus size={12} />
                              Subcategory
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => startEdit(category)}
                            className="inline-flex items-center gap-1 border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-950 hover:bg-neutral-50"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>

                          <button
                            type="button"
                            aria-label={`Delete ${category.name}`}
                            onClick={() => openDeleteModal(category)}
                            className="border border-neutral-200 bg-white p-1 text-neutral-400 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      {/* Intelligent Delete Modal (Prevents 409 Conflict Errors) */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-modal-title"
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 bg-white p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center bg-red-100 text-red-700">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h2
                    id="delete-category-modal-title"
                    className="text-base font-bold text-neutral-950"
                  >
                    Delete Category: {deleteTarget.name}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    ID: {deleteTarget.id} · Slug: /{deleteTarget.slug}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close dialog"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Check if category has items */}
            {(deleteTarget._count?.products ?? 0) > 0 ||
            (deleteTarget._count?.children ?? 0) > 0 ? (
              <div className="mt-4 space-y-4">
                <div className="border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-amber-950 mb-1">
                    <AlertTriangle size={15} className="text-amber-700" />
                    Contains Existing Content:
                  </div>
                  <p>
                    This category contains{" "}
                    <strong>
                      {deleteTarget._count?.products ?? 0} product(s)
                    </strong>
                    {deleteTarget._count?.children ? (
                      <>
                        {" "}
                        and{" "}
                        <strong>
                          {deleteTarget._count.children} subcategory(ies)
                        </strong>
                      </>
                    ) : null}
                    . Choose how you would like to handle them:
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Resolution Option 1: Reassign */}
                  <label
                    className={`block border p-3 cursor-pointer transition ${
                      deleteResolution === "reassign"
                        ? "border-neutral-950 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="resolution"
                        checked={deleteResolution === "reassign"}
                        onChange={() => setDeleteResolution("reassign")}
                        className="mt-0.5 accent-neutral-950"
                      />
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-neutral-900">
                          Option 1: Move items to another category (Recommended)
                        </span>
                        <span className="block text-[11px] text-neutral-600 mt-0.5">
                          Products and subcategories will be safely moved to
                          your chosen category.
                        </span>

                        {deleteResolution === "reassign" && (
                          <div className="mt-2.5">
                            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                              Select Target Category:
                            </label>
                            <select
                              value={reassignTargetId}
                              onChange={(e) =>
                                setReassignTargetId(e.target.value)
                              }
                              className="w-full border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                            >
                              {reassignOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.name} (/{opt.slug})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Resolution Option 2: Force delete cascade */}
                  <label
                    className={`block border p-3 cursor-pointer transition ${
                      deleteResolution === "cascade"
                        ? "border-red-600 bg-red-50/40"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="resolution"
                        checked={deleteResolution === "cascade"}
                        onChange={() => setDeleteResolution("cascade")}
                        className="mt-0.5 accent-red-600"
                      />
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-red-900">
                          Option 2: Delete category and ALL items inside it
                        </span>
                        <span className="block text-[11px] text-red-700 mt-0.5">
                          Permanently deletes all{" "}
                          {deleteTarget._count?.products ?? 0} products in this
                          category. This cannot be undone.
                        </span>

                        {deleteResolution === "cascade" && (
                          <label className="mt-2.5 flex items-center gap-2 text-xs font-medium text-red-900">
                            <input
                              type="checkbox"
                              checked={confirmCascade}
                              onChange={(e) =>
                                setConfirmCascade(e.target.checked)
                              }
                              className="size-3.5 accent-red-600"
                            />
                            <span>
                              I confirm permanent deletion of all items
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs leading-5 text-neutral-600">
                Are you sure you want to delete{" "}
                <strong className="text-neutral-950">
                  {deleteTarget.name}
                </strong>
                ? This category has no assigned products and will be removed
                immediately.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleting ||
                  (deleteResolution === "cascade" &&
                    ((deleteTarget._count?.products ?? 0) > 0 ||
                      (deleteTarget._count?.children ?? 0) > 0) &&
                    !confirmCascade) ||
                  (deleteResolution === "reassign" &&
                    ((deleteTarget._count?.products ?? 0) > 0 ||
                      (deleteTarget._count?.children ?? 0) > 0) &&
                    !reassignTargetId)
                }
                onClick={() => void handleDeleteConfirm()}
                className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-40 transition"
              >
                {deleting && (
                  <LoaderCircle size={13} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Confirm & Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
