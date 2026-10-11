// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import {
//   ChevronDown,
//   ChevronRight,
//   CirclePlus,
//   FolderTree,
//   LoaderCircle,
//   Pencil,
//   Search,
//   Trash2,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createCategory,
//   deleteCategory,
//   getCategories,
//   updateCategory,
//   type CategoryInput,
// } from "@/services/categories";
// import { Category } from "@/types/category";

// type CategoryFormState = {
//   name: string;
//   slug: string;
//   description: string;
//   imageUrl: string;
//   parentId: string;
//   sortOrder: string;
//   isActive: boolean;
// };

// type ViewMode = "list" | "create" | "edit";

// const emptyForm: CategoryFormState = {
//   name: "",
//   slug: "",
//   description: "",
//   imageUrl: "",
//   parentId: "",
//   sortOrder: "0",
//   isActive: true,
// };

// const inputClass =
//   "mt-1.5 w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-950 disabled:bg-neutral-100";

// const labelClass = "block text-sm font-medium text-neutral-800";

// function toSlug(value: string) {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$/g, "");
// }

// function toForm(category: Category): CategoryFormState {
//   return {
//     name: category.name,
//     slug: category.slug,
//     description: category.description ?? "",
//     imageUrl: category.imageUrl ?? "",
//     parentId: category.parentId ?? category.parent?.id ?? "",
//     sortOrder: String(category.sortOrder ?? 0),
//     isActive: category.isActive ?? true,
//   };
// }

// function categoryInput(form: CategoryFormState): CategoryInput {
//   return {
//     name: form.name.trim(),
//     slug: toSlug(form.slug),
//     description: form.description.trim() || undefined,
//     imageUrl: form.imageUrl.trim() || null,
//     parentId: form.parentId || null,
//     sortOrder: Number(form.sortOrder),
//     isActive: form.isActive,
//   };
// }

// export default function AdminCategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const [search, setSearch] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [mode, setMode] = useState<ViewMode>("list");
//   const [selected, setSelected] = useState<Category | null>(null);
//   const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

//   const [form, setForm] = useState<CategoryFormState>(emptyForm);
//   const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

//   const loadCategories = useCallback(async () => {
//     setLoading(true);

//     try {
//       const response = await getCategories();
//       setCategories(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         "Could not load categories. Check your admin session and API.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     void loadCategories();
//   }, [loadCategories]);

//   const filteredCategories = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return categories.filter((category) => {
//       const matchesSearch =
//         !query ||
//         category.name.toLowerCase().includes(query) ||
//         category.slug.toLowerCase().includes(query) ||
//         (category.description ?? "").toLowerCase().includes(query);

//       const matchesStatus =
//         activeFilter === "all" ||
//         (activeFilter === "active" && category.isActive) ||
//         (activeFilter === "inactive" && !category.isActive);

//       return matchesSearch && matchesStatus;
//     });
//   }, [categories, search, activeFilter]);

//   const activeCount = categories.filter((item) => item.isActive).length;
//   const parentCount = categories.filter(
//     (item) => !item.parentId && !item.parent,
//   ).length;

//   function startCreate() {
//     setSelected(null);
//     setForm(emptyForm);
//     setSlugManuallyEdited(false);
//     setMode("create");
//   }

//   function startEdit(category: Category) {
//     setSelected(category);
//     setForm(toForm(category));
//     setSlugManuallyEdited(true);
//     setMode("edit");
//   }

//   function updateField<K extends keyof CategoryFormState>(
//     key: K,
//     value: CategoryFormState[K],
//   ) {
//     setForm((current) => {
//       const next = { ...current, [key]: value };

//       if (key === "name" && !slugManuallyEdited) {
//         next.slug = toSlug(String(value));
//       }

//       return next;
//     });
//   }

//   function cancelForm() {
//     setMode("list");
//     setSelected(null);
//   }

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const sortOrder = Number(form.sortOrder);

//     if (!Number.isInteger(sortOrder) || sortOrder < 0) {
//       toast.error("Sort order must be a non-negative whole number.");
//       return;
//     }

//     const slug = toSlug(form.slug);

//     if (form.name.trim().length < 2) {
//       toast.error("Category name must be at least 2 characters.");
//       return;
//     }

//     if (slug.length < 2) {
//       toast.error("Slug must be at least 2 characters.");
//       return;
//     }

