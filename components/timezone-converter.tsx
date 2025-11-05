"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Clock, Globe, MapPin, Edit2, Check } from "lucide-react";

// Timezone systems with their offsets
const TIMEZONE_SYSTEMS = {
  UTC: [
    { label: "-12", value: "Etc/GMT+12", offset: "UTC-12" },
    { label: "-11", value: "Pacific/Midway", offset: "UTC-11" },
    { label: "-10", value: "Pacific/Honolulu", offset: "UTC-10" },
    { label: "-9", value: "America/Anchorage", offset: "UTC-9" },
    { label: "-8 (PST)", value: "America/Los_Angeles", offset: "UTC-8" },
    { label: "-7 (MST)", value: "America/Denver", offset: "UTC-7" },
    { label: "-6 (CST)", value: "America/Chicago", offset: "UTC-6" },
    { label: "-5 (EST)", value: "America/New_York", offset: "UTC-5" },
    { label: "-4", value: "America/Halifax", offset: "UTC-4" },
    { label: "-3", value: "America/Sao_Paulo", offset: "UTC-3" },
    { label: "±0", value: "UTC", offset: "UTC±0" },
    { label: "+1 (CET)", value: "Europe/Paris", offset: "UTC+1" },
    { label: "+2 (EET)", value: "Europe/Helsinki", offset: "UTC+2" },
    { label: "+3 (MSK)", value: "Europe/Moscow", offset: "UTC+3" },
    { label: "+4", value: "Asia/Dubai", offset: "UTC+4" },
    { label: "+5", value: "Asia/Karachi", offset: "UTC+5" },
    { label: "+5:30 (IST)", value: "Asia/Kolkata", offset: "UTC+5:30" },
    { label: "+6", value: "Asia/Dhaka", offset: "UTC+6" },
    { label: "+7", value: "Asia/Bangkok", offset: "UTC+7" },
    { label: "+8 (CST)", value: "Asia/Shanghai", offset: "UTC+8" },
    { label: "+9 (JST)", value: "Asia/Tokyo", offset: "UTC+9" },
    { label: "+10 (AEST)", value: "Australia/Sydney", offset: "UTC+10" },
    { label: "+11", value: "Pacific/Noumea", offset: "UTC+11" },
    { label: "+12 (NZST)", value: "Pacific/Auckland", offset: "UTC+12" },
  ],
  GMT: [
    { label: "-8", value: "America/Los_Angeles", offset: "GMT-8" },
    { label: "-7", value: "America/Denver", offset: "GMT-7" },
    { label: "-6", value: "America/Chicago", offset: "GMT-6" },
    { label: "-5", value: "America/New_York", offset: "GMT-5" },
    { label: "±0 (London)", value: "Europe/London", offset: "GMT±0" },
    { label: "+1", value: "Europe/Paris", offset: "GMT+1" },
    { label: "+2", value: "Europe/Helsinki", offset: "GMT+2" },
    { label: "+3", value: "Europe/Moscow", offset: "GMT+3" },
    { label: "+8", value: "Asia/Shanghai", offset: "GMT+8" },
    { label: "+9", value: "Asia/Tokyo", offset: "GMT+9" },
  ],
  Regional: [
    {
      label: "US Pacific (PST/PDT)",
      value: "America/Los_Angeles",
      offset: "PST/PDT",
    },
    {
      label: "US Mountain (MST/MDT)",
      value: "America/Denver",
      offset: "MST/MDT",
    },
    {
      label: "US Central (CST/CDT)",
      value: "America/Chicago",
      offset: "CST/CDT",
    },
    {
      label: "US Eastern (EST/EDT)",
      value: "America/New_York",
      offset: "EST/EDT",
    },
    { label: "UK (GMT/BST)", value: "Europe/London", offset: "GMT/BST" },
    {
      label: "Central Europe (CET/CEST)",
      value: "Europe/Paris",
      offset: "CET/CEST",
    },
    {
      label: "Eastern Europe (EET/EEST)",
      value: "Europe/Helsinki",
      offset: "EET/EEST",
    },
    { label: "Moscow (MSK)", value: "Europe/Moscow", offset: "MSK" },
    { label: "India (IST)", value: "Asia/Kolkata", offset: "IST" },
    { label: "China (CST)", value: "Asia/Shanghai", offset: "CST" },
    { label: "Japan (JST)", value: "Asia/Tokyo", offset: "JST" },
    {
      label: "Australia East (AEST/AEDT)",
      value: "Australia/Sydney",
      offset: "AEST/AEDT",
    },
  ],
};

