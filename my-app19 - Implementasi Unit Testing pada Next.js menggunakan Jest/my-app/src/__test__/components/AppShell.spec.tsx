import { render, screen } from "@testing-library/react";
import AppShell from "@/components/layouts/Appshell/index";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock Navbar
jest.mock("../../components/layouts/Navbar/index", () => {
  const MockNavbar = () => <div data-testid="navbar">Navbar</div>;
  MockNavbar.displayName = "MockNavbar";
  return MockNavbar;
});

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Roboto: () => ({ className: "roboto" }),
}));

import { useRouter } from "next/router";

describe("AppShell Component", () => {
  it("renders children", () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: "/" });
    render(<AppShell><p>Test Content</p></AppShell>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders Navbar on non-auth pages", () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: "/" });
    render(<AppShell><p>Content</p></AppShell>);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("hides Navbar on login page", () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: "/auth/login" });
    render(<AppShell><p>Login Content</p></AppShell>);
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("renders Footer on non-auth pages", () => {
    (useRouter as jest.Mock).mockReturnValue({ pathname: "/" });
    render(<AppShell><p>Content</p></AppShell>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
