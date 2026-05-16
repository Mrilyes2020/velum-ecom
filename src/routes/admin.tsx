import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, ShoppingBag, Settings as SettingsIcon, Tag,
  LogOut, Loader2, Search, Lock, FileText, Layers, Trash2, Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_PASSWORD = "velum2024";
const AUTH_KEY = "velum_admin_auth";

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  promo_code_used: string | null;
  discount_applied: number;
  status: string;
  notes: string | null;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
const STATUS_AR: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const fmtDZD = (n: number) => `${n.toLocaleString("fr-DZ")} دج`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleString("ar-DZ", { dateStyle: "short", timeStyle: "short" });

/* ---------- password gate ---------- */
function PasswordGate({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onOk();
    } else {
      setErr("كلمة المرور غير صحيحة");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink p-4">
      <form onSubmit={submit} className="bg-card rounded-3xl p-8 shadow-2xl w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-center">VELUM Admin</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">لوحة تحكم المدير</p>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }}
               placeholder="كلمة المرور"
               className="w-full mt-6 border rounded-md px-3 py-3 bg-background" />
        {err && <p className="text-xs text-destructive mt-2">{err}</p>}
        <button type="submit" className="btn-gold w-full mt-4 rounded-md py-3">دخول</button>
      </form>
    </div>
  );
}

