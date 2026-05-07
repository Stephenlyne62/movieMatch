import { START_DATE, weeklyPicks } from "../data/weeklyPicks";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const weekdayMoodMap = {
    1: "happy",      // Monday
    2: "excited",    // Tuesday
    3: "thoughtful", // Wednesday
    4: "scared",     // Thursday
    5: "romantic",   // Friday
    6: "romantic",   // Saturday catch-up
    0: "romantic",   // Sunday catch-up
};

export function getCurrentWeekIndex() {
    const start = new Date(`${START_DATE}T00:00:00`);
    const now = new Date();

    const diff = now.getTime() - start.getTime();

    if (diff < 0) return 0;

    const weekIndex = Math.floor(diff / MS_PER_WEEK);

    return Math.min(weekIndex, weeklyPicks.length - 1);
}

export function getCurrentWeek() {
    return weeklyPicks[getCurrentWeekIndex()];
}

export function getPastWeeks() {
    const currentIndex = getCurrentWeekIndex();
    return weeklyPicks.slice(0, currentIndex);
}

export function getFeaturedMoodForToday() {
    const day = new Date().getDay();
    return weekdayMoodMap[day] || "happy";
}

export function isWeekendCatchup() {
    const day = new Date().getDay();
    return day === 0 || day === 6;
}