//     if (
//       form.imageUrl.trim() &&
//       !/^https?:\/\/\S+$/i.test(form.imageUrl.trim())
//     ) {
//       toast.error("Enter a valid image URL.");
//       return;
//     }

//     if (selected && form.parentId === selected.id) {
//       toast.error("A category cannot be its own parent.");
//       return;
//     }

//     const payload = categoryInput(form);

//     setSaving(true);

//     try {
//       if (selected) {
//         await updateCategory(selected.id, payload);
//         toast.success("Category updated.");
//       } else {
//         await createCategory(payload);
//         toast.success("Category created.");
//       }

//       setMode("list");
//       setSelected(null);
//       await loadCategories();
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         "Could not save the category. Check the fields and try again.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function handleDelete() {
//     if (!deleteTarget) return;

//     setDeleting(true);

//     try {
//       await deleteCategory(deleteTarget.id);
//       toast.success("Category deleted.");
//       setDeleteTarget(null);
//       await loadCategories();
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         "Could not delete this category. It may contain products or child categories, or require Super Admin permission.",
//       );
//     } finally {
//       setDeleting(false);
//     }
//   }

//   if (mode !== "list") {
//     return (
//       <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
//         <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
//           <div>
//             <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
//               Catalogue management
//             </p>
//             <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
//               {selected ? "Edit category" : "Create category"}
//             </h1>
//             <p className="mt-2 text-sm text-neutral-500">
//               Manage category details and its position in the catalogue.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={cancelForm}
//             className="border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
//           >
//             Back to categories
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <section className="space-y-4 border border-neutral-200 p-4 sm:p-6">
//             <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
//               Category information
//             </h2>

//             <div className="grid gap-4 md:grid-cols-2">
//               <label className={labelClass}>
//                 Category name <span className="text-red-600">*</span>
//                 <input
//                   required
//                   minLength={2}
//                   maxLength={100}
//                   value={form.name}
//                   onChange={(event) => updateField("name", event.target.value)}
//                   placeholder="e.g. T-Shirts"
//                   className={inputClass}
//                 />
//               </label>

//               <label className={labelClass}>
//                 Slug <span className="text-red-600">*</span>
//                 <input
//                   required
//                   minLength={2}
//                   maxLength={120}
//                   pattern="[a-z0-9]+(-[a-z0-9]+)*"
//                   value={form.slug}
//                   onChange={(event) => {
//                     setSlugManuallyEdited(true);
//                     updateField("slug", toSlug(event.target.value));
//                   }}
//                   placeholder="t-shirts"
//                   className={inputClass}
//                 />
//                 <span className="mt-1 block text-xs font-normal text-neutral-500">
//                   Lowercase letters, numbers, and hyphens only.
//                 </span>
//               </label>

//               <label className={labelClass}>
//                 Parent category
//                 <select
//                   value={form.parentId}
//                   onChange={(event) =>
//                     updateField("parentId", event.target.value)
//                   }
//                   className={inputClass}
//                 >
//                   <option value="">None — top-level category</option>
//                   {categories
//                     .filter((category) => {
//                       if (selected && category.id === selected.id) return false;

//                       // Avoid making one of this category's descendants its parent.

// if (selected) {
//   let current: Category | undefined = category;
//   const visited = new Set<string>();

//   while (current && !visited.has(current.id)) {
//     if (current.id === selected.id) return false;

//     visited.add(current.id);

//     const parentId: string | null | undefined =
//       current.parentId ?? current.parent?.id;

//     current = categories.find(
//       (item: Category) => item.id === parentId,
//     );
//   }
// }

//                       return true;
//                     })
//                     .map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                 </select>
//               </label>

//               <label className={labelClass}>
//                 Sort order
//                 <input
//                   type="number"
//                   min={0}
//                   step={1}
//                   value={form.sortOrder}
//                   onChange={(event) =>
//                     updateField("sortOrder", event.target.value)
//                   }
//                   className={inputClass}
//                 />
//               </label>
//             </div>

//             <label className={labelClass}>
//               Description
//               <textarea
//                 rows={3}
//                 maxLength={500}
//                 value={form.description}
//                 onChange={(event) =>
//                   updateField("description", event.target.value)
//                 }
//                 placeholder="Briefly describe this category..."
//                 className={inputClass}
//               />
//               <span className="mt-1 block text-right text-xs font-normal text-neutral-400">
//                 {form.description.length}/500
//               </span>
//             </label>

