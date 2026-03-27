import { CardHeaderProps } from "@/lib/types/common/types";

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div className="flex items-baseline justify-between border-b border-[#88724B]">
      {children}
    </div>
  );
};

export default CardHeader;
