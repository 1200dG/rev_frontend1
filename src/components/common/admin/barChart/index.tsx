"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import PeriodDropdown from "../periodDropdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartData {
  labels: string[];
  values: number[];
  unit: string;
}
interface TotalProfitChartProps {
  period: string;
  onChangePeriod: (value: string) => void;
  chartData: ChartData;
}

const TotalProfitChart: React.FC<TotalProfitChartProps> = ({ period, onChangePeriod, chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: "#22222C",
        categoryPercentage: 0.8,
        barPercentage: 0.8,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#32475C61",
          callback: function (_tickValue: string | number, index: number) {
            if (period === "Yearly") {
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return index % 2 === 0 ? months[index / 2] : "";
            } else {
              return chartData.labels[index] ?? "";
            }
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 50,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: true,
          stepSize: 10,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <section
      aria-label="Total Profit chart"
      className="flex flex-col bg-white w-full rounded-lg p-4 md:p-5 gap-4 overflow-hidden"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold text-base">Total Profit</h3>
        <PeriodDropdown
          mode="local"
          options={["Monthly", "Yearly"]}
          defaultValue={period}
          onChange={onChangePeriod}
        />
      </div>
      <div className="overflow-x-auto md:h-72">
        <div className="w-full">
          <Bar data={data} options={options} />
        </div>
      </div>
    </section>
  );
};

export default TotalProfitChart;
