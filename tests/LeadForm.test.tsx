import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { LeadForm } from "@/components/LeadForm";

describe("LeadForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      } as Response)
    );
  });

  it("renders services tab by default with services fields visible", () => {
    render(<LeadForm />);
    expect(
      screen.getByRole("tab", { name: /services inquiry/i })
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("group", { name: /who is the care for/i })
    ).toBeInTheDocument();
  });

  it("switches to employment tab and shows employment-only fields", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("tab", { name: /work with us/i }));
    expect(screen.getByLabelText(/position \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/years of experience/i)).toBeInTheDocument();
  });

  it("renders submit buttons with type='submit' so the form actually submits", () => {
    // Regression guard: the Button component defaults to type='button',
    // which previously meant clicking the submit button did nothing.
    render(<LeadForm />);
    const servicesBtn = screen.getByRole("button", {
      name: /request info/i,
    }) as HTMLButtonElement;
    expect(servicesBtn.type).toBe("submit");
  });

  it("shows validation errors when submitting an empty services form", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("button", { name: /request info/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    // Fetch should not have been called with invalid data
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits a valid employment form and shows position-specific thank-you", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("tab", { name: /work with us/i }));

    await user.type(screen.getByLabelText(/full name \*/i), "Maria Lopez");
    await user.type(screen.getByLabelText(/phone \*/i), "(281) 555-0200");
    await user.type(screen.getByLabelText(/email \*/i), "maria@example.com");
    await user.selectOptions(screen.getByLabelText(/position \*/i), "rn");
    await user.selectOptions(
      screen.getByLabelText(/years of experience \*/i),
      "5-10"
    );

    await user.click(screen.getByRole("button", { name: /submit inquiry/i }));

    expect(
      await screen.findByText(/review your application/i)
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/lead",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const body = JSON.parse(fetchCall?.[1]?.body as string);
    expect(body).toMatchObject({
      type: "employment",
      name: "Maria Lopez",
      position: "rn",
      yearsExperience: "5-10",
    });
  });

  it("disables submit button while submitting", async () => {
    // Make fetch hang forever so we can observe the pending state
    global.fetch = vi.fn(() => new Promise<Response>(() => {}));
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("tab", { name: /work with us/i }));

    await user.type(screen.getByLabelText(/full name \*/i), "Test User");
    await user.type(screen.getByLabelText(/phone \*/i), "2815550100");
    await user.type(screen.getByLabelText(/email \*/i), "t@example.com");
    await user.selectOptions(screen.getByLabelText(/position \*/i), "rn");
    await user.selectOptions(
      screen.getByLabelText(/years of experience \*/i),
      "1-3"
    );

    const btn = screen.getByRole("button", {
      name: /submit inquiry/i,
    }) as HTMLButtonElement;
    await user.click(btn);

    // After click, button should show "Sending…" and be disabled
    const sendingBtn = (await screen.findByRole("button", {
      name: /sending/i,
    })) as HTMLButtonElement;
    expect(sendingBtn.disabled).toBe(true);
  });
});

// Helper keeps linter happy if `within` import becomes unused during trimming
void within;
