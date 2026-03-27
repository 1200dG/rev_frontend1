import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../common/InputFields/InputField";
import Image from "next/image";
import { UserProfileData, ProfileDesignData } from "@/lib/types/common/types";
import PrimaryButton from "../common/buttons/PrimaryButton";
import { BeatLoader } from "react-spinners";
import CountryDropdown from "../common/CountryDropdown";
import { getProfileAction, updateProfileAction } from "@/lib/services/userSettingsActions";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/errorHandler";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

type UserProfileProps = {
  onBack: () => void;
  profile?: ProfileDesignData | null;
  onProfileUpdated?: (updatedProfile: ProfileDesignData) => void;
};

const UserProfile = ({
  onBack,
  onProfileUpdated,
}: UserProfileProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameColor, setUsernameColor] = useState<string>("#FFFFFF");
  const [descriptionColor, setDescriptionColor] = useState<string>("#FFFFFF");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [displayOnProfile, setDisplayOnProfile] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<ProfileDesignData | null>(null);
  const { screenWidth } = useCalculateScreenWidth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserProfileData>({ mode: "onChange" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfileAction();
        if (response?.data?.status === 200) {
          const data = response.data.data;
          setInitialData(data);
          setValue("username", data.username || "");
          setValue("description", data.description || "");
          setValue("country", data.country || "");
          setValue("instagram", data.instagram || "");
          setValue("tiktok", data.tiktok || "");
          setValue("facebook", data.facebook || "");
          setValue("twitter", data.twitter || "");
          setSelectedCountry(data.country || "");
          setDisplayOnProfile(data.display_on_profile || false);
          setUsernameColor(data.username_color || "#FFFFFF");
          setDescriptionColor(data.description_color || "#FFFFFF");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    loadProfile();
  }, [setValue]);

  const onSubmit = async (data: UserProfileData) => {
    try {
      setLoading(true);
      const profileData = {
        ...data,
        country: selectedCountry,
        display_on_profile: displayOnProfile,
        username_color: usernameColor,
        description_color: descriptionColor,
        background: backgroundImage || undefined,
      };

      const response = await updateProfileAction(profileData);
      if (response?.data?.status === 200) {
        toast.success("Profile updated successfully");
        setInitialData(response.data.data);
        if (onProfileUpdated) {
          onProfileUpdated(response.data.data as ProfileDesignData);
        }
      }
    } catch (error: unknown) {
      handleApiError(error, "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      setValue("image", file.name, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setValue("country", countryCode, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const hasChanges =
    isDirty ||
    selectedCountry !== (initialData?.country || "") ||
    backgroundImage !== null ||
    usernameColor !== (initialData?.username_color || "#FFFFFF") ||
    descriptionColor !== (initialData?.description_color || "#FFFFFF") ||
    displayOnProfile !== (initialData?.display_on_profile || false);
  if (screenWidth > 650) {
    return (
      <div className="flex flex-col max-w-[58rem] gap-6">
        <div className="flex flex-col gap-1">
          <div>
            <button onClick={onBack} className="flex items-center gap-1 transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]" >
              <img src="/profile/arrow-back.svg" />
              <span className="text-[#898989] text-sm font-medium">BACK</span>
            </button>
          </div>
          <p className="text-white text-4xl font-bold">Profile Design</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3.5 w-[29rem]">
                <label
                  htmlFor="Username"
                  className="text-[#E2E2E2] text-base font-circular font-normal"
                >
                  Username
                </label>
                <div className="flex gap-3">
                  <InputField
                    name="Username"
                    type="text"
                    disabled={true}
                    register={register("username")}
                    placeholder="Username"
                    customClass="bg-white/10 border border-white text-white rounded-sm px-3 text-base font-circular opacity-60 cursor-not-allowed"
                    errorMessage={errors.username?.message}
                  />
                  <div className="h-12 w-13 border border-white rounded-md">
                    <input
                      type="color"
                      value={usernameColor}
                      onChange={(e) => setUsernameColor(e.target.value)}
                      className="h-11.5 p-1 cursor-pointer"
                      title="Pick text color"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="h-12 w-13 border border-white rounded-md">
                  <input
                    type="color"
                    value="#FFFFFF"
                    onChange={() => { }}
                    className="h-11.5 p-1 cursor-not-allowed"
                    title="Pick text color"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-3.5">
                  <label htmlFor="profileImage" className="text-[#E2E2E2] text-base font-circular font-normal" >
                    Background
                  </label>
                  <div className="relative overflow-hidden bg-white/10 w-40 py-3 text-white rounded-sm text-base font-circular cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="relative flex items-center gap-1 pl-4 h-full">
                      <Image src="/profile/importIcon.svg" alt="Import Icon" width={24} height={24} />
                      <span className="text-white text-base font-circular">
                        {backgroundImage ? backgroundImage.name.substring(0, 10) + "..." : "Import Image"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <label htmlFor="Username" className="text-[#E2E2E2] text-base font-circular font-normal flex items-center gap-1" >
                Description
                <span className="text-xs text-gray-400">(max 150 characters)</span>
              </label>
              <div className="flex gap-3">
                <InputField
                  name="description"
                  type="text"
                  register={register("description", {
                    maxLength: {
                      value: 150,
                      message: "Description cannot exceed 150 characters",
                    },
                  })}
                  placeholder="Description"
                  customClass="bg-white/10 border border-white text-white rounded-sm px-3 text-base font-circular"
                  errorMessage={errors.description?.message}
                  maxLength={150}

                />
                <div className="h-12 w-13 border border-white rounded-md">
                  <input
                    type="color"
                    value={descriptionColor}
                    onChange={(e) => setDescriptionColor(e.target.value)}
                    className="h-11.5 p-1 rounded-sm cursor-pointer"
                    title="Pick text color"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-6">
                <p className="text-base font-semibold text-white">Social Media</p>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <InputField
                      name="instagram"
                      type="text"
                      register={register("instagram", {
                        pattern: {
                          value: /^https?:\/\/.+$/,
                          message: "URL must start with http:// or https://",
                        },
                      })}
                      placeholder="Instagram"
                      customClass="bg-white/10 border-transparent focus:border-white text-white rounded-sm ps-4 pe-10 text-base font-circular"
                      errorMessage={errors.instagram?.message}
                      icon={ <Image src="/social-media/instagram.svg" alt="Insta icon" height={20} width={20} /> }
                    />
                    <InputField
                      name="Twitter"
                      type="text"
                      register={register("twitter",{
                        pattern: {
                          value: /^https?:\/\/.+$/,
                          message: "URL must start with http:// or https://",
                        },
                      })}
                      placeholder="Twitter"
                      customClass="bg-white/10 border-transparent focus:border-white text-white rounded-sm ps-4 pe-10 text-base font-circular"
                      errorMessage={errors.twitter?.message}
                      icon={
                        <Image
                          src="/social-media/twitter.svg"
                          alt="Insta icon"
                          height={20}
                          width={20}
                        />
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <InputField
                      name="tiktok"
                      type="text"
                      register={register("tiktok",{
                        pattern: {
                          value: /^https?:\/\/.+$/,
                          message: "URL must start with http:// or https://",
                        },
                      })}
                      placeholder="Tiktok"
                      customClass="bg-white/10 border-transparent focus:border-white text-white rounded-sm ps-4 pe-10 text-base font-circular"
                      errorMessage={errors.tiktok?.message}
                      icon={
                        <Image
                          src="/social-media/tiktok.svg"
                          alt="Insta icon"
                          height={20}
                          width={20}
                        />
                      }
                    />
                    <InputField
                      name="facebook"
                      type="text"
                      register={register("facebook",{
                        pattern: {
                          value: /^https?:\/\/.+$/,
                          message: "URL must start with http:// or https://",
                        },
                      })}
                      placeholder="Facebook"
                      customClass="bg-white/10 border-transparent focus:border-white text-white rounded-sm ps-4 pe-10 text-base font-circular"
                      errorMessage={errors.facebook?.message}
                      icon={
                        <Image
                          src="/social-media/facebook.svg"
                          alt="Insta icon"
                          height={15}
                          width={15}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3.5 w-64">
                <label htmlFor="country" className="text-white text-base font-semibold" > Country </label>
                <CountryDropdown
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                />
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="displayOnProfile"
                      checked={displayOnProfile}
                      onChange={(e) => setDisplayOnProfile(e.target.checked)}
                      className="w-4 h-4 bg-transparent border border-white rounded-sm focus:ring-0 focus:ring-offset-0 appearance-none cursor-pointer"
                    />
                    {displayOnProfile && (
                      <svg
                        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <label htmlFor="displayOnProfile" className="text-white text-sm font-circular cursor-pointer" > Display on profile? </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <PrimaryButton
                type="submit"
                customClass={`w-full border border-transparent sm:w-[473px] font-bold py-3 mt-6 rounded-[10px] font-circular h-11 text-base leading-[20px] transition-all duration-200 ${hasChanges && !loading
                  ? "bg-[url('/profile/buttonBg.svg')] text-white hover:bg-[#4A2A0B] hover:border-white/80 cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                disabled={!hasChanges || loading}
              >
                {loading ? <BeatLoader color="white" /> : "Save Changes"}
              </PrimaryButton>
              <p className="text-[#BDBDBD] text-xs font-normal">
                For more information, please reach out to us via email:{" "}
                <a href="mailto:info@rev.com" className="text-white font-medium cursor-pointer" >
                  info@rev.com
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    )
  }
  return (
    <div className="flex justify-center sm:hidden w-[calc(375/375*100vw)] h-[calc(600/812*100vh)] overflow-y-auto">
      <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
        <div className={`flex flex-col justify-between w-[calc(323/375*100vw)]  gap-[calc(30/845*100vh)] `}>
          <div className="flex flex-col gap-1 w-[calc(323/375*100vw)] h-[calc(58/812*100vh)]">
            <div>
              <button onClick={onBack} className="inline-flex items-center gap-1 h-[calc(13/812*100vh)] cc rounded-md transition-all duration-300 hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105" >
                <img src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
              </button>
            </div>
            <p className="text-white text-4xl font-bold">Profile Design</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-between w-[calc(323/375*100vw)] h-[calc(620/812*100vh)]">
              <div className="flex flex-col justify-between h-[calc(54/812*100vh)] w-[calc(323/375*100vw)]">
                <label htmlFor="Username" className="text-[#D4B588] text-[clamp(8px,3.5vw,14px)] font-circular h-[calc(13/812*100vh)] font-bold" >
                  IN-GAME USERNAME
                </label>
                <div className="flex justify-between w-[calc(323/375*100vw)] h-[calc(32/812*100vh)]">
                  <div className="w-[calc(284/375*100vw)] h-[calc(32/812*100vh)]">
                    <InputField
                      name="Username"
                      type="text"
                      disabled={true}
                      register={register("username")}
                      placeholder="Username"
                      customClass="bg-white w-[calc(284/375*100vw)] h-[calc(32/812*100vh)] border border-white !text-black rounded-md text-base font-circular cursor-not-allowed"
                      errorMessage={errors.username?.message}
                      mode="mobile"
                    />
                  </div>
                  <input
                    type="color"
                    value={usernameColor}
                    onChange={(e) => setUsernameColor(e.target.value)}
                    className="w-[calc(32/375*100vw)] h-[calc(32/812*100vh)] rounded-md cursor-pointer"
                    title="Pick text color"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between h-[calc(95/812*100vh)] w-[calc(323/375*100vw)]">
                <label htmlFor="Username" className="text-[#D4B588] text-[clamp(8px,3.5vw,14px)] font-circular h-[calc(13/812*100vh)] font-bold" >
                  DESCRIPTION
                </label>
                <div className="flex justify-between w-[calc(323/375*100vw)] h-[calc(73/812*100vh)]">
                  <div className="w-[calc(284/375*100vw)] h-[calc(73/812*100vh)]">
                    <textarea
                      placeholder="Description"
                      maxLength={150}
                      {...register("description", {
                        maxLength: {
                          value: 150,
                          message: "Description cannot exceed 150 characters",
                        },
                      })}
                      className="w-[calc(284/375*100vw)] h-[calc(73/812*100vh)] bg-[#ededed] border border-[#C7C7C7] text-black rounded-sm px-3 text-base font-circular outline-none focus:border-black"
                    />

                    {errors.description && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <input
                    type="color"
                    value={descriptionColor}
                    onChange={(e) => setDescriptionColor(e.target.value)}
                    className="w-[calc(32/375*100vw)] h-[calc(32/812*100vh)] rounded-md cursor-pointer"
                    title="Pick text color"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between h-[calc(64/812*100vh)] w-[calc(323/375*100vw)]">
                <label htmlFor="profileImage" className="text-[#D4B588] text-[clamp(8px,3.5vw,14px)] font-circular h-[calc(13/812*100vh)] font-bold">
                  BACKGROUND COLOR
                </label>
                <div className="relative flex justify-between items-center overflow-hidden  h-[calc(43/812*100vh)] w-[calc(239/375*100vw)] text-white  text-base font-circular cursor-pointer hover:bg-white/20 transition-colors">
                  <div className="relative flex items-center border border-[D4B588]/50 w-[calc(145/375*100vw)] gap-2 pl-4 h-full bg-[#ededed] rounded-md">
                    <Image src="/profile/publish.svg" alt="Import Icon" width={15.61} height={15.61} />
                    <span className="text-black text-[clamp(8px,3.5vw,12vw)] font-circular">
                      {backgroundImage ? backgroundImage.name.substring(0, 10) + "..." : "Import Image"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled
                  />
                  <span className="text-white text-center text-[clamp(8px,3.5vw,12vw)] font-circular"> OR </span>
                  <input
                    type="color"
                    value="#FFFFFF"
                    onChange={() => { }}
                    className="h-11.5 p-1 cursor-pointer"
                    title="Pick text color"
                    disabled
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-[calc(3/812*100vh)] h-[calc(85/812*100vh)] w-[calc(323/375*100vw)]">
                <label htmlFor="country" className="text-[#D4B588] text-[clamp(8px,3.5vw,14px)] font-circular h-[calc(13/812*100vh)] font-bold">  COUNTRY </label>
                <CountryDropdown
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                />
                <div className="flex items-center gap-2 h-[calc(18/812*100vh)]">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="displayOnProfile"
                      checked={displayOnProfile}
                      onChange={(e) => setDisplayOnProfile(e.target.checked)}
                      className="w-4 h-4 bg-transparent border border-white rounded-sm focus:ring-0 focus:ring-offset-0 appearance-none cursor-pointer"
                    />
                    {displayOnProfile && (
                      <svg className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <label htmlFor="displayOnProfile" className="text-white text-sm font-circular cursor-pointer" > Display on profile? </label>
                </div>
              </div>
              <div className="flex flex-col h-[calc(172/812*100vh)] w-[calc(323/375*100vw)]">
                <p className="text-base font-semibold text-[#D4B588]">SOCIAL MEDIA</p>
                <div className="flex flex-col justify-between  h-[calc(152/812*100vh)] w-[calc(323/375*100vw)]">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Image src="/social-media/instaMobile.svg" alt="Insta icon" height={20} width={20} />
                    </span>
                    <input
                      type="text"
                      placeholder="Instagram"
                      {...register("instagram")}
                      className="w-full bg-[#ededed] border border-[#C7C7C7] focus:border-white text-black rounded-sm ps-10 pe-4 h-[calc(32/812*100vh)] text-base font-circular outline-none "
                    />
                    {errors.instagram && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.instagram.message}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Image src="/social-media/twitterMobile.svg" alt="Insta icon" height={20} width={20} />
                    </span>
                    <input
                      type="text"
                      placeholder="Twitter"
                      {...register("twitter")}
                      className="w-full bg-[#ededed] border border-[#C7C7C7] focus:border-white text-black rounded-sm ps-10 pe-4 h-[calc(32/812*100vh)] text-base font-circular outline-none "
                    />
                    {errors.twitter && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.twitter.message}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Image src="/social-media/tiktokMobile.svg" alt="Insta icon" height={20} width={20} />
                    </span>
                    <input
                      type="text"
                      placeholder="Tiktok"
                      {...register("tiktok")}
                      className="w-full bg-[#ededed] border border-[#C7C7C7] focus:border-white text-black rounded-sm ps-10 pe-4 h-[calc(32/812*100vh)] text-base font-circular outline-none "
                    />
                    {errors.tiktok && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.tiktok.message}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Image src="/social-media/facebookMobile.svg" alt="Insta icon" height={10.37} width={20} className="h-[calc(20/812*100vh)] w-[calc(10.37/375*100vw)]" />
                    </span>
                    <input
                      type="text"
                      placeholder="Facebook"
                      {...register("facebook")}
                      className="w-full bg-[#ededed] border border-[#C7C7C7] focus:border-white text-black rounded-sm ps-10 pe-4 h-[calc(32/812*100vh)] text-base font-circular outline-none "
                    />
                    {errors.facebook && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.facebook.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <PrimaryButton
                  type="submit"
                  customClass={`h-[calc(54/812*100vh)] w-[calc(323/375*100vw)] border border-[#D4B588] font-bold flex items-center justify-center gap-[calc(10/375*100vw)] rounded-[10px] font-circular text-base leading-[20px] transition-all duration-200 ${hasChanges && !loading
                    ? "bg-[url('/profile/saveButton.png')] text-white hover:bg-[#4A2A0B] hover:border-white/80 cursor-pointer"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  disabled={!hasChanges || loading}
                >
                  <img src={'/profile/CheckSave.svg'} />
                  {loading ? <BeatLoader color="white" /> : "Save Changes"}
                </PrimaryButton>
              </div>
            </div>
          </form>
          <div className="h-[calc(15/812*100vh)] w-[calc(323/375*100vw)]"></div>
        </div>
      </div>
    </div>
  )

};

export default UserProfile;
