"use client";
import Header from "../common/header";
import Sidebar from "../common/sidebar";
import UserProfile from "./UserProfile";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { BeatLoader } from "react-spinners";
import SelectMenu from "../common/select-menu";
import SocialLinks from "./SocialLinks";
import { useImagePreloader } from "@/lib/hooks/useImagePreloader";
import Loader from "../common/loader";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/constants/countries";
import { handleApiError } from "@/lib/errorHandler";
import AutoComplete from "../common/autoCompleteDropDown";
import { useSession } from "next-auth/react";
import { ProfileSearch } from "@/lib/types/common/types";

type Profile = {
  username: string;
  description: string;
  country: string;
  background: string | null;
  display_on_profile: boolean;
  username_color: string;
  description_color: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  email: string;
  twitter: string;
};

type HistoricalProgress = {
  level: string;
  event: string;
  time_spent: string;
};

interface ProfilePageProps {
  userId?: string;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<HistoricalProgress[]>([]);
  const [filterMode, setFilterMode] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ProfileSearch[]>([]);
  const [selectedUser, setSelectedUser] = useState<ProfileSearch | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useImagePreloader(["/profile/Bg.png", "/profile/header-banner.svg"], () =>
    setImagesLoaded(true)
  );

  const fetchProfile = async () => {
    try {
      const endpoint = userId
        ? `profile/historical/progress/?user_id=${userId}&mode=${filterMode}`
        : `profile/historical/progress/?mode=${filterMode}`;

      const res = await api.get(endpoint);
      setProfile(res.data.data.profile);
      setProgress(res.data.data.historical_progress);
    } catch (err) {
      console.error("Failed to load profile:", err);
      handleApiError(err, "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [filterMode, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/all-usernames/");
        if (res.data && res.data.data.length > 0) {
          setUsers(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch all usernames:", error);
        handleApiError(error);
      }
    };
    fetchUsers();
  }, []);

  if (!imagesLoaded) return <Loader />;

