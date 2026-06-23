"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const court = {
  id: 1,
  name: "Sân Cầu Lông Premium Him Lam",
  category: "Cầu lông",
  categoryIcon: "🏸",
  rating: 4.9,
  reviewsCount: 142,
  popular: true,
  address: "285 Nguyễn Văn Linh, Tân Hưng, Quận 7, TP. Hồ Chí Minh",
  phone: "0901 234 567",
  openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
  description:
    "Sân cầu lông Him Lam Premium là tổ hợp sân cầu lông tiêu chuẩn thi đấu quốc tế với 8 sân trong nhà, hệ thống máy lạnh toàn bộ, thảm sân chuẩn Yonex NK và ánh sáng LED đạt 500 lux. Đây là điểm đến lý tưởng cho cả người chơi nghiệp dư lẫn vận động viên chuyên nghiệp tại TP. Hồ Chí Minh.",
  images: [
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
  ],
  features: [
    { icon: "❄️", label: "Máy lạnh toàn bộ" },
    { icon: "💡", label: "Đèn LED 500 lux" },
    { icon: "🏅", label: "Thảm Yonex NK chuẩn thi đấu" },
    { icon: "🚿", label: "Phòng tắm & thay đồ" },
    { icon: "🅿️", label: "Bãi xe miễn phí" },
    { icon: "🎥", label: "Camera giám sát 24/7" },
    { icon: "🧴", label: "Quầy bán phụ kiện" },
    { icon: "🥤", label: "Canteen & nước uống" },
  ],
  pricing: [
    {
      label: "Khung giờ vàng (Sáng)",
      time: "05:00 – 08:00",
      price: "60.000đ - 80.000đ",
      note: "/ giờ / sân",
    },
    {
      label: "Giờ thường",
      time: "08:00 – 17:00",
      price: "80.000đ - 100.000đ",
      note: "/ giờ / sân",
    },
    {
      label: "Giờ cao điểm (Tối)",
      time: "17:00 – 22:00",
      price: "120.000đ - 140.000đ",
      note: "/ giờ / sân",
    },
  ],
  reviews: [
    {
      id: 1,
      name: "Nguyễn Hoàng Minh",
      avatar: "N",
      rating: 5,
      date: "20/05/2026",
      content:
        "Sân rất đẹp, sạch sẽ và thoáng mát. Nhân viên nhiệt tình, hỗ trợ đặt sân online rất nhanh. Thảm sân chuẩn chỉnh, cảm giác đánh bóng rất tốt. Sẽ quay lại thường xuyên!",
      likes: 12,
    },
    {
      id: 2,
      name: "Trần Thị Lan Anh",
      avatar: "T",
      rating: 5,
      date: "18/05/2026",
      content:
        "Mình đã đặt sân tại đây nhiều lần, lần nào cũng hài lòng. Giá cả hợp lý, đặc biệt khung giờ sáng sớm rất rẻ và thoáng. Bãi xe rộng, không phải lo đỗ xe.",
      likes: 8,
    },
    {
      id: 3,
      name: "Lê Văn Đức",
      avatar: "L",
      rating: 4,
      date: "15/05/2026",
      content:
        "Sân tốt, đèn sáng đều. Chỉ góp ý là giờ cao điểm hay full sân, nên đặt trước ít nhất 1 ngày. App đặt sân rất tiện lợi, thanh toán nhanh.",
      likes: 5,
    },
  ],
  nearby: [
    {
      id: 2,
      name: "Pickleball Elite Club Thảo Điền",
      rating: 5.0,
      price: "150.000đ - 220.000đ",
      category: "🏓",
      image:
        "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=400&q=80",
      distance: "2.4 km",
    },
    {
      id: 3,
      name: "Vinhomes Central Park Tennis",
      rating: 4.8,
      price: "180.000đ - 250.000đ",
      category: "🎾",
      image:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80",
      distance: "3.1 km",
    },
  ],
};

const SUB_COURTS = [
  { id: "c1", name: "Sân số 1 (Yonex Pro)", type: "VIP" },
  { id: "c2", name: "Sân số 2 (Yonex Pro)", type: "VIP" },
  { id: "c3", name: "Sân số 3 (Victor Gold)", type: "Standard" },
  { id: "c4", name: "Sân số 4 (Victor Gold)", type: "Standard" },
  { id: "c5", name: "Sân số 5 (Lining Premium)", type: "Standard" },
  { id: "c6", name: "Sân số 6 (Lining Premium)", type: "Standard" },
];

