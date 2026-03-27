"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/common/InputFields/InputField";
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import { toast } from "react-toastify";
import { resetPassword } from "@/lib/services/authActions";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

interface ResetPasswordFormData {
  password: string;
  confirm_password: string;
}

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const { register, handleSubmit, watch, trigger, formState: { errors, isDirty, isValid } } = useForm<ResetPasswordFormData>({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const route = useRouter();
  const password = watch("password") || "";
  const confirmPassword = watch("confirm_password");
  const { screenWidth } = useCalculateScreenWidth();
  const passwordRules = [
    { label: "Minimum 8 Characters", valid: password.length >= 8 },
    { label: "Minimum 1 uppercase Character", valid: /[A-Z]/.test(password) },
    { label: "Minimum 1 lowercase Character", valid: /[a-z]/.test(password) },
    { label: "Minimum 1 number", valid: /[0-9]/.test(password) },
    { label: "Minimum 1 Special Character ", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  useEffect(() => {
    trigger("confirm_password");
  }, [password]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (data.password !== data.confirm_password && data.password != "" && data.confirm_password != "") {
        toast.error("Passwords do not match");
        return;
      }
      setLoading(true);
      const res = await resetPassword(data, token);
      if (res.detail as string) {
        toast.success(res.detail);
        route.push("/auth/sign-in");
      }
    } catch (error) {
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {screenWidth > 650 ? (
        <div className="flex flex-col justify-center items-center w-[calc(373/1440*100vw)] h-[calc(477/900*100vh)] ">
          <div className="flex flex-col justify-between items-center w-[calc(370/1440*100vw)] h-[calc(380/900*100vh)] ">
            <div className="w-full max-w-3xl bg-transparent flex flex-col gap-8">

              <h1 className="text-white text-3xl sm:text-4xl font-extrabold font-circular text-center">
                Reset Password
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">

                <div className="flex flex-col gap-2 w-full">
                  <InputField
                    name="password"
                    type="password"
                    placeholder="New Password"
                    autoComplete="new-password"
                    register={register("password", {
                      validate: (value) => {
                        if (value == "") return true;
                        if (!/[A-Z]/.test(value))
                          return "Minimum one uppercase letter";
                        if (!/[a-z]/.test(value))
                          return "Minimum one lowercase letter";
                        if (!/[0-9]/.test(value))
                          return "Minimum one number";
                        if (!/[^A-Za-z0-9]/.test(value))
                          return "Minimum one special character";
                        if (value.length < 8)
                          return "Minimum 8 characters long";
                        return true;
                      },
                    })}
                    customClass="w-full bg-white/10 border border-white text-white rounded-[10px] h-11 px-5 text-base sm:text-lg font-circular"
                    errorMessage={errors.password?.message}
                    showEyeIcon={!!password}
                  />


                  {/* <div className="mt-2 space-y-1">
              {passwordRules.map((rule, index) => (
                <p
                  key={index}
                  className={`text-xs font-circular flex gap-1 ${rule.valid ? "text-green-400" : "text-white"
                    }`}
                >
                  {rule.valid ? "✓" : "✗"} {rule.label}
                </p>
              ))}
            </div> */}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <InputField
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    register={register("confirm_password", {
                      // required: "Confirm password is required",
                      validate: (value) => {
                        if (value === "") return "";
                        return value === password || "Passwords must match"
                      },
                    })}
                    customClass="w-full bg-white/10 border border-white text-white rounded-[10px] h-11 px-5 text-base sm:text-lg font-circular"
                    errorMessage={errors.confirm_password?.message}
                    showEyeIcon={!!confirmPassword}
                  />
                </div>

                <PrimaryButton
                  type="submit"
                  disabled={!isDirty || !isValid || loading}
                  customClass={`w-full bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-11 text-base leading-[20px]
                 ${!(!isDirty || !isValid || loading) ? 'hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300' : ''} disabled:opacity-50 disabled:cursor-not-allowed`} >
                  {loading ? "Saving..." : "Save"}
                </PrimaryButton>

              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="block sm:hidden w-[calc(375/375*100vw)] h-[calc(658/812*100vh)] ">
          <div className="flex flex-col justify-center items-center w-[calc(375/375*100vw)] h-[calc(477/812*100vh)] ">
            <div className="flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(380/812*100vh)] ">
              <div className="w-full max-w-3xl bg-transparent flex flex-col gap-8">

                <h1 className="text-white text-3xl sm:text-4xl font-extrabold font-circular text-center">
                  Reset Password
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        autoComplete="new-password"
                        {...register("password", {
                          validate: (value) => {
                            if (value == "") return true;
                            if (!/[A-Z]/.test(value))
                              return "Minimum one uppercase letter";
                            if (!/[a-z]/.test(value))
                              return "Minimum one lowercase letter";
                            if (!/[0-9]/.test(value))
                              return "Minimum one number";
                            if (!/[^A-Za-z0-9]/.test(value))
                              return "Minimum one special character";
                            if (value.length < 8)
                              return "Minimum 8 characters long";
                            return true;
                          },
                        })}
                        className="bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] w-[calc(321/375*100vw)] px-3 text-base font-circular outline-none !focus:border-[#f9cd75]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f9cd75]"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>

                    </div>
                    {errors.password?.message && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                    {/* <div className="mt-2 space-y-1">
              {passwordRules.map((rule, index) => (
                <p
                  key={index}
                  className={`text-xs font-circular flex gap-1 ${rule.valid ? "text-green-400" : "text-white"
                    }`}
                >
                  {rule.valid ? "✓" : "✗"} {rule.label}
                </p>
              ))}
            </div> */}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...register("confirm_password", {
                          // required: "Confirm password is required",
                          validate: (value) => {
                            if (value === "") return "";
                            return value === password || "Passwords must match"
                          },
                        })}
                        className=" bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] w-[calc(321/375*100vw)] px-3 text-base font-circular outline-none focus:border-[#f9cd75] "

                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f9cd75]"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirm_password?.message ? (
                      <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
                    ) : password === "" && confirmPassword !== "" ? (
                      <p className="text-red-500 text-sm">Please enter Password first</p>
                    ) : null}
                  </div>

                  <PrimaryButton
                    type="submit"
                    disabled={!isDirty || !isValid || loading}
                    customClass={`w-full bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-[calc(51/812*100vh)] text-base leading-[20px]
                    ${!(!isDirty || !isValid || loading) ? 'hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300' : ''} disabled:opacity-50 disabled:cursor-not-allowed`} > {loading ? "Saving..." : "Save"}
                  </PrimaryButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
