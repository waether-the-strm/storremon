import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils functions", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional", false && "hidden")).toBe(
        "base conditional"
      );
    });

    it("should merge tailwind classes and resolve conflicts", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("should handle empty and undefined values", () => {
      expect(cn("class1", "", undefined, "class2")).toBe("class1 class2");
    });
  });
});
