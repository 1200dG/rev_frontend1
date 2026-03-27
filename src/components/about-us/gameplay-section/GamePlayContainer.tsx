import { useRef } from "react";
import gsap from "gsap";

interface GameplayContainerProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const GameplayContainer = ({ title, icon, children }: GameplayContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);

  const toggleContainer = () => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    if (!isOpenRef.current) {
      tl.to(containerRef.current, {
        height: "70vh",
        duration: 0.3,
        ease: "power3.out",
      });
      isOpenRef.current = true;
    } else {
      tl.to(containerRef.current, {
        height: "calc(51/1089*100vh)",
        duration: 0.3,
        ease: "power3.inOut",
      });
      isOpenRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={toggleContainer}
      className="relative overflow-hidden transition-all ease-in-out w-[calc(321/375*100vw)] rounded-md border border-[#D4B588] bg-[#342317]/50 h-[calc(51/1089*100vh)]"
    >
      {/* Header */}
      <div className="relative z-10 flex justify-center items-center h-[calc(51/1089*100vh)] border-b border-[#D4B588]">
        <div className="flex justify-between w-[calc(289/375*100vw)]">
          <div className="flex items-center gap-2">
            <img src={icon} width={18} />
            <h2 className="text-[#D4B588] font-bold">{title}</h2>
          </div>
          <img src="/gamePlay/add.svg" width={10} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 text-[clamp(8px,5vw,14px)] leading-relaxed max-h-[65vh] overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default GameplayContainer;
