import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch globally for tests
global.fetch = vi.fn();

// Mock analytics module
vi.mock("@/lib/analytics", () => ({
  event: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));
