import { motion } from "framer-motion";
import { TrendingUp, Droplets, Wind, type LucideIcon } from "lucide-react";
import { useWeather } from "@hooks/useWeather";

interface Props {
  averages: { temp: number; humidity: number; wind: number };
}

interface CardData {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bgClass: string;
  delay: number;
}
const StatCards = ({ averages }: Props) => {
  const { convertTemp, tempUnit } = useWeather();

  const cards: CardData[] = [
    {
      title: "Avg Temperature",
      value: `${convertTemp(averages.temp)}${tempUnit}`,
      icon: TrendingUp,
      bgClass: "bg-primary/20 text-primary",
      delay: 0.1,
    },
    {
      title: "Avg Humidity",
      value: `${Math.round(averages.humidity)}%`,
      icon: Droplets,
      bgClass: "bg-weather-rainy/20 text-weather-rainy",
      delay: 0.2,
    },
    {
      title: "Avg Wind Speed",
      value: `${Math.round(averages.wind * 3.6)} km/h`,
      icon: Wind,
      bgClass: "bg-muted/20 text-muted-foreground",
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ title, value, icon: Icon, bgClass, delay }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay }}
          className="glass-card p-6 max-sm:p-5"
        >
          <div className="flex items-center gap-3 mb-2 max-sm:gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass}`}
            >
              <Icon className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </div>
            <span className="text-muted-foreground">{title}</span>
          </div>
          <p className="text-3xl max-sm:text-2xl font-bold font-space-grotesk">
            {value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
