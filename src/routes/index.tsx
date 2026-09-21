import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, ChevronUp, Heart, MapPin, Maximize2, Music2, Navigation, Pause, Phone, Share2, Sparkles, X } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import a1 from "@/assets/TVT00967.jpg";
import a2 from "@/assets/TVT00864.jpg";
import a3 from "@/assets/TVT01258.jpg";
import a4 from "@/assets/TVT01234.jpg";
import a5 from "@/assets/TVT01222.jpg";
import a6 from "@/assets/TVT01187.jpg";
import a7 from "@/assets/TVT01136.jpg";
import a8 from "@/assets/TVT01066.jpg";
import a9 from "@/assets/TVT01057.jpg";
import musicUrl from "@/assets/leDuong.mp3";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Thiệp cưới Thảo My & Xuân Tú — 03.10.2026" },
    { name: "description", content: "Cùng Thảo My và Xuân Tú đếm ngược đến ngày chúng mình trở thành gia đình." },
    { property: "og:title", content: "Thảo My & Xuân Tú — Save the date" },
    { property: "og:description", content: "Hai con người. Hai hành trình. Một đích đến — 03.10.2026" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: WeddingInvitation,
});

const [img1, , img3, img4, img5, img6, img7, img8, img9] = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
const gallery = [img1, img3, img4, img5, img6, img7, img8, img9];
const storyPhoto = [img4, img5, img6, img7];
const weddingDate = new Date("2026-10-03T10:00:00+07:00").getTime();

function IconButton({ label, onClick, children, className = "" }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return <Button type="button" variant="glass" size="iconLg" aria-label={label} title={label} onClick={onClick} className={className}>{children}</Button>;
}

