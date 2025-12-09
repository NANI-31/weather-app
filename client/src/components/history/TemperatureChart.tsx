import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import type { ChartData, ChartOptions } from "chart.js";

interface TemperatureChartProps {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
  tempUnit: string;
}

const TemperatureChart = ({
  data,
  options,
  tempUnit,
}: TemperatureChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="glass-card p-6"
  >
    <h3 className="text-lg font-semibold font-space-grotesk mb-4">
      Temperature History ({tempUnit})
    </h3>
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  </motion.div>
);

export default TemperatureChart;