// Simplified GMT timezones for manual user selection
const GMT_TIMEZONES = [
  { label: "GMT-12", value: "Etc/GMT+12" },
  { label: "GMT-11", value: "Pacific/Midway" },
  { label: "GMT-10", value: "Pacific/Honolulu" },
  { label: "GMT-9", value: "America/Anchorage" },
  { label: "GMT-8", value: "America/Los_Angeles" },
  { label: "GMT-7", value: "America/Denver" },
  { label: "GMT-6", value: "America/Chicago" },
  { label: "GMT-5", value: "America/New_York" },
  { label: "GMT-4", value: "America/Halifax" },
  { label: "GMT-3", value: "America/Sao_Paulo" },
  { label: "GMT-2", value: "Atlantic/South_Georgia" },
  { label: "GMT-1", value: "Atlantic/Azores" },
  { label: "GMT+0", value: "UTC" },
  { label: "GMT+1", value: "Europe/Paris" },
  { label: "GMT+2", value: "Europe/Helsinki" },
  { label: "GMT+3", value: "Europe/Moscow" },
  { label: "GMT+4", value: "Asia/Dubai" },
  { label: "GMT+5", value: "Asia/Karachi" },
  { label: "GMT+6", value: "Asia/Dhaka" },
  { label: "GMT+7", value: "Asia/Bangkok" },
  { label: "GMT+8", value: "Asia/Shanghai" },
  { label: "GMT+9", value: "Asia/Tokyo" },
  { label: "GMT+10", value: "Australia/Sydney" },
  { label: "GMT+11", value: "Pacific/Noumea" },
  { label: "GMT+12", value: "Pacific/Auckland" },
];

