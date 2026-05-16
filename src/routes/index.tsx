import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles, Leaf, ShieldCheck, Zap, Heart, Apple, Wheat,
  Package, Pill, Sun, Check, X, Star, Phone, Facebook, Instagram, MessageCircle,
  Clock, Eye, MapPin, Minus, Plus, Loader2,
} from "lucide-react";
import heroImg from "@/assets/velum-product.png";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { WILAYAS } from "@/lib/wilayas";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

/* ---------- helpers ---------- */
const fmtDZD = (n: number) => `${n.toLocaleString("fr-DZ")} دج`;

const SOCIAL_NAMES = [
  { name: "أحمد", city: "قسنطينة" },
  { name: "فاطمة", city: "الجزائر" },
  { name: "يوسف", city: "وهران" },
  { name: "نادية", city: "عنابة" },
  { name: "محمد", city: "سطيف" },
];

/* ---------- live social proof + visitors ---------- */
function LiveSocialProof() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  const [visitors, setVisitors] = useState(() => 14 + Math.floor(Math.random() * 17));

  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % SOCIAL_NAMES.length);
        setShow(true);
      }, 300);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setVisitors(14 + Math.floor(Math.random() * 17));
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const p = SOCIAL_NAMES[idx];
  return (
    <div className="sticky top-0 z-40 w-full bg-ink text-gold py-2 px-3 text-center text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] border-b border-gold/20 uppercase">
      <span className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gold" />
        </span>
        <span><b>{visitors}</b> يشاهد الآن</span>
        <span className="hidden sm:inline opacity-50 mx-2">•</span>
        <span key={p.name} className="hidden sm:inline opacity-90">{p.name} من {p.city} طلب VELUM</span>
      </span>
    </div>
  );
}

