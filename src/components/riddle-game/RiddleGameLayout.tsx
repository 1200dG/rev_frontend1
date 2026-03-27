import Header from "@/components/common/header";
import BaseLayout from "@/components/layouts/BaseLayout";
import Sidebar from "@/components/common/sidebar";
import RightHelperPanel from "./RightHelperPanel";
import BottomSolveArea from "./BottomSolveArea";
import { RiddleGameLayoutProps } from "@/lib/types/common/types";
import { RIDDLE_DEFAULTS } from "@/lib/constants/riddle";
import { useState } from "react";

const RiddleGameLayout: React.FC<RiddleGameLayoutProps> = ({
  children,
  lives = 0,
  currentLevel = 1,
  profileInitials = RIDDLE_DEFAULTS.PROFILE_INITIALS,
  balance,
  currency,
  helpers,
  levelDescription,
  onSubmit,
  isLoading,
  placeholder,
  riddleId,
  riddleData,
  onHintUsed,
  success,
  gameMode = 'OTHER',
  modeId,
  accountId,
  onBalanceUpdate,
}) => {
  const [buyLives, setLives] = useState(0);
  const [credits, setCredits] = useState(0);
  const [tabIndex, setTabIndex] = useState<0 | 1 | null>(null);

  const handleUpdateLives = (newLives: number, newCredits: number) => {
    setLives(newLives);
    setCredits(newCredits);
  };
  return (
    <>
      <div className="hidden sm:block">
        <BaseLayout>
          <div className="relative flex flex-col min-h-screen overflow-x-hidden">
            <div className="z-10">
              <Header showGameElements={true} lives={buyLives || lives} profileInitials={profileInitials} showBorder={true} />
            </div>
            <div className="flex justify-between h-full w-full">
              <div className="py-[1.5%] z-10">
                <Sidebar />
              </div>
              <div className="absolute inset-0 z-0 w-full h-full bg-black">
                {children}
              </div>
              <div className="z-10">
                <RightHelperPanel
                  balance={credits || balance}
                  currency={currency}
                  helpers={helpers}
                  riddleData={riddleData}
                  onHintUsed={onHintUsed}
                  gameMode={gameMode}
                  modeId={modeId}
                  accountId={accountId}
                  onBalanceUpdate={onBalanceUpdate}
                  lives={lives}
                  onUpdateLives={handleUpdateLives}
                />
              </div>
            </div>
            <div className="fixed bottom-0 z-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6">
              <BottomSolveArea
                currentLevel={currentLevel}
                levelDescription={levelDescription}
                onSubmit={onSubmit}
                isLoading={isLoading}
                placeholder={placeholder}
                riddleId={riddleId}
                success={success}
                riddleData={riddleData}
                gameMode={gameMode}
              />
            </div>
          </div>
        </BaseLayout>
      </div>
      <div className="block sm:hidden">
        <BaseLayout>
          <div className="relative flex flex-col min-h-screen overflow-x-hidden">
            <div className="z-10">
              <Header showGameElements={true} lives={buyLives || lives} profileInitials={profileInitials} showBorder={true} />
            </div>
            <div className="flex justify-between h-full w-full">
              <div className="absolute inset-0 z-0 w-full h-full bg-black">
                {children}
              </div>
              {tabIndex === null && (
                <div className="h-[calc(660/812*100vh)] w-[calc(375/375*100vw)] z-10 flex justify-center items-end">
                  <div className="flex justify-center w-[calc(321/375*100vw)] ">
                    <BottomSolveArea
                      currentLevel={currentLevel}
                      levelDescription={levelDescription}
                      onSubmit={onSubmit}
                      isLoading={isLoading}
                      placeholder={placeholder}
                      riddleId={riddleId}
                      success={success}
                      riddleData={riddleData}
                      gameMode={gameMode}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className=" w-full ">
              <RightHelperPanel
                balance={credits || balance}
                currency={currency}
                helpers={helpers}
                riddleData={riddleData}
                onHintUsed={onHintUsed}
                gameMode={gameMode}
                modeId={modeId}
                accountId={accountId}
                onBalanceUpdate={onBalanceUpdate}
                lives={lives}
                onUpdateLives={handleUpdateLives}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
              />
            </div>
          </div>
        </BaseLayout>
      </div>
    </>
  );
};

export default RiddleGameLayout;