export default function TimezoneConverter() {
  const [raidHour, setRaidHour] = useState("19");
  const [raidMinute, setRaidMinute] = useState("00");
  const [timezoneSystem, setTimezoneSystem] =
    useState<keyof typeof TIMEZONE_SYSTEMS>("UTC");
  const [raidTimezone, setRaidTimezone] = useState("Europe/Paris");
  const [detectedTimezone, setDetectedTimezone] = useState("");
  const [manualTimezone, setManualTimezone] = useState("UTC");
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [convertedTime, setConvertedTime] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Combine hour and minute into time string
  const raidTime = `${raidHour}:${raidMinute}`;

  // Get the active user timezone (either detected or manual)
  const userTimezone = isAutoDetect ? detectedTimezone : manualTimezone;

  // Generate hours array (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

  // Generate minutes array (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];

  // Auto-detect user's timezone on mount
  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setDetectedTimezone(detected);

    // Check if user prefers dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Format time for a specific timezone
  const formatTimeForTimezone = (timezone: string) => {
    if (!timezone) return "--:--:--";
    return currentTime.toLocaleString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Convert raid time to user's timezone
  useEffect(() => {
    if (!raidTime || !raidTimezone || !userTimezone) return;

    try {
      // Create a date object for today with the raid time in the raid timezone
      const now = new Date();
      const [hours, minutes] = raidTime.split(":").map(Number);

      // Create date string in ISO format for the raid timezone
      const dateStr = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
        hours
      ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

      // Parse the time in the raid timezone
      const raidDate = new Date(dateStr);

      // Get the offset difference
      const raidFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: raidTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const userFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Create a specific date/time in the raid timezone
      const testDate = new Date(
        Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        )
      );

      // Format it in both timezones to see the conversion
      const raidOffset = getTimezoneOffset(raidTimezone, testDate);
      const userOffset = getTimezoneOffset(userTimezone, testDate);

      // Calculate the time difference
      const offsetDiff = userOffset - raidOffset;
      const convertedDate = new Date(testDate.getTime() + offsetDiff);

      // Format the converted time
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimezone,
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      setConvertedTime(timeFormatter.format(convertedDate));
      setConvertedDate(dateFormatter.format(convertedDate));
    } catch (error) {
      console.error("Error converting timezone:", error);
      setConvertedTime("Error");
      setConvertedDate("");
    }
  }, [raidTime, raidTimezone, userTimezone]);

  // Helper function to get timezone offset in milliseconds
  function getTimezoneOffset(timeZone: string, date: Date) {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
    return utcDate.getTime() - tzDate.getTime();
  }

  // Get timezone display name with offset
  const getUserTimezoneDisplay = () => {
    if (!userTimezone) return "Detecting...";
    const offset = new Date()
      .toLocaleString("en-US", {
        timeZone: userTimezone,
        timeZoneName: "short",
      })
      .split(" ")
      .pop();
    return `${userTimezone.replace("_", " ")} (${offset})`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8 relative">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 rounded-lg bg-secondary hover:bg-accent transition-all duration-200 border border-border shadow-sm"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-primary" />
        ) : (
          <Moon className="h-5 w-5 text-primary" />
        )}
      </button>

      {/* Header with gradient */}
      <div className="text-center space-y-3 pt-4">
        <div className="flex items-center justify-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Raid Time Converter
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Never miss a raid - convert times across timezones instantly
        </p>
      </div>

      {/* Input Section with gradient border */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-50" />
        <div className="relative bg-card border-2 border-primary/20 rounded-xl p-8 space-y-6 shadow-lg backdrop-blur-sm">
          {/* Raid Time Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Raid Time
            </label>
            <div className="flex gap-3 items-center justify-center">
              {/* Hour Selector */}
              <div className="relative flex-1">
                <select
                  value={raidHour}
                  onChange={(e) => setRaidHour(e.target.value)}
                  className="w-full px-3 py-2 text-xl font-bold text-center border-2 rounded-lg bg-background hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer appearance-none"
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Separator */}
              <div className="text-2xl font-bold text-primary">:</div>

              {/* Minute Selector */}
              <div className="relative flex-1">
                <select
                  value={raidMinute}
                  onChange={(e) => setRaidMinute(e.target.value)}
                  className="w-full px-3 py-2 text-xl font-bold text-center border-2 rounded-lg bg-background hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer appearance-none"
                >
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Raid Timezone System Select */}
          <div className="space-y-3">
            <label
              htmlFor="timezone-system"
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <Globe className="h-4 w-4 text-primary" />
              Timezone System
            </label>
            <div className="relative">
              <select
                id="timezone-system"
                value={timezoneSystem}
                onChange={(e) => {
                  const newSystem = e.target
                    .value as keyof typeof TIMEZONE_SYSTEMS;
                  setTimezoneSystem(newSystem);
                  // Set first timezone of the new system as default
                  setRaidTimezone(TIMEZONE_SYSTEMS[newSystem][0].value);
                }}
                className="w-full px-4 py-2.5 text-base font-medium border-2 rounded-lg bg-background hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer appearance-none"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
                <option value="Regional">
                  Regional Names (PST, CET, JST, etc.)
                </option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Raid Timezone Offset Select */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="raid-timezone"
                className="flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <Clock className="h-4 w-4 text-primary" />
                Raid Timezone Offset
              </label>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-sm font-mono font-bold text-primary animate-pulse">
                {formatTimeForTimezone(raidTimezone)}
              </div>
            </div>
            <div className="relative">
              <select
                id="raid-timezone"
                value={raidTimezone}
                onChange={(e) => setRaidTimezone(e.target.value)}
                className="w-full px-4 py-2.5 text-base font-medium border-2 rounded-lg bg-background hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer appearance-none"
              >
                {TIMEZONE_SYSTEMS[timezoneSystem].map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {timezoneSystem === "Regional" ? tz.label : tz.offset}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* User Timezone Display/Edit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Your Timezone
                </label>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-sm font-mono font-bold text-primary animate-pulse">
                  {formatTimeForTimezone(userTimezone)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {isAutoDetect ? "Auto" : "Manual"}
                </span>
                <button
                  onClick={() => setIsAutoDetect(!isAutoDetect)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAutoDetect ? "bg-primary" : "bg-muted"
                  }`}
                  aria-label="Toggle auto-detect timezone"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                      isAutoDetect ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            {isAutoDetect ? (
              <div className="w-full px-4 py-2.5 border-2 border-dashed rounded-lg bg-muted/50 text-sm font-medium flex items-center justify-between">
                <span>{getUserTimezoneDisplay()}</span>
                <span className="text-xs text-muted-foreground">
                  Browser detected
                </span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={manualTimezone}
                  onChange={(e) => setManualTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 text-base font-medium border-2 rounded-lg bg-background hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer appearance-none"
                >
                  {GMT_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Section with animated gradient */}
      {convertedTime && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30 rounded-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl p-10 text-center space-y-4 shadow-xl backdrop-blur-sm">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Your Raid Starts At
            </p>
            <div className="space-y-2">
              <p className="text-6xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-lg">
                {convertedTime}
              </p>
              <p className="text-lg text-muted-foreground font-medium">
                {convertedDate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
