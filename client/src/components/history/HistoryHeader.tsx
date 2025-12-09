import { Calendar } from "lucide-react";
import { type TimeRange } from "@hooks/useHistoricalData";
import { motion } from "framer-motion";
import { useWeather } from "@hooks/useWeather";

interface Props {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const HistoryHeader = ({ timeRange, setTimeRange }: Props) => {
  const { currentWeather } = useWeather();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-space-grotesk text-gradient bg-clip-text text-transparent">
          Weather History
        </h1>
        <p className="text-muted-foreground mt-1">
          {currentWeather
            ? `Historical data for ${currentWeather.city}`
            : "View past weather trends"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange("week")}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium
                      ring-offset-background transition-colors flex-1 rounded-xl h-10 px-4 py-2
                    ${
                      timeRange === "week"
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Past Week
        </button>

        <button
          onClick={() => setTimeRange("month")}
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium
                      ring-offset-background transition-colors flex-1 rounded-xl h-10 px-4 py-2
                    ${
                      timeRange === "month"
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Past Month
        </button>
      </div>
    </motion.div>
  );
};

export default HistoryHeader;
