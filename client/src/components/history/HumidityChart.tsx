import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

import type { ChartData, ChartOptions } from "chart.js";

interface HumidityChartProps {
  data: ChartData<"bar">;
  options: ChartOptions<"bar">;
}

const HumidityChart = ({ data, options }: HumidityChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="glass-card p-6"
  >
    <h3 className="text-lg font-semibold font-space-grotesk mb-4">
      Humidity History
    </h3>
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  </motion.div>
);

export default HumidityChart;
