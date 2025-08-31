import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getDashboardChartApi } from "@/services/api";
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardCharts = ({ active, all }: { active: number; all: number }) => {
  const revenueRef = useRef<HTMLCanvasElement>(null);
  const occupancyRef = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const fetchChart = async () => {
      const res = await getDashboardChartApi();
      if (res.success) {
        const newLabels: string[] = [];
        const newData: number[] = [];

        res.data?.forEach((item: { month: string; totalRevenue: number }) => {
          newLabels.push(item.month);
          newData.push(item.totalRevenue);
        });

        setLabels(newLabels);
        setData(newData);
      }
    };
    fetchChart();
  }, []);

  useEffect(() => {
    let revenueChart: Chart | null = null;
    let occupancyChart: Chart | null = null;

    if (revenueRef.current) {
      revenueChart = new Chart(revenueRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data,
              borderColor: "#667eea",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: "rgba(0,0,0,0.1)" },
            },
            x: { grid: { display: false } },
          },
        },
      });
    }

    if (occupancyRef.current) {
      occupancyChart = new Chart(occupancyRef.current, {
        type: "doughnut",
        data: {
          labels: ["Đã thuê", "Còn trống"],
          datasets: [
            {
              data: [active, all - active],
              backgroundColor: ["#10B981", "#E5E7EB"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 1.8,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 20, usePointStyle: true },
            },
          },
          cutout: "70%",
        },
      });
    }

    return () => {
      revenueChart?.destroy();
      occupancyChart?.destroy();
    };
  }, [labels, data, active, all]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-transform">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Doanh Thu Các Tháng Gần Đây
        </h3>
        <canvas ref={revenueRef}></canvas>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-transform">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏠 Tỷ Lệ Thuê Căn Hộ
        </h3>
        <canvas ref={occupancyRef}></canvas>
      </div>
    </div>
  );
};

export default DashboardCharts;
