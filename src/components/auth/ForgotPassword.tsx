"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import InputField from "@/components/common/InputFields/InputField";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { forgotPassword } from "@/lib/services/authActions";
import { handleApiError } from "@/lib/errorHandler";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";
interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { screenWidth } = useCalculateScreenWidth();

  const { register, handleSubmit, formState: { errors, isValid, isDirty }, } = useForm<ForgotPasswordForm>({
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);

      const res = await forgotPassword(data.email);
      if (res.detail) {
        toast.success(res.detail);
      }
    } catch (error) {
      handleApiError(error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {screenWidth > 650 ? (
        <div className="flex flex-col justify-center items-center w-[calc(373/1440*100vw)] h-[calc(477/900*100vh)] ">
          <div className="flex flex-col justify-between items-center w-[calc(370/1440*100vw)] h-[calc(380/900*100vh)] ">
            <div className="relative z-10 flex flex-col items-center justify-center w-full sm:w-lg ">
              <div className="w-full gap-3 max-w-xs sm:max-w-none">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold mb-5 font-circular leading-snug text-center sm:text-left">
                    Forgot your Password ?
                  </h1>
                  <p className="text-white text-xs sm:text-sm md:text-xm font-medium mb-5 font-circular leading-4 sm:leading-4 md:leading-5 text-center sm:text-left">
                    Enter your email to reset your password
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-8 w-full"
                >
                  <div className="flex flex-col gap-4 w-full">
                    <InputField
                      name="email"
                      type="text"
                      register={register("email", {
                        // required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Enter a valid email address",
                        },
                        validate: (value) => {
                          if (value === "")
                            return false;
                        },
                      })}
                      placeholder="Email "
                      customClass="bg-white/10 border border-white text-white rounded-[12px] h-11 px-4 text-lg font-circular w-full"
                      errorMessage={errors.email?.message}
                    />
                  </div>

                  <PrimaryButton
                    type="submit"
                    customClass={`w-full bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-11 text-base leading-[20px]
                    ${!(!isDirty || !isValid || loading) ? 'hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={!isDirty || !isValid}
                  >
                    {loading ? <BeatLoader color="white" /> : "Submit"}
                  </PrimaryButton>
                </form>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 cursor-pointer text-white text-sm font-circular hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105 transition-colors"
                  >
                    <Image
                      src="/forgot/arrow_back_forgot.svg"
                      alt="Back Icon"
                      height={14}
                      width={14}
                    />
                    <span className="text-sm font-medium text-white">BACK</span>
                  </button>
                  <p className="text-white text-s font-circular">
                    Don't have an account?
                    <Link
                      href="/auth/sign-up"
                      className="text-[#FFC300] font-circular font-bold  hover:text-[#c8ad56] transition-colors"
                    >
                      {" "}SignUp
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="block sm:hidden w-[calc(375/375*100vw)] h-[calc(658/812*100vh)] ">
          <div className="flex flex-col justify-center items-center w-[calc(375/375*100vw)] h-[calc(477/812*100vh)] ">
            <div className="flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(380/812*100vh)] ">
              <div className="relative z-10 flex flex-col items-center justify-center w-full sm:w-lg ">
                <div className="w-full gap-3 max-w-xs sm:max-w-none">
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold mb-5 font-circular leading-snug text-center sm:text-left">
                      Forgot your Password ?
                    </h1>
                    <p className="text-white text-xs sm:text-sm md:text-xm font-medium mb-5 font-circular leading-4 sm:leading-4 md:leading-5 text-center sm:text-left">
                      Enter your email to reset your password
                    </p>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 w-full"
                  >
                    <div className="flex flex-col gap-4 w-full">
                      <input
                        type="email"
                        {...register("email", {
                          // required: "Email is required",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Enter a valid email address",
                          },
                          validate: (value) => {
                            if (value === "")
                              return false;
                          },
                        })}
                        placeholder="Email "
                        className="bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] px-3 text-base font-circular outline-none focus:border-[#f9cd75]"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <PrimaryButton
                      type="submit"
                      customClass={`w-full bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-[calc(51/812*100vh)] text-base leading-[20px]
                      ${!(!isDirty || !isValid || loading) ? 'hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300' : ''}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={!isDirty || !isValid}
                    >
                      {loading ? <BeatLoader color="white" /> : "Submit"}
                    </PrimaryButton>
                  </form>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => router.back()}
                      className="flex items-center gap-1 cursor-pointer text-white text-sm font-circular hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105 transition-colors"
                    >
                      <Image
                        src="/forgot/arrow_back_forgot.svg"
                        alt="Back Icon"
                        height={14}
                        width={14}
                      />
                      <span className="text-sm font-medium text-white">BACK</span>
                    </button>
                    <p className="text-white text-s font-circular">
                      Don't have an account?
                      <Link
                        href="/auth/sign-up"
                        className="text-[#FFC300] font-circular font-bold  hover:text-[#c8ad56] transition-colors"
                      >
                        {" "}SignUp
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
};

export default ForgotPassword;