//             <label className={labelClass}>
//               Image URL
//               <input
//                 type="url"
//                 value={form.imageUrl}
//                 onChange={(event) =>
//                   updateField("imageUrl", event.target.value)
//                 }
//                 placeholder="https://..."
//                 className={inputClass}
//               />
//               <span className="mt-1 block text-xs font-normal text-neutral-500">
//                 Paste an image URL. This form does not upload category images.
//               </span>
//             </label>

//             {form.imageUrl.trim() && (
//               <div className="relative aspect-[16/5] max-w-xl overflow-hidden border border-neutral-200 bg-neutral-100">
//                 <Image
//                   src={form.imageUrl}
//                   alt={`${form.name || "Category"} preview`}
//                   fill
//                   unoptimized
//                   sizes="(max-width: 768px) 100vw, 600px"
//                   className="object-cover"
//                   onError={() =>
//                     toast.error("Could not load the image preview.")
//                   }
//                 />
//               </div>
//             )}

//             <label className="flex cursor-pointer items-center gap-3 border border-neutral-200 p-3 text-sm text-neutral-800">
//               <input
//                 type="checkbox"
//                 checked={form.isActive}
//                 onChange={(event) =>
//                   updateField("isActive", event.target.checked)
//                 }
//                 className="size-4 accent-neutral-950"
//               />
//               <span>
//                 <span className="block font-medium">Active category</span>
//                 <span className="mt-0.5 block text-xs text-neutral-500">
//                   Make this category available to the storefront.
//                 </span>
//               </span>
//             </label>
//           </section>

//           <div className="flex flex-wrap justify-end gap-3">
//             <button
//               type="button"
//               onClick={cancelForm}
//               className="border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="inline-flex items-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
//             >
//               {saving && <LoaderCircle size={16} className="animate-spin" />}
//               {saving
//                 ? "Saving..."
//                 : selected
//                   ? "Save changes"
//                   : "Create category"}
//             </button>
//           </div>
//         </form>
//       </main>
//     );
//   }

//   return (
//     <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
//       <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
//         <div>
//           <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
//             Catalogue management
//           </p>
//           <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
//             Categories
//           </h1>
//           <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
//             Organize products into a clear hierarchy for your wholesale
//             catalogue.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={startCreate}
//           className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
//         >
//           <CirclePlus size={17} />
//           Add category
//         </button>
//       </div>

//       <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
//         <div className="border border-neutral-200 bg-white p-4">
//           <FolderTree size={17} className="text-neutral-500" />
//           <p className="mt-3 text-2xl font-semibold tabular-nums">
//             {categories.length}
//           </p>
//           <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
//             Total categories
//           </p>
//         </div>

//         <div className="border border-neutral-200 bg-white p-4">
//           <ChevronDown size={17} className="text-neutral-500" />
//           <p className="mt-3 text-2xl font-semibold tabular-nums">
//             {parentCount}
//           </p>
//           <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
//             Top-level categories
//           </p>
//         </div>

//         <div className="col-span-2 border border-neutral-200 bg-white p-4 sm:col-span-1">
//           <p className="text-xs uppercase tracking-wider text-neutral-500">
//             Active categories
//           </p>
//           <p className="mt-3 text-2xl font-semibold tabular-nums">
//             {activeCount}
//           </p>
//           <p className="mt-1 text-xs text-neutral-500">
//             {categories.length - activeCount} inactive
//           </p>
//         </div>
//       </div>

//       <section className="mt-6 border border-neutral-200 bg-white">
//         <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row">
//           <label className="relative block flex-1">
//             <Search
//               size={16}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
//             />
//             <input
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder="Search by name, slug, or description..."
//               className="w-full border border-neutral-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-950"
//             />
//           </label>

