import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const mockUseReducedMotion = vi.fn();
vi.mock("motion/react", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe("useReducedMotionSafe", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReset();
  });

  it("returns true when user prefers reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => useReducedMotionSafe());
    expect(result.current).toBe(true);
  });

  it("returns false when user does not prefer reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(false);
    const { result } = renderHook(() => useReducedMotionSafe());
    expect(result.current).toBe(false);
  });

  it("returns false when underlying hook returns null (SSR safety)", () => {
    mockUseReducedMotion.mockReturnValue(null);
    const { result } = renderHook(() => useReducedMotionSafe());
    expect(result.current).toBe(false);
  });
});
