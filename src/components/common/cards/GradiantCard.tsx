import { GradiantCardProps } from "@/lib/types/common/types";

const GradiantCard: React.FC<GradiantCardProps> = ({ children }) => {
  return (
    <div className="mt-4 rounded-xl border border-[#7a684f] bg-gradient-to-r from-[#4b1e0e]/50 via-[#8b4a1f]/50 to-[#1c130c]/50">
      {children}
    </div>
  );
};

export default GradiantCard;
