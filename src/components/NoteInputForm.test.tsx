import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteInputForm } from "./NoteInputForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("NoteInputForm", () => {
  it("shows an accessible error when submitted without notes", async () => {
    const user = userEvent.setup();

    render(<NoteInputForm />);

    await user.click(
      screen.getByRole("button", { name: /generate flashcards/i }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /paste some notes first/i,
    );

    expect(pushMock).not.toHaveBeenCalled();
  });
});