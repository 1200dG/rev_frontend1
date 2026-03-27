import { DashboardCardProps } from "@/lib/types/admin";

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  percentage,
  value,
}) => {
  return (
    <div
      className="relative bg-white rounded-2xl p-4 md:p-6 flex flex-col justify-between"
      style={{ boxShadow: "0px 12px 24px -4px rgba(145, 158, 171, 0.12)" }}
    >
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
        <h3 className="text-[#212B36] font-bold text-sm">{title}</h3>
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-[#54D62C]/15">
              <img src="/admin/stockUp.svg" />
            </div>
            <span className="text-[#212B36] font-bold text-sm">
              {percentage}
            </span>
          </div>
          <p className="text-[#212B36] font-bold text-xl md:text-2xl lg:text-3xl">
            {value}
          </p>
        </div>
        <img
          src="/admin/chart.svg"
          className="absolute top-[0.88rem] right-[0.88rem]"
        />
      </div>
    </div>
  );
};

export default DashboardCard;
