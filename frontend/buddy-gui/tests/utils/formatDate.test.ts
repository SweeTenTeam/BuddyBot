import { formatDate } from "@/utils/formatDate";

describe("formatDate", () => {
  it("should format a timestamp correctly", () => {
    const timestamp = new Date("2024-03-17T15:30:00Z").getTime();
    const formatted = formatDate(timestamp);
    
    expect(formatted).toMatch(/17 marzo 2024, \d{2}:30/);
  });

  it("should handle different times correctly", () => {
    const timestamp = new Date("2025-12-25T08:15:00Z").getTime();
    const formatted = formatDate(timestamp);
    
    expect(formatted).toMatch(/25 dicembre 2025, \d{2}:15/);
  });
});