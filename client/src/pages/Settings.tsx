import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AccountSection from "@components/settings/AccountSection";
import ThemeModeSection from "@components/settings/ThemeModeSection";
import ColorThemeSection from "@components/settings/ColorThemeSection";
import WeatherThemeSection from "@components/settings/WeatherThemeSection";
import UnitPreferencesSection from "@components/settings/UnitPreferencesSection";

const Settings = () => {
  const [tab, setTab] = useState<"account" | "theme" | "units">("account");
  const tabs = [
    { key: "account", label: "Account" },
    { key: "theme", label: "Theme" },
    { key: "units", label: "Units" },
  ] as const;
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-space-grotesk text-gradient bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your weather experience
        </p>
      </motion.div>
      <div className="flex gap-4 text-center">
        {tabs.map((t) => (
          <p
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              flex-1 p-2 rounded-full cursor-pointer transition-all
              ${
                tab === t.key
                  ? "bg-primary text-white"
                  : "border border-primary/20 bg-primary/10"
              }
            `}
          >
            {t.label}
          </p>
        ))}
      </div>

      {/* Sections */}
      <AnimatePresence mode="wait">
        {tab === "account" && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <AccountSection />
          </motion.div>
        )}

        {tab === "theme" && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <ThemeModeSection />
            <ColorThemeSection />
            <WeatherThemeSection />
          </motion.div>
        )}

        {tab === "units" && (
          <motion.div
            key="units"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <UnitPreferencesSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
