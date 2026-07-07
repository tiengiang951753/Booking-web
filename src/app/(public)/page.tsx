"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Sports categories for filtering
const categories = [
  { id: "all", name: "Tất cả môn", icon: "⚡" },
  { id: "badminton", name: "Cầu lông", icon: "🏸" },
  { id: "pickleball", name: "Pickleball", icon: "🏓" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "football", name: "Bóng đá", icon: "⚽" },
  { id: "basketball", name: "Bóng rổ", icon: "🏀" },
];

// Curated list of premium courts with gorgeous images
const premiumCourts = [
  {
    id: 1,
    name: "Sân Cầu Lông Premium Him Lam",
    category: "badminton",
    rating: 4.9,
    reviews: 142,
    price: "80.000đ - 120.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    location:
      "Số 285 Đường Nguyễn Văn Linh, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh",
    features: ["Thảm chuẩn Yonex", "Hệ thống máy lạnh", "Bãi xe rộng rãi"],
    popular: true,
  },
  {
    id: 2,
    name: "Pickleball Elite Club Thảo Điền",
    category: "pickleball",
    rating: 5.0,
    reviews: 89,
    price: "150.000đ - 220.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80",
    location: "Số 12 Đường Quốc Hương, Phường Thảo Điền, Quận 2, TP. Thủ Đức",
    features: [
      "Sân trong nhà & ngoài trời",
      "Hệ thống đèn LED chuẩn thi đấu",
      "Quầy Bar & Lounge",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Vinhomes Central Park Tennis Court",
    category: "tennis",
    rating: 4.8,
    reviews: 65,
    price: "180.000đ - 250.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
    location:
      "Khu đô thị Vinhomes Central Park, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh",
    features: [
      "Mặt sân Plexipave",
      "Cạnh sông thoáng mát",
      "Huấn luyện viên cá nhân",
    ],
    popular: false,
  },
  {
    id: 4,
    name: "Sân Bóng Đá Rạch Chiếc Stadium",
    category: "football",
    rating: 4.7,
    reviews: 215,
    price: "300.000đ - 450.000đ / trận",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    location:
      "Khu liên hợp thể thao Rạch Chiếc, Xa lộ Hà Nội, Phường An Phú, Quận 2, TP. Thủ Đức",
    features: [
      "Cỏ nhân tạo chất lượng FIFA",
      "Hệ thống thoát nước hiện đại",
      "Cho thuê đồ thi đấu",
    ],
    popular: true,
  },
  {
    id: 5,
    name: "Sân Bóng Rổ Thể Thao Đa Năng Phú Thọ",
    category: "basketball",
    rating: 4.9,
    reviews: 104,
    price: "120.000đ - 180.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    location:
      "Số 219 Đường Lý Thường Kiệt, Phường 15, Quận 11, TP. Hồ Chí Minh",
    features: [
      "Mặt sân gỗ cao cấp",
      "Bảng rổ kính cường lực",
      "Khu tắm rửa tiện nghi",
    ],
    popular: false,
  },
  {
    id: 6,
    name: "Cầu Lông & Pickleball Sunrise Center",
    category: "pickleball",
    rating: 4.9,
    reviews: 73,
    price: "130.000đ - 200.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
    location:
      "Khu đô thị Sunrise Riverside, Đường Nguyễn Hữu Thọ, Xã Phước Kiển, Huyện Nhà Bè, TP. Hồ Chí Minh",
    features: [
      "Sân đa năng hiện đại",
      "Có camera quay lại trận đấu",
      "Trọng tài hỗ trợ",
    ],
    popular: false,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customCourts, setCustomCourts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomCourts = async () => {
      try {
        const q = query(collection(db, "courts"), where("active", "==", true));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            category: data.sportType,
            rating: 5.0,
            reviews: 0,
            price: `${data.pricePerHour.toLocaleString("vi-VN")}đ / giờ`,
            image: data.imageUrl || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
            location: data.address,
            features: [`Sân con: ${data.subCourtsCount}`, "Đặt lịch nhanh", "Đèn chiếu sáng"],
            popular: false,
          };
        });
        setCustomCourts(list);
      } catch (err) {
        console.error("Error loading custom courts:", err);
      }
    };
    fetchCustomCourts();
  }, []);

  const combinedCourts = [...premiumCourts, ...customCourts];

  // Filtering courts based on category and search query
  const filteredCourts = combinedCourts.filter((court) => {
    const matchesCategory =
      selectedCategory === "all" || court.category === selectedCategory;
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-background text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 2. HERO BANNER WITH INTEGRATED SEARCH BAR */}
        <section className="relative w-full aspect-[21/9] min-h-[440px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
          {/* Background Image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/sports_banner.png"
              alt="Premium Sports Banner"
              fill
              priority
              className="object-cover object-center scale-[1.01] transition-transform duration-700 hover:scale-105"
            />
            {/* Dark glassmorphic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-950/70" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>

          {/* Banner Content Container */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-8">
            {/* Text details */}
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-xs tracking-wider uppercase border border-emerald-500/30">
                ⭐ Nền tảng đặt sân thể thao số 1 Việt Nam
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Đột Phá Trải Nghiệm <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  Đặt Sân Đỉnh Cao
                </span>
              </h1>
              <p className="text-zinc-300 text-sm md:text-base max-w-xl mx-auto font-light">
                Tìm kiếm, đối chiếu và giữ chỗ sân cầu lông, tennis, pickleball
                chỉ trong 30 giây. Đầy đủ tiện ích, kết nối nhanh chóng.
              </p>
            </div>

            {/* Centered Search Bar (70% wide on large screens) */}
            <div className="w-full md:w-[75%] lg:w-[70%]">
              <div className="relative flex p-1.5 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 rounded-full shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
                {/* Search input field */}
                <div className="relative flex-1 flex items-center pl-4">
                  <span className="text-lg mr-2">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập tên sân, khu vực hoặc môn thể thao..."
                    className="w-full bg-transparent border-0 outline-none text-white placeholder-zinc-300 text-sm md:text-base focus:ring-0 py-2.5"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 mr-2 text-zinc-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Primary Action Button */}
                <button className="bg-primary hover:bg-primary-hover active:scale-95 text-button-text font-semibold text-sm px-6 md:px-8 py-3 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 flex items-center gap-2">
                  <span>Tìm ngay</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SPORT CATEGORIES FILTER & PREMIUM LISTINGS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {/* Section Header & Sports Filter */}
          <div className="flex flex-col gap-6 items-center md:items-between md:flex-row border-b border-zinc-200/80 dark:border-zinc-800 pb-8">
            <div className="text-center md:text-left space-y-1.5">
              {/* <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Danh sách sân thể thao chất lượng cao
              </h2> */}
              {/* <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Được lọc và kiểm tra định kỳ để đáp ứng tiêu chuẩn trải nghiệm
                tốt nhất
              </p> */}
            </div>

            {/* Interactive Category Selector with Micro-animations */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 active:scale-95 ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-lg shadow-zinc-950/15"
                        : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-base transition-transform duration-300 ${isActive ? "scale-115 rotate-6" : ""}`}
                    >
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Court Cards Grid */}
          {filteredCourts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourts.map((court) => (
                <article
                  key={court.id}
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-xl hover:border-highlight/50 dark:hover:border-highlight/30 transition-all duration-200 hover:scale-[1.025] hover:border-2"
                >
                  {/* Court Image Panel */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wider capitalize">
                        {categories.find((c) => c.id === court.category)?.icon}{" "}
                        {categories.find((c) => c.id === court.category)?.name}
                      </span>
                      {court.popular && (
                        <span className="inline-flex items-center justify-center gap-1 h-6 px-2.5 rounded-full bg-highlight text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-highlight/35 border border-white/20 hover:scale-105 transition-all duration-300 select-none">
                          <svg
                            className="w-3.5 h-3.5 text-amber-300 fill-current flex-shrink-0"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.12 4.8-4.8 4.8z" />
                          </svg>
                          <span className="leading-none">
                            {/* translate-y-[-1px] */}
                            Phổ biến
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Rating Overlay (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-amber-500 font-extrabold px-2.5 py-1 rounded-xl text-[11px] shadow-lg border border-white/10">
                        ★ {court.rating}{" "}
                        <span className="text-zinc-300 font-medium">
                          ({court.reviews} đánh giá)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Court Details */}
                  <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-3.5">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {court.name}
                      </h3>

                      {/* Tags / Features */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {court.features.map((feat: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-primary/5 text-primary border border-primary/20 dark:bg-primary/10 dark:text-highlight dark:border-primary/30 text-xs font-semibold transition-all duration-300"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Full Detailed Address under tags */}
                      <div className="pt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex items-start gap-1.5 border-t border-dashed border-zinc-200/50 dark:border-zinc-800/40">
                        <span className="text-sm mt-0.5 flex-shrink-0">📍</span>
                        <span className="font-medium">{court.location}</span>
                      </div>
                    </div>

                    {/* Pricing & Booking CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">
                          Giá thuê từ
                        </span>
                        <span className="text-sm font-extrabold text-highlight">
                          {court.price}
                        </span>
                      </div>
                      <Link
                        href={`/bookings/${court.id}`}
                        className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-button-text font-bold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-95"
                      >
                        Đặt sân ngay
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // No Results Screen
            <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 max-w-md mx-auto space-y-4">
              <span className="text-4xl">😢</span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Không tìm thấy sân phù hợp
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
                Thử đổi từ khóa tìm kiếm hoặc lọc theo môn thể thao khác để tìm
                sân ưng ý nhé.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
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