/* ---------- main shell ---------- */
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);
  if (!ready) return null;
  if (!authed) return <PasswordGate onOk={() => setAuthed(true)} />;
  return <AdminShell onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"overview" | "orders" | "settings" | "content" | "promo">("overview");
  const items = [
    { key: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
    { key: "orders", label: "الطلبات", icon: ShoppingBag },
    { key: "settings", label: "الإعدادات", icon: SettingsIcon },
    { key: "content", label: "النصوص", icon: FileText },
    { key: "promo", label: "كود الخصم", icon: Tag },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="bg-ink text-cream w-16 md:w-60 shrink-0 flex flex-col">
        <div className="px-3 md:px-6 py-5 border-b border-cream/10">
          <div className="text-gold font-black text-xl text-center md:text-right">V<span className="hidden md:inline">ELUM</span></div>
        </div>
        <nav className="flex-1 py-4">
          {items.map((it) => (
            <button key={it.key} onClick={() => setTab(it.key)}
                    className={`w-full flex items-center gap-3 px-3 md:px-6 py-3 text-sm transition ${tab === it.key ? "bg-gold/20 text-gold border-r-4 border-gold" : "hover:bg-cream/5"}`}>
              <it.icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">{it.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout}
                className="m-3 flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-md bg-cream/10 hover:bg-cream/20 text-sm">
          <LogOut className="w-4 h-4" /><span className="hidden md:inline">خروج</span>
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <h1 className="font-black text-lg">VELUM Admin</h1>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("ar-DZ")}</span>
        </header>
        <div className="p-6">
          {tab === "overview" && <Overview />}
          {tab === "orders" && <OrdersTab />}
          {tab === "settings" && <SettingsTab />}
          {tab === "content" && <ContentTab />}
          {tab === "promo" && <PromoTab />}
        </div>
      </main>
    </div>
  );
}

/* ---------- overview ---------- */
function Overview() {
  const { settings } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data ?? []) as Order[]);
      setLoading(false);
    });
  }, []);
  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  const today = new Date().toDateString();
  const todayCount = orders.filter((o) => new Date(o.created_at).toDateString() === today).length;
  const sales = orders
    .filter((o) => ["confirmed", "delivered", "shipped"].includes(o.status))
    .reduce((s, o) => s + o.total_price, 0);
  const byStatus = STATUSES.map((s) => ({ s, n: orders.filter((o) => o.status === s).length }));
  const maxN = Math.max(1, ...byStatus.map((x) => x.n));

  const cards = [
    { label: "إجمالي الطلبات", value: orders.length },
    { label: "طلبات اليوم", value: todayCount },
    { label: "إجمالي المبيعات", value: fmtDZD(sales) },
    { label: "نقرات واتساب", value: settings?.whatsapp_clicks ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border rounded-2xl p-5">
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-black text-gold mt-2">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-4">الطلبات حسب الحالة</h3>
        <div className="space-y-2">
          {byStatus.map((x) => (
            <div key={x.s} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0">{STATUS_AR[x.s]}</span>
              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-gold h-full transition-all" style={{ width: `${(x.n / maxN) * 100}%` }} />
              </div>
              <span className="w-8 text-left font-bold">{x.n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-4">آخر 5 طلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground text-right">
              <tr><th className="p-2">الاسم</th><th className="p-2">الولاية</th><th className="p-2">الكمية</th><th className="p-2">الإجمالي</th><th className="p-2">الحالة</th><th className="p-2">التاريخ</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.customer_name}</td>
                  <td className="p-2">{o.wilaya}</td>
                  <td className="p-2">{o.quantity}</td>
                  <td className="p-2 font-bold text-gold">{fmtDZD(o.total_price)}</td>
                  <td className="p-2"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>{STATUS_AR[o.status]}</span></td>
                  <td className="p-2 text-xs text-muted-foreground">{fmtDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- orders ---------- */
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusF && o.status !== statusF) return false;
      if (!qq) return true;
      return (
        o.customer_name.toLowerCase().includes(qq) ||
        o.customer_phone.includes(qq) ||
        o.wilaya.toLowerCase().includes(qq)
      );
    });
  }, [orders, q, statusF]);

  const updateStatus = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("فشل التحديث"); load(); }
    else toast.success("تم تحديث الحالة ✓");
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث: الاسم، الهاتف، الولاية"
                 className="w-full border rounded-md pr-10 pl-3 py-2 bg-background text-sm" />
        </div>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
                className="border rounded-md px-3 py-2 bg-background text-sm">
          <option value="">كل الحالات</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
        </select>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">لا توجد طلبات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs text-right">
                <tr>
                  <th className="p-3">الاسم</th><th className="p-3">الهاتف</th><th className="p-3">الولاية</th>
                  <th className="p-3">الكمية</th><th className="p-3">الإجمالي</th><th className="p-3">كود الخصم</th>
                  <th className="p-3">الحالة</th><th className="p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-muted/40">
                    <td className="p-3 font-medium">{o.customer_name}</td>
                    <td className="p-3 text-muted-foreground">{o.customer_phone}</td>
                    <td className="p-3">{o.wilaya}</td>
                    <td className="p-3">{o.quantity}</td>
                    <td className="p-3 font-bold text-gold">{fmtDZD(o.total_price)}</td>
                    <td className="p-3 text-xs">{o.promo_code_used || "—"}</td>
                    <td className="p-3">
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full border-0 ${STATUS_COLOR[o.status]}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{fmtDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- settings ---------- */
function SettingsTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [price, setPrice] = useState(settings?.price ?? 2500);
  const [price30, setPrice30] = useState(settings?.price_30 ?? 1500);
  const [phone, setPhone] = useState(settings?.phone ?? "");
  const [fb, setFb] = useState(settings?.facebook_url ?? "");
  const [ig, setIg] = useState(settings?.instagram_url ?? "");
  useEffect(() => {
    if (!settings) return;
    setPrice(settings.price); setPrice30(settings.price_30); setPhone(settings.phone);
    setFb(settings.facebook_url); setIg(settings.instagram_url);
  }, [settings]);

  const save = async (patch: Partial<NonNullable<typeof settings>>, label: string) => {
    updateLocal(patch);
    const { error } = await supabase.from("settings").update(patch).eq("id", 1);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success(`${label} — تم الحفظ بنجاح ✓`);
  };

  if (!settings) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">سعر عبوة 60 كبسولة</h3>
        <p className="text-xs text-muted-foreground mb-3">السعر بالدينار الجزائري</p>
        <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ price }, "سعر 60")} className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">سعر عبوة 30 كبسولة</h3>
        <p className="text-xs text-muted-foreground mb-3">السعر بالدينار الجزائري</p>
        <input type="number" value={price30} onChange={(e) => setPrice30(+e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ price_30: price30 }, "سعر 30")} className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-3">رقم الهاتف</h3>
        <input value={phone} onChange={(e) => setPhone(e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ phone }, "رقم الهاتف")} className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-3">روابط التواصل</h3>
        <label className="text-sm">Facebook URL</label>
        <input value={fb} onChange={(e) => setFb(e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background mb-3" />
        <label className="text-sm">Instagram URL</label>
        <input value={ig} onChange={(e) => setIg(e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ facebook_url: fb, instagram_url: ig }, "روابط التواصل")}
                className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
    </div>
  );
}

