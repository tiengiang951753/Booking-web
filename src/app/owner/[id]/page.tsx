"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// ─── Dynamic Mock Database of Sports Centers (for reference/mapping) ─────────
const premiumCourts = [
  {
    id: 1,
    name: "Sân Cầu Lông Premium Him Lam",
    category: "badminton",
    categoryName: "Cầu lông",
    categoryIcon: "🏸",
  },
  {
    id: 2,
    name: "Pickleball Elite Club Thảo Điền",
    category: "pickleball",
    categoryName: "Pickleball",
    categoryIcon: "🏓",
  },
  {
    id: 3,
    name: "Vinhomes Central Park Tennis Court",
    category: "tennis",
    categoryName: "Tennis",
    categoryIcon: "🎾",
  },
  {
    id: 4,
    name: "Sân Bóng Đá Rạch Chiếc Stadium",
    category: "football",
    categoryName: "Bóng đá",
    categoryIcon: "⚽",
  },
  {
    id: 5,
    name: "Sân Bóng Rổ Thể Thao Đa Năng Phú Thọ",
    category: "basketball",
    categoryName: "Bóng rổ",
    categoryIcon: "🏀",
  },
  {
    id: 6,
    name: "Cầu Lông & Pickleball Sunrise Center",
    category: "pickleball",
    categoryName: "Pickleball",
    categoryIcon: "🏓",
  },
];

const getSubCourtsForCategory = (category: string) => {
  switch (category) {
    case "badminton":
      return [
        { id: "b1", name: "Sân Cầu Lông 1 (Yonex Pro)", type: "VIP" },
        { id: "b2", name: "Sân Cầu Lông 2 (Yonex Pro)", type: "VIP" },
        { id: "b3", name: "Sân Cầu Lông 3 (Victor)", type: "Standard" },
        { id: "b4", name: "Sân Cầu Lông 4 (Victor)", type: "Standard" },
        { id: "b5", name: "Sân Cầu Lông 5 (Lining)", type: "Standard" },
        { id: "b6", name: "Sân Cầu Lông 6 (Lining)", type: "Standard" },
      ];
    case "pickleball":
      return [
        { id: "p1", name: "Sân Pickleball 1 (Indoor VIP)", type: "VIP" },
        { id: "p2", name: "Sân Pickleball 2 (Indoor VIP)", type: "VIP" },
        { id: "p3", name: "Sân Pickleball 3 (Outdoor)", type: "Standard" },
        { id: "p4", name: "Sân Pickleball 4 (Outdoor)", type: "Standard" },
        { id: "p5", name: "Sân Pickleball 5 (Standard)", type: "Standard" },
        { id: "p6", name: "Sân Pickleball 6 (Standard)", type: "Standard" },
      ];
    case "tennis":
      return [
        { id: "t1", name: "Sân Tennis 1 (VIP Plexipave)", type: "VIP" },
        { id: "t2", name: "Sân Tennis 2 (VIP Plexipave)", type: "VIP" },
        { id: "t3", name: "Sân Tennis 3 (Standard)", type: "Standard" },
        { id: "t4", name: "Sân Tennis 4 (Standard)", type: "Standard" },
        { id: "t5", name: "Sân Tennis 5 (Standard)", type: "Standard" },
        { id: "t6", name: "Sân Tennis 6 (Standard)", type: "Standard" },
      ];
    case "football":
      return [
        { id: "f1", name: "Sân 7 Người (Cỏ FIFA VIP)", type: "VIP" },
        { id: "f2", name: "Sân 7 Người (Cỏ FIFA VIP)", type: "VIP" },
        { id: "f3", name: "Sân 5 Người (Sân Lớn A)", type: "Standard" },
        { id: "f4", name: "Sân 5 Người (Sân Lớn B)", type: "Standard" },
        { id: "f5", name: "Sân 5 Người (Standard C)", type: "Standard" },
        { id: "f6", name: "Sân 5 Người (Standard D)", type: "Standard" },
      ];
    case "basketball":
      return [
        { id: "bk1", name: "Sân Bóng Rổ Gỗ 1 (VIP)", type: "VIP" },
        { id: "bk2", name: "Sân Bóng Rổ Gỗ 2 (VIP)", type: "VIP" },
        { id: "bk3", name: "Sân Bóng Rổ Cao Su A", type: "Standard" },
        { id: "bk4", name: "Sân Bóng Rổ Cao Su B", type: "Standard" },
        { id: "bk5", name: "Sân Cao Su Standard C", type: "Standard" },
        { id: "bk6", name: "Sân Cao Su Standard D", type: "Standard" },
      ];
    default:
      return [
        { id: "g1", name: "Sân số 1 (VIP)", type: "VIP" },
        { id: "g2", name: "Sân số 2 (VIP)", type: "VIP" },
        { id: "g3", name: "Sân số 3 (Standard)", type: "Standard" },
        { id: "g4", name: "Sân số 4 (Standard)", type: "Standard" },
        { id: "g5", name: "Sân số 5 (Standard)", type: "Standard" },
        { id: "g6", name: "Sân số 6 (Standard)", type: "Standard" },
      ];
  }
};

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

