"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    location: "Quận 7, TP. Hồ Chí Minh",
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
    image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80",
    location: "Thảo Điền, Quận 2, TP. Thủ Đức",
    features: ["Sân trong nhà & ngoài trời", "Hệ thống đèn LED chuẩn thi đấu", "Quầy Bar & Lounge"],
    popular: true,
  },
  {
    id: 3,
    name: "Vinhomes Central Park Tennis Court",
    category: "tennis",
    rating: 4.8,
    reviews: 65,
    price: "180.000đ - 250.000đ / giờ",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
    location: "Bình Thạnh, TP. Hồ Chí Minh",
    features: ["Mặt sân Plexipave", "Cạnh sông thoáng mát", "Huấn luyện viên cá nhân"],
    popular: false,
  },
  {
    id: 4,
    name: "Sân Bóng Đá Rạch Chiếc Stadium",
    category: "football",
    rating: 4.7,
    reviews: 215,
    price: "300.000đ - 450.000đ / trận",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    location: "An Phú, Quận 2, TP. Thủ Đức",
    features: ["Cỏ nhân tạo chất lượng FIFA", "Hệ thống thoát nước hiện đại", "Cho thuê đồ thi đấu"],
    popular: true,
  },
  {
    id: 5,
    name: "Sân Bóng Rổ Thể Thao Đa Năng Phú Thọ",
    category: "basketball",
    rating: 4.9,
    reviews: 104,
    price: "120.000đ - 180.000đ / giờ",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    location: "Quận 11, TP. Hồ Chí Minh",
    features: ["Mặt sân gỗ cao cấp", "Bảng rổ kính cường lực", "Khu tắm rửa tiện nghi"],
    popular: false,
  },
  {
    id: 6,
    name: "Cầu Lông & Pickleball Sunrise Center",
    category: "pickleball",
    rating: 4.9,
    reviews: 73,
    price: "130.000đ - 200.000đ / giờ",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
    location: "Nhà Bè, TP. Hồ Chí Minh",
    features: ["Sân đa năng hiện đại", "Có camera quay lại trận đấu", "Trọng tài hỗ trợ"],
    popular: false,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering courts based on category and search query
  const filteredCourts = premiumCourts.filter((court) => {
    const matchesCategory = selectedCategory === "all" || court.category === selectedCategory;
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          court.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      
      {/* 1. HEADERBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                SportHub
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                Pro
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/bookings" className="text-sm font-medium text-zinc-600 hover:text-emerald-500 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors">
                Tìm sân nhanh
              </Link>
              <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-emerald-500 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors">
                Giải đấu
              </Link>
              <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-emerald-500 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors">
                Cộng đồng
              </Link>
            </nav>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-zinc-700 hover:text-emerald-500 dark:text-zinc-300 dark:hover:text-emerald-400 px-4 py-2 rounded-full transition-colors"
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

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
                Tìm kiếm, đối chiếu và giữ chỗ sân cầu lông, tennis, pickleball chỉ trong 30 giây. Đầy đủ tiện ích, kết nối nhanh chóng.
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
                <button className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm px-6 md:px-8 py-3 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 flex items-center gap-2">
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
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Danh sách sân thể thao chất lượng cao
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Được lọc và kiểm tra định kỳ để đáp ứng tiêu chuẩn trải nghiệm tốt nhất
              </p>
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
                        : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                    }`}
                  >
                    <span className={`text-base transition-transform duration-300 ${isActive ? "scale-115 rotate-6" : ""}`}>
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
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-400/20 transition-all duration-500 hover:scale-[1.025]"
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
                        {categories.find(c => c.id === court.category)?.icon} {categories.find(c => c.id === court.category)?.name}
                      </span>
                      {court.popular && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-emerald-500/20">
                          🔥 Phổ biến
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Court Details */}
                  <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                    
                    <div className="space-y-3">
                      {/* Location & Rating */}
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">📍 {court.location}</span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                          ★ {court.rating} <span className="text-zinc-400 dark:text-zinc-500 font-medium">({court.reviews})</span>
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-bold group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {court.name}
                      </h3>

                      {/* Tags / Features */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {court.features.map((feat, idx) => (
                          <span 
                            key={idx} 
                            className="px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-xs"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Booking CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">Giá thuê từ</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{court.price}</span>
                      </div>
                      <Link 
                        href={`/bookings/${court.id}`}
                        className="px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300 active:scale-95 shadow-md"
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
              <h3 className="text-lg font-bold">Không tìm thấy sân phù hợp</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
                Thử đổi từ khóa tìm kiếm hoặc lọc theo môn thể thao khác để tìm sân ưng ý nhé.
              </p>
              <button 
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
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
          <p>© {new Date().getFullYear()} SportHub Pro. Đã đăng ký bản quyền.</p>
          <p className="font-light">Được thiết kế tỉ mỉ để kết nối và thắp sáng đam mê thể thao của bạn.</p>
        </div>
      </footer>

    </div>
  );
}