// Generate 38 slots of 30-minute intervals from 05:00 to 24:00
const TIME_SLOTS = Array.from({ length: 38 }, (_, i) => {
  const startTotalMinutes = 5 * 60 + i * 30;
  const endTotalMinutes = startTotalMinutes + 30;

  const startHour = Math.floor(startTotalMinutes / 60);
  const startMin = startTotalMinutes % 60;
  const endHour = Math.floor(endTotalMinutes / 60);
  const endMin = endTotalMinutes % 60;

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return {
    id: `t_${i}`,
    label: `${formatTime(startHour, startMin)} - ${formatTime(endHour, endMin)}`,
    start: formatTime(startHour, startMin),
    end: formatTime(endHour, endMin),
    isPeak: startHour >= 17 && startHour < 22,
    hourNum: startHour,
  };
});

const getSlotPrice = (courtType: string, slotStartHour: number) => {
  const isVIP = courtType === "VIP";
  if (slotStartHour >= 5 && slotStartHour < 8) {
    return isVIP ? 40000 : 30000; // Early morning per 30 mins
  } else if (slotStartHour >= 17 && slotStartHour < 22) {
    return isVIP ? 70000 : 60000; // Peak hour per 30 mins
  } else {
    return isVIP ? 50000 : 40000; // Regular hour per 30 mins
  }
};

// Stable mock bookings based on selected day, court id, and slot index
const getMockBookingStatus = (
  dayIndex: number,
  courtId: string,
  slotIndex: number,
) => {
  const slotHour = 5 + Math.floor(slotIndex / 2);

  if (slotHour >= 5 && slotHour < 7) {
    return (slotIndex + dayIndex) % 4 === 0;
  }
  if (slotHour >= 9 && slotHour < 15) {
    return (slotIndex * dayIndex + courtId.charCodeAt(1)) % 5 === 0;
  }
  if (slotHour >= 17 && slotHour < 22) {
    return (slotIndex + courtId.charCodeAt(1) + dayIndex) % 3 !== 0; // High occupancy peak hours
  }
  if (slotHour >= 22) {
    return (slotIndex + dayIndex * 2) % 2 === 0;
  }

  return (slotIndex + courtId.charCodeAt(1) * dayIndex) % 6 === 0;
};

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const today = new Date();