type Props = {
  params: Promise<{ id: string }>;
};

export default function OwnerDashboardPage({ params }: Props) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { id: ownerUid } = use(params);

  // Dashboard state
  const [bookings, setBookings] = useState<any[]>([]);
  const [courts, setCourts] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Timetable filters state
  const currentDayOfWeek = today.getDay();
  const defaultSelectedDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay);
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");

  // Week dates calculations
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Auth Guard redirect (Enforces ownerUid matches logged in user.uid)
  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== "owner" || user.uid !== ownerUid) {
        router.replace("/");
      }
    }
  }, [user, profile, loading, ownerUid, router]);

  // Fetch Firestore Data
  useEffect(() => {
    if (user && profile?.role === "owner" && user.uid === ownerUid) {
      const fetchData = async () => {
        try {
          setIsLoadingData(true);

          // 1. Fetch bookings matching ownerId
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("ownerId", "==", ownerUid),
          );
          const bookingsSnap = await getDocs(bookingsQuery);
          const firestoreBookings = bookingsSnap.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as any,
          );

          // 3 Mock Pending Bookings
          const mockPendingBookings = [
            {
              id: "mock_p1",
              courtId: 1,
              courtName: "Sân Cầu Lông Premium Him Lam",
              customerName: "Nguyễn Văn Hùng",
              customerPhone: "0912 345 678",
              note: "Cần thuê thêm 2 vợt Yonex Pro",
              slots: [
                {
                  courtId: "b1",
                  courtName: "Sân Cầu Lông 1 (Yonex Pro)",
                  slotId: "t_26",
                  slotLabel: "18:00 - 18:30",
                  price: 62500,
                  dateStr: formatDateVi(today),
                },
                {
                  courtId: "b1",
                  courtName: "Sân Cầu Lông 1 (Yonex Pro)",
                  slotId: "t_27",
                  slotLabel: "18:30 - 19:00",
                  price: 62500,
                  dateStr: formatDateVi(today),
                },
              ],
              totalPrice: 125000,
              createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              status: "pending",
              ownerId: ownerUid,
            },
            {
              id: "mock_p2",
              courtId: 2,
              courtName: "Pickleball Elite Club Thảo Điền",
              customerName: "Trần Thị Mai",
              customerPhone: "0987 654 321",
              note: "Mua thêm 1 lon bóng Selkirk",
              slots: [
                {
                  courtId: "p1",
                  courtName: "Sân Pickleball 1 (Indoor VIP)",
                  slotId: "t_28",
                  slotLabel: "19:00 - 19:30",
                  price: 93750,
                  dateStr: formatDateVi(today),
                },
                {
                  courtId: "p1",
                  courtName: "Sân Pickleball 1 (Indoor VIP)",
                  slotId: "t_29",
                  slotLabel: "19:30 - 20:00",
                  price: 93750,
                  dateStr: formatDateVi(today),
                },
              ],
              totalPrice: 187500,
              createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              status: "pending",
              ownerId: ownerUid,
            },
            {
              id: "mock_p3",
              courtId: 1,
              courtName: "Sân Cầu Lông Premium Him Lam",
              customerName: "Lê Hoàng Nam",
              customerPhone: "0905 111 222",
              note: "Vui lòng bật máy lạnh trước 10 phút",
              slots: [
                {
                  courtId: "b2",
                  courtName: "Sân Cầu Lông 2 (Yonex Pro)",
                  slotId: "t_30",
                  slotLabel: "20:00 - 20:30",
                  price: 62500,
                  dateStr: formatDateVi(today),
                },
              ],
              totalPrice: 62500,
              createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
              status: "pending",
              ownerId: ownerUid,
            },
          ];

          // Combine live firestore bookings and mock pending bookings
          const combinedBookings = [
            ...firestoreBookings,
            ...mockPendingBookings,
          ];

          // Sort manually by createdAt descending
          combinedBookings.sort((a: any, b: any) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          setBookings(combinedBookings);

          // 2. Fetch courts created by this owner
          const courtsQuery = query(
            collection(db, "courts"),
            where("ownerId", "==", ownerUid),
          );
          const courtsSnap = await getDocs(courtsQuery);
          const courtsList = courtsSnap.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as any,
          );

          setCourts(courtsList);

          // Set default selected court for timetable
          if (courtsList.length > 0) {
            setSelectedCourtId(courtsList[0].id);
          } else {
            // Check if there are bookings for mock courts to display
            const mockBooked = combinedBookings.find(
              (b: any) => typeof b.courtId === "number",
            );
            if (mockBooked) {
              setSelectedCourtId(String(mockBooked.courtId));
            } else {
              setSelectedCourtId("1");
            }
          }
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchData();
    }
  }, [user, profile, ownerUid]);

  if (loading || !user || profile?.role !== "owner" || user.uid !== ownerUid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <svg
          className="animate-spin h-10 w-10 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 animate-pulse">
          Đang tải trang quản trị...
        </p>
      </div>
    );
  }

  // Action handlers
  const handleApproveBooking = async (bookingId: string) => {
    if (bookingId.startsWith("mock_")) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "confirmed" } : b,
        ),
      );
    } else {
      try {
        const docRef = doc(db, "bookings", bookingId);
        await updateDoc(docRef, { status: "confirmed" });
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "confirmed" } : b,
          ),
        );
      } catch (err) {
        console.error("Error approving booking:", err);
      }
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    if (bookingId.startsWith("mock_")) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
    } else {
      try {
        const docRef = doc(db, "bookings", bookingId);
        await updateDoc(docRef, { status: "cancelled" });
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b,
          ),
        );
      } catch (err) {
        console.error("Error cancelling booking:", err);
      }
    }
  };

  const handleToggleCourtActive = async () => {
    if (!selectedCourt || selectedCourt.isMock) return;
    const newActiveState = !selectedCourt.active;
    try {
      const docRef = doc(db, "courts", selectedCourt.id);
      await updateDoc(docRef, { active: newActiveState });

      // Update local courts state
      setCourts((prev) =>
        prev.map((c) =>
          c.id === selectedCourt.id ? { ...c, active: newActiveState } : c,
        ),
      );
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái hiển thị của sân:", err);
    }
  };

  // Calculate metrics
  const todayDateStr = formatDateVi(new Date());
  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();

  let todayRevenue = 0;
  let monthRevenue = 0;
  let totalBookings = bookings.length;

  bookings.forEach((b: any) => {
    if (b.status === "confirmed") {
      if (b.slots && Array.isArray(b.slots)) {
        b.slots.forEach((s: any) => {
          const isToday = s.dateStr === todayDateStr;

          // Parse dateStr e.g. "Thứ Ba, 23/6/2026"
          const dateParts = s.dateStr.split(",");
          let isCurrentMonth = false;
          if (dateParts.length > 1) {
            const dmy = dateParts[1].trim().split("/");
            if (dmy.length === 3) {
              const m = parseInt(dmy[1]);
              const y = parseInt(dmy[2]);
              if (m === currentMonthNum && y === currentYearNum) {
                isCurrentMonth = true;
              }
            }
          }

          if (isToday) {
            todayRevenue += s.price || 0;
          }
          if (isCurrentMonth) {
            monthRevenue += s.price || 0;
          }
        });
      } else {
        todayRevenue += b.totalPrice || 0;
        monthRevenue += b.totalPrice || 0;
      }
    }
  });

  // Filter pending bookings
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  // Combined list of managed courts for timetable grid
  const managedCourts: {
    id: string;
    name: string;
    isMock: boolean;
    category: string;
    active: boolean;
    subCourts: any[];
  }[] = [];

  // Add custom courts
  courts.forEach((c) => {
    managedCourts.push({
      id: c.id,
      name: c.name,
      isMock: false,
      category: c.sportType,
      active: c.active !== undefined ? c.active : false,
      subCourts: (c.subCourts || []).map((sc: any, index: number) => ({
        id: `${c.id}_sc_${index}`,
        name: sc.name,
        type: "Standard",
      })),
    });
  });

  // Add mock courts that have bookings
  premiumCourts.forEach((mc) => {
    const hasBookings = bookings.some((b: any) => Number(b.courtId) === mc.id);
    const alreadyAdded = managedCourts.some(
      (c) => c.isMock && c.id === String(mc.id),
    );
    if ((hasBookings || managedCourts.length === 0) && !alreadyAdded) {
      managedCourts.push({
        id: String(mc.id),
        name: mc.name,
        isMock: true,
        category: mc.category,
        active: true,
        subCourts: getSubCourtsForCategory(mc.category),
      });
    }
  });

  // Selected court object for timetable
  const selectedCourt =
    managedCourts.find((c) => c.id === selectedCourtId) || managedCourts[0];
  const selectedDateStr = formatDateVi(weekDates[selectedDay]);

  // Find booking for cell
  const findBookingForSlot = (subCourtId: string, slotId: string) => {
    for (const b of bookings) {
      if (b.status !== "cancelled" && b.slots && Array.isArray(b.slots)) {
        const matchingSlot = b.slots.find(
          (s: any) =>
            s.courtId === subCourtId &&
            s.slotId === slotId &&
            s.dateStr === selectedDateStr,
        );
        if (matchingSlot) {
          return {
            customerName: b.customerName,
            customerPhone: b.customerPhone,
            note: b.note,
            price: matchingSlot.price,
            status: b.status,
          };
        }
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              📊 Dashboard Chủ Sân
            </h1>
            <p className="text-sm text-zinc-550 dark:text-zinc-400">
              Xin chào,{" "}
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {profile?.fullName}
              </span>
              . Quản lý doanh thu và duyệt lịch đặt sân của bạn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/owner/config-court"
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-button-text font-bold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
            >
              ⚙️ Cấu hình sân
            </Link>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Today Revenue */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300"></div>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                  Doanh thu ngày hôm nay
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {todayRevenue.toLocaleString("vi-VN")}đ
                </h3>
              </div>
              <span className="text-2xl bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-2xl text-emerald-600">
                💰
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
              Chỉ tính các lịch đã được duyệt • Ngày:{" "}
              {todayDateStr.split(",")[1]?.trim() || todayDateStr}
            </div>
          </div>

          {/* Card 2: Month Revenue */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300"></div>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                  Doanh thu tháng này
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {monthRevenue.toLocaleString("vi-VN")}đ
                </h3>
              </div>
              <span className="text-2xl bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-2xl text-blue-600">
                📈
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
              Tính tổng doanh thu được duyệt trong tháng {currentMonthNum}/
              {currentYearNum}
            </div>
          </div>

          {/* Card 3: Total Bookings */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300"></div>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                  Tổng lượt đặt sân
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {totalBookings} lượt
                </h3>
              </div>
              <span className="text-2xl bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-2xl text-amber-600">
                📅
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
              Tổng số lượng phiếu đặt trên hệ thống của bạn
            </div>
          </div>
        </div>

        {/* SECTION 1: PENDING BOOKINGS LIST (MAX 3 ITEMS HEIGHT WITH SCROLL) */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              ⏳ Danh Sách Đặt Sân Chờ Duyệt
              {pendingBookings.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black">
                  {pendingBookings.length} phiếu
                </span>
              )}
            </h2>
          </div>

          <div className="max-h-[360px] overflow-y-auto pr-2 space-y-3.5 scrollbar-thin">
            {isLoadingData ? (
              <div className="py-8 text-center text-zinc-400 animate-pulse text-xs font-semibold">
                Đang tải danh sách chờ duyệt...
              </div>
            ) : pendingBookings.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs font-medium">
                🎉 Không có yêu cầu đặt sân nào cần chờ duyệt. Tất cả lịch đều
                gọn gàng!
              </div>
            ) : (
              pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-500/[0.02] hover:bg-amber-500/[0.05] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group shadow-sm"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">
                        {b.customerName}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-455 font-mono">
                        📞 {b.customerPhone}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        •{" "}
                        {b.createdAt
                          ? new Date(b.createdAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
                      <p className="font-bold text-zinc-700 dark:text-zinc-350">
                        🏢 {b.courtName}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {b.slots?.map((s: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold"
                          >
                            {s.courtName} ({s.slotLabel}) -{" "}
                            {s.dateStr.split(",")[0]}
                          </span>
                        ))}
                      </div>
                      {b.note && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-1.5">
                          💬 "{b.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-dashed border-zinc-150 dark:border-zinc-800 pt-3 md:pt-0">
                    <div className="text-right pr-2">
                      <span className="block text-[9px] text-zinc-455 uppercase tracking-wider font-bold">
                        Tổng cộng
                      </span>
                      <span className="text-base font-black text-highlight">
                        {b.totalPrice?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeclineBooking(b.id)}
                        className="px-3.5 py-2 rounded-xl text-[11px] font-bold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 transition-all active:scale-95"
                      >
                        ✕ Từ chối
                      </button>
                      <button
                        onClick={() => handleApproveBooking(b.id)}
                        className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-button-text font-bold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
                      >
                        ✓ Duyệt
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 2: TIMETABLE SCHEDULE GRID VIEW */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100">
                🗓️ Bảng Lịch Đặt Sân (Timetable)
              </h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Hiển thị trạng thái các ô giờ trong ngày. Màu xanh lá biểu thị
                đã duyệt, màu cam biểu thị chờ duyệt.
              </p>
            </div>

            {/* Timetable Court Filter Dropdown & Active Toggle */}
            {managedCourts.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-455 dark:text-zinc-500">
                    Chọn sân cơ sở:
                  </span>
                  <select
                    value={selectedCourtId}
                    onChange={(e) => setSelectedCourtId(e.target.value)}
                    className="text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-primary outline-none transition-all dark:text-zinc-100 font-semibold shadow-sm"
                  >
                    {managedCourts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.isMock ? "(Mẫu)" : "(Thật)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {isLoadingData ? (
            <div className="p-12 text-center text-zinc-400 animate-pulse text-xs font-semibold">
              Đang tải bảng lịch đặt sân...
            </div>
          ) : !selectedCourt ? (
            <div className="p-12 text-center text-zinc-400 text-xs font-medium">
              📭 Không có sân nào để hiển thị bảng lịch. Hãy tạo sân mới trước.
            </div>
          ) : (
            <>
              {/* Day Picker */}
              <div className="space-y-3">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Chọn ngày xem lịch:
                </p>
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, i) => {
                    const isSelected = selectedDay === i;
                    const dateDayName =
                      weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
                    const isToday =
                      date.toDateString() === today.toDateString();

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDay(i)}
                        className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-2xl border transition-all duration-200 relative ${
                          isSelected
                            ? "bg-primary border-primary-hover text-white shadow-md scale-[1.01]"
                            : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {isToday && (
                          <span
                            className={`absolute -top-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${
                              isSelected
                                ? "bg-white text-primary"
                                : "bg-primary text-white"
                            }`}
                          >
                            Hôm nay
                          </span>
                        )}
                        <span className="text-[8px] font-bold uppercase opacity-80">
                          {dateDayName}
                        </span>
                        <span className="text-sm font-black tracking-tight">
                          {date.getDate()}
                        </span>
                        <span className="text-[8px] opacity-75">
                          Thg {date.getMonth() + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timetable Table Grid */}
              <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-inner">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full border-collapse border-spacing-0 table-fixed">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-900 text-[10px] font-bold text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                        <th
                          rowSpan={2}
                          className="sticky left-0 z-30 bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-left w-[150px] min-w-[150px] border-r border-zinc-200 dark:border-zinc-800 font-extrabold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] align-middle"
                        >
                          Sân Con
                        </th>
                        {Array.from({ length: 19 }, (_, i) => {
                          const hour = 5 + i;
                          const hourStr =
                            hour.toString().padStart(2, "0") + ":00";
                          return (
                            <th
                              key={i}
                              colSpan={2}
                              className="px-2 py-3 text-center border-r border-zinc-200 dark:border-zinc-800 w-[120px] min-w-[120px] font-extrabold text-zinc-800 dark:text-zinc-200"
                            >
                              {hourStr}
                            </th>
                          );
                        })}
                      </tr>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-950 text-[8px] font-bold text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                        {TIME_SLOTS.map((slot) => (
                          <th
                            key={slot.id}
                            className={`px-1 py-1 text-center border-r border-zinc-200 dark:border-zinc-800 w-[60px] min-w-[60px] ${
                              slot.isPeak
                                ? "text-amber-500 bg-amber-500/5 font-extrabold"
                                : ""
                            }`}
                          >
                            {slot.start.endsWith("30") ? `:30` : `:00`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourt.subCourts.map((courtItem: any) => (
                        <tr
                          key={courtItem.id}
                          className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                        >
                          {/* Subcourt Name Column */}
                          <td className="sticky left-0 z-20 bg-white dark:bg-zinc-950 px-4 py-3.5 border-r border-zinc-200 dark:border-zinc-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                            <div className="flex flex-col">
                              <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 truncate w-[130px]">
                                {courtItem.name}
                              </span>
                              <span className="text-[9px] text-zinc-400 mt-0.5">
                                {courtItem.type} Court
                              </span>
                            </div>
                          </td>

                          {/* Slot Grid Cells */}
                          {TIME_SLOTS.map((slot) => {
                            const bookingCell = findBookingForSlot(
                              courtItem.id,
                              slot.id,
                            );

                            return (
                              <td
                                key={slot.id}
                                className="p-1 border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 align-middle"
                              >
                                {bookingCell ? (
                                  bookingCell.status === "pending" ? (
                                    <div
                                      title={`Khách: ${bookingCell.customerName}\nSĐT: ${bookingCell.customerPhone}\nTrạng thái: CHỜ DUYỆT\nGiá: ${bookingCell.price.toLocaleString("vi-VN")}đ\nGhi chú: ${bookingCell.note || "Không"}`}
                                      className="h-10 w-full rounded p-1 flex flex-col justify-center items-center gap-0.5 border border-dashed border-amber-300 dark:border-amber-800 bg-amber-500/10 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 select-none cursor-pointer hover:bg-amber-500/20 transition-all text-center animate-pulse"
                                    >
                                      <span className="text-[8px] font-black tracking-tight truncate w-full">
                                        {bookingCell.customerName}
                                      </span>
                                      <span className="text-[7px] font-mono leading-none tracking-tight truncate w-full">
                                        ⏳ CHỜ DUYỆT
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      title={`Khách: ${bookingCell.customerName}\nSĐT: ${bookingCell.customerPhone}\nTrạng thái: ĐÃ DUYỆT\nGiá: ${bookingCell.price.toLocaleString("vi-VN")}đ\nGhi chú: ${bookingCell.note || "Không"}`}
                                      className="h-10 w-full rounded p-1 flex flex-col justify-center items-center gap-0.5 border border-emerald-200 dark:border-emerald-800 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 select-none cursor-pointer hover:bg-emerald-500/20 transition-all text-center"
                                    >
                                    >
                                      <span className="text-[8px] font-black tracking-tight truncate w-full">
                                        {bookingCell.customerName}
                                      </span>
                                      <span className="text-[7px] font-mono leading-none tracking-tight truncate w-full text-emerald-600 dark:text-emerald-400">
                                        ✓ ĐÃ DUYỆT
                                      </span>
                                    </div>
                                  )
                                ) : (
                                  <div
                                    className="h-10 w-full rounded flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/5 text-zinc-350 dark:text-zinc-700 select-none"
                                    title="Sân trống"
                                  >
                                    <span className="text-[8px] font-medium tracking-wider">
                                      TRỐNG
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