//           <select
//             value={activeFilter}
//             onChange={(event) => setActiveFilter(event.target.value)}
//             className="border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950 sm:w-48"
//           >
//             <option value="all">All categories</option>
//             <option value="active">Active only</option>
//             <option value="inactive">Inactive only</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-190 border-collapse text-left">
//             <thead>
//               <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
//                 <th className="px-4 py-3 font-medium">Category</th>
//                 <th className="px-4 py-3 font-medium">Parent</th>
//                 <th className="px-4 py-3 font-medium">Sort order</th>
//                 <th className="px-4 py-3 font-medium">Status</th>
//                 <th className="px-4 py-3 text-right font-medium">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-neutral-100">
//               {loading && (
//                 <tr>
//                   <td colSpan={5} className="px-4 py-16 text-center">
//                     <LoaderCircle
//                       size={23}
//                       className="mx-auto animate-spin text-neutral-500"
//                     />
//                     <p className="mt-3 text-sm text-neutral-500">
//                       Loading categories...
//                     </p>
//                   </td>
//                 </tr>
//               )}

//               {!loading && filteredCategories.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="px-4 py-16 text-center">
//                     <FolderTree
//                       size={25}
//                       className="mx-auto text-neutral-300"
//                     />
//                     <p className="mt-3 text-sm font-medium text-neutral-800">
//                       No categories found
//                     </p>
//                     <p className="mt-1 text-sm text-neutral-500">
//                       Change your search or create a category.
//                     </p>
//                   </td>
//                 </tr>
//               )}

//               {!loading &&
//                 filteredCategories.map((category) => (
//                   <tr
//                     key={category.id}
//                     className="transition hover:bg-neutral-50/70"
//                   >
//                     <td className="px-4 py-3">
//                       <div className="flex min-w-57.5 items-center gap-3">
//                         <div className="relative size-12 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">
//                           {category.imageUrl ? (
//                             <Image
//                               src={category.imageUrl}
//                               alt={category.name}
//                               fill
//                               unoptimized
//                               sizes="48px"
//                               className="object-cover"
//                             />
//                           ) : (
//                             <div className="flex size-full items-center justify-center text-neutral-400">
//                               <FolderTree size={19} />
//                             </div>
//                           )}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-semibold text-neutral-950">
//                             {category.name}
//                           </p>
//                           <p className="mt-1 truncate text-xs text-neutral-500">
//                             /{category.slug}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 text-sm text-neutral-600">
//                       {category.parent?.name ||
//                         categories.find((item) => item.id === category.parentId)
//                           ?.name ||
//                         "—"}
//                     </td>

//                     <td className="px-4 py-3 text-sm tabular-nums text-neutral-700">
//                       {category.sortOrder ?? 0}
//                     </td>

//                     <td className="px-4 py-3">
//                       <span
//                         className={`inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
//                           category.isActive
//                             ? "bg-neutral-950 text-white"
//                             : "border border-neutral-300 text-neutral-600"
//                         }`}
//                       >
//                         {category.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => startEdit(category)}
//                           className="inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-medium hover:border-neutral-950 hover:bg-neutral-50"
//                         >
//                           <Pencil size={14} />
//                           Edit
//                         </button>

//                         <button
//                           type="button"
//                           aria-label={`Delete ${category.name}`}
//                           onClick={() => setDeleteTarget(category)}
//                           className="border border-neutral-300 p-2 text-neutral-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
//                         >
//                           <Trash2 size={15} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
//           Showing {filteredCategories.length} of {categories.length} categories
//         </div>
//       </section>

//       {deleteTarget && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget && !deleting) {
//               setDeleteTarget(null);
//             }
//           }}
//         >
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="delete-category-title"
//             className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-xl"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex size-10 items-center justify-center bg-neutral-100">
//                 <Trash2 size={19} />
//               </div>
//               <button
//                 type="button"
//                 aria-label="Close dialog"
//                 disabled={deleting}
//                 onClick={() => setDeleteTarget(null)}
//                 className="p-1 text-neutral-500 hover:text-neutral-950 disabled:opacity-40"
//               >
//                 <X size={19} />
//               </button>
//             </div>

//             <h2
//               id="delete-category-title"
//               className="mt-5 text-lg font-semibold text-neutral-950"
//             >
//               Delete category?
//             </h2>
//             <p className="mt-2 text-sm leading-6 text-neutral-600">
//               You are about to delete{" "}
//               <span className="font-medium text-neutral-950">
//                 {deleteTarget.name}
//               </span>
//               . If this category contains products or child categories, the
//               backend may reject the request.
//             </p>

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 type="button"
//                 disabled={deleting}
//                 onClick={() => setDeleteTarget(null)}
//                 className="border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 disabled={deleting}
//                 onClick={() => void handleDelete()}
//                 className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
//               >
//                 {deleting && (
//                   <LoaderCircle size={15} className="animate-spin" />
//                 )}
//                 Delete category
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

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
  CirclePlus,
  FolderTree,
  ImagePlus,
  LoaderCircle,
  Pencil,
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
  updateCategory,
  uploadCategoryImage,
  type CategoryInput,
} from "@/services/categories";
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
  "mt-1.5 w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-950 disabled:bg-neutral-100";
