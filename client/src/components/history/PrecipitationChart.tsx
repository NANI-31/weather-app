import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";

import type { ChartData, ChartOptions } from "chart.js";

interface PrecipitationChartProps {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}

const PrecipitationChart = ({ data, options }: PrecipitationChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="glass-card p-6"
  >
    <h3 className="text-lg font-semibold font-space-grotesk mb-4">
      Precipitation Trends
    </h3>
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  </motion.div>
);

export default PrecipitationChart;