/* ---------- countdown ---------- */
function Countdown() {
  const [secs, setSecs] = useState(12 * 3600);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s <= 0 ? 12 * 3600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return (
    <div className="bg-[#F1EDE4] py-5 md:py-8 px-4 border-y border-[#E5E1D8]">
      <div className="container mx-auto flex items-center justify-between gap-3 max-w-3xl">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-gold" />
          </div>
          <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-widest text-ink truncate">
            العرض ينتهي بعد
          </span>
        </div>
        <div className="flex gap-1.5 md:gap-3 text-lg md:text-3xl font-black text-ink tabular-nums shrink-0">
          <div className="flex flex-col items-center min-w-[2ch]"><span>{h}</span><span className="text-[7px] md:text-[8px] text-muted-foreground font-bold uppercase mt-0.5">ساعة</span></div>
          <span className="text-gold leading-none">:</span>
          <div className="flex flex-col items-center min-w-[2ch]"><span>{m}</span><span className="text-[7px] md:text-[8px] text-muted-foreground font-bold uppercase mt-0.5">دقيقة</span></div>
          <span className="text-gold leading-none">:</span>
          <div className="flex flex-col items-center min-w-[2ch]"><span>{s}</span><span className="text-[7px] md:text-[8px] text-muted-foreground font-bold uppercase mt-0.5">ثانية</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---------- hero ---------- */
function Hero() {
  const scrollOrder = () =>
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="bg-[#FCFAF7] text-ink relative overflow-hidden">
      <div className="container mx-auto px-5 pt-8 pb-12 md:py-24 max-w-3xl text-center">
        <div className="mb-6 md:mb-10 flex justify-center fade-in-up">
          <div className="relative">
            <div className="absolute -inset-6 md:-inset-8 rounded-full bg-gold/10 blur-3xl" />
            <img
              src={heroImg}
              alt="VELUM bottle"
              width={520}
              height={520}
              className="relative rounded-3xl shadow-2xl w-full max-w-[260px] sm:max-w-sm md:max-w-md mx-auto"
            />
          </div>
        </div>

        <div className="fade-in-up">
          <span className="inline-block py-1 px-4 rounded-full border border-gold/40 text-gold text-[9px] md:text-[10px] font-black tracking-[0.25em] mb-4 md:mb-6 bg-white/60 backdrop-blur">
            VELUM SUPPLEMENTS
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-3 md:mb-4 text-ink leading-none">
            VELUM
          </h1>
          <p className="text-base md:text-xl font-bold text-gold mb-2 md:mb-3">تركيبة بريبيوتك ومضادات الأكسدة</p>
          <p className="text-gold/80 italic text-sm md:text-base mb-4 md:mb-5">طبيعي. فعّال. موثوق.</p>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-md mx-auto mb-6 md:mb-8">
            مكمل غذائي فريد يجمع فاكهة التنين والرمان وبذور الكتان لدعم صحة الجهاز الهضمي والأمعاء.
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-8 md:mb-10">
            {["نباتي 100%", "60 كبسولة", "بدون GMO", "بريبيوتيك طبيعي"].map((t) => (
              <span key={t} className="text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 bg-[#F9F7F2] border border-[#E5E1D8] rounded-lg text-ink">
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={scrollOrder}
            className="w-full max-w-sm bg-ink text-white font-black py-4 md:py-5 rounded-2xl shadow-xl hover:bg-gold hover:text-ink transition-all duration-300 active:scale-95"
          >
            اطلب المنتج الآن
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- generic section heading ---------- */
function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <div className="text-gold text-[10px] md:text-xs tracking-widest uppercase mb-2 font-black">{kicker}</div>
      <h2 className="text-2xl md:text-4xl font-black">{title}</h2>
    </div>
  );
}

/* ---------- benefits ---------- */
const BENEFITS = [
  { icon: Sparkles, title: "دعم الهضم الصحي", desc: "ألياف بريبيوتيك تعزز توازن الميكروبيوم وراحة المعدة." },
  { icon: ShieldCheck, title: "تقوية المناعة", desc: "مضادات أكسدة قوية تحمي الخلايا من الإجهاد التأكسدي." },
  { icon: Zap, title: "طاقة طبيعية", desc: "مزيج نباتي يدعم الحيوية والنشاط اليومي بدون منبهات." },
];
function Benefits() {
  return (
    <section className="py-14 md:py-24 bg-background">
      <div className="container mx-auto px-5 max-w-3xl">
        <SectionHeader kicker="المميزات" title="لماذا VELUM؟" />
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className={`p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#E5E1D8] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${
                i % 2 === 0 ? "bg-[#F9F7F2]" : "bg-white shadow-lg shadow-ink/5"
              }`}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/50 rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex md:block items-start gap-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center md:mb-6 shadow-sm border border-[#E5E1D8] shrink-0">
                  <b.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black mb-2 md:mb-3">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- ingredients ---------- */
const INGREDIENTS = [
  { icon: Heart, name: "فاكهة التنين", desc: "غنية بالألياف ومضادات الأكسدة لدعم صحة الأمعاء." },
  { icon: Apple, name: "الرمان", desc: "مصدر طبيعي للبوليفينولات التي تحمي القلب والجلد." },
  { icon: Wheat, name: "بذور الكتان", desc: "أحماض أوميغا-3 وألياف تساعد على الهضم السليم." },
];
function Ingredients() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <SectionHeader kicker="المكونات" title="مكونات نباتية مختارة بعناية" />
        <div className="grid md:grid-cols-3 gap-6">
          {INGREDIENTS.map((i) => (
            <div key={i.name} className="text-center p-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gold/15 text-gold flex items-center justify-center mb-4">
                <i.icon className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl mb-2">{i.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- how to use ---------- */
const STEPS = [
  { icon: Package, text: "افتح العلبة" },
  { icon: Pill, text: "تناول كبسولتين" },
  { icon: Sun, text: "مع كأس ماء صباحاً" },
];
function HowToUse() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader kicker="طريقة الاستخدام" title="3 خطوات بسيطة" />
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6 text-center relative">
              <div className="absolute -top-4 right-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-gold text-ink font-black flex items-center justify-center">
                {i + 1}
              </div>
              <s.icon className="w-10 h-10 mx-auto text-gold mt-3 mb-3" />
              <p className="font-semibold">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- before/after ---------- */
const BEFORE = ["انتفاخ مزعج", "هضم بطيء", "تعب متكرر", "مناعة ضعيفة"];
const AFTER = ["راحة في المعدة", "هضم أفضل وأسرع", "طاقة وحيوية", "مناعة أقوى"];
function BeforeAfter() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <SectionHeader kicker="النتائج" title="قبل و بعد 30 يوم" />
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-destructive/30 p-6 bg-destructive/5">
            <h3 className="font-bold text-lg mb-4 text-destructive">قبل الاستخدام</h3>
            <ul className="space-y-3">
              {BEFORE.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <X className="w-5 h-5 text-destructive shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-gold p-6 bg-gold/5">
            <h3 className="font-bold text-lg mb-4 text-gold">بعد 30 يوم</h3>
            <ul className="space-y-3">
              {AFTER.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-gold shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- testimonials ---------- */
const REVIEWS = [
  { name: "سارة م.", city: "تيزي وزو", text: "بعد شهر من VELUM، هضمي تحسن كثيراً وشعرت بطاقة لم أعهدها من قبل. أنصح به بشدة!" },
  { name: "كريم ب.", city: "الجزائر العاصمة", text: "منتج ممتاز ومكونات طبيعية 100%. الانتفاخ اختفى تقريباً وأنا أتناوله بانتظام." },
  { name: "نور الدين ح.", city: "وهران", text: "جودة عالية وتوصيل سريع. سعيد جداً بالنتائج وسأكرر الطلب بدون تردد." },
];
function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader kicker="آراء العملاء" title="ماذا يقولون عن VELUM" />
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{r.name}</span> — {r.city}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- order section ---------- */
function OrderSection() {
  const { settings } = useStore();
  const [qty, setQty] = useState(1);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const price = settings?.price ?? 2500;
  const subtotal = price * qty;
  const discountAmount = appliedPromo ? Math.round(subtotal * (appliedPromo.discount / 100)) : 0;
  const total = subtotal - discountAmount;

  const applyPromo = () => {
    if (!settings) return;
    if (!settings.promo_active) {
      setPromoMsg({ ok: false, msg: "كود الخصم غير صحيح" });
      return;
    }
    if (promoInput.trim().toUpperCase() === settings.promo_code.toUpperCase()) {
      setAppliedPromo({ code: settings.promo_code, discount: settings.promo_discount });
      setPromoMsg({ ok: true, msg: `تم تطبيق الكود! خصم ${settings.promo_discount}%` });
    } else {
      setAppliedPromo(null);
      setPromoMsg({ ok: false, msg: "كود الخصم غير صحيح" });
    }
  };

  const validPhone = (p: string) => /^(05|06|07)\d{8}$/.test(p.replace(/\s/g, ""));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("الرجاء إدخال الاسم الكامل");
    if (!validPhone(form.phone)) return toast.error("رقم هاتف جزائري غير صالح (مثال: 0555000000)");
    if (!form.wilaya) return toast.error("الرجاء اختيار الولاية");
    setSubmitting(true);
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name.trim(),
        customer_phone: form.phone.replace(/\s/g, ""),
        wilaya: form.wilaya,
        quantity: qty,
        unit_price: price,
        total_price: total,
        promo_code_used: appliedPromo?.code ?? null,
        discount_applied: discountAmount,
        notes: form.notes.trim() || null,
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error("فشل إرسال الطلب: " + error.message);
      return;
    }
    setSuccessId(data.id.slice(0, 8).toUpperCase());
    setForm({ name: "", phone: "", wilaya: "", notes: "" });
    setQty(1);
    setAppliedPromo(null);
    setPromoInput("");
    setPromoMsg(null);
  };

  return (
    <section id="order" className="py-20 md:py-24 bg-ink text-cream rounded-t-[3rem]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3 font-black">اطلب الآن</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">احصل على VELUM إلى باب منزلك</h2>
          <p className="text-gold text-sm font-bold mt-3">الدفع عند الاستلام</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* product card */}
          <div className="bg-card text-foreground rounded-3xl p-6 shadow-2xl">
            <img src={heroImg} alt="VELUM" width={400} height={400} loading="lazy"
                 className="rounded-2xl w-full" />
            <h3 className="text-2xl font-black mt-4">VELUM</h3>
            <p className="text-sm text-muted-foreground">تركيبة بريبيوتك ومضادات الأكسدة — 60 كبسولة</p>
            <div className="mt-4 text-3xl font-black text-gold">{fmtDZD(price)}</div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm">الكمية:</span>
              <div className="flex items-center border rounded-full">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold">كود الخصم</label>
              <div className="flex gap-2 mt-1">
                <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)}
                       placeholder="VELUM10"
                       className="flex-1 border rounded-md px-3 py-2 bg-background" />
                <button type="button" onClick={applyPromo}
                        className="btn-gold rounded-md px-4">تطبيق</button>
              </div>
              {promoMsg && (
                <p className={`text-xs mt-2 ${promoMsg.ok ? "text-green-600" : "text-destructive"}`}>
                  {promoMsg.msg}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t space-y-1 text-sm">
              <div className="flex justify-between"><span>المجموع</span><span>{fmtDZD(subtotal)}</span></div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم</span><span>- {fmtDZD(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black pt-2">
                <span>الإجمالي</span><span className="text-gold">{fmtDZD(total)}</span>
              </div>
            </div>
          </div>

          {/* form */}
          <form onSubmit={submit} className="bg-card text-foreground rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">معلومات التوصيل</h3>
            <div>
              <label className="text-sm font-semibold">الاسم الكامل *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                     className="w-full mt-1 border rounded-md px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-semibold">رقم الهاتف *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                     placeholder="0555000000"
                     className="w-full mt-1 border rounded-md px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-semibold">الولاية *</label>
              <select value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                      className="w-full mt-1 border rounded-md px-3 py-2 bg-background">
                <option value="">اختر الولاية</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">ملاحظات</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="w-full mt-1 border rounded-md px-3 py-2 bg-background" />
            </div>
            <button disabled={submitting} type="submit"
                    className="btn-gold w-full rounded-full py-4 text-lg disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              تأكيد الطلب
            </button>
          </form>
        </div>
      </div>

      {/* success modal */}
      {successId && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur flex items-center justify-center p-4"
             onClick={() => setSuccessId(null)}>
          <div className="bg-card text-foreground rounded-3xl p-8 max-w-md text-center shadow-2xl"
               onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gold/20 text-gold mx-auto flex items-center justify-center mb-4">
              <Check className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black mb-2">تم استلام طلبك!</h3>
            <p className="text-sm text-muted-foreground">سيتصل بك فريقنا قريباً لتأكيد التوصيل.</p>
            <div className="mt-4 bg-muted rounded-xl p-3 text-sm">
              رقم الطلب: <span className="font-black text-gold">#{successId}</span>
            </div>
            <button onClick={() => setSuccessId(null)}
                    className="btn-gold mt-6 rounded-full px-8 py-3">حسناً</button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- contact ---------- */
function Contact() {
  const { settings } = useStore();
  if (!settings) return null;
  const trackWA = async () => {
    await supabase
      .from("settings")
      .update({ whatsapp_clicks: (settings.whatsapp_clicks ?? 0) + 1 })
      .eq("id", 1);
  };
  const waUrl = `https://wa.me/${settings.phone.replace(/\D/g, "").replace(/^0/, "213")}`;
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader kicker="نحن هنا" title="تواصل معنا" />
        <a href={`tel:${settings.phone}`}
           className="inline-flex items-center gap-3 text-2xl md:text-3xl font-black text-gold mb-8">
          <Phone className="w-6 h-6" /> {settings.phone}
        </a>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href={settings.facebook_url} target="_blank" rel="noopener"
             className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition">
            <Facebook className="w-6 h-6" />
          </a>
          <a href={settings.instagram_url} target="_blank" rel="noopener"
             className="w-12 h-12 rounded-full text-white flex items-center justify-center hover:scale-110 transition"
             style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" }}>
            <Instagram className="w-6 h-6" />
          </a>
          <a href={waUrl} target="_blank" rel="noopener" onClick={trackWA}
             className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition">
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
function Footer() {
  return (
    <footer className="bg-ink text-cream py-10 border-t border-cream/10">
      <div className="container mx-auto px-4 text-center">
        <div className="text-3xl font-black text-gold">VELUM</div>
        <p className="text-sm text-cream/70 italic mt-1">طبيعي. فعّال. موثوق.</p>
        <p className="text-xs text-cream/50 mt-6">© 2024 VELUM. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */
function LandingPage() {
  const { loading } = useStore();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }
  return (
    <main className="min-h-screen">
      <LiveSocialProof />
      <Hero />
      <Countdown />
      <Benefits />
      <Ingredients />
      <HowToUse />
      <BeforeAfter />
      <Testimonials />
      <OrderSection />
      <Contact />
      <Footer />
    </main>
  );
}

function MapPinHidden() {
  // silence unused-import lint while keeping icon set tidy
  return <MapPin className="hidden" />;
}
export { MapPinHidden };
