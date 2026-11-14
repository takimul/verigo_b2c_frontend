"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe2,
  LoaderCircle,
  Mail,
  Package,
  Phone,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getInquiries,
  getInquiryById,
  updateInquiry,
} from "@/services/inquiries";
import {
  INQUIRY_STATUSES,
  type Inquiry,
  type InquiryStatus,
  type InquiryPagination,
} from "@/types/inquiry";

const emptyPage: InquiryPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

const inputClass =
  "w-full border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-950 transition";

const statusStyle = (status: InquiryStatus) => {
  switch (status) {
    case "NEW":
      return "border border-amber-300 bg-amber-50 text-amber-900 font-bold";
    case "PROCESSING":
      return "bg-neutral-950 text-white font-semibold";
    case "COMPLETED":
      return "border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold";
    case "CANCELLED":
      return "border border-neutral-200 bg-neutral-100 text-neutral-600";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

const formatDate = (isoString: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState(emptyPage);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Details Modal
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState<InquiryStatus>("NEW");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getInquiries({
        page,
        limit: 20,
        search: search.trim() || undefined,
        status: status || undefined,
      });
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load inquiries.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function openDetails(inquiry: Inquiry) {
    setSelected(inquiry);
    setDetailLoading(true);
    try {
      const res = await getInquiryById(inquiry.id);
      setSelected(res.data);
      setEditStatus(res.data.status);
      setNotes(res.data.adminNotes ?? "");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load inquiry details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function saveInquiryChanges() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await updateInquiry(selected.id, {
        status: editStatus,
        adminNotes: notes.trim() || null,
      });
      setSelected(res.data);
      toast.success("Inquiry updated successfully.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update inquiry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Customer Relations
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-neutral-950">
            Quote Inquiries
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Review incoming quote requests, record internal progress notes, and follow up with wholesale buyers.
          </p>
        </div>

        <button
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh List
        </button>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Total Inquiries
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-950">
            {pagination.total}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Active Filter
          </p>
          <p className="mt-2 text-sm font-semibold text-neutral-950">
            {status ? INQUIRY_STATUSES.find((s) => s.value === status)?.label : "All Statuses"}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 border border-neutral-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Current Page
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-950">
            {pagination.totalPages ? `${page} / ${pagination.totalPages}` : "1 / 1"}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <section className="border border-neutral-200 bg-white shadow-xs">
        <div className="grid gap-3 border-b border-neutral-200 p-3 sm:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              className={`${inputClass} pl-9`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search buyer name, company, email, phone..."
            />
          </div>

          <select
            className={inputClass}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as InquiryStatus | "");
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {INQUIRY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {(search || status) && (
            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setPage(1);
              }}
              className="inline-flex items-center justify-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>

        {error && (
          <div className="m-4 border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            {error}{" "}
            <button onClick={() => void load()} className="ml-2 font-bold underline">
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="relative overflow-x-auto">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <LoaderCircle size={24} className="animate-spin text-neutral-700" />
            </div>
          )}

          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Customer / Buyer</th>
                <th className="px-4 py-3">Inquiry For</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3">Received Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-neutral-500">
                    No customer inquiries found.
                  </td>
                </tr>
              )}

              {items.map((inq) => (
                <tr key={inq.id} className="transition hover:bg-neutral-50/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-neutral-950">{inq.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      {inq.companyName ? `${inq.companyName} · ` : ""}
                      {inq.email}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-neutral-800">
                    {inq.product?.name ? (
                      <span className="font-medium">{inq.product.name}</span>
                    ) : (
                      <span className="italic text-neutral-500">General Quote Request</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center text-xs font-semibold tabular-nums text-neutral-800">
                    {inq.quantity ? inq.quantity.toLocaleString() : "—"}
                  </td>

                  <td className="px-4 py-3 text-xs text-neutral-600">
                    {formatDate(inq.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-xs ${statusStyle(
                        inq.status,
                      )}`}
                    >
                      {inq.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => void openDetails(inq)}
                      className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:border-neutral-950 hover:bg-neutral-50"
                    >
                      <Eye size={13} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <footer className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-600 bg-neutral-50">
          <p>
            Showing {items.length ? (page - 1) * pagination.limit + 1 : 0}–
            {(page - 1) * pagination.limit + items.length} of {pagination.total} inquiries
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:bg-neutral-50"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className="px-2 font-medium">
              {pagination.totalPages ? `${page} / ${pagination.totalPages}` : "1 / 1"}
            </span>

            <button
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="inline-flex items-center gap-1 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:bg-neutral-50"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </footer>
      </section>

      {/* Inquiry Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-neutral-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-neutral-200 bg-white p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Inquiry Details
                </p>
                <h2 id="inquiry-modal-title" className="mt-1 text-xl font-bold text-neutral-950">
                  {selected.name}
                </h2>
                <p className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                  <Calendar size={13} /> Received on {formatDate(selected.createdAt)}
                </p>
              </div>

              <button
                aria-label="Close modal"
                disabled={saving}
                onClick={() => setSelected(null)}
                className="text-neutral-400 hover:text-neutral-950 p-1"
              >
                <X size={18} />
              </button>
            </header>

            {detailLoading ? (
              <div className="p-16 text-center text-neutral-500">
                <LoaderCircle className="mx-auto animate-spin mb-2" />
                Loading inquiry details...
              </div>
            ) : (
              <div className="grid gap-6 p-6 sm:grid-cols-2">
                {/* Left column: Buyer & Request Specs */}
                <div className="space-y-5">
                  <div className="border border-neutral-200 bg-neutral-50 p-4 space-y-2.5 text-xs text-neutral-800">
                    <p className="font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Buyer Contact Information
                    </p>
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex items-center gap-2 font-medium text-neutral-900 hover:underline"
                    >
                      <Mail size={14} className="text-neutral-500" />
                      {selected.email}
                    </a>
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-2 font-medium text-neutral-900 hover:underline"
                    >
                      <Phone size={14} className="text-neutral-500" />
                      {selected.phone}
                    </a>
                    {selected.companyName && (
                      <p className="flex items-center gap-2">
                        <Building2 size={14} className="text-neutral-500" />
                        Company: <strong>{selected.companyName}</strong>
                      </p>
                    )}
                    {selected.country && (
                      <p className="flex items-center gap-2">
                        <Globe2 size={14} className="text-neutral-500" />
                        Country: <strong>{selected.country}</strong>
                      </p>
                    )}
                  </div>

                  <div className="border border-neutral-200 p-4 space-y-2 text-xs text-neutral-800">
                    <p className="font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Order Requirements
                    </p>
                    <p className="font-semibold text-sm text-neutral-950">
                      {selected.product?.name || "General Wholesale Inquiry"}
                    </p>
                    <p>
                      Requested Quantity:{" "}
                      <strong>
                        {selected.quantity ? selected.quantity.toLocaleString() : "Not specified"}
                      </strong>
                    </p>
                    <p>
                      Custom Branding:{" "}
                      <strong>{selected.customBranding ? "Yes, requested" : "Standard"}</strong>
                    </p>

                    <div className="pt-2 border-t border-neutral-100 mt-2">
                      <p className="font-medium text-neutral-600 mb-1">Customer Message:</p>
                      <p className="whitespace-pre-wrap rounded-xs bg-neutral-50 p-2.5 text-neutral-800 leading-relaxed font-sans">
                        {selected.message || "No additional message provided."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column: Status & Admin Notes */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Inquiry Status
                    </label>
                    <select
                      className={inputClass}
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                    >
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Internal Admin Notes
                    </label>
                    <textarea
                      maxLength={3000}
                      rows={6}
                      className={`${inputClass} resize-y text-xs`}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add follow-up notes, factory coordination info, or pricing discussions. Internal only."
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">
                      {notes.length}/3000 characters. Notes are visible only to team administrators.
                    </p>
                  </div>

                  <button
                    disabled={saving}
                    onClick={() => void saveInquiryChanges()}
                    className="inline-flex w-full items-center justify-center gap-2 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 transition"
                  >
                    {saving && <LoaderCircle size={14} className="animate-spin" />}
                    {saving ? "Saving Changes..." : "Save Status & Notes"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