  return (
    <>
      <div className="hidden sm:block">
        <div className="w-full min-h-screen aspect-[1280/832] bg-[url('/profile/Bg.png')] bg-no-repeat bg-cover">
          <Header />
          <div className="flex">
            <div className="py-[1.5%]">
              <Sidebar />
            </div>
            {showProfile && !loading ? (
              <div className="w-full px-[4%] py-[1.5%]">
                <UserProfile
                  onBack={() => {
                    setShowProfile(false);
                    fetchProfile();
                  }}
                  onProfileUpdated={(updatedProfile) => {
                    fetchProfile();
                  }}
                />
              </div>
            ) : !loading ? (
              <div className="flex flex-col gap-1 lg:gap-2 w-full px-[4%] pt-[1.7%]">
                <div className="bg-[#050505] flex justify-between items-center border border-[#D4B588] rounded-[0.225rem] lg:rounded-[0.625rem] aspect-[1137/132] bg-[url('/profile/header-banner.svg')] bg-no-repeat bg-cover">
                  <div className="flex flex-col sm:gap-1 lg:gap-2 h-[80%] p-[2%] pt-[1%]">
                    <div className="flex items-center gap-1">
                      <h1 style={{ color: profile?.username_color || "white" }} className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-none tracking-[-0.09rem]" > {profile?.username} </h1>
                      {profile?.display_on_profile && profile?.country && (
                        <div className="flex items-center">
                          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none"> {COUNTRIES.find((c) => c.code === profile.country)?.flag || "🏳️"} </span>
                        </div>
                      )}
                    </div>
                    <div className="relative group max-w-[680px]">
                      <p style={{ color: profile?.description_color || "white" }} className="text-[7px] sm:text-[9px] md:text-[11px] lg:text-sm xl:text-base 2xl:text-xl font-medium leading-snug line-clamp-2 overflow-hidden break-words cursor-pointer" >
                        {profile?.description}
                      </p>

                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 backdrop-blur-sm text-xs p-2 rounded-lg w-[300px] z-50 whitespace-normal max-h-[200px] overflow-y-auto pointer-events-none"
                        style={{ color: profile?.description_color || "white", top: "100%", left: 0, transform: "translateY(8px)", }}
                      >
                        {profile?.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end w-[28.5%] h-full p-[1%]">
                    <div className="flex items-center justify-between gap-3 h-[27.07%] w-full">
                      {session?.user.email === profile?.email ? (
                        <button onClick={() => setShowProfile(true)} className="flex items-center cursor-pointer shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-opacity duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box gap-1 lg:gap-2 h-full w-2/5 bg-[#D9D9D9] border border-black/30 rounded-[0.15rem] lg:rounded-[0.3125rem] px-[3%]" >
                          <img src="/profile/settings.svg" alt="Settings" className="w-auto h-3/5" />
                          <span className="text-[2.5px] sm:text-[4px] md:text-[6.5px] lg:text-[9px] xl:text-xs 2xl:text-sm font-medium w-full text-left will-change-transform"> Edit Profile </span>
                        </button>
                      ) : (
                        <div className="h-full w-2/5"></div>
                      )}
                      <div className="h-full w-[55%] flex-shrink-0">
                        <AutoComplete
                          name="userSearch"
                          placeholder="Search"
                          options={users}
                          value={selectedUser?.username}
                          onChange={(username) => {
                            const selected = users.find((u) => u.username === username) || null;
                            setSelectedUser(selected);
                            if (selected) {
                              router.push(`/profile/${selected.id}`);
                            }
                          }}
                          customClass="h-full w-full flex items-center gap-2 px-[3%] border border-[#D4B588] rounded-[0.3125rem]"
                          isSimpleDropdown={false}
                        />
                      </div>
                    </div>
                    <SocialLinks
                      instagram={profile?.instagram}
                      twitter={profile?.twitter}
                      tiktok={profile?.tiktok}
                      facebook={profile?.facebook}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/50 ps-[1%] pe-[2%] py-[1%]">
                  <nav className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10 text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold">
                    <button className="text-white">Historical Progress</button>
                    {/* <button className="text-white/50">
                  Achievements
                </button> */}
                  </nav>
                  <SelectMenu
                    id="mode"
                    value={filterMode}
                    onChange={setFilterMode}
                    openId={openId}
                    setOpenId={setOpenId}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Season", value: "season" },
                      { label: "Tournament", value: "tournament" },
                      { label: "Daily", value: "daily" },
                    ]}
                    align="end"
                  />
                </div>
                <ul className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 py-[1%] aspect-[1137/388] overflow-y-auto no-scrollbar">
                  {progress.length > 0 ? (
                    progress.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-[#D9D9D9]/20 rounded-[2px] sm:rounded lg:rounded-md xl:rounded-lg ps-[1.5%] pe-[2%] py-[0.3%] md:py-[0.4%]" >
                        <span className="text-white text-[7px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-normal"> {item.level} &nbsp; | &nbsp; {item.event} </span>
                        <span className="text-white text-[7px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-normal"> {item.time_spent} </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center w-full py-8"> No progress data available </div>
                  )}
                </ul>
              </div>
            ) : (
              <div className="flex w-full justify-center items-center">
                <BeatLoader color="white" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="block sm:hidden min-h-screen fixed bg-[url('/gamehub/background.png')] bg-no-repeat bg-cover w-[calc(375/375*100vw)] h-[calc(812/812*100vh)]">
        <div className="w-[calc(375/375*100vw)] h-[calc(70/812*100vh)]">
          <Header />
        </div>
        <div className="flex">
          {showProfile && !loading ? (
            <div className="w-full px-0 py-0 sm:px-[4%] sm:py-[1.5%]">
              <UserProfile
                onBack={() => {
                  setShowProfile(false);
                  fetchProfile();
                }}
                onProfileUpdated={(updatedProfile) => {
                  fetchProfile();
                }}
              />
            </div>
          ) : !loading ? (
            <div className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(600/812*100vh)] overflow-y-auto">
              <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
                <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
                  <div className="flex flex-col justify-between items-center border-2 border-[#D4B588]/50 rounded-[0.225rem] lg:rounded-[0.625rem] w-[calc(321/375*100vw)] h-[calc(157/812*100vh)] bg-[#2A0B00]/50">
                    <div className="flex flex-col justify-center items-center w-[calc(321/375*100vw)] h-[calc(113/812*100vh)]">
                      <div className="flex flex-col justify-between w-[calc(285/375*100vw)] h-[calc(88/812*100vh)]">
                        <div className="flex items-center gap-1 w-[calc(285/375*100vw)] h-[calc(22/812*100vh)]">
                          <h1 style={{ color: profile?.username_color || "white" }} className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-none tracking-[-0.09rem]" > {profile?.username} </h1>
                          {profile?.display_on_profile && profile?.country && (
                            <div className="flex items-center">
                              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none"> {COUNTRIES.find((c) => c.code === profile.country)?.flag || "🏳️"} </span>
                            </div>
                          )}
                        </div>
                        <div className="relative group w-[calc(285/375*100vw)] h-[calc(33/812*100vh)]">
                          <p style={{ color: profile?.description_color || "white" }} className="text-[7px] sm:text-[9px] md:text-[11px] lg:text-sm xl:text-base 2xl:text-xl  font-medium leading-snug line-clamp-2 overflow-hidden break-words  cursor-pointer" > {profile?.description} </p>

                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 backdrop-blur-sm text-xs p-2 rounded-lg w-[300px] z-50 bottom-full left-1/2 -translate-x-1/2 mb-2  whitespace-normal max-h-[200px] overflow-y-auto  pointer-events-none"
                            style={{ color: profile?.description_color || "white" }}
                          >
                            {profile?.description}
                          </div>
                        </div>
                        <div className="flex justify-end w-[calc(285/375*100vw)] h-[calc(20/812*100vh)]">
                          <SocialLinks
                            instagram={profile?.instagram}
                            twitter={profile?.twitter}
                            tiktok={profile?.tiktok}
                            facebook={profile?.facebook}
                          />
                        </div>
                      </div>

                    </div>
                    <div className="flex justify-center w-[calc(321/375*100vw)] h-[calc(39/812*100vh)]">
                      <div className="flex items-center justify-center h-[calc(39/812*100vh)] w-[calc(318/375*100vw)]">
                        <div className={`h-[calc(39/812*100vh)] ${session?.user.email === profile?.email ? "w-[calc(169/375*100vw)]" : "w-[calc(317/375*100vw)]"} flex-shrink-0`}>
                          <AutoComplete
                            name="userSearch"
                            placeholder="SEARCH PLAYER"
                            options={users}
                            value={selectedUser?.username}
                            onChange={(username) => {
                              const selected = users.find((u) => u.username === username) || null;
                              setSelectedUser(selected);
                              if (selected) {
                                router.push(`/profile/${selected.id}`);
                              }
                            }}
                            customClass="h-full w-full flex items-center gap-2 px-[3%]"
                            isSimpleDropdown={false}
                          />
                        </div>
                        {session?.user.email === profile?.email ? (
                          <button onClick={() => setShowProfile(true)} className="flex items-center cursor-pointer bg-[#614438] shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box gap-2 w-[calc(149/375*100vw)] h-[calc(39/812*100vh)]  border-t-2 border-r-2 border-[#9d7e61] rounded-[0.15rem] lg:rounded-[0.3125rem] px-[3%] hover:brightness-95 transition" >
                            <img src="/profile/settingsMobile.svg" className="w-auto h-[calc(18.33/812*100vh)]" />
                            <span className="text-white text-[clamp(8px,4.0vw,14px)] font-medium w-full text-left"> Edit Profile </span>
                          </button>
                        ) : (
                          <div className="h-full w-2/5"></div>
                        )}

                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center  w-[calc(321/375*100vw)] h-[calc(24/812*100vh)] border-b-2 border-[#FFC066] ">
                    <nav className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10 text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold">
                      <button className="text-[#FFC066] text-[clamp(6px,4.0vw,16px)]">Historical Progress</button>
                      {/* <button className="text-white/50">
                  Achievements
                </button> */}
                    </nav>
                    <SelectMenu
                      id="mode"
                      value={filterMode}
                      onChange={setFilterMode}
                      openId={openId}
                      setOpenId={setOpenId}
                      options={[
                        { label: "All", value: "all" },
                        { label: "Season", value: "season" },
                        { label: "Tournament", value: "tournament" },
                        { label: "Daily", value: "daily" },
                      ]}
                      align="end"
                      customClass="border-none text-white text-end uppercase bg-transparent w-[calc(100/375*100vw)] h-[calc(22/812*100vh)]"
                    />
                  </div>
                  <ul className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 py-[1%] h-[calc(397/812*100vh)] w-[calc(321/375*100vw)] overflow-y-auto no-scrollbar">
                    {progress.length > 0 ? (
                      progress.map((item, index) => (
                        <li key={index} className="flex justify-center items-center h-[calc(37/812*100vh)] w-[calc(321/375*100vw)]  bg-[#D9D9D9]/20 rounded-md " >
                          <div className="flex justify-between items-center h-[calc(37/812*100vh)] w-[calc(295/375*100vw)]">
                            <span className="text-white text-[clamp(8px,3.0vw,12px)] font-normal"> {item.level} &nbsp; | &nbsp; {item.event} </span>
                            <span className="text-white text-[clamp(8px,3.0vw,12px)] font-normal"> {item.time_spent} </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center w-full py-8"> No progress data available </div>
                    )}
                  </ul>
                  <div className="w-[calc(321/375*100vw)] h-[calc(20/812*100vh)]"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-screen justify-center items-center">
              <BeatLoader color="white" />
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 w-full z-50">
          <Sidebar />
        </div>
      </div >

    </>
  );
};

export default ProfilePage;
