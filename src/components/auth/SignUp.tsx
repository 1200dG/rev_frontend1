"use client";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import InputField from "@/components/common/InputFields/InputField";
import Link from "next/link";
import SocialLogin from "@/components/common/register/SocialLogin";
import React, { useEffect, useState } from "react";
import { SignUpFormData } from "@/lib/types/common/types";
import { signUp } from "@/lib/services/authActions";
import { routes } from "@/lib/routes";
import { signIn } from "next-auth/react";
import { hardNavigate } from "@/lib/utils/helpers";
import { handleApiError } from "@/lib/errorHandler";
import { Eye, EyeOff } from "lucide-react";
import { checkUserNameAction } from "@/lib/services/userSettingsActions";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

const SignUp: React.FC = () => {
  const { register, handleSubmit, watch, trigger, clearErrors, setError, formState: { errors, isDirty, isValid }, } = useForm<SignUpFormData>({
    mode: "onChange",
    defaultValues: { privacy_terms: false },
  });
  const username = watch("username") || "";
  const password = watch("password") || "";
  const confirmPassword = watch("confirm_password");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);

  const [usernameError, setUsernameError] = useState<string>("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { screenWidth } = useCalculateScreenWidth();

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

  const debouncedCheckRef = React.useRef(
    debounce((value: string) => {
      checkUserName(value);
    }, 500)
  );

  useEffect(() => {
    debouncedCheckRef.current.cancel();

    if (!username || username.trim() === "") {
      setUsernameAvailable(null);
      setUsernameError("");
      clearErrors("username");
      return;
    }

    // Reset while typing
    setUsernameAvailable(null);

    debouncedCheckRef.current(username);
  }, [username]);


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


  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      data.username = data.username.trim();
      const response = await signUp(data);
      if (response?.data) {
        const loginResponse = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (loginResponse?.ok) {
          hardNavigate(routes.ui.root);
        } else {
          setSuccessMessage(
            "Account created successfully! Please log in to continue.",
          );
        }
      }
    } catch (error) {
      handleApiError(error, "An error occurred during sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {screenWidth > 650 ? (
        <div className="flex flex-col justify-center items-center w-[calc(447/1440*100vw)] h-[calc(477/900*100vh)] ">
          <div className="flex flex-col justify-between items-center w-[calc(447/1440*100vw)] h-[calc(370/900*100vh)] ">
            <div className="flex flex-col items-center justify-center w-[calc(383/1440*100vw)] h-[calc(370/900*100vh)]">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-5 font-circular text-center sm:text-left whitespace-nowrap">
                Ready for a new Adventure ?
              </h1>

              <p className="text-white text-xs sm:text-sm md:text-base font-medium mb-5 font-circular leading-4 sm:leading-4 md:leading-5 text-center sm:text-left">
                Let's create an account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2 sm:gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 w-full">
                <div className="flex flex-col gap-1 w-full sm:w-1/2 sm:mr-2">
                  {/* <label
                  htmlFor="firstName"
                  className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
                >
                  First Name
                </label> */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        validate: (value) => {
                          if (!value || value.trim() === "") return "Username is required";
                          return true;
                        },
                      })}
                      onFocus={() => setIsUsernameFocused(true)}
                      onBlur={() => {
                        setIsUsernameFocused(false);

                        // Optional: clear error when empty
                        if (!username.trim()) {
                          clearErrors("username");
                          setUsernameAvailable(null);
                          setUsernameError("");
                        }
                      }}
                      className={`bg-[#FFFFFF26] text-white outline-none placeholder-grey border rounded-[10px] h-12 px-4 pr-10 text-base font-circular w-full
                        ${errors.username?.message || usernameError
                          ? "border-red-500"
                          : usernameAvailable === true
                            ? "border-green-500"
                            : "border-white"
                        }`}
                    />


                    {username.length > 3 && usernameAvailable === true && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                        ✓ Available
                      </span>
                    )}

                    {isUsernameFocused && (errors.username?.message || usernameError) && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.username?.message || usernameError}
                      </p>
                    )}
                  </div>

                </div>
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  {/* <label
                  htmlFor="lastName"
                  className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
                >
                  Last Name
                </label> */}
                  <InputField
                    name="email"
                    type="email"
                    autoComplete="new-email"
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
                    placeholder="Email"
                    customClass="bg-white/10 border border-white text-white rounded-[10px] h-10 px-3 text-base font-circular"
                    errorMessage={errors.email?.message}
                  />
                </div>
              </div>

              {/* <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="email"
                className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
              >
                Email
              </label>
              <InputField
                name="email"
                type="email"
                autoComplete="new-email"
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Email"
                customClass="bg-white/10 border border-white text-white rounded-[10px] h-10 px-3 text-base font-circular"
                errorMessage={errors.email?.message}
              />
            </div> */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0.5 w-full">
                <div className="flex flex-col gap-2 w-full sm:w-1/2 sm:mr-2">
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
                    customClass="bg-white/10 border border-white text-white rounded-[10px] h-10 px-3 text-base font-circular"
                    errorMessage={errors.password?.message}
                    showEyeIcon={!!password}
                  />

                  {/* <div className="mt-1 space-y-1 w-full sm:w-md md:w-lg">
                  {passwordRules.map((rule, index) => (
                    <p
                      key={index}
                      className={`text-[11px] font-circular flex gap-1 ${rule.valid ? "text-green-400" : "text-white"
                        }`}
                    >
                      {rule.valid ? "✓" : "✗"} {rule.label}
                    </p>
                  ))}
                </div> */}
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  {/* <label
                  htmlFor="confirmPassword"
                  className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
                >
                  Confirm Password
                </label> */}
                  <InputField
                    name="confirm_password"
                    type="password"
                    register={register("confirm_password", {
                      //required: "Confirm password is required",
                      validate: (value) => {
                        if (value === "") return "";
                        return value === password || "Passwords must match"
                      },
                      // minLength: {
                      //   value: 8,
                      //   message: "Password must be at least 8 characters long",
                      // },
                    })}
                    placeholder="Confirm Password"
                    customClass="bg-white/10 border border-white text-white rounded-[10px] h-10 px-3 text-base font-circular"
                    errorMessage={errors.confirm_password?.message || (password === "" && confirmPassword !== "" ? "Please enter Password first" : undefined)
                    }
                    showEyeIcon={!!confirmPassword}
                  />
                </div>
              </div>

              {/* {isPasswordFocused && (
            <div className="mt-1 space-y-1 font-circular text-white text-[13px] leading-4">
              <p className={password.length >= 8 ? "text-green-500" : "text-red-500"}>
                {password.length >= 8 ? "✓" : "✗"} Minimum 8 Characters
              </p>
              <p className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-red-500"}>
                {/[^A-Za-z0-9]/.test(password) ? "✓" : "✗"} Minimum 1 Special Character
              </p>
              <p className={/\s/.test(password) ? "text-red-500" : "text-green-500"}>
                {/\s/.test(password) ? "✗" : "✓"} No Whitespace
              </p>
            </div>
          )} */}

              <div className="flex items-center gap-0.5 h-6 mt-0.1">
                <input
                  type="checkbox"
                  id="privacy_terms"
                  {...register("privacy_terms", {
                    required:
                      "You must agree to the Terms of Service and Privacy Policy",
                  })}
                  className="h-4 w-4 border border-white bg-transparent focus:ring-0 mr-3 rounded"
                />
                <label
                  htmlFor="privacy_terms"
                  className="text-white text-xs font-circular leading-4"
                  style={{
                    fontFamily: "Circular Std",
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#fff",
                  }}
                >
                  I agree to the <span className="text-[#F27556] font-semibold">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-[#F27556] font-semibold">Privacy Policy</span>
                </label>
              </div>
              {errors.privacy_terms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.privacy_terms.message}
                </p>
              )}

              <PrimaryButton
                type="submit"
                customClass={`w-full bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-11 text-base leading-[20px]
                 ${!(!isDirty || !isValid || isLoading) ? 'hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300' : ''}
               disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={!isDirty || !isValid || isLoading}
              >
                {isLoading ? "Signing up..." : "Signup"}
              </PrimaryButton>
              <SocialLogin mode="signup" />
            </form>

            {successMessage && (
              <div className="bg-[#5E350E] text-white px-4 py-3 rounded-lg mb-4">
                {successMessage}
              </div>
            )}

            <div className="w-full text-center">
              <p className="text-white font-circular font-[450] text-s leading-4.5">
                Already have an account?
                <Link
                  href={routes.ui.auth.signIn}
                  className="text-[#FFC300] font-circular font-bold hover:text-[#c8ad56] transition-colors"
                >
                  &nbsp; Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="block sm:hidden w-[calc(375/375*100vw)] h-[calc(658/812*100vh)] ">
          <div className="flex flex-col justify-center items-center w-[calc(375/375*100vw)] h-[calc(658/812*100vh)] ">
            <div className="flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(572/812*100vh)] ">
              <div className="flex flex-col items-center justify-between w-[calc(321/375*100vw)] h-[calc(89/812*100vh)]">
                <h1 className="text-white text-[clamp(16px,15.0vw,24px)] font-bold font-circular text-center whitespace-nowrap">
                  Ready for a new <br /> Adventure ?
                </h1>

                <p className="text-white text-xs sm:text-sm md:text-base font-medium font-circular text-center sm:text-left">
                  Let's create an account.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex justify-between flex-col h-[calc(416/812*100vh)] ">
                <div className="flex flex-col gap-1 w-full ">
                  {/* <label
                      htmlFor="firstName"
                      className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
                      >
                        First Name
                      </label> */}
                  <input
                    type="text"
                    placeholder="Ingame Name"
                    {...register("username", {
                      validate: (value) => {
                        if (value === "") return false;
                      },
                    })}
                    className=" bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] px-3 text-base font-circular outline-none focus:border-[#f9cd75] "
                  />

                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.username.message || "Ingame Name is required"}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  {/* <label
                      htmlFor="lastName"
                      className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
                    >
                      Last Name
                    </label> */}
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="new-email"
                    {...register("email", {
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Enter a valid email address",
                      },
                      validate: (value) =>
                        value !== "" || "Email is required",
                    })}
                    className="bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] px-3 text-base font-circular outline-none focus:border-[#f9cd75]"
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="email"
                className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
              >
                Email
              </label>
              <InputField
                name="email"
                type="email"
                autoComplete="new-email"
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Email"
                customClass="bg-white/10 border border-white text-white rounded-[10px] h-10 px-3 text-base font-circular"
                errorMessage={errors.email?.message}
              />
            </div> */}
                <div className="flex flex-col gap-2 w-full ">
                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      autoComplete="new-password"
                      {...register("password", {
                        validate: (value) => {
                          if (value === "") return true;
                          if (!/[A-Z]/.test(value)) return "Minimum one uppercase letter";
                          if (!/[a-z]/.test(value)) return "Minimum one lowercase letter";
                          if (!/[0-9]/.test(value)) return "Minimum one number";
                          if (!/[^A-Za-z0-9]/.test(value))
                            return "Minimum one special character";
                          if (value.length < 8) return "Minimum 8 characters long";
                          return true;
                        },
                      })}
                      className="bg-[#3a2a20]/70 border border-t-2 border-[#f9cd75] text-[#f9cd75] rounded-[10px] h-[calc(51/812*100vh)] w-[calc(321/375*100vw)] px-3 text-base font-circular outline-none !focus:border-[#f9cd75]"
                    />

                    {/* Eye toggle button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f9cd75]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Error message */}
                  {errors.password?.message && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}

                  {/* <div className="mt-1 space-y-1 w-full sm:w-md md:w-lg">
                  {passwordRules.map((rule, index) => (
                    <p
                      key={index}
                      className={`text-[11px] font-circular flex gap-1 ${rule.valid ? "text-green-400" : "text-white"
                        }`}
                    >
                      {rule.valid ? "✓" : "✗"} {rule.label}
                    </p>
                  ))}
                </div> */}
                </div>

                <div className="flex flex-col gap-1 w-full">
                  {/* <label
                  htmlFor="confirmPassword"
                  className="text-[#E2E2E2] text-xs font-circular font-[450] leading-4"
                >
                  Confirm Password
                </label> */}
                  <div className="relative">

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirm_password", {
                        //required: "Confirm password is required",
                        validate: (value) => {
                          if (value === "") return "";
                          return value === password || "Passwords must match"
                        },
                        // minLength: {
                        //   value: 8,
                        //   message: "Password must be at least 8 characters long",
                        // },
                      })}
                      placeholder="Confirm Password"
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

                {/* {isPasswordFocused && (
            <div className="mt-1 space-y-1 font-circular text-white text-[13px] leading-4">
              <p className={password.length >= 8 ? "text-green-500" : "text-red-500"}>
                {password.length >= 8 ? "✓" : "✗"} Minimum 8 Characters
              </p>
              <p className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-red-500"}>
                {/[^A-Za-z0-9]/.test(password) ? "✓" : "✗"} Minimum 1 Special Character
              </p>
              <p className={/\s/.test(password) ? "text-red-500" : "text-green-500"}>
                {/\s/.test(password) ? "✗" : "✓"} No Whitespace
              </p>
            </div>
          )} */}

                <div className="flex items-center gap-0.5 h-6 mt-0.1">
                  <input
                    type="checkbox"
                    id="privacy_terms"
                    {...register("privacy_terms", {
                      required:
                        "You must agree to the Terms of Service and Privacy Policy",
                    })}
                    className="h-4 w-4 border border-white bg-transparent focus:ring-0 mr-3 rounded"
                  />
                  <label
                    htmlFor="privacy_terms"
                    className="text-white text-xs font-circular leading-4"
                    style={{
                      fontFamily: "Circular Std",
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#fff",
                    }}
                  >
                    I agree to the <span className="text-[#F27556] font-semibold">Terms of Service</span>
                    {" "}and{" "}
                    <span className="text-[#F27556] font-semibold">Privacy Policy</span>
                  </label>
                </div>
                {errors.privacy_terms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.privacy_terms.message}
                  </p>
                )}

                <PrimaryButton
                  type="submit"
                  customClass={`w-full h-[calc(51/812*100vh)] text-[#f9cd75] flex justify-center items-center gap-[calc(5/375*100vw)] bg-[#421d14] text-[clamp(10px,4.0vw,16vw)] border-y-2 border border-[#f9cd75] font-bold rounded-[10px] font-circular text-base leading-[20px]
                  ${!(!isDirty || !isValid || isLoading) ? 'hover:drop-shadow-[0_0_3px_#facc15] transition-transform duration-300' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed`} disabled={!isDirty || !isValid || isLoading}
                >
                  <img src={'/auth/signUpIcon.svg'} width={19.55} height={17.66} alt="SignUP Icon" />
                  {isLoading ? "Signing up..." : "SIGN UP"}
                </PrimaryButton>
                <SocialLogin mode="signup" />
              </form>

              {successMessage && (
                <div className="bg-[#5E350E] text-white px-4 py-3 rounded-lg mb-4">
                  {successMessage}
                </div>
              )}

              <div className="w-full text-center">
                <p className="text-white font-circular font-[450] text-s leading-4.5">
                  Already have an account?
                  <Link
                    href={routes.ui.auth.signIn}
                    className="text-[#FFAA00] font-circular font-bold hover:text-[#c8ad56] transition-colors"
                  >
                    &nbsp; Login
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

export default SignUp;
