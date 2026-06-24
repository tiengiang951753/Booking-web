"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { courtSchema, CourtInput } from "./_components/court-schema";
import SubCourtsConfig from "./_components/SubCourtsConfig";

function ConfigCourtForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courtId = searchParams.get("id");

  const { user, profile, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!courtId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CourtInput>({
    resolver: zodResolver(courtSchema),
    defaultValues: {
      name: "",
      sportType: "badminton",
      address: "",
      pricePerHour: 50000,
      openingTime: "06:00",
      closingTime: "22:00",
      subCourtsCount: 1,
      subCourts: [{ name: "Sân số 1" }],
      description: "",
      imageUrl: "",
      active: false,
    },
  });

  // Auth Guard: Chỉ cho phép "owner" truy cập
  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== "owner") {
        router.replace("/");
      }
    }
  }, [user, profile, loading, router]);

  // Tải dữ liệu sân cũ nếu có courtId
  useEffect(() => {
    if (user && courtId) {
      const fetchCourt = async () => {
        try {
          setIsLoadingData(true);
          const docRef = doc(db, "courts", courtId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Xác thực quyền sở hữu
            if (data.ownerId !== user.uid) {
              router.replace(`/owner/${user.uid}`);
              return;
            }
            // Reset form với dữ liệu cũ
            reset({
              name: data.name || "",
              sportType: data.sportType || "badminton",
              address: data.address || "",
              pricePerHour: data.pricePerHour || 50000,
              openingTime: data.openingTime || "06:00",
              closingTime: data.closingTime || "22:00",
              subCourtsCount: data.subCourtsCount || 1,
              subCourts: data.subCourts || [{ name: "Sân số 1" }],
              description: data.description || "",
              imageUrl: data.imageUrl || "",
              active: data.active ?? false,
            });
          } else {
            setErrorMsg("Sân thể thao không tồn tại trên hệ thống.");
          }
        } catch (err) {
          console.error("Error fetching court data:", err);
          setErrorMsg("Không thể tải thông tin sân.");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchCourt();
    }
  }, [user, courtId, reset, router]);

  // Hiển thị trạng thái chờ khi đang xác thực hoặc đang tải dữ liệu
  if (loading || !user || profile?.role !== "owner" || isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 animate-pulse">
          {isLoadingData ? "Đang tải cấu hình sân..." : "Đang xác thực thông tin tài khoản..."}
        </p>
      </div>
    );
  }

  // Xử lý gửi biểu mẫu
  const onSubmit = async (data: CourtInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const courtPayload = {
        name: data.name,
        sportType: data.sportType,
        address: data.address,
        pricePerHour: Number(data.pricePerHour),
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        subCourtsCount: Number(data.subCourtsCount),
        subCourts: data.subCourts,
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        ownerId: user.uid,
        ownerName: profile.fullName,
        active: data.active ?? false,
        updatedAt: new Date().toISOString(),
      };

      if (courtId) {
        // Cập nhật thông tin sân hiện tại
        const docRef = doc(db, "courts", courtId);
        await updateDoc(docRef, courtPayload);
        alert("Cập nhật thông tin sân thành công!");
      } else {
        // Tạo sân thể thao mới
        const courtPayloadWithCreatedAt = {
          ...courtPayload,
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "courts"), courtPayloadWithCreatedAt);
        alert("Tạo thông tin sân thể thao thành công!");
      }

      reset();
      
      // Chuyển hướng về trang quản trị
      router.push(`/owner/${user.uid}`);
    } catch (err: any) {
      console.error("Lỗi khi lưu thông tin sân:", err);
      setErrorMsg("Không thể lưu cấu hình sân. Vui lòng kiểm tra lại kết nối và thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Breadcrumbs & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-555 dark:text-zinc-400">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href={user ? `/owner/${user.uid}` : "/"} className="hover:text-primary transition-colors">Quản trị</Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              {courtId ? "Chỉnh sửa sân" : "Thêm sân mới"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {courtId ? "⚙️ Chỉnh sửa thông tin sân" : "➕ Thêm sân thể thao mới"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {courtId 
              ? "Cập nhật các thông số cơ sở và cấu hình tên từng sân con thành viên."
              : "Thiết lập một sân thể thao mới để quản lý và hiển thị cho khách hàng đặt sân."
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Tên Sân */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Tên sân thể thao / Cơ sở
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Ví dụ: Sân Cầu Lông Him Lam - Sân Số 1"
                className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.name.message}</p>
              )}
            </div>

            {/* Môn thể thao & Số lượng sân nhỏ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Môn thể thao áp dụng
                </label>
                <select
                  {...register("sportType")}
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                >
                  <option value="badminton">Cầu lông (🏸)</option>
                  <option value="pickleball">Pickleball (🏓)</option>
                  <option value="tennis">Tennis (🎾)</option>
                  <option value="football">Bóng đá (⚽)</option>
                  <option value="basketball">Bóng rổ (🏀)</option>
                </select>
                {errors.sportType && (
                  <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.sportType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Số lượng sân nhỏ thành viên
                </label>
                <input
                  type="number"
                  {...register("subCourtsCount", { valueAsNumber: true })}
                  placeholder="Ví dụ: 6"
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
                {errors.subCourtsCount && (
                  <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.subCourtsCount.message}</p>
                )}
              </div>
            </div>

            {/* Danh sách tên các sân con */}
            <SubCourtsConfig
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
            />

            {/* Địa chỉ cụ thể */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Địa chỉ chi tiết cơ sở sân
              </label>
              <input
                type="text"
                {...register("address")}
                placeholder="Số 123, Đường Nguyễn Thị Thập, Quận 7, TP.HCM"
                className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
              />
              {errors.address && (
                <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.address.message}</p>
              )}
            </div>

            {/* Giá tiền thuê và Giờ hoạt động */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Giá thuê (đ/giờ)
                </label>
                <input
                  type="number"
                  {...register("pricePerHour", { valueAsNumber: true })}
                  placeholder="50000"
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
                {errors.pricePerHour && (
                  <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.pricePerHour.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Giờ mở cửa
                </label>
                <input
                  type="time"
                  {...register("openingTime")}
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
                {errors.openingTime && (
                  <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.openingTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Giờ đóng cửa
                </label>
                <input
                  type="time"
                  {...register("closingTime")}
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
                {errors.closingTime && (
                  <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.closingTime.message}</p>
                )}
              </div>
            </div>

            {/* Link ảnh sân */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Đường dẫn hình ảnh sân (URL)
              </label>
              <input
                type="text"
                {...register("imageUrl")}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.imageUrl.message}</p>
              )}
            </div>

            {/* Mô tả chi tiết */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Mô tả chi tiết về sân thể thao
              </label>
              <textarea
                rows={4}
                {...register("description")}
                placeholder="Giới thiệu về dịch vụ tiện ích đi kèm (ví dụ: nước uống miễn phí, bãi xe rộng, dịch vụ cho thuê vợt...)"
                className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.description.message}</p>
              )}
            </div>

            {/* Trạng thái kích hoạt hiển thị */}
            <div className="p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/[0.3] dark:bg-zinc-900/10 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  🌐 Kích hoạt hiển thị sân
                </label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Khi bật, khách hàng có thể tìm thấy và đặt lịch sân này trên trang chủ.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("active")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary dark:peer-focus:ring-primary/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Thông báo lỗi từ Firestore */}
            {errorMsg && (
              <div className="p-3 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <Link
                href={user ? `/owner/${user.uid}` : "/"}
                className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider text-button-text bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu cấu hình</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}

export default function ConfigCourtPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400">Đang tải thiết lập...</p>
      </div>
    }>
      <ConfigCourtForm />
    </Suspense>
  );
}
