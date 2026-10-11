 "use client";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { createInquiry } from "@/services/inquiries";
import type { InquiryInput } from "@/types/inquiry";
import type { Product } from "@/types/product";

type Props = { initialProductId?: string; compact?: boolean; onSuccess?: () => void };
export default function InquiryForm({initialProductId="", compact=false, onSuccess}: Props) {
 const [products,setProducts]=useState<Product[]>([]);
 const [loadingProducts,setLoadingProducts]=useState(true);
 const [sending,setSending]=useState(false);
 const [sent,setSent]=useState(false);
 const [form,setForm]=useState({productId:initialProductId,name:"",companyName:"",email:"",phone:"",country:"",quantity:"",customBranding:false,message:""});
 useEffect(()=>{let live=true; api.get("/products",{params:{limit:100}}).then(r=>{
   const d=r.data?.data; const list=Array.isArray(d)?d:Array.isArray(d?.items)?d.items:[];
   if(live)setProducts(list.filter((x:Product)=>x.status==="ACTIVE"));
 }).catch(e=>{console.error(e);}).finally(()=>{if(live)setLoadingProducts(false);}); return()=>{live=false;};},[]);
 useEffect(()=>{if(initialProductId)setForm(s=>({...s,productId:initialProductId}));},[initialProductId]);
 const product=products.find(p=>p.id===form.productId);
 const qty=form.quantity.trim()?Number(form.quantity):undefined;
 const tooLow=!!product&&qty!==undefined&&qty<product.moq;
 function field<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm(s => ({ ...s, [key]: value })); }
 const input="mt-1.5 w-full border border-neutral-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-neutral-950";
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(qty!==undefined&&(!Number.isInteger(qty)||qty<=0)){toast.error("Enter a valid whole-number quantity.");return;}
  if(product&&qty!==undefined&&qty<product.moq){toast.error(`Minimum order quantity is ${product.moq}.`);return;}
  const payload:InquiryInput={...(form.productId?{productId:form.productId}:{}),name:form.name.trim(),...(form.companyName.trim()?{companyName:form.companyName.trim()}:{}),email:form.email.trim(),phone:form.phone.trim(),...(form.country.trim()?{country:form.country.trim()}:{}),...(qty!==undefined?{quantity:qty}:{}),customBranding:form.customBranding,...(form.message.trim()?{message:form.message.trim()}:{})};
  setSending(true);try{await createInquiry(payload);setSent(true);toast.success("Inquiry submitted successfully.");onSuccess?.();}catch(err){toast.error(err instanceof Error?err.message:"Could not submit inquiry.");}finally{setSending(false);}
 }
 if(sent)return <div className="border border-neutral-200 bg-white p-8 text-center"><CheckCircle2 size={34} className="mx-auto"/><h2 className="mt-4 text-xl font-semibold">Thank you for your inquiry</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Your request has been received. Our team will contact you.</p><button className="mt-5 border border-neutral-300 px-4 py-2 text-sm" onClick={()=>{setSent(false);setForm({productId:initialProductId,name:"",companyName:"",email:"",phone:"",country:"",quantity:"",customBranding:false,message:""});}}>Submit another inquiry</button></div>;
 return <form onSubmit={submit} className={`border border-neutral-200 bg-white ${compact?"p-4":"p-5 sm:p-8"}`}>
  <div className="grid gap-5 sm:grid-cols-2">
   <label className="text-sm font-medium">Full name *<input required minLength={2} maxLength={100} autoComplete="name" className={input} value={form.name} onChange={e=>field("name",e.target.value)} placeholder="Your full name"/></label>
   <label className="text-sm font-medium">Company name<input maxLength={150} autoComplete="organization" className={input} value={form.companyName} onChange={e=>field("companyName",e.target.value)} placeholder="Business or company"/></label>
   <label className="text-sm font-medium">Business email *<input required type="email" maxLength={150} autoComplete="email" className={input} value={form.email} onChange={e=>field("email",e.target.value)} placeholder="you@company.com"/></label>
   <label className="text-sm font-medium">Phone / WhatsApp *<input required minLength={5} maxLength={30} type="tel" autoComplete="tel" className={input} value={form.phone} onChange={e=>field("phone",e.target.value)} placeholder="+880..."/></label>
   <label className="text-sm font-medium">Country<input maxLength={100} autoComplete="country-name" className={input} value={form.country} onChange={e=>field("country",e.target.value)} placeholder="Your country"/></label>
   <label className="text-sm font-medium">Product<select className={input} value={form.productId} disabled={loadingProducts} onChange={e=>field("productId",e.target.value)}><option value="">General wholesale inquiry</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>{product&&<span className="mt-1 block text-xs text-neutral-500">Minimum order: {product.moq.toLocaleString()} units</span>}</label>
   <label className="text-sm font-medium">Estimated quantity<input type="number" min={product?.moq??1} step={1} className={input} value={form.quantity} onChange={e=>field("quantity",e.target.value)} placeholder={product?`Minimum ${product.moq}`:"e.g. 500"}/>{tooLow&&<span className="text-xs text-red-700">Minimum quantity is {product?.moq}.</span>}</label>
   <label className="flex items-start gap-3 border border-neutral-200 p-3.5 text-sm sm:col-span-2"><input type="checkbox" className="mt-0.5 size-4 accent-neutral-950" checked={form.customBranding} onChange={e=>field("customBranding",e.target.checked)}/><span><span className="font-medium">I'm interested in custom branding</span><span className="mt-1 block text-xs text-neutral-500">Private labels, printing, embroidery, or custom packaging.</span></span></label>
   <label className="text-sm font-medium sm:col-span-2">Requirements<textarea maxLength={2000} className={`${input} min-h-32 resize-y`} value={form.message} onChange={e=>field("message",e.target.value)} placeholder="Sizes, colors, delivery expectations, or other requirements..."/><span className="mt-1 block text-right text-xs text-neutral-400">{form.message.length}/2000</span></label>
  </div>
  <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-neutral-500">Fields marked * are required.</p><button type="submit" disabled={sending||tooLow} className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">{sending?<LoaderCircle size={16} className="animate-spin"/>:<Send size={16} />}{sending?"Submitting...":"Submit inquiry"}</button></div>
 </form>;
}