function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [qr, setQr] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishes, setWishes] = useState<Array<{ id: string; guest_name: string; message: string }>>([]);
  const [wishStatus, setWishStatus] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef(0);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrevious = useCallback(() => setLightboxIndex((current) => current === null ? null : (current - 1 + gallery.length) % gallery.length), []);
  const showNext = useCallback(() => setLightboxIndex((current) => current === null ? null : (current + 1) % gallery.length), []);

  useEffect(() => {
    const update = () => {
      const distance = Math.max(0, weddingDate - Date.now());
      setCountdown({ days: Math.floor(distance / 86400000), hours: Math.floor(distance / 3600000) % 24, minutes: Math.floor(distance / 60000) % 60, seconds: Math.floor(distance / 1000) % 60 });
    };
    update();
    const timer = window.setInterval(update, 1000);
    const onScroll = () => setProgress(Math.min(100, (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100));
    window.addEventListener("scroll", onScroll, { passive: true });
    QRCode.toDataURL(window.location.href, { width: 220, margin: 1, color: { dark: "#2f4453", light: "#fffdf9" } }).then(setQr).catch(() => setQr(""));
    return () => { window.clearInterval(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [closeLightbox, lightboxIndex, showNext, showPrevious]);

  useEffect(() => {
    if (!opened) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((item, index) => { item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`; observer.observe(item); });
    return () => observer.disconnect();
  }, [opened]);

  const calendarUrl = useMemo(() => {
    const details = encodeURIComponent("Lễ thành hôn Thảo My & Xuân Tú tại tư gia nhà trai, Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên.");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Lễ thành hôn Thảo My & Xuân Tú")}&dates=20261003T030000Z/20261003T050000Z&details=${details}`;
  }, []);

  async function enterInvitation() {
    if (opening) return;
    setOpening(true);
    try { await audioRef.current?.play(); setPlaying(true); } catch { setPlaying(false); }
    window.setTimeout(() => setOpened(true), 3200);
  }
  async function toggleMusic() {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause(); else await audioRef.current.play();
    setPlaying(!playing);
  }
  async function share() {
    const data = { title: "Thiệp cưới Thảo My & Xuân Tú", text: "03.10.2026 — Hẹn gặp bạn trong ngày vui của chúng mình!", url: window.location.href };
    if (navigator.share) await navigator.share(data).catch(() => undefined);
    else { await navigator.clipboard.writeText(window.location.href); window.alert("Đã sao chép đường dẫn thiệp."); }
  }
  function addAppleCalendar() {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "DTSTART:20261003T030000Z", "DTEND:20261003T050000Z", "SUMMARY:Lễ thành hôn Thảo My & Xuân Tú", "LOCATION:Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "thao-my-xuan-tu.ics"; a.click(); URL.revokeObjectURL(a.href);
  }
  async function submitWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setWishStatus("Đang gửi...");
    const formElement = event.currentTarget;
    const form = new FormData(formElement); const guest_name = String(form.get("wishName") ?? ""); const message = String(form.get("message") ?? "");
    const wish = { id: crypto.randomUUID(), guest_name, message };
    setWishes((current) => [wish, ...current]);
    setWishStatus("Lời chúc đã được gửi đến hai chúng mình.");
    formElement.reset();
  }

  return <main className="paper-texture min-h-screen text-foreground">
    <audio ref={audioRef} src={musicUrl} loop preload="metadata" />
    {!opened && <div className={`invitation-cover fixed inset-0 z-50 grid place-items-center overflow-hidden px-6 ${opening ? "is-opening" : ""}`}>
      <img aria-hidden src={img1} className="cover-photo absolute inset-0 h-full w-full object-cover object-[50%_32%]" alt="" />
      <div aria-hidden className="cover-photo-shade absolute inset-0" />
      <div aria-hidden className="cover-floor absolute inset-x-0 bottom-0 h-[34%]" />
      <span aria-hidden className="cover-petal petal-one" /><span aria-hidden className="cover-petal petal-two" /><span aria-hidden className="cover-petal petal-three" /><span aria-hidden className="cover-petal petal-four" />
      <span aria-hidden className="cover-aura pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <p className="cover-whisper absolute top-[11%] text-center font-display text-[1.6rem] italic leading-[1.9]">Một lời hẹn<br/>đang đợi bàn tay bạn<br/>chạm vào…</p>
      <Button type="button" variant="envelope" onClick={enterInvitation} aria-label="Mở thiệp cưới" className="envelope-scene relative mt-12 aspect-[1.28] h-auto w-full max-w-[360px] overflow-visible border-0 bg-transparent p-0 shadow-none hover:scale-100 sm:mt-8">
        <span className="envelope-back absolute inset-x-0 bottom-0 z-10 block h-[88%] overflow-hidden film-shadow">
          <span className="envelope-liner absolute inset-0" />
          <span className="envelope-edge absolute inset-x-0 top-0 h-px" />
        </span>
        <span className="invitation-card absolute inset-x-[8%] bottom-[4%] z-20 flex h-[calc(76%+11px)] flex-col items-center overflow-hidden border border-primary/15 bg-card px-5 pt-4 text-center shadow-xl">
          <span className="card-glint absolute inset-y-0 -left-1/3 w-1/3" />
          <span className="text-[8px] uppercase tracking-[.24em] text-muted-foreground">Trân trọng báo tin vui</span>
          <span className="mt-3 font-display text-[2.35rem] leading-none">Thảo My</span>
          <span className="my-1 font-display text-xl italic text-accent">&</span>
          <span className="font-display text-[2.35rem] leading-none">Xuân Tú</span>
          <span className="mt-4 h-px w-9 bg-primary/35" />
          <span className="mt-3 text-[9px] tracking-[.22em] text-muted-foreground">03 · 10 · 2026</span>
          <span className="card-photo absolute inset-x-3 bottom-3 top-[55%] overflow-hidden"><img src={img1} alt="" className="h-full w-full object-cover object-[50%_27%]" /></span>
        </span>
        <span className="envelope-front absolute inset-x-0 bottom-0 z-30 block h-[88%] overflow-hidden">
          <span className="envelope-left absolute inset-y-0 left-0 w-[53%] [clip-path:polygon(0_0,100%_52%,0_100%)]" />
          <span className="envelope-right absolute inset-y-0 right-0 w-[53%] [clip-path:polygon(100%_0,0_52%,100%_100%)]" />
          <span className="envelope-pocket absolute inset-x-0 bottom-0 h-[64%] [clip-path:polygon(0_100%,0_36%,50%_0,100%_36%,100%_100%)]" />
        </span>
        <span className="envelope-flap absolute inset-x-0 top-[12%] z-40 block h-[33%] origin-top [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        <span className="wax-seal absolute left-1/2 top-[45%] z-50 grid h-[4.35rem] w-[4.35rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-xl italic text-primary-foreground">M · T<span className="seal-ring absolute inset-1 rounded-full border border-primary-foreground/30" /><span className="seal-dot absolute inset-[.65rem] rounded-full border border-primary-foreground/15" /></span>
        <span className="open-label absolute left-1/2 top-[calc(100%+1.3rem)] z-40 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[.22em] text-foreground">Chạm để mở<span className="mt-3 flex justify-center gap-1.5"><i/><i/><i/></span></span>
      </Button>
    </div>}
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-border no-print"><div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div>
    {[8, 29, 53, 76, 91].map((left, i) => <i key={left} className="petal" style={{ left: `${left}%`, animationDelay: `${i * 2.4}s` }} />)}
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2 no-print">
      <IconButton label={playing ? "Tạm dừng nhạc" : "Phát nhạc"} onClick={toggleMusic}>{playing ? <Pause size={18} /> : <Music2 size={18} />}</IconButton>
      <IconButton label="Chia sẻ thiệp" onClick={share}><Share2 size={18} /></IconButton>
      {progress > 18 && <IconButton label="Lên đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ChevronUp size={19} /></IconButton>}
    </div>

    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-foreground">
      <img src={img1} alt="Thảo My và Xuân Tú trong ngày cưới" className="hero-photo absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
      <div className="hero-vignette absolute inset-0" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-end px-5 pb-12 text-center text-primary-foreground">
        <p className="mb-4 text-[10px] uppercase tracking-[.3em] text-primary-foreground/85">03 · 10 · 2026</p>
        <h1 className="text-[3.6rem] leading-[.9] sm:text-8xl">Thảo My<br/><span className="text-secondary">&</span> Xuân Tú</h1>
        <p className="mt-6 font-display text-lg italic leading-[2]">Hai con người,<br/>hai hành trình,<br/>một đích đến.</p>
        <span aria-hidden className="scroll-hint mt-8 block h-12 w-px text-primary-foreground/70"><i /></span>
      </div>
    </section>

    <section id="invitation" className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-16 md:grid-cols-[.85fr_1.15fr] md:py-24">
      <div className="reveal"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Chương I · Lời mời</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Ngày chúng mình<br/>gọi nhau là gia đình</h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Sẽ thật trọn vẹn nếu ngày ấy có nụ cười của bạn.</p></div>
      <Button type="button" variant="image" onClick={() => setLightboxIndex(gallery.indexOf(img3))} className="reveal reveal-slow relative ml-auto h-auto w-full overflow-hidden p-0"><img src={img3} alt="Ảnh cưới của Thảo My và Xuân Tú" className="aspect-[3/4] w-full object-cover"/><span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-foreground/45 text-primary-foreground backdrop-blur"><Maximize2 size={18}/></span></Button>
    </section>

    <section className="bg-foreground px-5 py-16 text-primary-foreground md:py-24">
      <div className="reveal mx-auto max-w-4xl text-center"><p className="text-[10px] uppercase tracking-[.3em] text-secondary">03 · 10 · 2026</p><h2 className="mt-3 text-[2.2rem] leading-tight md:text-4xl">Đếm ngược đến ngày vui</h2>
        <div className="mt-10 grid grid-cols-4 gap-2">{Object.entries(countdown).map(([label, value]) => <div key={label} className="border-y border-primary-foreground/20 py-5"><strong className="block font-display text-3xl sm:text-5xl">{String(value).padStart(2,"0")}</strong><span className="mt-2 block text-[9px] uppercase tracking-[.16em] text-primary-foreground/65">{{days:"Ngày",hours:"Giờ",minutes:"Phút",seconds:"Giây"}[label as keyof typeof countdown]}</span></div>)}</div>
      </div>
    </section>

    <section id="story" className="mx-auto max-w-4xl px-6 py-16 md:py-24"><div className="reveal"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Chương II · Chuyện chúng mình</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Từ hai câu chuyện,<br/>thành một hành trình</h2></div>
      <div className="mt-12 grid gap-10">{[
        ["01", "Ngày mình gặp nhau", "Giữa rất nhiều người, mình nhận ra một ánh mắt."],
        ["02", "Ngày thương gọi thành tên", "Những câu chuyện không đầu không cuối thành điều mong mỗi ngày."],
        ["03", "Lời hứa cho mai sau", "Chỉ cần đúng người và một câu đồng ý."],
        ["04", "Ngày về chung một nhà", "03.10.2026 — chương đẹp nhất được viết tiếp."],
      ].map(([n,title,text], i) => <article key={n} className={`reveal grid grid-cols-[5.5rem_1fr] items-center gap-5 sm:grid-cols-[9rem_1fr] sm:gap-8 ${i % 2 ? "sm:[direction:rtl] sm:[&>*]:[direction:ltr]" : ""}`}>
        <img src={storyPhoto[i]} alt={title} loading="lazy" className="story-photo aspect-[3/4] w-full object-cover object-[50%_25%]"/>
        <div className="min-w-0"><span className="text-[10px] tracking-[.3em] text-accent">{n}</span><h3 className="mt-2 text-2xl leading-snug sm:text-3xl">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></div>
      </article>)}</div>
    </section>

    <section id="gallery" className="gallery-stage py-16 md:py-24"><div className="mx-auto max-w-6xl"><div className="reveal px-6 text-center"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Chương III · Những thước phim</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Một đời, thật nhiều dịu dàng</h2><p className="mx-auto mt-3 text-xs text-muted-foreground">Chạm vào ảnh để xem trọn khoảnh khắc</p></div>
      <div className="mt-10 grid grid-cols-2 items-start gap-1.5 px-1.5 sm:gap-3 sm:px-3 md:grid-cols-3">{gallery.map((src,i) => { const featured = i === 0; return <Button type="button" variant="image" key={src} onClick={() => setLightboxIndex(i)} className={`gallery-tile reveal group relative h-auto w-full min-w-0 overflow-hidden p-0 aspect-[3/4] ${featured ? "col-span-2 aspect-[4/5] md:col-span-1 md:aspect-[3/4]" : ""}`}><img src={src} alt={`Khoảnh khắc cưới ${i+1}`} loading="lazy" className="absolute inset-0 block h-full w-full object-cover object-[50%_25%] transition duration-700 group-hover:scale-[1.035]"/><span className="gallery-sheen absolute inset-0"/><span className="absolute bottom-3 left-3 font-display text-sm italic text-primary-foreground/90">{String(i+1).padStart(2,"0")}</span></Button>; })}</div></div>
    </section>

    <section id="date" className="mx-auto max-w-5xl px-6 py-16 md:py-24"><div className="grid gap-8 md:grid-cols-2"><div className="reveal"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Chương IV · Hẹn ngày</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Tháng Mười<br/>mình có hẹn</h2></div><div className="reveal"><Calendar /></div></div>
      <div className="reveal mt-12 grid gap-4 md:grid-cols-2"><EventCard label="Tiệc mừng nhà gái" time="18:00 · Thứ Sáu" date="02.10.2026" lunar="22 tháng 08 năm Bính Ngọ" address="Cuối nhà thờ Cát Phú, Thôn Phú Bình, Xã Xuân Giang, Tỉnh Ninh Bình"/><EventCard label="Lễ thành hôn nhà trai" time="10:00 · Thứ Bảy" date="03.10.2026" lunar="23 tháng 08 năm Bính Ngọ" address="Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên"/></div>
    </section>

    <section className="bg-secondary/25 px-6 py-16 md:py-24"><div className="mx-auto max-w-5xl"><div className="reveal text-center"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Hai nơi yêu thương</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Hai gia đình</h2></div><div className="reveal mt-10 grid gap-4 md:grid-cols-2"><FamilyCard side="Nhà gái" father="Ông Tống Văn Chức" mother="Bà Phạm Thị Ngân" address="Thôn Phú Bình, Xã Xuân Giang, Tỉnh Ninh Bình" query="Cuối nhà thờ Cát Phú, Xuân Giang, Ninh Bình"/><FamilyCard side="Nhà trai" father="Ông Trần Xuân Sinh" mother="Bà Phạm Thị Kim Thủy" address="Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên" query="Chợ Gồ, Hiệp Cường, Hưng Yên"/></div></div></section>

    <section id="schedule" className="mx-auto max-w-4xl px-6 py-16 md:py-24"><div className="reveal"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Chương V · Chương trình</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Hai ngày vui,<br/>một lời hẹn</h2></div><div className="reveal mt-10 space-y-0"><Schedule time="18:00 · 02.10" title="Tiệc mừng tại nhà gái" place="Tư gia nhà gái · Ninh Bình"/><Schedule time="10:00 · 03.10" title="Lễ thành hôn tại nhà trai" place="Tư gia nhà trai · Hưng Yên"/></div><div className="reveal mt-8 flex flex-wrap gap-3"><a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"><CalendarPlus size={17}/> Google Calendar</a><button type="button" onClick={addAppleCalendar} className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary"><CalendarPlus size={17}/> Apple Calendar</button></div></section>


    <section id="wishes" className="mx-auto max-w-5xl px-6 py-16 md:py-24"><div className="reveal text-center"><p className="text-[10px] uppercase tracking-[.3em] text-primary">Những điều thương mến</p><h2 className="mt-3 text-[2.6rem] leading-[1.1] md:text-5xl">Gửi một lời chúc</h2></div><form onSubmit={submitWish} className="reveal mx-auto mt-8 grid max-w-xl gap-3"><Field name="wishName" label="Tên của bạn" required light/><label className="grid gap-2 text-sm">Lời chúc<textarea required name="message" maxLength={500} rows={3} className="rounded-sm border border-border bg-card p-4"/></label><button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground"><Heart size={17}/> Gửi lời chúc</button>{wishStatus && <p role="status" className="text-center text-sm text-primary">{wishStatus}</p>}</form><div className="mx-auto mt-10 grid max-w-2xl gap-3">{wishes.length ? wishes.map(w=><div key={w.id} className="grid grid-cols-[auto_1fr_auto] gap-3 rounded-sm border border-border bg-card p-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-display text-lg text-secondary-foreground">{w.guest_name.charAt(0).toUpperCase()}</div><div className="min-w-0"><strong className="text-sm">{w.guest_name}</strong><p className="mt-1 text-sm leading-6 text-muted-foreground">{w.message}</p></div><Heart size={16} className="mt-1 text-accent"/></div>) : <p className="text-center text-sm text-muted-foreground">Hãy là người đầu tiên gửi lời chúc đến hai chúng mình.</p>}</div></section>

    <section className="relative min-h-[82svh] overflow-hidden bg-foreground"><img src={img9} alt="Thảo My và Xuân Tú dưới tấm voan cưới" className="absolute inset-0 h-full w-full object-cover opacity-60"/><div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent"/><div className="relative mx-auto flex min-h-[82svh] max-w-xl flex-col items-center justify-end px-6 pb-20 text-center text-primary-foreground"><Sparkles className="mb-5 text-secondary"/><p className="font-display text-lg italic leading-[2] text-primary-foreground/80">Cảm ơn bạn đã đi hết<br/>câu chuyện của chúng mình.</p><h2 className="mt-6 text-5xl">The End</h2><p className="mt-2 text-xs uppercase tracking-[.28em] text-secondary">See you there</p><div className="mt-10 flex items-center gap-4">{qr && <img src={qr} alt="Mã QR thiệp cưới" className="h-24 w-24 rounded-sm"/>}<div className="text-left text-xs leading-6 text-primary-foreground/65">Thảo My & Xuân Tú<br/>03 · 10 · 2026</div></div></div></section>

     {lightboxIndex !== null && <div role="dialog" aria-modal="true" aria-label="Xem ảnh cưới" className="lightbox fixed inset-0 z-50 grid place-items-center bg-foreground p-0" onClick={closeLightbox} onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? 0; }} onTouchEnd={(event) => { const distance = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current; if (Math.abs(distance) > 45) distance > 0 ? showPrevious() : showNext(); }}><div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-foreground/75 to-transparent px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]"><span className="text-xs tracking-[.18em] text-primary-foreground/75">{String(lightboxIndex+1).padStart(2,"0")} / {gallery.length}</span><IconButton label="Đóng ảnh" onClick={closeLightbox}><X size={20}/></IconButton></div><img src={gallery[lightboxIndex]} alt={`Ảnh cưới ${lightboxIndex+1}`} className="h-full w-full object-contain" onClick={e=>e.stopPropagation()}/><div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-5 bg-gradient-to-t from-foreground/80 to-transparent px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-12"><IconButton label="Ảnh trước" onClick={showPrevious}><ChevronLeft size={21}/></IconButton><p className="text-center text-[10px] uppercase tracking-[.2em] text-primary-foreground/60">Vuốt để xem tiếp</p><IconButton label="Ảnh tiếp theo" onClick={showNext}><ChevronRight size={21}/></IconButton></div></div>}
  </main>;
}

function Calendar() {
  const days = ["T2","T3","T4","T5","T6","T7","CN"];
  return <div className="rounded-sm border border-border bg-card p-5 film-shadow"><div className="flex items-center justify-between border-b border-border pb-4"><span className="font-display text-2xl">October</span><span className="text-sm text-muted-foreground">2026</span></div><div className="mt-4 grid grid-cols-7 gap-1 text-center">{days.map(d=><span key={d} className="py-2 text-[10px] uppercase text-muted-foreground">{d}</span>)}{[...Array(3)].map((_,i)=><span key={`blank-${i}`}/>)}{[...Array(31)].map((_,i)=>{const n=i+1;return <span key={n} className={`relative grid aspect-square place-items-center text-sm ${n===3 ? "rounded-full bg-secondary font-semibold text-secondary-foreground" : ""}`}>{n}{n===3&&<Heart size={12} fill="currentColor" className="absolute -top-1 -right-0"/>}</span>})}</div></div>;
}

function EventCard({ label,time,date,lunar,address }: { label:string;time:string;date:string;lunar:string;address:string }) {
  return <article className="rounded-sm border border-border bg-card p-6"><p className="text-xs uppercase tracking-[.18em] text-primary">{label}</p><h3 className="mt-4 text-3xl">{time}</h3><p className="mt-1 font-medium">{date}</p><p className="mt-1 text-sm text-muted-foreground">Âm lịch · {lunar}</p><div className="mt-6 flex gap-3 border-t border-border pt-5 text-sm leading-6 text-muted-foreground"><MapPin size={18} className="mt-1 shrink-0 text-accent"/>{address}</div></article>;
}
function FamilyCard({side,father,mother,address,query}:{side:string;father:string;mother:string;address:string;query:string}) {
  return <article className="rounded-sm border border-border bg-card p-7 text-center"><p className="text-xs uppercase tracking-[.2em] text-primary">{side}</p><h3 className="mt-5 text-2xl">{father}<br/>{mother}</h3><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{address}</p><div className="mt-6 flex justify-center gap-3"><a title="Mở Google Maps" aria-label={`Chỉ đường đến ${side}`} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Navigation size={18}/></a><a title="Mở Apple Maps" aria-label={`Mở Apple Maps đến ${side}`} href={`https://maps.apple.com/?q=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-primary text-primary"><MapPin size={18}/></a><span title="Số điện thoại sẽ được cập nhật" aria-label="Số điện thoại chưa cập nhật" className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground"><Phone size={18}/></span></div></article>;
}
function Schedule({time,title,place}:{time:string;title:string;place:string}) { return <div className="grid grid-cols-[6rem_1fr] gap-5 border-t border-border py-7 first:border-t-0 sm:grid-cols-[9rem_1fr]"><span className="text-sm font-medium text-primary">{time}</span><div><h3 className="text-2xl">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{place}</p></div></div>; }
function Field({name,label,required,inputMode,light}:{name:string;label:string;required?:boolean;inputMode?:"tel";light?:boolean}) { return <label className="grid gap-2 text-sm">{label}<input name={name} required={required} inputMode={inputMode} maxLength={100} className={`h-12 rounded-sm border px-4 ${light ? "border-border bg-card" : "border-primary-foreground/20 bg-primary-foreground/5"}`}/></label>; }
