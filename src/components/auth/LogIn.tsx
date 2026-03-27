"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import InputField from "@/components/common/InputFields/InputField";
import SocialLogin from "@/components/common/register/SocialLogin";
import { SignInFormData } from "@/lib/types/common/types";
import { BeatLoader } from "react-spinners";
import { routes } from "@/lib/routes";
import { hardNavigate } from "@/lib/utils/helpers";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/errorHandler";
import { Eye, EyeOff } from "lucide-react";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

const LogIn: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<SignInFormData>({
        mode: "onChange",
    });
    const [loading, setIsLoading] = useState<boolean>(false);
    const password = watch("password");
    const [showPassword, setShowPassword] = useState(false);
    const { screenWidth } = useCalculateScreenWidth();

    const onSubmit = async (data: SignInFormData) => {
        try {
            setIsLoading(true);
            const response = await signIn("credentials", {
                email: data.email,
                password: data.password,
                callbackUrl: routes.ui.root,
                redirect: false,
            });

            if (response?.ok) {
                toast.success("Login successful! Redirecting...");
                hardNavigate(routes.ui.root);
            } else if (response?.error) {
                switch (response.error) {
                    case "CredentialsSignin":
                        toast.error("Invalid email/username or password. Please try again.");
                        handleApiError(response.error);
                        break;
                    case "CallbackRouteError":
                        toast.error("Authentication failed. Please try again.");
                        break;
                    default:
                        toast.error(response.error);
                        // handleApiError(response.error);
                }
            } else {
                handleApiError(response?.error);
            }
        } catch (error) {
            console.log("dil dil pakistann ---->>>>>>", error);
            toast.error("An unexpected error occurred. Please try again.");
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {screenWidth > 650 ? (
                <div className="flex flex-col justify-center items-center w-[calc(373/1440*100vw)] h-[calc(477/900*100vh)] ">
                    <div className="flex flex-col justify-between items-center w-[calc(370/1440*100vw)] h-[calc(400/900*100vh)] ">
                        <div className="flex flex-col items-center justify-between w-full h-[calc(65/900*100vh)]">
                            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-circular text-center sm:text-left">Welcome !</h1>
                            <p className="text-white text-xs sm:text-sm md:text-base font-medium font-circular leading-4 sm:leading-4 md:leading-5 text-center sm:text-left">
                                Please enter your details
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col justify-between h-[calc(290/900*100vh)] w-[calc(370/1440*100vw)]"
                        >
                            <div className="flex flex-col h-[calc(48/900*100vh)]  gap-1 w-full">
                                <InputField
                                    name="email"
                                    type="text"
                                    register={register("email", {
                                        required: "Email or User Name Required",
                                    })}
                                    placeholder="Email or username"
                                    customClass="bg-white/10 border border-white text-white rounded-[10px] h-[calc(48/900*100vh)] px-3 text-base font-circular"
                                    errorMessage={errors.email?.message}
                                />
                            </div>

                            <div className="flex flex-col justify-between w-full h-[calc(70/900*100vh)]">
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                        className="bg-white/10 border border-white text-white px-4 pr-10 rounded-[10px] h-[calc(48/900*100vh)] w-full text-base font-circular outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-50 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="flex justify-end">
                                    <Link href={routes.ui.auth.forgotPassword} className="text-white text-sm font-circular hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <PrimaryButton
                                type="submit"
                                customClass={`w-full h-[calc(48/900*100vh)] bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-11 text-base leading-[20px]
                 ${!(!isDirty || !isValid || loading) ? "hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300" : ""}
               disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={!isDirty || !isValid}
                            >
                                {loading ? <BeatLoader color="white" /> : "Login"}
                            </PrimaryButton>
                            <SocialLogin mode="login" />
                        </form>

                        <div className="w-full text-center h-[calc(19/900*100vh)]">
                            <p className="text-white font-circular font-[450] text-s">
                                Don&apos;t have an account?
                                <Link
                                    href={routes.ui.auth.signUp}
                                    className="text-[#FFC300] font-circular font-[5000] hover:text-[#c8ad56] transition-colors"
                                >
                                    &nbsp;Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="block sm:hidden w-[calc(375/375*100vw)] h-[calc(658/812*100vh)] ">
                    <div className="flex flex-col justify-center items-center w-[calc(375/375*100vw)] h-[calc(460/812*100vh)] ">
                        <div className="flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(401/812*100vh)] ">
                            <div className="flex flex-col items-center justify-between w-full h-[calc(54/812*100vh)]">
                                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold font-circular text-center sm:text-left">
                                    Welcome !
                                </h1>
                                <p className="text-white text-xs sm:text-sm md:text-base font-medium font-circular leading-4 sm:leading-4 md:leading-5 text-center sm:text-left">
                                    Please enter your details
                                </p>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col justify-between h-[calc(294/812*100vh)] w-[calc(321/375*100vw)]"
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email or User Name Required",
                                        })}
                                        placeholder="Email or username"
                                        className="bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] !text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] px-4 text-base font-circular outline-none focus:border-[#f9cd75]"
                                    />
                                    <p className="min-h-4 text-xs text-red-500"> {errors.email?.message || ""} </p>
                                </div>

                                <div className="flex flex-col justify-between w-full h-[calc(80/812*100vh)]">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            {...register("password", {
                                                required: "Password is required",
                                            })}
                                            className="bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] px-4 rounded-[10px] h-[calc(51/812*100vh)] w-[calc(321/375*100vw)] text-base font-circular outline-none focus:border-[#f9cd75]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f9cd75]"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {/* Error message */}
                                    {errors.password?.message && <p className="text-red-500 text-sm">{errors.password?.message}</p>}
                                    <div className="flex justify-end h-[calc(20/812*100vh)]">
                                        <Link href={routes.ui.auth.forgotPassword} className="text-white text-sm font-circular hover:underline">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    customClass={`w-full h-[calc(51/812*100vh)] bg-[#421d14] gap-[calc(7/375*100vw)] flex justify-center items-center text-[#f9cd75] border border-[#D4B588] font-bold rounded-[10px] font-circular text-base leading-[20px]
                  ${!(!isDirty || !isValid || loading) ? "hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300" : ""}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={!isDirty || !isValid}
                                >
                                    <img src={"/auth/login.svg"} width={19.55} height={19.55} alt="Login Icon" />
                                    {loading ? <BeatLoader color="white" /> : "Login"}
                                </PrimaryButton>
                                <SocialLogin mode="login" />
                            </form>

                            <div className="w-full text-center h-[calc(18/812*100vh)]">
                                <p className="text-white font-circular font-[450] text-s">
                                    Don&apos;t have an account?
                                    <Link
                                        href={routes.ui.auth.signUp}
                                        className="text-[#FFAA00] font-circular font-[5000] hover:text-[#c8ad56] transition-colors"
                                    >
                                        &nbsp;Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogIn;