const labelClass = "block text-sm font-medium text-neutral-800";
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
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
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
      toast.error(
        "Could not load categories. Check your admin session and API.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

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

  const activeCount = categories.filter((item) => item.isActive).length;
  const parentCount = categories.filter(
    (item) => !item.parentId && !item.parent,
  ).length;

  function resetImageState() {
    clearImageSelection();
    setRemoveExistingImage(false);
  }

  function startCreate() {
    resetImageState();
    setSelected(null);
    setForm(emptyForm);
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

      // Remove the stored image before updating imageUrl to null, so the
      // backend can still read the old Cloudinary URL and delete its asset.
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
            "Category details were saved, but image upload failed. Edit the category to retry.",
          );
          resetImageState();
          setMode("list");
          setSelected(null);
          await loadCategories();
          return;
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
        "Could not save the category. Check the fields and try again.",
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
      setRemovingImage(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted.");
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error(
        "Could not delete this category. It may contain products or child categories, or require Super Admin permission.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (mode !== "list") {
    const displayedImage =
      imagePreview || (removeExistingImage ? "" : form.imageUrl);
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
              Catalogue management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
              {selected ? "Edit category" : "Create category"}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Manage category details, image, and position in the catalogue.
            </p>
          </div>
          <button
            type="button"
            onClick={cancelForm}
            className="border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
          >
            Back to categories
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4 border border-neutral-200 p-4 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Category information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                Category name <span className="text-red-600">*</span>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. T-Shirts"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Slug <span className="text-red-600">*</span>
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugManuallyEdited(true);
                    updateField("slug", toSlug(event.target.value));
                  }}
                  placeholder="t-shirts"
                  className={inputClass}
                />
                <span className="mt-1 block text-xs font-normal text-neutral-500">
                  Lowercase letters, numbers, and hyphens only.
                </span>
              </label>
              <label className={labelClass}>
                Parent category
                <select
                  value={form.parentId}
                  onChange={(event) =>
                    updateField("parentId", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">None — top-level category</option>
                  {categories
                    .filter((category) => {
                      if (selected && category.id === selected.id) return false;
                      if (selected) {
                        let current: Category | undefined = category;
                        const visited = new Set<string>();

                        while (current && !visited.has(current.id)) {
                          if (current.id === selected.id) return false;

                          visited.add(current.id);

                          const parentId: string | null | undefined =
                            current.parentId ?? current.parent?.id;

                          current = categories.find(
                            (item: Category) => item.id === parentId,
                          );
                        }
                      }
                      return true;
                    })
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className={labelClass}>
                Sort order
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.sortOrder}
                  onChange={(event) =>
                    updateField("sortOrder", event.target.value)
                  }
                  className={inputClass}
                />
              </label>
            </div>

            <label className={labelClass}>
              Description
              <textarea
                rows={3}
                maxLength={500}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Briefly describe this category..."
                className={inputClass}
              />
              <span className="mt-1 block text-right text-xs font-normal text-neutral-400">
                {form.description.length}/500
              </span>
            </label>
          </section>

          <section className="space-y-4 border border-neutral-200 p-4 sm:p-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Category image
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Choose an image from your device. JPG, PNG, WebP, or AVIF · up
                to 5 MB.
              </p>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative flex aspect-[4/3] w-full max-w-sm items-center justify-center overflow-hidden border border-neutral-200 bg-neutral-100">
                {displayedImage ? (
                  <Image
                    src={displayedImage}
                    alt={`${form.name || "Category"} preview`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 384px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <ImagePlus size={30} />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50">
                  <Upload size={16} /> Choose image
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImageSelect}
                    className="sr-only"
                  />
                </label>
                {selectedImage && (
                  <p className="max-w-xs break-all text-xs text-neutral-600">
                    {selectedImage.name} ·{" "}
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                {displayedImage && (
                  <button
                    type="button"
                    disabled={saving || uploadingImage || removingImage}
                    onClick={handleRemoveImageClick}
                    className="text-sm text-red-700 underline underline-offset-4 disabled:opacity-50"
                  >
                    Remove image
                  </button>
                )}
                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => {
                      clearImageSelection();
                      setRemoveExistingImage(false);
                    }}
                    className="text-sm text-neutral-500 underline underline-offset-4"
                  >
                    Cancel selection
                  </button>
                )}
                {removeExistingImage && selected && (
                  <p className="max-w-xs text-xs text-neutral-500">
                    The image will be removed when you save your changes.
                  </p>
                )}
              </div>
            </div>
          </section>

          <label className="flex cursor-pointer items-center gap-3 border border-neutral-200 p-3 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
              className="size-4 accent-neutral-950"
            />
            <span>
              <span className="block font-medium">Active category</span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                Make this category available to the storefront.
              </span>
            </span>
          </label>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={cancelForm}
              disabled={saving || uploadingImage}
              className="border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage || removingImage}
              className="inline-flex items-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {(saving || uploadingImage || removingImage) && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {uploadingImage
                ? "Uploading image..."
                : removingImage
                  ? "Removing image..."
                  : saving
                    ? "Saving..."
                    : selected
                      ? "Save changes"
                      : "Create category"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
            Catalogue management
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Categories
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Organize products into a clear hierarchy for your wholesale
            catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <CirclePlus size={17} /> Add category
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-4">
          <FolderTree size={17} className="text-neutral-500" />
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {categories.length}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
            Total categories
          </p>
        </div>
        <div className="border border-neutral-200 bg-white p-4">
          <FolderTree size={17} className="text-neutral-500" />
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {parentCount}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
            Top-level categories
          </p>
        </div>
        <div className="col-span-2 border border-neutral-200 bg-white p-4 sm:col-span-1">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Active categories
          </p>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {categories.length - activeCount} inactive
          </p>
        </div>
      </div>

      <section className="mt-6 border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row">
          <label className="relative block flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, slug, or description..."
              className="w-full border border-neutral-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-neutral-950"
            />
          </label>
          <select
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value)}
            className="border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950 sm:w-48"
          >
            <option value="all">All categories</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Parent</th>
                <th className="px-4 py-3 font-medium">Sort order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <LoaderCircle
                      size={23}
                      className="mx-auto animate-spin text-neutral-500"
                    />
                    <p className="mt-3 text-sm text-neutral-500">
                      Loading categories...
                    </p>
                  </td>
                </tr>
              )}
              {!loading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <FolderTree
                      size={25}
                      className="mx-auto text-neutral-300"
                    />
                    <p className="mt-3 text-sm font-medium text-neutral-800">
                      No categories found
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Change your search or create a category.
                    </p>
                  </td>
                </tr>
              )}
              {!loading &&
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-neutral-50/70"
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-[230px] items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-neutral-400">
                              <FolderTree size={19} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-950">
                            {category.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-neutral-500">
                            /{category.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {category.parent?.name ||
                        categories.find((item) => item.id === category.parentId)
                          ?.name ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-neutral-700">
                      {category.sortOrder ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${category.isActive ? "bg-neutral-950 text-white" : "border border-neutral-300 text-neutral-600"}`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className="inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-medium hover:border-neutral-950 hover:bg-neutral-50"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${category.name}`}
                          onClick={() => setDeleteTarget(category)}
                          className="border border-neutral-300 p-2 text-neutral-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </section>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting)
              setDeleteTarget(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 items-center justify-center bg-neutral-100">
                <Trash2 size={19} />
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="p-1 text-neutral-500 hover:text-neutral-950 disabled:opacity-40"
              >
                <X size={19} />
              </button>
            </div>
            <h2
              id="delete-category-title"
              className="mt-5 text-lg font-semibold text-neutral-950"
            >
              Delete category?
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              You are about to delete{" "}
              <span className="font-medium text-neutral-950">
                {deleteTarget.name}
              </span>
              . If this category contains products or child categories, the
              backend may reject the request.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {deleting && (
                  <LoaderCircle size={15} className="animate-spin" />
                )}{" "}
                Delete category
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
