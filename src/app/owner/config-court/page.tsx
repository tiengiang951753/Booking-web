"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { courtSchema, CourtInput } from "./_components/court-schema";
import CourtForm from "./_components/CourtForm";

function ConfigCourtForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courtId = searchParams.get("id");

  const { user, profile, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!courtId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [courts, setCourts] = useState<any[]>([]);
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadedCourtId, setLoadedCourtId] = useState<string | null>(null);

  // Form cho Chỉnh sửa sân (Inline)
  const editForm = useForm<CourtInput>({
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

  // Form cho Tạo mới sân (Modal)
  const createForm = useForm<CourtInput>({
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

  // Tải danh sách tất cả các sân của chủ sân
  const fetchAllCourts = async () => {
    if (!user) return;
    try {
      setLoadingCourts(true);
      const courtsQuery = query(
        collection(db, "courts"),
        where("ownerId", "==", user.uid),
      );
      const querySnapshot = await getDocs(courtsQuery);
      const courtsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourts(courtsList);
      setLoadedCourtId(courtsList[0]?.id);
    } catch (err) {
      console.error("Error fetching all courts:", err);
    } finally {
      setLoadingCourts(false);
    }
  };

  useEffect(() => {
    fetchAllCourts();
  }, [user]);

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
    if (!user) return;
    if (courtId) {
      // Reset form values to default state immediately to avoid showing old court's data while fetching
      editForm.reset({
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
      });

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
            // Reset form chỉnh sửa với dữ liệu cũ
            editForm.reset({
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
            setLoadedCourtId(courtId);
          } else {
            setErrorMsg("Sân thể thao không tồn tại trên hệ thống.");
            setLoadedCourtId(courtId);
          }
        } catch (err) {
          console.error("Error fetching court data:", err);
          setErrorMsg("Không thể tải thông tin sân.");
          setLoadedCourtId(courtId);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchCourt();
    } else {
      // Khi không có courtId, làm sạch form chỉnh sửa
      editForm.reset({
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
      });
      setLoadedCourtId(null);
    }
  }, [user, courtId, editForm, router]);

  // Hiển thị trạng thái chờ khi đang xác thực hoặc đang tải dữ liệu
  // if (loading || !user || profile?.role !== "owner" || isLoadingData) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
  //       <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
  //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  //       </svg>
  //       <p className="text-sm font-semibold text-zinc-555 dark:text-zinc-400 animate-pulse">
  //         {isLoadingData ? "Đang tải cấu hình sân..." : "Đang xác thực thông tin tài khoản..."}
  //       </p>
  //     </div>
  //   );
  // }

  // Hàm chuyển file sang chuỗi Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Xử lý gửi biểu mẫu chỉnh sửa (Inline)
  const onEditSubmit = async (data: CourtInput, imageFile: File | null) => {
    if (!courtId || !user || !profile) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      let finalImageUrl = data.imageUrl || "";

      // Chuyển file ảnh sang Base64 nếu có chọn file mới
      if (imageFile) {
        finalImageUrl = await fileToBase64(imageFile);
      }

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
        imageUrl: finalImageUrl,
        ownerId: user.uid,
        ownerName: profile.fullName,
        active: data.active ?? false,
        updatedAt: new Date().toISOString(),
      };

      const docRef = doc(db, "courts", courtId);
      await updateDoc(docRef, courtPayload);
      alert("Cập nhật thông tin sân thành công!");

      // Tải lại danh sách sân để hiển thị tên mới nếu có thay đổi
      await fetchAllCourts();
    } catch (err: any) {
      console.error("Lỗi khi lưu thông tin sân:", err);
      setErrorMsg(
        `Không thể lưu cấu hình sân: ${err.message || err.code || err}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý gửi biểu mẫu tạo mới (Modal)
  const onCreateSubmit = async (data: CourtInput, imageFile: File | null) => {
    if (!user || !profile) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      let finalImageUrl = data.imageUrl || "";

      // Chuyển file ảnh sang Base64 nếu có chọn file mới
      if (imageFile) {
        finalImageUrl = await fileToBase64(imageFile);
      }

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
        imageUrl: finalImageUrl,
        ownerId: user.uid,
        ownerName: profile.fullName,
        active: data.active ?? false,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "courts"), courtPayload);
      alert("Tạo thông tin sân thể thao thành công!");

      // Đóng modal và reset form tạo mới
      setIsCreateModalOpen(false);
      createForm.reset();

      // Tải lại danh sách sân
      await fetchAllCourts();

      // Tự động chuyển hướng chọn sân vừa tạo mới để cấu hình tiếp nếu cần
      router.push(`/owner/config-court?id=${docRef.id}`);
    } catch (err: any) {
      console.error("Lỗi khi tạo sân mới:", err);
      setErrorMsg(`Không thể tạo sân mới: ${err.message || err.code || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActuallyLoading = courtId
    ? isLoadingData || courtId !== loadedCourtId
    : false;

  return (
    <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-955 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Breadcrumbs & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-555 dark:text-zinc-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              href={user ? `/owner/${user.uid}` : "/"}
              className="hover:text-primary transition-colors"
            >
              Quản trị
            </Link>
            <span>/</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              Cấu hình sân
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Cấu hình sân
            </h1>
            <button
              type="button"
              onClick={() => {
                createForm.reset({
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
                });
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-button-text font-bold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <AddIcon className="text-inherit" sx={{ fontSize: 16 }} />
              Thêm sân mới
            </button>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Quản lý, chỉnh sửa thông tin hoặc thiết lập các sân thể thao trong
            cơ sở của bạn.
          </p>
        </div>

        {/* Chọn sân để cấu hình */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Chọn sân để cấu hình:
            </label>
            {loadingCourts && (
              <span className="text-xs text-zinc-400 animate-pulse">
                Đang tải danh sách sân...
              </span>
            )}
          </div>
          {loadingCourts ? (
            <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
          ) : courts.length === 0 ? (
            <div className="p-3.5 text-xs text-zinc-650 dark:text-zinc-455 bg-amber-500/10 dark:bg-amber-955/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl font-bold flex items-center gap-2">
              <span>
                ⚠️ Hiện tại chưa có sân nào được tạo, xin vui lòng chọn vào thêm
                mới để tạo sân
              </span>
            </div>
          ) : (
            <div className="relative">
              <select
                value={courtId || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    router.push(`/owner/config-court?id=${val}`);
                  } else {
                    router.push("/owner/config-court");
                  }
                }}
                className="w-full text-sm p-3 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100 font-semibold cursor-pointer appearance-none"
              >
                <option
                  value=""
                  disabled
                  className="text-zinc-400 dark:text-zinc-500 font-normal"
                >
                  -- Chọn sân cần cấu hình --
                </option>
                {courts.map((court) => (
                  <option
                    key={court.id}
                    value={court.id}
                    className="text-zinc-850 dark:text-zinc-200"
                  >
                    {court.name}{" "}
                    {court.sportType
                      ? `(${court.sportType === "badminton" ? "Cầu lông" : court.sportType === "football" ? "Bóng đá" : court.sportType === "tennis" ? "Tennis" : court.sportType === "basketball" ? "Bóng rổ" : court.sportType === "pickleball" ? "Pickleball" : court.sportType})`
                      : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 dark:text-zinc-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Form Container (Chỉnh sửa sân inline) */}
        {courtId && (
          <div
            key={courtId}
            className="relative bg-white dark:bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm animate-fade-in"
          >
            {isActuallyLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-10 transition-all duration-300">
                <svg
                  className="animate-spin h-8 w-8 text-primary"
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
                <p className="text-xs font-semibold text-zinc-555 dark:text-zinc-400 mt-2 animate-pulse">
                  Đang tải thông tin sân...
                </p>
              </div>
            )}
            <CourtForm
              form={editForm}
              onSubmit={onEditSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => user && router.push(`/owner/${user.uid}`)}
              submitText="Lưu cấu hình"
            />
          </div>
        )}

        {/* Modal tạo sân mới */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between">
                <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  ➕ Thêm Sân Thể Thao Mới
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                <CourtForm
                  form={createForm}
                  onSubmit={onCreateSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={() => setIsCreateModalOpen(false)}
                  submitText="Tạo sân mới"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ConfigCourtPage() {
  return (
    <Suspense
      fallback={
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
          <p className="text-sm font-semibold text-zinc-555 dark:text-zinc-400">
            Đang tải thiết lập...
          </p>
        </div>
      }
    >
      <ConfigCourtForm />
    </Suspense>
  );
}