const formatDateVi = (date: Date) => {
  const weekdaysVi = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const weekday = weekdaysVi[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${weekday}, ${day}/${month}/${year}`;
};

interface SelectedSlot {
  courtId: string;
  courtName: string;
  slotId: string;
  slotLabel: string;
  price: number;
  dateStr: string;
}

export default function DetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const currentDayOfWeek = today.getDay();
  const defaultSelectedDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [guestCount, setGuestCount] = useState(2);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [highlightAvailableOnly, setHighlightAvailableOnly] = useState(false);

  // Week Dates starting from Monday of current week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const handleToggleSlot = (
    courtItem: { id: string; name: string },
    slot: { id: string; label: string; start: string; end: string },
    price: number,
  ) => {
    const dateStr = formatDateVi(weekDates[selectedDay]);

    const isAlreadySelected = selectedSlots.some(
      (s) =>
        s.courtId === courtItem.id &&
        s.slotId === slot.id &&
        s.dateStr === dateStr,
    );

    if (isAlreadySelected) {
      setSelectedSlots((prev) =>
        prev.filter(
          (s) =>
            !(
              s.courtId === courtItem.id &&
              s.slotId === slot.id &&
              s.dateStr === dateStr
            ),
        ),
      );
    } else {
      setSelectedSlots((prev) => [
        ...prev,
        {
          courtId: courtItem.id,
          courtName: courtItem.name,
          slotId: slot.id,
          slotLabel: slot.label,
          price,
          dateStr,
        },
      ]);
    }
  };

  const handleRemoveSlot = (
    courtId: string,
    slotId: string,
    dateStr: string,
  ) => {
    setSelectedSlots((prev) =>
      prev.filter(
        (s) =>
          !(
            s.courtId === courtId &&
            s.slotId === slotId &&
            s.dateStr === dateStr
          ),
      ),
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlots.length === 0 || !fullName || !phone) return;
    setIsSuccessModalOpen(true);
  };

  const handleResetBooking = () => {
    setSelectedSlots([]);
    setFullName("");
    setPhone("");
    setNote("");
    setIsSuccessModalOpen(false);
  };

  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);
  const totalHours = (selectedSlots.length * 30) / 60;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── BREADCRUMB ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 mb-6">
          <Link href="/" className="hover:text-emerald-500 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-emerald-500 transition-colors">
            Cầu lông
          </Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-xs">
            {court.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* ── IMAGE GALLERY ─────────────────────────────────────── */}
            <section>
              {/* Main Image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-xl">
                <img
                  src={court.images[activeImage]}
                  alt={court.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {/* Popular badge */}
                {court.popular && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center justify-center gap-1 h-6 px-2.5 rounded-full bg-highlight text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-highlight/35 border border-white/20 select-none">
                      <svg
                        className="w-3.5 h-3.5 text-amber-300 fill-current animate-pulse flex-shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.12 4.8-4.8 4.8z" />
                      </svg>
                      <span className="leading-none translate-y-[-1px]">
                        Phổ biến
                      </span>
                    </span>
                  </div>
                )}
                {/* Image counter */}
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold">
                    {activeImage + 1} / {court.images.length}
                  </span>
                </div>
                {/* Nav arrows */}
                <button
                  onClick={() =>
                    setActiveImage(
                      (p) =>
                        (p - 1 + court.images.length) % court.images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors flex items-center justify-center text-sm font-bold"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActiveImage((p) => (p + 1) % court.images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors flex items-center justify-center text-sm font-bold"
                >
                  ›
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-3">
                {court.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-1 aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 ${
                      activeImage === i
                        ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950 scale-[1.02]"
                        : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* ── TITLE & META ──────────────────────────────────────── */}
            <section>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
                      {court.categoryIcon} {court.category}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
                    {court.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      📍 {court.address}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-3 py-2">
                    <span className="text-amber-500 text-lg">★</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                      {court.rating}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {court.reviewsCount} đánh giá
                  </span>
                </div>
              </div>

              {/* Quick Info pills */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  🕐 {court.openHours}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  📞 {court.phone}
                </span>
              </div>
            </section>

            {/* ── TIMELINE INTERACTIVE SCHEDULE ─────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-850 dark:text-zinc-50">
                    Bảng Lịch Đặt Sân Trực Tuyến
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Nhấp vào ô giờ trống để đặt sân. Các sân VIP & thảm chuyên
                    nghiệp được ký hiệu riêng biệt.
                  </p>
                </div>
                {/* Visual filter toggle */}
                <button
                  onClick={() =>
                    setHighlightAvailableOnly(!highlightAvailableOnly)
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    highlightAvailableOnly
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "bg-zinc-55 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                  }`}
                >
                  <span>✨</span>
                  <span>
                    {highlightAvailableOnly
                      ? "Hiển thị tất cả"
                      : "Nhấn mạnh ô trống"}
                  </span>
                </button>
              </div>

              {/* Day Picker inside scheduler */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Chọn Ngày Chơi Sân
                </p>
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, i) => {
                    const isSelected = selectedDay === i;
                    const dateDayName =
                      weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
                    const isToday = date.toDateString() === today.toDateString();

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border transition-all duration-300 relative ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                            : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {isToday && (
                          <span
                            className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${isSelected ? "bg-white text-emerald-600" : "bg-emerald-500 text-white"}`}
                          >
                            Hôm nay
                          </span>
                        )}
                        <span className="text-[9px] font-bold uppercase opacity-80">
                          {dateDayName}
                        </span>
                        <span className="text-base font-black tracking-tight">
                          {date.getDate()}
                        </span>
                        <span className="text-[9px] opacity-70">
                          Thg {date.getMonth() + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Info Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="w-3.5 h-3.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 inline-block"></span>
                  Giờ thường (Còn trống)
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="w-3.5 h-3.5 rounded bg-white dark:bg-zinc-900 border border-emerald-400 dark:border-emerald-600 inline-block"></span>
                  Giờ vàng (Phụ thu nhẹ)
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 inline-block"></span>
                  Đang chọn
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="w-3.5 h-3.5 rounded bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/20 inline-block relative overflow-hidden">
                    <span className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:5px_5px]"></span>
                  </span>
                  Đã có người đặt
                </span>
              </div>

              {/* Responsive Scrollable Schedule Grid */}
              <div className="relative border border-zinc-250 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full border-collapse border-spacing-0 table-fixed">
                    <thead>
                      {/* First Header Row: Hours */}
                      <tr className="bg-zinc-100 dark:bg-zinc-800 text-[10px] md:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                        <th
                          rowSpan={2}
                          className="sticky left-0 z-30 bg-zinc-100 dark:bg-zinc-850 px-4 py-3 text-left w-[150px] min-w-[150px] border-r border-zinc-200 dark:border-zinc-700 font-extrabold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] align-middle"
                        >
                          Sân Đặt
                        </th>
                        {Array.from({ length: 19 }, (_, i) => {
                          const hour = 5 + i;
                          const hourStr =
                            hour.toString().padStart(2, "0") + ":00";
                          return (
                            <th
                              key={i}
                              colSpan={2}
                              className="px-2 py-3 text-center border-r border-zinc-200 dark:border-zinc-700 w-[120px] min-w-[120px] font-extrabold text-zinc-800 dark:text-zinc-200"
                            >
                              {hourStr}
                            </th>
                          );
                        })}
                      </tr>
                      {/* Second Header Row: 30-min intervals */}
                      <tr className="bg-zinc-50 dark:bg-zinc-900 text-[9px] font-bold text-zinc-500 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-850">
                        {TIME_SLOTS.map((slot) => (
                          <th
                            key={slot.id}
                            className={`px-1 py-2 text-center border-r border-zinc-200 dark:border-zinc-800 w-[60px] min-w-[60px] ${
                              slot.isPeak
                                ? "text-amber-500 dark:text-amber-400 font-extrabold bg-amber-500/5"
                                : ""
                            }`}
                          >
                            {slot.start.endsWith("30") ? ":30" : ":00"}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SUB_COURTS.map((courtItem) => {
                        return (
                          <tr
                            key={courtItem.id}
                            className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 border-b border-zinc-150 dark:border-zinc-800 last:border-0"
                          >
                            {/* Sticky Court ID Column */}
                            <td className="sticky left-0 z-20 bg-white dark:bg-zinc-900 px-4 py-3 border-r border-zinc-200 dark:border-zinc-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                              <div className="flex flex-col">
                                <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 truncate w-[130px]">
                                  {courtItem.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span
                                    className={`px-1 py-0.5 rounded text-[8px] font-black tracking-wide uppercase ${
                                      courtItem.type === "VIP"
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                                    }`}
                                  >
                                    {courtItem.type}
                                  </span>
                                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                                    {courtItem.type === "VIP"
                                      ? "100k-140k/h"
                                      : "80k-120k/h"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 38 Cells */}
                            {TIME_SLOTS.map((slot, index) => {
                              const isBooked = getMockBookingStatus(
                                selectedDay,
                                courtItem.id,
                                index,
                              );
                              const dateStr = formatDateVi(weekDates[selectedDay]);
                              const isSelected = selectedSlots.some(
                                (s) =>
                                  s.courtId === courtItem.id &&
                                  s.slotId === slot.id &&
                                  s.dateStr === dateStr,
                              );
                              const price = getSlotPrice(
                                courtItem.type,
                                slot.hourNum,
                              );

                              return (
                                <td
                                  key={slot.id}
                                  className="p-1 border-r border-zinc-100 dark:border-zinc-800/80 last:border-r-0 align-middle"
                                >
                                  {isBooked ? (
                                    <div
                                      title="Đã có người đặt"
                                      className="h-10 w-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none rounded border border-transparent"
                                    >
                                      <span className="text-[8px] font-extrabold text-zinc-500 dark:text-zinc-400 tracking-wider">
                                        ĐÃ ĐẶT
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleToggleSlot(courtItem, slot, price)
                                      }
                                      title={`${courtItem.name}\n${slot.label}\nNgày: ${dateStr}\nGiá: ${price.toLocaleString("vi-VN")}đ`}
                                      className={`h-10 w-full rounded flex flex-col items-center justify-center gap-0.5 transition-all duration-150 border text-center ${
                                        isSelected
                                          ? "bg-emerald-500 text-white border-emerald-600 dark:border-emerald-400 shadow-md shadow-emerald-500/20 scale-[0.97]"
                                          : highlightAvailableOnly
                                            ? "bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/30 hover:scale-[0.97]"
                                            : "bg-white dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 hover:scale-[0.97]"
                                      }`}
                                    >
                                      <span
                                        className={`text-[9px] font-extrabold tracking-wider ${
                                          isSelected
                                            ? "text-white"
                                            : "text-highlight"
                                        }`}
                                      >
                                        {(price / 1000).toString()}K
                                      </span>
                                      <span
                                        className={`text-[8px] font-medium leading-none ${
                                          isSelected
                                            ? "text-emerald-100"
                                            : "text-zinc-400 dark:text-zinc-500"
                                        }`}
                                      >
                                        {slot.isPeak ? "Giờ vàng" : "Thường"}
                                      </span>
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── DESCRIPTION ───────────────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-3">Mô tả cơ sở</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {court.description}
              </p>
            </section>

            {/* ── AMENITIES ─────────────────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Tiện ích & Dịch vụ</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {court.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-center hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── PRICING TABLE ─────────────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">
                Bảng giá chi tiết theo giờ
              </h2>
              <div className="space-y-3">
                {court.pricing.map((tier, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      i === 2
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-250 dark:border-emerald-800"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-150 dark:border-zinc-800"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                        {tier.label}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {tier.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-base font-black ${i === 2 ? "text-highlight" : "text-zinc-800 dark:text-zinc-100"}`}
                      >
                        {tier.price}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {tier.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── REVIEWS ───────────────────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Đánh giá từ người dùng</h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-amber-500">
                    {court.rating}
                  </span>
                  <div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`text-sm ${s <= Math.round(court.rating) ? "text-amber-400" : "text-zinc-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400">
                      {court.reviewsCount} đánh giá
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {court.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex gap-4 pb-5 border-b border-zinc-150 dark:border-zinc-800 last:border-0 last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {rev.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-sm font-bold">{rev.name}</p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            {rev.date}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`text-xs ${s <= rev.rating ? "text-amber-400" : "text-zinc-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {rev.content}
                      </p>
                      <button className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-500 transition-colors">
                        <span>👍</span>
                        <span>Hữu ích ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-500 transition-all duration-200">
                Xem tất cả {court.reviews.length} đánh giá
              </button>
            </section>

            {/* ── NEARBY ────────────────────────────────────────────── */}
            <section>
              <h2 className="text-lg font-bold mb-4">Sân gần đây</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {court.nearby.map((n) => (
                  <Link
                    key={n.id}
                    href={`/bookings/${n.id}`}
                    className="group flex gap-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden hover:border-highlight/50 dark:hover:border-highlight/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-24 flex-shrink-0 aspect-square overflow-hidden bg-zinc-100">
                      <img
                        src={n.image}
                        alt={n.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="py-4 pr-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <p className="text-xs mb-1">{n.category}</p>
                        <p className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-emerald-500 transition-colors">
                          {n.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-amber-500 font-bold">
                          ★ {n.rating}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {n.distance}
                        </span>
                      </div>
                      <p className="text-xs text-highlight font-bold mt-1">
                        {n.price}/h
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ─── RIGHT COLUMN (STICKY BOOKING PANEL / CART) ──────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl overflow-hidden">
                {/* Cart Header */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-6 text-white relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl -translate-y-6 translate-x-6"></div>
                  <p className="text-emerald-100 text-[10px] font-extrabold uppercase tracking-widest mb-1">
                    Đăng Ký Đặt Sân
                  </p>
                  <div className="flex items-baseline justify-between mt-2">
                    <h3 className="text-xl font-black">Giỏ Đặt Sân</h3>
                    {selectedSlots.length > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {selectedSlots.length} ô giờ
                      </span>
                    )}
                  </div>
                </div>

                {/* Cart Items or Instructions */}
                {selectedSlots.length === 0 ? (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-2xl animate-pulse">
                      🏸
                    </div>
                    <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Chưa chọn ô đặt sân nào
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                      Vui lòng cuộn lịch đặt sân bên trái và nhấn chọn các ô giờ
                      trống màu trắng phù hợp với kế hoạch của bạn.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleBookingSubmit}
                    className="p-6 space-y-6"
                  >
                    {/* Selected slots list */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <span>Danh Sách Ô Đã Chọn</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSlots([])}
                          className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors uppercase font-extrabold"
                        >
                          Xóa hết
                        </button>
                      </div>
                      <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
                        {selectedSlots.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 p-3 rounded-2xl group transition-all"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate">
                                {item.courtName}
                              </p>
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                                {item.dateStr.split(",")[0]} • {item.slotLabel}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                              <span className="text-xs font-bold text-highlight">
                                {item.price.toLocaleString("vi-VN")}đ
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSlot(
                                    item.courtId,
                                    item.slotId,
                                    item.dateStr,
                                  )
                                }
                                className="text-zinc-400 hover:text-red-500 text-xs p-1 font-bold transition-all rounded hover:bg-red-500/10"
                                title="Xóa ô này"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Calculations */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-4 space-y-2">
                      <p className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                        Tóm tắt thanh toán
                      </p>
                      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Số ô chọn</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {selectedSlots.length} ô
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Tổng thời lượng</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {totalHours} giờ
                        </span>
                      </div>
                      <div className="border-t border-emerald-100/50 dark:border-emerald-900/50 pt-2 flex justify-between items-baseline">
                        <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                          Tổng tiền tạm tính
                        </span>
                        <span className="text-lg font-black text-highlight">
                          {totalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    {/* Guest count */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Số người chơi ước tính
                      </p>
                      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 border border-zinc-100 dark:border-zinc-700">
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount((c) => Math.max(1, c - 1))
                          }
                          className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-lg font-bold text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-500 transition-all"
                        >
                          −
                        </button>
                        <span className="text-sm font-extrabold">
                          {guestCount} người
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount((c) => Math.min(12, c + 1))
                          }
                          className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-lg font-bold text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-500 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Booking Form Details */}
                    <div className="space-y-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        Thông Tin Liên Hệ
                      </p>
                      <div className="space-y-2.5">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Họ và tên khách hàng *"
                          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Số điện thoại liên hệ *"
                          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                        <textarea
                          rows={2}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ghi chú thêm về yêu cầu đặc biệt..."
                          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-extrabold text-sm tracking-wide text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      ✓ Xác Nhận Đặt Sân
                    </button>

                    <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
                      Miễn phí hủy trước 4 giờ • Nhận giữ sân 10 phút chờ thanh
                      toán chuyển khoản
                    </p>
                  </form>
                )}
              </div>

              {/* Contact Card */}
              <div className="mt-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-5 shadow-sm">
                <p className="text-sm font-bold mb-3">Hỗ trợ khách hàng 24/7</p>
                <a
                  href={`tel:${court.phone}`}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-zinc-100 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 group"
                >
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Gọi Hotline cơ sở
                    </p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {court.phone}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── SUCCESS MODAL ────────────────────────────────────────────── */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-6 transform scale-100 transition-transform duration-300">
            {/* Confetti / Success graphic icon */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-3xl animate-bounce text-emerald-600">
                🎉
              </div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                Đặt Lịch Đăng Ký Thành Công!
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm">
                Chúng tôi đã tiếp nhận yêu cầu đặt lịch của bạn. Sân sẽ được giữ
                tạm thời trong vòng 10 phút chờ thanh toán.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-2xl p-4 space-y-3">
              <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-1">
                Chi tiết đặt sân
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Khách hàng</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Số điện thoại</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Cơ sở chơi</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {court.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tổng giờ chơi</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {totalHours} giờ
                  </span>
                </div>
                <div className="flex justify-between border-t border-zinc-200/50 dark:border-zinc-800/50 pt-2 font-bold">
                  <span className="text-zinc-800 dark:text-zinc-100">
                    Tổng thanh toán
                  </span>
                  <span className="text-highlight text-sm font-extrabold">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Grouped booked slots list in modal */}
              <div className="mt-2.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-1.5">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                  Khung giờ giữ sân:
                </p>
                <div className="max-h-[100px] overflow-y-auto space-y-1 text-[10px] scrollbar-thin">
                  {selectedSlots.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-zinc-500 dark:text-zinc-400"
                    >
                      <span>
                        • {s.courtName} ({s.slotLabel})
                      </span>
                      <span className="font-medium">
                        {s.dateStr.split(",")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Payment Transfer Mock */}
            <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-center">
                Quét QR Chuyển Khoản Nhanh
              </p>

              {/* Mock QR Code Image container */}
              <div className="relative w-36 h-36 bg-white p-2 rounded-2xl border border-zinc-200 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center rounded-xl text-center p-2 border-2 border-dashed border-zinc-300">
                  <span className="text-2xl">⚡</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">
                    SportHub Pay
                  </span>
                  <span className="text-[8px] text-zinc-400 mt-0.5">
                    Vietcombank
                  </span>
                  <span className="text-[8px] font-bold text-emerald-600">
                    1023456789
                  </span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                  Vietcombank • Công Ty Thể Thao SportHub
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium">
                  Cú pháp CK:{" "}
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    SPORTHUB {phone}
                  </span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleResetBooking}
              className="w-full py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-950/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Hoàn Thành & Đóng
            </button>
          </div>
        </div>
      )}

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            © {new Date().getFullYear()} SportHub Pro. Đã đăng ký bản quyền.
          </p>
          <p className="font-light">
            Được thiết kế tỉ mỉ để kết nối và thắp sáng đam mê thể thao của bạn.
          </p>
        </div>
      </footer>
    </div>
  );
}
