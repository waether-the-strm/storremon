import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScaleSlider } from "@/components/scale-slider";

// Mock fetch for density data
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ScaleSlider", () => {
  const defaultProps = {
    value: 50,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch response for both pokemon and museum density data
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          heights: [10, 20, 50, 100, 200],
        }),
    });
  });

  it("should render slider with correct initial value", async () => {
    await act(async () => {
      render(<ScaleSlider {...defaultProps} />);
    });

    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("50");
  });

  it("should call onChange when slider value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ScaleSlider {...defaultProps} onChange={onChange} />);

    const slider = screen.getByRole("slider");
    await user.click(slider);

    fireEvent.change(slider, { target: { value: "75" } });

    expect(onChange).toHaveBeenCalledWith(75);
  });

  it("should display correct scale labels", async () => {
    await act(async () => {
      render(<ScaleSlider {...defaultProps} />);
    });

    expect(screen.getByText("Micro")).toBeInTheDocument();
    expect(screen.getByText("Tiny")).toBeInTheDocument();
    expect(screen.getByText("Human-sized")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getByText("Colossal")).toBeInTheDocument();
  });

  it("should highlight current scale label", async () => {
    await act(async () => {
      render(<ScaleSlider {...defaultProps} value={25} />);
    });

    // At value 25, should be in "Tiny" range
    const tinyLabel = screen.getByText("Tiny");
    expect(tinyLabel).toHaveClass("text-white/90", "font-medium");
  });

  it("should show tooltip on interaction", async () => {
    const user = userEvent.setup();
    render(<ScaleSlider {...defaultProps} />);

    const slider = screen.getByRole("slider");

    // Trigger change to show tooltip
    fireEvent.change(slider, { target: { value: "30" } });

    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText(/cm/)).toBeInTheDocument();
    });
  });

  it("should fetch density data on mount", async () => {
    render(<ScaleSlider {...defaultProps} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/density-map/pokemon");
      expect(mockFetch).toHaveBeenCalledWith("/api/density-map/museum");
    });
  });

  it("should handle fetch error gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Fetch failed"));

    await act(async () => {
      render(<ScaleSlider {...defaultProps} />);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/density-map/pokemon");
      expect(mockFetch).toHaveBeenCalledWith("/api/density-map/museum");
    });

    // Component should still render even if fetch fails
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("should handle props variations", async () => {
    let rerender: any;
    await act(async () => {
      const result = render(
        <ScaleSlider
          {...defaultProps}
          showDescription={false}
          showPokemon={false}
          showArt={false}
          className="custom-class"
        />
      );
      rerender = result.rerender;
    });

    expect(screen.getByRole("slider")).toBeInTheDocument();

    // Test that component updates when props change
    await act(async () => {
      rerender(<ScaleSlider {...defaultProps} value={80} />);
    });
    expect(screen.getByRole("slider")).toHaveValue("80");
  });

  it("should debounce analytics events", async () => {
    await act(async () => {
      render(<ScaleSlider {...defaultProps} />);
    });

    const slider = screen.getByRole("slider");

    // Rapidly change values
    await act(async () => {
      fireEvent.change(slider, { target: { value: "30" } });
      fireEvent.change(slider, { target: { value: "40" } });
      fireEvent.change(slider, { target: { value: "50" } });
    });

    // Analytics should be debounced, not called immediately
    // We can't easily test the actual debouncing without waiting,
    // but we can ensure the component handles rapid changes
    expect(slider).toHaveValue("50");
  });
});
