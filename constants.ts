// The ID from the provided Google Sheet URL
const SHEET_ID = '17OzrRnZaNo36bIwU48OirJCgtgD5cX-taAjL07vB0c8';

// Use the export endpoint which is typically strictly real-time for 'Anyone with link' sheets
// Adding gid=0 ensures we get the first sheet.
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

export const REFRESH_INTERVAL_MS = 10000; // Update every 10 seconds for real-time feel

// Team Goal Configuration (Monthly default)
export const TEAM_MONTHLY_GOAL = 50000; 

// Mock images for Top commercials (could be replaced with real URLs mapped by name)
export const AVATARS: Record<string, string> = {
  default: 'https://picsum.photos/200',
};