"use client";

import { useRouter } from "next/navigation";

const Vault = () => {

  const router = useRouter();
  return (
    <div className="block sm:hidden">
      <div className="w-[375/375*100vw] h-[calc(394/821*100vh)] flex justify-center">
        <div className="w-[321/375*100vw] h-[calc(394/821*100vh)] flex flex-col items-center justify-between">
          <div className="w-[calc(321/375*100vw)] h-[calc(45/821*100vh)] flex flex-col justify-between">
            <h1 className="text-white text-[clamp(16px,5vw,24px)] font-bold ">VAULT</h1>
            <p className="text-[#E2AC5D] text-[clamp(12px,4vw,20px)] "> Quick Links</p>
          </div>

          <div className="w-[calc(321/375*100vw)] h-[calc(320/821*100vh)] flex flex-col justify-between">
            <div className="w-[calc(321/375*100vw)] h-[calc(155/821*100vh)] flex items-center justify-between">
              <div className="w-[calc(155/375*100vw)] h-[calc(155/821*100vh)] bg-[#2e0d02]/50 border-2 border-[#D4B588] flex flex-col items-center justify-center" onClick={() => router.push('/game-rules')}>
                <div className="w-[calc(155/375*100vw)] h-[calc(111/821*100vh)] flex flex-col items-center justify-between" >
                  <img src="/vault/disc.svg" alt="box1" width="64.17" height="64.17" />
                  <div className="w-full bg-[url('/vault/centerLineVault.png')] h-1" />
                  <p className="text-white font-bold text-[clamp(12px,4vw,20px)]">GAME RULES</p>
                </div>
              </div>
              <div className="w-[calc(155/375*100vw)] h-[calc(155/821*100vh)] bg-[#2e0d02]/50 border-2 border-[#D4B588] flex flex-col items-center justify-center" onClick={() => router.push('/about')}>
                <div className="w-[calc(155/375*100vw)] h-[calc(111/821*100vh)] flex flex-col items-center justify-between" >
                  <img src="/vault/eco.svg" alt="box1" width="64.17" height="64.17" />
                  <div className="w-full bg-[url('/vault/centerLineVault.png')] h-1" />
                  <p className="text-white font-bold text-[clamp(12px,4vw,20px)]">ABOUT</p>
                </div>
              </div>
            </div>

            <div className="w-[calc(321/375*100vw)] h-[calc(155/821*100vh)] bg-[#2C1A0F] rounded-lg flex items-center justify-between">
              <div className="w-[calc(155/375*100vw)] h-[calc(155/821*100vh)] bg-[#2e0d02]/50 border-2 border-[#D4B588] flex flex-col items-center justify-center" onClick={()=> router.push('/faq')}>
                <div className="w-[calc(155/375*100vw)] h-[calc(111/821*100vh)] flex flex-col items-center justify-between" >
                  <img src="/vault/help.svg" alt="box1" width="64.17" height="64.17" />
                  <div className="w-full bg-[url('/vault/centerLineVault.png')] h-1" />
                  <p className="text-white font-bold text-[clamp(12px,4vw,20px)]">FAQ</p>
                </div>
              </div>
              <div className="w-[calc(155/375*100vw)] h-[calc(155/821*100vh)] bg-[#2e0d02]/50 border-2 border-[#D4B588] flex flex-col items-center justify-center" onClick={()=> router.push('/settings')}>
                <div className="w-[calc(155/375*100vw)] h-[calc(111/821*100vh)] flex flex-col items-center justify-between" >
                  <img src="/vault/settings.png" alt="box1" width="64.49" height="64.17" />
                  <div className="w-full bg-[url('/vault/centerLineVault.png')] h-1" />
                  <p className="text-white font-bold text-[clamp(12px,4vw,20px)]">SETTINGS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Vault;   