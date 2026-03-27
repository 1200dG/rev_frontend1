import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import { useRouter } from "next/navigation";

const AboutSection = () => {
  const router = useRouter();

  return (
    <>
      <div className="hidden sm:block">
        <div className="flex flex-col gap-2 md:gap-3 lg:gap-5 xl:gap-6 2xl:gap-8 w-full ps-[5%] pt-[3%] pe-[2.5%]">
          <div className="relative flex flex-col w-full">
            <span className="text-[#ABABAB] font-Sora text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-base 2xl:text-lg">About REV</span>
            <h2 className="font-Farsan text-white text-lg leading-none sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl w-[23%]">It is not just <br /> about creating</h2>
            <img src="/about-us/riddles.svg" className="w-full aspect-[950/60]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[73%]">
              <p className="text-white text-justify text-[6px] sm:text-[9px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-Sora">
                REV is a small team that aims to build an online platform that combines fun, logic, and challenge through an engaging riddle-solving experience. We came up with this idea, since nowadays, people seem disconnected with how much fun these types of puzzles can be. This is the best way to learn, be creative and have fun all together. We plan to launch a series of initiatives that focus on the two points below:
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center gap-[2%] w-full ps-[27%]">
            <div className="relative flex flex-col items-center gap-2 xl:gap-4 w-1/2 p-[4%] pb-[4%] border border-[#FFCE96]/70 rounded-[0.3125rem] bg-[#6C5C43]/70">
              <div className="relative w-1/2">
                <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-full scale-110 opacity-50 bg-[radial-gradient(50%_50%_at_50%_50%,#FFD278_8.43%,rgba(255,210,120,0)_100%)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[125%] h-2/3 scale-110 rounded-[13.30194rem] opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.30)_0%,rgba(2,117,151,0)_100%)]" />
                <img src="/about-us/Aura.svg" className="w-full animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite" />
                <img src="/about-us/curved-leaf.svg" className="absolute top-1/2 left-1/2 -translate-1/2 w-[90%]" />
              </div>
              <div className="absolute bottom-0 h-1/3 w-full rounded-[25.803rem] bg-black mix-blend-luminosity blur-[128.4796600341797px]" />
              <div className="relative z-10 flex flex-col items-center gap-1 xl:gap-2">
                <h2 className="text-white text-[9px] sm:text-xs md:text-sm lg:text-lg xl:text-2xl 2xl:text-3xl font-bold">Be More Sustainable</h2>
                <p className="text-[#E8EFFD] font-Sora text-[6px] sm:text-[8px] md:text-[9px] lg:text-[13px] xl:text-base 2xl:text-xl font-normal text-center">
                  We want to invest in green energy <br /> initiatives around the world.
                </p>
              </div>
            </div>
            <div className="relative flex flex-col items-center gap-2 xl:gap-4 w-1/2 p-[4%] pb-[1.5%] border border-[#FFCE96]/70 rounded-[0.3125rem] bg-[#6C5C43]/70">
              <div className="relative w-1/2">
                <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-full scale-110 opacity-50 bg-[radial-gradient(50%_50%_at_50%_50%,#FFD278_8.43%,rgba(255,210,120,0)_100%)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[125%] h-2/3 scale-110 rounded-[13.30194rem] opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.30)_0%,rgba(2,117,151,0)_100%)]" />
                <img src="/about-us/Aura.svg" className="w-full -scale-x-100 animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite" />
                <img src="/about-us/golden-sunburst.svg" className="absolute top-[48%] left-1/2 -translate-1/2 w-[65%]" />
              </div>
              <div className="absolute bottom-0 h-1/3 w-full rounded-[25.803rem] bg-black mix-blend-luminosity blur-[128.4796600341797px]" />
              <div className="relative z-10 flex flex-col items-center gap-1 xl:gap-2">
                <h2 className="text-white text-[9px] sm:text-xs md:text-sm lg:text-lg xl:text-2xl 2xl:text-3xl font-bold">Invest in our Community</h2>
                <p className="text-[#E8EFFD] font-Sora text-[6px] sm:text-[8px] md:text-[9px] lg:text-[13px] xl:text-base 2xl:text-xl font-normal text-center">
                  Through giveaways and tournaments, <br /> we aim to foster a fun and rewarding <br /> environment.
                </p>
              </div>
            </div>
          </div>
          <p className="text-white font-Sora font-normal text-center text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl pt-4 sm:pt-6">Stay tuned!</p>
        </div>
      </div>
      <div className={`block sm:hidden min-h-screen fixed bg-[url('/gamehub/background.png')] h-[calc(812/812*100vh)] bg-no-repeat bg-cover w-[calc(375/375*100vw)]`}>
        <div className="w-[calc(375/375*100vw)] h-[calc(70/812*100vh)]">
          <Header />
        </div>
        <div className="w-[calc(375/375*100vw)]  h-[calc(676/812*100vh)] overflow-y-auto">
          <div className={`flex flex-col items-center w-[calc(375/375*100vw)] overflow-y-auto `}>
            <div className={`flex flex-col justify-center items-center overflow-y-auto w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
              <div className={`flex flex-col justify-between overflow-y-auto w-[calc(323/375*100vw)]  gap-[calc(18/845*100vh)] `}>

                <div className={`flex flex-col justify-between w-[calc(323/375*100vw)] h-[calc(50/845*100vh)] `}>
                  <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1 h-[calc(13/812*100vh)] w-[calc(321/375*100vw)] rounded-md transition-all duration-300 hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105"
                  >
                    <img
                      src="/statistics/backArrow.svg"
                      alt="Back Icon"
                      height={11.67} width={6.87}
                    />
                    <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                  </button>

                  <div className="flex items-baseline w-full flex-wrap">
                    <p className="text-white text-3xl font-medium">About</p>
                  </div>
                </div>
                <div className={`relative flex flex-col justify-between w-[calc(323/375*100vw)] h-[calc(109/845*100vh)]`}>
                  <p className="font-Farsan text-white text-3xl">
                    It is not just about <br /> creating
                  </p>
                  <div className="absolute right-1 bottom-0 w-[calc(219/375*100vw)] -mt-[calc(35/845*100vh)]">
                    <img src="/about/riddlesAbout.png" className="w-full h-auto" />
                  </div>
                </div>
              </div>
              <div className={`relative flex justify-center  w-[calc(375/375*100vw)] h-[calc(720/845*100vh)] `}>
                <img src={'/about/bgAbout.png'} className="absolute w-full h-full" />
                <div className={` flex flex-col justify-between w-[calc(323/375*100vw)] h-[calc(660/845*100vh)] `}>
                  <img src={'/about/aboutCenter.png'} alt="Center Line" />
                  <div className={`z-10 flex flex-col justify-between w-[calc(323/375*100vw)] h-[calc(160/845*100vh)] `}>
                    <p className="text-white text-[clamp(8px,calc(12/375*100vw),14px)] text-justify">
                      REV is a small team that aims to build an online platform that combines fun, logic, and challenge through an engaging riddle-solving experience. We came up with this idea, since nowadays, people seem disconnected with how much fun these types of puzzles can be. This is the best way to learn, be creative and have fun all together. We plan to launch a series of initiatives that focus on the two points below.
                    </p>
                  </div>
                  <div className={`relative z-10 flex flex-col justify-center w-[calc(323/375*100vw)] rounded-md overflow-hidden h-[calc(169/845*100vh)]`}>
                    <img src="/about/card1About.png" className="w-full h-full " alt="Card" />
                    <div className="absolute w-[calc(323/375*100vw)] h-[calc(143.22/845*100vh)] flex flex-col justify-between items-center">
                      <div className="relative w-[calc(89.44/375*100vw)] h-[calc(89.44/845*100vh)]">
                        <img src="/about-us/Aura.svg" className="w-full h-full -scale-x-100 animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite]" alt="Aura" />
                        <img src="/about-us/curved-leaf.svg" className="absolute inset-0 m-auto w-[calc(78/375*100vw)] h-[calc(78/845*100vh)]" alt="Curved Leaf" />
                      </div>
                      <p className="text-white font-bold">BE MORE SUSTAINABLE</p>
                      <p className="text-[#D4B588] text-[9px] text-center uppercase">We want to invest in green energy initiatives <br /> around the world</p>
                    </div>
                    <img
                      src="/about/aboutCenter.png"
                      alt="Center Line"
                      className="absolute bottom-0 left-0 w-full"
                    />
                  </div>

                  <div className={`relative z-10 flex flex-col justify-center w-[calc(323/375*100vw)] rounded-md overflow-hidden h-[calc(169/845*100vh)]`}>
                    <img src="/about/card1About.png" className="w-full h-full " alt="Card" />
                    <div className="absolute w-[calc(323/375*100vw)] h-[calc(143.22/845*100vh)] flex flex-col justify-between items-center">
                      <div className="relative w-[calc(89.44/375*100vw)] h-[calc(89.44/845*100vh)]">
                        <img src="/about-us/Aura.svg" className="w-full h-full -scale-x-100 animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite]" alt="Aura" />
                        <img src="/about-us/person.svg" className="absolute inset-0 m-auto w-[calc(60/375*100vw)] h-[calc(60/845*100vh)]" alt="Curved Leaf" />
                      </div>
                      <p className="text-white font-bold">INVEST IN OUR COMMUNITY</p>
                      <p className="text-[#D4B588] text-[9px] text-center uppercase">Through giveaways and tournaments, we aim to foster <br /> a fun and rewarding environment.</p>
                    </div>
                    <img src="/about/aboutCenter.png" alt="Center Line" className="absolute bottom-0 left-0 w-full" />
                  </div>

                  <div className={`z-10 flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(18/845*100vh)] `}>
                    <p className="text-[#D4B588] text-center ">STAY TUNED!</p>

                  </div>
                  <div className={`flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(50/845*100vh)] `}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full z-50">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

export default AboutSection;
