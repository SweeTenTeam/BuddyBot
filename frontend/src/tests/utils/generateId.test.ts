import { generateId } from "@/utils/generateId";

describe("generateId", () => {
  it("should generate unique incrementing IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    expect(id1).toMatch(/^\d+Q$/);
    expect(id2).toMatch(/^\d+Q$/);
    expect(id3).toMatch(/^\d+Q$/);
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
  });

  it("should start from 1 when the module is reloaded", () => {
    jest.resetModules();
    const { generateId: newGenerateId } = require("@/utils/generateId");
    
    expect(newGenerateId()).toBe("1Q");
  });
});
