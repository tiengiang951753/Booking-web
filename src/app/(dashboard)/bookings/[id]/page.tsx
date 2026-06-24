"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/services/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

// ─── Dynamic Mock Database of Sports Centers ─────────────────────────────────
const premiumCourts = [
  {
    id: 1,
    name: "Sân Cầu Lông Premium Him Lam",
    category: "badminton",
    categoryName: "Cầu lông",
    categoryIcon: "🏸",
    rating: 4.9,
    reviewsCount: 142,
    priceRange: "80.000đ - 140.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    location: "285 Nguyễn Văn Linh, Tân Hưng, Quận 7, TP. Hồ Chí Minh",
    phone: "0901 234 567",
    openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
    description:
      "Sân cầu lông Him Lam Premium là tổ hợp sân cầu lông tiêu chuẩn thi đấu quốc tế với 8 sân trong nhà, hệ thống máy lạnh toàn bộ, thảm sân chuẩn Yonex NK và ánh sáng LED đạt 500 lux. Đây là điểm đến lý tưởng cho cả người chơi nghiệp dư lẫn vận động viên chuyên nghiệp tại TP. Hồ Chí Minh.",
    features: [
      { icon: "❄️", label: "Máy lạnh toàn bộ" },
      { icon: "💡", label: "Đèn LED 500 lux" },
      { icon: "🏅", label: "Thảm Yonex chuẩn BWF" },
      { icon: "🚿", label: "Phòng thay đồ & tắm nóng lạnh" },
      { icon: "🅿️", label: "Bãi xe rộng miễn phí" },
      { icon: "🥤", label: "Canteen phục vụ ăn uống" },
    ],
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: 2,
    name: "Pickleball Elite Club Thảo Điền",
    category: "pickleball",
    categoryName: "Pickleball",
    categoryIcon: "🏓",
    rating: 5.0,
    reviewsCount: 89,
    priceRange: "110.000đ - 220.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80",
    location: "12 Quốc Hương, Thảo Điền, Quận 2, TP. Thủ Đức",
    phone: "0908 777 999",
    openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
    description:
      "Câu lạc bộ Pickleball Elite Thảo Điền sở hữu không gian chơi thể thao đẳng cấp thượng lưu với 6 sân trong nhà và 4 sân ngoài trời thoáng mát. Hệ thống mặt sân chuẩn USA Pickleball, trang bị sẵn vợt Selkirk cao cấp và có khu Lounge nghỉ ngơi cực chill.",
    features: [
      { icon: "🍹", label: "Quầy Bar & Juice Lounge" },
      { icon: "🏓", label: "Cho thuê vợt Selkirk miễn phí" },
      { icon: "💡", label: "Đèn LED chuẩn giải đấu" },
      { icon: "🚿", label: "Phòng tắm hơi cao cấp" },
      { icon: "🚗", label: "Hỗ trợ đỗ ô tô" },
      { icon: "🎥", label: "Camera tự động ghi hình trận đấu" },
    ],
    images: [
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: 3,
    name: "Vinhomes Central Park Tennis Court",
    category: "tennis",
    categoryName: "Tennis",
    categoryIcon: "🎾",
    rating: 4.8,
    reviewsCount: 65,
    priceRange: "140.005đ - 250.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
    location: "Khu đô thị Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0912 888 777",
    openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
    description:
      "Cụm sân Tennis đẳng cấp quốc tế tọa lạc ngay tại công viên ven sông Central Park. Mặt sân phủ Plexipave giảm chấn cực tốt cho khớp gối, không gian thoáng đãng lộng gió sông Sài Gòn, rất thích hợp cho các buổi giao lưu tennis ban đêm.",
    features: [
      { icon: "🌊", label: "Cạnh sông lộng gió" },
      { icon: "🏅", label: "Mặt sân giảm chấn Plexipave" },
      { icon: "💡", label: "Hệ thống chiếu sáng 800 lux" },
      { icon: "🚿", label: "Khu vệ sinh hiện đại" },
      { icon: "🎾", label: "Cung cấp bóng Dunlop chất lượng" },
      { icon: "🎓", label: "Có huấn luyện viên hỗ trợ" },
    ],
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: 4,
    name: "Sân Bóng Đá Rạch Chiếc Stadium",
    category: "football",
    categoryName: "Bóng đá",
    categoryIcon: "⚽",
    rating: 4.7,
    reviewsCount: 215,
    priceRange: "200.000đ - 450.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    location: "Xa lộ Hà Nội, An Phú, Quận 2, TP. Thủ Đức",
    phone: "0944 555 666",
    openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
    description:
      "Tổ hợp sân bóng cỏ nhân tạo FIFA chất lượng cao tại Rạch Chiếc. Sân bóng sử metal hạt cao su thân thiện môi trường, hệ thống thoát nước siêu tốc không lo ngập lụt ngày mưa, đèn cao áp chiếu sáng cực nét toàn sân đấu.",
    features: [
      { icon: "⚽", label: "Cỏ nhân tạo chuẩn FIFA" },
      { icon: "💡", label: "Đèn cao áp không bóng mờ" },
      { icon: "🚿", label: "Khu vực tắm rửa sạch sẽ" },
      { icon: "👕", label: "Cho thuê áo bib thi đấu" },
      { icon: "🅿️", label: "Bãi xe ô tô cực rộng" },
      { icon: "🥤", label: "Nước uống đá lạnh sẵn sàng" },
    ],
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: 5,
    name: "Sân Bóng Rổ Thể Thao Đa Năng Phú Thọ",
    category: "basketball",
    categoryName: "Bóng rổ",
    categoryIcon: "🏀",
    rating: 4.9,
    reviewsCount: 104,
    priceRange: "100.000đ - 180.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    location: "219 Lý Thường Kiệt, Quận 11, TP. Hồ Chí Minh",
    phone: "0903 111 222",
    openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
    description:
      "Sân bóng rổ Phú Thọ nổi tiếng là địa chỉ thi đấu bóng rổ hàng đầu với mặt sân gỗ phong cao cấp nhập khẩu, rổ kính chịu lực chuẩn thi đấu VBA. Hệ thống thông gió mát mẻ và khán đài mini cho cổ động viên.",
    features: [
      { icon: "🪵", label: "Mặt sàn gỗ phong cao cấp" },
      { icon: "🏀", label: "Rổ kính chịu lực chuẩn VBA" },
      { icon: "💡", label: "Đèn LED chống chói mắt" },
      { icon: "🚿", label: "Khu vực thay đồ & locker" },
      { icon: "🚗", label: "Bãi xe Phú Thọ tiện lợi" },
      { icon: "🎟️", label: "Khán đài theo dõi trận đấu" },
    ],
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: 6,
    name: "Cầu Lông & Pickleball Sunrise Center",
    category: "pickleball",
    categoryName: "Pickleball",
    categoryIcon: "🏓",
    rating: 4.9,
    reviewsCount: 73,
    priceRange: "110.000đ - 200.000đ / giờ",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
    location: "Lô D4 Nguyễn Hữu Thọ, Nhà Bè, TP. Hồ Chí Minh",
    phone: "0933 444 555",
    openHours: "05:00 – 24:00 (Tất cả các ngày trong tuần)",
    description:
      "Tổ hợp Sunrise Center là trung tâm thể thao phức hợp thế hệ mới, tích hợp sân cầu lông trong nhà chuẩn thảm thi đấu và cụm sân Pickleball ngoài trời hiện đại. Rất thoáng mát, tiện nghi ngập tràn.",
    features: [
      { icon: "🌟", label: "Tổ hợp đa năng hiện đại" },
      { icon: "🎥", label: "Quay video livestream trận đấu" },
      { icon: "🚿", label: "Khu tắm rửa khép kín" },
      { icon: "☕", label: "Canteen & Coffee Shop" },
      { icon: "🅿️", label: "Bãi xe ô tô có mái che" },
      { icon: "🏸", label: "Cho thuê đầy đủ phụ kiện" },
    ],
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

// Dynamic sub-courts based on center category
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

// Dynamic pricing calculation based on sport category and VIP status
const getSlotPriceForCategory = (
  category: string,
  courtType: string,
  slotStartHour: number,
  customBasePrice?: number,
) => {
  const isVIP = courtType === "VIP";
  let basePrice = customBasePrice ? (customBasePrice / 2) : 40000; // per 30 mins

  if (!customBasePrice) {
    if (category === "football") {
      basePrice = isVIP ? 150000 : 100000;
    } else if (category === "tennis") {
      basePrice = isVIP ? 90000 : 70000;
    } else if (category === "pickleball") {
      basePrice = isVIP ? 75000 : 55000;
    } else if (category === "basketball") {
      basePrice = isVIP ? 70000 : 50000;
    } else {
      // badminton & default
      basePrice = isVIP ? 50000 : 40000;
    }
  } else {
    if (isVIP) {
      basePrice = basePrice * 1.2;
    }
  }

  // Peak hours (+25%) and early morning golden hour (-20%)
  if (slotStartHour >= 5 && slotStartHour < 8) {
    return Math.round((basePrice * 0.8) / 5000) * 5000;
  } else if (slotStartHour >= 17 && slotStartHour < 22) {
    return Math.round((basePrice * 1.25) / 5000) * 5000;
  } else {
    return basePrice;
  }
};

// Stable mock bookings based on date selected, court ID and cell index
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
    return (
      (slotIndex * dayIndex + courtId.charCodeAt(courtId.length - 1)) % 5 === 0
    );
  }
  if (slotHour >= 17 && slotHour < 22) {
    return (
      (slotIndex + courtId.charCodeAt(courtId.length - 1) + dayIndex) % 3 !== 0
    ); // High booked peak
  }
  if (slotHour >= 22) {
    return (slotIndex + dayIndex * 2) % 2 === 0;
  }
  return (
    (slotIndex + courtId.charCodeAt(courtId.length - 1) * dayIndex) % 6 === 0
  );
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

type Props = {
  params: Promise<{ id: string }>;
};

export default function DynamicBookingPage({ params }: Props) {
  const { user, profile } = useAuth();
  
  // Resolve params using React.use()
  const { id: paramId } = use(params);
  const courtId = parseInt(paramId);
  const isMock = !isNaN(courtId) && courtId >= 1 && courtId <= 6;

  const [customCourtData, setCustomCourtData] = useState<any | null>(null);
  const [isLoadingCourt, setIsLoadingCourt] = useState(!isMock);

  // States
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

  useEffect(() => {
    if (!isMock) {
      const fetchCustomCourt = async () => {
        try {
          setIsLoadingCourt(true);
          const docRef = doc(db, "courts", paramId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            const categoryMap: Record<string, { name: string; icon: string }> = {
              badminton: { name: "Cầu lông", icon: "🏸" },
              pickleball: { name: "Pickleball", icon: "🏓" },
              tennis: { name: "Tennis", icon: "🎾" },
              football: { name: "Bóng đá", icon: "⚽" },
              basketball: { name: "Bóng rổ", icon: "🏀" },
            };
            const catInfo = categoryMap[data.sportType] || { name: data.sportType, icon: "🏸" };

            setCustomCourtData({
              id: paramId,
              name: data.name,
              category: data.sportType,
              categoryName: catInfo.name,
              categoryIcon: catInfo.icon,
              rating: 5.0,
              reviewsCount: 0,
              priceRange: `${data.pricePerHour.toLocaleString("vi-VN")}đ / giờ`,
              image: data.imageUrl || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
              location: data.address,
              phone: data.phone || "N/A",
              openHours: `${data.openingTime} – ${data.closingTime}`,
              description: data.description || "",
              features: [
                { icon: "⚡", label: "Sân mới hiện đại" },
                { icon: "🅿️", label: "Bãi xe tiện lợi" },
                { icon: "💡", label: "Đèn chiếu sáng tốt" },
              ],
              images: [
                data.imageUrl || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
              ],
              subCourts: (data.subCourts || []).map((sc: any, index: number) => ({
                id: `${paramId}_sc_${index}`,
                name: sc.name,
                type: "Standard"
              })),
              ownerId: data.ownerId,
              pricePerHour: data.pricePerHour,
              active: data.active ?? false,
            });
          }
        } catch (err) {
          console.error("Error fetching custom court:", err);
        } finally {
          setIsLoadingCourt(false);
        }
      };
      fetchCustomCourt();
    }
  }, [paramId, isMock]);

  // Autofill contact info when logged in user is loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  // Find center from mock DB
  const centerData = isMock
    ? (premiumCourts.find((c) => c.id === courtId) || premiumCourts[0])
    : customCourtData;

  const subCourts = isMock
    ? getSubCourtsForCategory(centerData?.category || "badminton")
    : (centerData?.subCourts || []);

  if (isLoadingCourt || (!isMock && !centerData)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-background gap-3">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 animate-pulse">
          Đang tải dữ liệu sân...
        </p>
      </div>
    );
  }

  const isActive = isMock ? true : (centerData?.active ?? false);
  const isOwner = user && centerData && user.uid === centerData.ownerId;

  if (!isActive && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 text-center gap-4">
        <span className="text-6xl">🔒</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Sân thể thao chưa được kích hoạt
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-md">
          Cơ sở thể thao này hiện tại đang tạm ẩn hoặc chưa được kích hoạt bởi chủ sân. Vui lòng quay lại sau hoặc chọn sân khác từ trang chủ.
        </p>
        <Link
          href="/"
          className="mt-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-button-text font-bold text-xs rounded-xl shadow-md transition-all duration-200"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

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

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlots.length === 0 || !fullName || !phone) return;
    setIsSubmittingBooking(true);
    setBookingError(null);
    try {
      const mockOwnerId = user?.uid || "mock-owner-id";
      const ownerId = isMock ? mockOwnerId : (centerData.ownerId || "mock-owner-id");

      await addDoc(collection(db, "bookings"), {
        courtId: isMock ? courtId : paramId,
        courtName: centerData.name,
        customerName: fullName,
        customerPhone: phone,
        note: note || "",
        slots: selectedSlots.map((s) => ({
          courtId: s.courtId,
          courtName: s.courtName,
          slotId: s.slotId,
          slotLabel: s.slotLabel,
          price: s.price,
          dateStr: s.dateStr,
        })),
        totalPrice: totalPrice,
        createdAt: new Date().toISOString(),
        ownerId: ownerId,
        status: "confirmed",
      });

      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error("Lỗi khi lưu lịch đặt sân:", err);
      setBookingError("Không thể hoàn tất đặt sân. Vui lòng thử lại.");
    } finally {
      setIsSubmittingBooking(false);
    }
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
    <div className="min-h-screen bg-zinc-50 dark:bg-background text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {!isActive && isOwner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-400 py-3 px-4 text-center text-xs font-bold flex items-center justify-center gap-2">
          <span>⚠️ Sân này đang ở chế độ ẩn đối với khách hàng. Chỉ có bạn (Chủ sân) mới có thể xem trang này ở chế độ xem trước.</span>
          <Link
            href={`/owner/config-court?id=${paramId}`}
            className="underline hover:text-amber-900 dark:hover:text-amber-300 font-extrabold"
          >
            Kích hoạt ngay
          </Link>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── BREADCRUMB ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="capitalize">{centerData.categoryName}</span>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-xs">
            {centerData.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* ── IMAGE GALLERY ─────────────────────────────────────── */}
            <section>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-xl">
                <img
                  src={centerData.images[activeImage]}
                  alt={centerData.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-primary/30">
                    ⭐ {centerData.categoryName} Đỉnh Cao
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold">
                    {activeImage + 1} / {centerData.images.length}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setActiveImage(
                      (p) =>
                        (p - 1 + centerData.images.length) %
                        centerData.images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors flex items-center justify-center text-sm font-bold"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActiveImage((p) => (p + 1) % centerData.images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors flex items-center justify-center text-sm font-bold"
                >
                  ›
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-3">
                {centerData.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-1 aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 ${
                      activeImage === i
                        ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950 scale-[1.02]"
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
                      {centerData.categoryIcon} {centerData.categoryName}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
                    {centerData.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      📍 {centerData.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-3 py-2">
                    <span className="text-amber-500 text-lg">★</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                      {centerData.rating}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {centerData.reviewsCount} đánh giá
                  </span>
                </div>
              </div>

              {/* Quick Info pills */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  🕐 {centerData.openHours}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  📞 {centerData.phone}
                </span>
              </div>
            </section>

            {/* ── TIMELINE INTERACTIVE SCHEDULE ─────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    Bảng Lịch Đặt Sân Trực Tuyến
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Nhấp vào ô giờ trống để đặt sân. Giá thay đổi tùy theo sân
                    VIP/Thường và Giờ Vàng.
                  </p>
                </div>
              </div>

              {/* Day Picker */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Chọn Ngày Chơi Sân
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
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border transition-all duration-300 relative ${
                          isSelected
                            ? "bg-primary border-primary-hover text-white shadow-lg shadow-primary/20 scale-[1.02]"
                            : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200/50 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {isToday && (
                          <span
                            className={`w-[70%] absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${isSelected ? "bg-white text-primary" : "bg-primary text-white"}`}
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

              {/* Responsive Scrollable Schedule Grid */}
              <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full border-collapse border-spacing-0 table-fixed">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800 text-[10px] md:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                        <th
                          rowSpan={2}
                          className="sticky left-0 z-30 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 text-left w-[150px] min-w-[150px] border-r border-zinc-200 dark:border-zinc-700 font-extrabold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] align-middle"
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
                      <tr className="bg-zinc-50 dark:bg-zinc-900 text-[9px] font-bold text-zinc-500 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                        {TIME_SLOTS.map((slot) => (
                          <th
                            key={slot.id}
                            className={`px-1 py-2 text-center border-r border-zinc-200 dark:border-zinc-800 w-[60px] min-w-[60px] ${
                              slot.isPeak
                                ? "text-amber-500 dark:text-amber-400 font-extrabold bg-amber-500/5"
                                : ""
                            }`}
                          >
                            {slot.start.endsWith("30") ? `:30` : `:00`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {subCourts.map((courtItem: any) => {
                        return (
                          <tr
                            key={courtItem.id}
                            className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 border-b border-zinc-150 dark:border-zinc-800 last:border-0"
                          >
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
                                      ? "VIP Court"
                                      : "Standard"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {TIME_SLOTS.map((slot, index) => {
                              const isBooked = getMockBookingStatus(
                                selectedDay,
                                courtItem.id,
                                index,
                              );
                              const dateStr = formatDateVi(
                                weekDates[selectedDay],
                              );
                              const isSelected = selectedSlots.some(
                                (s) =>
                                  s.courtId === courtItem.id &&
                                  s.slotId === slot.id &&
                                  s.dateStr === dateStr,
                              );
                              const price = getSlotPriceForCategory(
                                centerData.category,
                                courtItem.type,
                                slot.hourNum,
                                isMock ? undefined : centerData.pricePerHour,
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
                                      type="button"
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
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                Mô tả cơ sở
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {centerData.description}
              </p>
            </section>

            {/* ── AMENITIES ─────────────────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Tiện ích & Dịch vụ
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {centerData.features.map((f: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      {f.label}
                    </span>
                  </div>
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
                  {/* <p className="text-emerald-100 text-[10px] font-extrabold uppercase tracking-widest mb-1">
                    Đăng Ký Đặt Lịch
                  </p> */}
                  <div className="flex items-baseline justify-between mt-2">
                    <h3 className="text-xl font-black text-white">
                      Đặt lịch sân
                    </h3>
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
                      {centerData.categoryIcon}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Chưa chọn ô đặt sân nào
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                      Vui lòng cuộn lịch đặt sân bên trái và nhấn chọn các ô giờ
                      trống để hoàn thiện phiếu đặt sân của bạn.
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
                      {/* <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Số ô chọn</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {selectedSlots.length} ô
                        </span>
                      </div> */}
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
                          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Số điện thoại liên hệ *"
                          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                        <textarea
                          rows={2}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ghi chú thêm (giờ nhận sân, thuê thêm vợt/bóng...)"
                          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    {bookingError && (
                      <div className="p-3 text-xs font-bold text-red-500 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
                        ⚠️ {bookingError}
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="w-full py-4 rounded-xl font-extrabold text-sm tracking-wide text-button-text bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSubmittingBooking ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Đang đặt sân...</span>
                        </>
                      ) : (
                        <span>✓ Xác Nhận Đặt Sân</span>
                      )}
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
                <p className="text-sm font-bold mb-3">Hỗ trợ trực tiếp</p>
                <a
                  href={`tel:${centerData.phone}`}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-zinc-100 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 group"
                >
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Gọi Hotline cơ sở
                    </p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {centerData.phone}
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
                Chi tiết phiếu đặt
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
                    {centerData.name}
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

              {/* Grouped booked slots */}
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

            {/* QR Payment Transfer */}
            <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-center">
                Quét QR Chuyển Khoản Nhanh
              </p>

              <div className="relative w-36 h-36 bg-white p-2 rounded-2xl border border-zinc-200 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center rounded-xl text-center p-2 border-2 border-dashed border-zinc-300">
                  <span className="text-2xl">{centerData.categoryIcon}</span>
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
