import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@app/store";
import { Thermometer, Wind } from "lucide-react";
import {
  setTemperatureUnit,
  setSpeedUnit,
} from "@features/settings/settingsSlice";

const UnitPreferencesSection = () => {
  const dispatch = useDispatch();
  const { temperatureUnit, speedUnit } = useSelector(
    (state: RootState) => state.settings
  );

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl max-sm:text-lg font-semibold mb-4">
        Unit Preferences
      </h2>

      <div>
        <div className="flex items-center gap-3 mb-3">
          <Thermometer className="w-5 h-5 text-primary" /> Temperature
        </div>
        <div className="flex gap-2 max-xs:flex-col">
          <button
            onClick={() => dispatch(setTemperatureUnit("celsius"))}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium 
                        transition-colors flex-1 rounded-xl h-10 px-4 py-2 ${
                          temperatureUnit === "celsius"
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
          >
            Celsius (°C)
          </button>

          <button
            onClick={() => dispatch(setTemperatureUnit("fahrenheit"))}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium 
                        transition-colors flex-1 rounded-xl h-10 px-4 py-2 ${
                          temperatureUnit === "fahrenheit"
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-3">
          <Wind className="w-5 h-5 text-primary" /> Wind Speed
        </div>
        <div className="flex gap-2 max-xs:flex-col">
          <button
            onClick={() => dispatch(setSpeedUnit("kmh"))}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium 
                        transition-colors flex-1 rounded-xl h-10 px-4 py-2 ${
                          speedUnit === "kmh"
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
          >
            Km/h
          </button>
          <button
            onClick={() => dispatch(setSpeedUnit("mph"))}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium 
                        transition-colors flex-1 rounded-xl h-10 px-4 py-2 ${
                          speedUnit === "mph"
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
          >
            Mph
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitPreferencesSection;
