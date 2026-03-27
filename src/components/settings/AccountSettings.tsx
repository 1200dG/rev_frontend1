"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SignUpFormData, UserSettingsData } from "@/lib/types/common/types";
import { BeatLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import { checkUserNameAction, updateUserAction, getSettingsAction } from "@/lib/services/userSettingsActions";
import { toast } from "react-toastify";
import InputField from "../common/InputFields/InputField";
import PrimaryButton from "../common/buttons/PrimaryButton";
import Image from "next/image";
import debounce from "lodash/debounce";
import { handleApiError } from "@/lib/errorHandler";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [initialData, setInitialData] = useState<UserSettingsData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isCollapsed } = useAppContext();

  const { data: session } = useSession();

  const { register, watch, handleSubmit, setError, clearErrors, setValue, formState: { errors, isDirty, isValid }, } = useForm<SignUpFormData>({
    mode: "onChange",
    defaultValues: {
      email: session?.user.email,
      username: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirm_password");
  const username = watch("username");
  const isChangingPassword = Boolean(password || confirmPassword);
  const isChangingUsername = username !== initialData?.username;
  const router = useRouter();
  const {screenWidth } = useCalculateScreenWidth();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSettingsAction();
        if (response?.data?.status === 200) {
          const data = response.data.data;
          setInitialData(data);
          setValue("username", data.username || "");
          setValue("email", data.email || session?.user.email || "");
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        handleApiError(error, "Failed to load account settings. Please try again.");
      }
    };

    if (session?.user) {
      loadSettings();
    }
  }, [session?.user, setValue]);


  const checkUserName = async (username: string) => {
    try {
      setUsernameError("");
      clearErrors("username");
      const response = await checkUserNameAction(username);
      if (response?.data?.status === 200) {
        setUsernameAvailable(true);
        setUsernameError("");
      }
    } catch (error: unknown) {
      setUsernameAvailable(false);
      const axiosError = error as { response?: { data?: { errors?: { details?: string[] } } } };
      if (axiosError?.response?.data?.errors?.details) {
        const errorMessage = axiosError.response.data.errors.details[0];
        toast.error(errorMessage);
        setUsernameError(errorMessage);
        setError("username", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        setUsernameError("Username already exists.");
        setError("username", {
          type: "manual",
          message: "Username already exists.",
        });
      }
    }
  };

  const canSubmit = isDirty && isValid && !(isChangingUsername && usernameAvailable !== true) && !(isChangingPassword && (!password || !confirmPassword));


  const debouncedCheckRef = React.useRef(
    debounce((value: string) => {
      checkUserName(value);
    }, 500)
  );

  useEffect(() => {
    if (!initialData) return;

    if (!username || username === initialData.username) {
      setUsernameAvailable(null);
      setUsernameError("");
      clearErrors("username");
      return;
    }

    debouncedCheckRef.current(username);
  }, [username, initialData]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Copied to clipboard");
    }
  };


  const onSubmit = async (data: SignUpFormData) => {
    const payload: Partial<SignUpFormData> = {};

    if (isChangingUsername && data.username.trim() !== "") {
      if (!usernameAvailable) {
        toast.error("Please choose an available username");
        return;
      }
      payload.username = data.username.trim();
    }

    if (isChangingPassword) {
      if (!data.password || !data.confirm_password) {
        toast.error("Please enter password and confirm password");
        return;
      }
      if (data.password !== data.confirm_password) {
        toast.error("Passwords do not match");
        return;
      }
      payload.password = data.password;
      payload.confirm_password = data.confirm_password;
    }

    try {
      setLoading(true);
      const response = await updateUserAction(payload as SignUpFormData); 
      if (response?.data?.status === 200) {
        toast.success("User Updated Successfully");
        setInitialData(response.data.data);
        setUsernameAvailable(null);
        setUsernameError("");
      }
    } catch (error: unknown) {
      handleApiError(error, "Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {screenWidth > 650 ? (
        <div className="hidden sm:block">
          <div className={`flex justify-center h-auto ${isCollapsed ? "w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"}`}>
            <div className={`flex justify-between h-auto ${isCollapsed ? "w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"}`}>

              <div className={`flex flex-col h-auto ${isCollapsed ? "w-[calc(632.5/1440*100vw)]" : "w-[calc(568.5/1440*100vw)]"}`}>
                <div className={`h-[calc(56/812*100vh)] sm:h-auto ${isCollapsed ? "w-[calc(632.5/1440*100vw)]" : "w-[calc(568.5/1440*100vw)]"}`}>
                  <button className="inline-flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15] sm:hidden">
                    <Image src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                    <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                  </button>
                  <div className="flex items-start">
                    <p className="text-white text-2xl sm:text-4xl font-bold font-circular">
                      Account Settings
                    </p>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col justify-between gap-6 h-auto w-full"
                >
                  <div className="flex h-auto space-y-0 gap-3 w-full py-[1%]">
                    <div className=" w-full flex flex-col justify-between gap-1">
                      <label className="text-[#E2E2E2] text-base font-circular font-normal">Username</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Username"
                          {...register("username", {
                            validate: (value) => {
                              if (isChangingUsername) {
                                if (!value || value.trim() === "") return "Username is required";
                              }
                              return true;
                            },
                          })}
                          className={`bg-[#FFFFFF26] text-white outline-none placeholder-white border rounded-[10px] h-[calc(51/812*100vh)] px-4 pr-10 text-base font-circular w-full
                            ${errors.username?.message || usernameError
                              ? "border-red-500"
                              : usernameAvailable === true && username !== initialData?.username
                                ? "border-green-500"
                                : "border-white"
                            }`}
                        />
                        {username && username !== initialData?.username && usernameAvailable === true && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm"> ✓ Available </span>
                        )}
                      </div>
                      <p className=" mt-1 text-red-500 text-sm"> {errors.username?.message || usernameError || " "} </p>
                    </div>
                    <div className="relative w-full flex flex-col gap-1">
                      <label className="text-[#E2E2E2] text-base font-circular font-normal">Email</label>
                      <InputField
                        name="email"
                        type="email"
                        placeholder="Email"
                        disabled={true}
                        register={register("email")}
                        customClass="bg-[#FFFFFF26] border border-white text-white rounded-[10px] h-[calc(51/812*100vh)] px-4 text-base font-circular w-full opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex h-auto space-y-0 gap-3 w-full">
                    {/* Password Field */}
                    <div className="flex flex-col w-full  gap-1">
                      <label className="text-[#E2E2E2] sm:text-[#E2E2E2] text-base font-circular font-normal">
                        Password
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          autoComplete="new-password"
                          {...register("password", {
                            validate: (value) => {
                              if (!value) return true;
                              if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
                              if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
                              if (!/[0-9]/.test(value)) return "Password must contain at least one number";
                              if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
                              if (value.length < 8) return "Password must be at least 8 characters long";
                              return true;
                            },
                          })}
                          className="bg-[#FFFFFF26] border border-white text-white px-4 pr-10 rounded-[10px] h-[calc(51/812*100vh)] w-full text-base font-circular outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-50"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="h-5 mt-1 text-red-500 text-sm">{errors.password?.message || " "}</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col w-full  gap-1">
                      <label className="text-[#E2E2E2] sm:text-[#E2E2E2] text-base font-circular font-normal">
                        Confirm Password
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...register("confirm_password", {
                            validate: (value) => {
                              if (!isChangingPassword) return true;
                              if (!value) return "Confirm password is required";
                              if (value !== password) return "Passwords must match";
                              return true;
                            },
                          })}
                          className="bg-[#FFFFFF26] border border-white text-white  px-4 pr-10 rounded-[10px] h-[calc(51/812*100vh)] w-full text-base font-circular outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-50"
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="h-5 mt-1 text-red-500 text-sm">{errors.confirm_password?.message || " "}</p>
                    </div>
                  </div>

                  <PrimaryButton
                    type="submit"
                    customClass={` w-[440px] font-bold py-[1%] mt-6 rounded-[10px] font-circular h-13 text-lg leading-[20px] transition-all duration-200 ${isDirty && !loading
                      ? "bg-[url('/profile/buttonBg.svg')] text-white will-change-transform shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-opacity duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box  cursor-pointer"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    disabled={!canSubmit || loading}
                  >
                    {loading ? <BeatLoader color="white" /> : "Save Changes"}
                  </PrimaryButton>
                </form>
                <div className="flex flex-col gap-3 mt-12 w-[433px]">
                  <label className="text-[#E2E2E2] text-base font-circular font-normal">Account Unique ID</label>
                  <div className="flex items-center border border-white gap-3 rounded-md py-2 px-5 bg-[#FFFFFF26]">
                    <div className="flex w-full justify-between">
                      <div className="flex flex-col">
                        <p className="text-base font-normal text-[#FFFFFFCC]">
                          {initialData?.account_id || session?.user.account_id}
                        </p>
                      </div>
                      <Image
                        src="/settings/document-copy.svg"
                        alt="copy icon"
                        width={26}
                        height={26}
                        className="cursor-pointer"
                        onClick={() => {
                          const id = initialData?.account_id || session?.user?.account_id;
                          if (!id) return toast.error("Account ID not found");
                          copyToClipboard(id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block w-[calc(600/1440*100vw)]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="block sm:hidden">

          <div className={`flex justify-center h-[calc(660/812*100vh)] w-[calc(375/375*100vw)]`}>
            <div className={`flex flex-col items-center gap-[calc(30/812*100vh)] h-[calc(580/812*100vh)] w-[calc(323/375*100vw)]`}>

              <div className={`h-[calc(56/812*100vh)] w-[calc(323/375*100vw)]`}>
                <button onClick={() => router.back()} className="inline-flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15] sm:hidden">
                  <Image src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                  <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                </button>
                <div className="flex items-start">
                  <p className="text-white text-2xl sm:text-4xl font-bold font-circular"> Settings </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-between h-[calc(385/812*100vh)] w-full"
              >
                <div className="relative w-full flex h-[calc(52/812*100vh)] flex-col justify-between">
                  <label className="text-[#D4B588] text-base font-circular font-bold uppercase">IN-GAME Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        validate: (value) => {
                          if (isChangingUsername) {
                            if (!value || value.trim() === "") return "Username is required";
                          }
                          return true;
                        },
                      })}
                      className={`bg-white text-black outline-none placeholder-black border rounded-[10px] h-[calc(33/812*100vh)] px-4 pr-10 text-base font-circular w-full
                            ${errors.username?.message || usernameError
                          ? "border-red-500"
                          : usernameAvailable === true && username !== initialData?.username
                            ? "border-green-500"
                            : "border-white"
                        }`}
                    />
                    {username && username !== initialData?.username && usernameAvailable === true && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm"> ✓ Available </span>
                    )}
                  </div>
                  <p className=" mt-1 text-red-500 text-sm"> {errors.username?.message || usernameError || " "} </p>
                </div>
                <div className="relative w-full flex h-[calc(52/812*100vh)] flex-col justify-between">
                  <label className="text-[#D4B588] text-base font-circular font-bold">Email</label>
                  <InputField
                    name="email"
                    type="email"
                    placeholder="Email"
                    disabled={true}
                    register={register("email")}
                    customClass="bg-[#38190B] border border-white text-white rounded-[10px] h-[calc(32/812*100vh)] px-4 text-base font-circular w-full opacity-60 cursor-not-allowed"
                  />
                </div>
                {/* Password Field */}
                <div className="relative w-full flex h-[calc(52/812*100vh)] flex-col justify-between">
                  <label className="text-[#D4B588] text-base font-circular font-bold"> Password </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register("password", {
                        validate: (value) => {
                          if (!value) return true;
                          if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
                          if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
                          if (!/[0-9]/.test(value)) return "Password must contain at least one number";
                          if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
                          if (value.length < 8) return "Password must be at least 8 characters long";
                          return true;
                        },
                      })}
                      className="bg-white border border-white text-black px-4 pr-10 rounded-[10px] h-[calc(32/812*100vh)] w-full text-base font-circular outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black" > {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} </button>
                  </div>
                  <p className="h-5 mt-0.5 text-red-500 text-xs">{errors.password?.message || " "}</p>
                </div>

                {/* Confirm Password Field */}
                <div className="relative w-full flex h-[calc(52/812*100vh)] mt-1 flex-col justify-between">
                  <label className="text-[#D4B588] text-base font-circular font-bold "> Confirm Password </label>
                  <div className="relative w-full">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...register("confirm_password", {
                        validate: (value) => {
                          if (!isChangingPassword) return true;
                          if (!value) return "Confirm password is required";
                          if (value !== password) return "Passwords must match";
                          return true;
                        },
                      })}
                      className="bg-white border border-white text-black  px-4 pr-10 rounded-[10px] h-[calc(32/812*100vh)] w-full text-base font-circular outline-none"
                    />
                    <button type="button" onClick={() => setShowConfirm((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black" > {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />} </button>
                  </div>
                  <p className="h-5 mt-0.5 text-red-500 text-xs">{errors.confirm_password?.message || " "}</p>
                </div>

                <PrimaryButton type="submit" customClass={`w-full mt-3 border-2 border-[#D4B588] w-full font-bold rounded-[10px] font-circular h-[calc(54/812*100vh)] text-lg leading-[20px] transition-all duration-200 ${isDirty && !loading
                  ? "bg-[url('/clash/playBg.png')] text-white hover:bg-[#4A2A0B] hover:border-white/80 cursor-pointer" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                  disabled={!canSubmit || loading}
                >
                  {loading ? (
                    <BeatLoader color="white" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <img src="/settings/save.svg" alt="Save" className="w-5 h-5" />
                      <span>Save Changes</span>
                    </span>
                  )}
                </PrimaryButton>
                <div className="flex flex-col">
                  <p className="text-[#E2AC5D] text-sm">For more information, please reach out to us via email:</p>
                  <p className="text-white">info@revs.com</p>
                </div>
              </form>
              <div className="flex flex-col w-full h-[calc(54/812*100vh)]">
                <label className="text-[#D4B588] text-base font-circular font-bold">Account Unique ID</label>
                <div className="flex items-center justify-center border border-white h-[calc(33/812*100vh)] w-[calc(323/375*100vw)] rounded-md bg-[#1F0D08]">
                  <div className="flex justify-between w-[calc(305/375*100vw)]">
                    <div className="flex flex-col">
                      <p className="text-base font-normal text-[#FFFFFFCC]"> {initialData?.account_id || session?.user.account_id} </p>
                    </div>
                    <Image
                      src="/settings/document-copy.svg"
                      alt="copy icon"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={() => {
                        const id = initialData?.account_id || session?.user?.account_id;
                        if (!id) return toast.error("Account ID not found");
                        copyToClipboard(id);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden sm:block w-[calc(600/1440*100vw)]" />
            </div>
          </div>
        </div>
      )}
    </>

  );
};

export default Settings;