/* ---------- content (editable site texts) ---------- */
const CONTENT_FIELDS: { key: keyof import("@/lib/store-context").SiteContent; label: string; long?: boolean }[] = [
  { key: "hero_badge", label: "شارة الهيرو (أعلى العنوان)" },
  { key: "hero_title", label: "العنوان الرئيسي" },
  { key: "hero_subtitle", label: "العنوان الفرعي" },
  { key: "hero_tagline", label: "الشعار القصير" },
  { key: "hero_description", label: "الوصف في الهيرو", long: true },
  { key: "hero_cta", label: "نص زر الطلب الرئيسي" },
  { key: "product_name", label: "اسم المنتج" },
  { key: "product_short_desc", label: "وصف المنتج القصير" },
  { key: "order_title", label: "عنوان قسم الطلب" },
  { key: "order_subtitle", label: "نص أسفل عنوان الطلب" },
  { key: "footer_tagline", label: "شعار الفوتر" },
  { key: "footer_copyright", label: "نص حقوق النشر" },
];

function ContentTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [draft, setDraft] = useState(settings?.content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.content) setDraft(settings.content);
  }, [settings]);

  if (!settings || !draft) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  const setField = (k: keyof typeof draft, v: string) =>
    setDraft({ ...draft, [k]: v });

  const saveAll = async () => {
    setSaving(true);
    updateLocal({ content: draft });
    const { error } = await supabase.from("settings").update({ content: draft }).eq("id", 1);
    setSaving(false);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success("تم حفظ النصوص بنجاح ✓");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">تعديل نصوص الموقع</h3>
        <p className="text-xs text-muted-foreground">قم بتحرير النصوص الظاهرة للزوار. التغييرات تظهر مباشرة بعد الحفظ.</p>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-4">
        {CONTENT_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-semibold">{f.label}</label>
            {f.long ? (
              <textarea
                value={(draft[f.key] as string) ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                rows={3}
                className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm resize-none"
              />
            ) : (
              <input
                value={(draft[f.key] as string) ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={saveAll} disabled={saving}
                className="btn-gold rounded-md px-6 py-3 font-bold disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          حفظ كل التغييرات
        </button>
        <button onClick={() => setDraft(settings.content)}
                className="rounded-md px-6 py-3 border font-bold hover:bg-muted">
          استعادة
        </button>
      </div>
    </div>
  );
}

/* ---------- promo ---------- */
function PromoTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [code, setCode] = useState(settings?.promo_code ?? "");
  const [disc, setDisc] = useState(settings?.promo_discount ?? 10);
  const [active, setActive] = useState(settings?.promo_active ?? true);
  const [usage, setUsage] = useState<number>(0);

  useEffect(() => {
    if (!settings) return;
    setCode(settings.promo_code); setDisc(settings.promo_discount); setActive(settings.promo_active);
  }, [settings]);

  useEffect(() => {
    supabase.from("orders").select("id", { count: "exact", head: true })
      .not("promo_code_used", "is", null)
      .then(({ count }) => setUsage(count ?? 0));
  }, []);

  const save = async () => {
    const patch = { promo_code: code, promo_discount: disc, promo_active: active };
    updateLocal(patch);
    const { error } = await supabase.from("settings").update(patch).eq("id", 1);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success("تم الحفظ بنجاح ✓");
  };

  if (!settings) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  return (
    <div className="max-w-xl space-y-5">
      <div className="bg-card border rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold">حالة كود الخصم</h3>
          <p className="text-xs text-muted-foreground mt-1">{active ? "مفعّل" : "معطّل"}</p>
        </div>
        <button onClick={() => setActive((v) => !v)}
                className={`w-14 h-8 rounded-full transition relative ${active ? "bg-gold" : "bg-muted"}`}>
          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${active ? "right-1" : "right-7"}`} />
        </button>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold">كود الخصم</label>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                 className="w-full mt-1 border rounded-md px-3 py-2 bg-background uppercase" />
        </div>
        <div>
          <label className="text-sm font-semibold">نسبة الخصم (%)</label>
          <input type="number" min={1} max={100} value={disc}
                 onChange={(e) => setDisc(Math.max(1, Math.min(100, +e.target.value)))}
                 className="w-full mt-1 border rounded-md px-3 py-2 bg-background" />
        </div>
        <div className="bg-gold/10 border border-gold/40 rounded-md p-3 text-sm">
          الكود الحالي: <b className="text-gold">{code || "—"}</b> — خصم <b>{disc}%</b>
        </div>
        <button onClick={save} className="btn-gold rounded-md px-6 py-2">حفظ التغييرات</button>
      </div>

      <div className="bg-card border rounded-2xl p-5">
        <div className="text-xs text-muted-foreground">عدد مرات استخدام الكود</div>
        <div className="text-3xl font-black text-gold mt-1">{usage}</div>
      </div>
    </div>
  );
}
