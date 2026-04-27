import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock next/image
jest.mock("next/image", () => {
  const MockImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
  MockImage.displayName = "MockImage";
  return MockImage;
});

import { useSession } from "next-auth/react";

describe("Home Page", () => {
  it("renders snapshot", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it("renders HOME heading", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Home />);
    expect(screen.getByText("HOME")).toBeInTheDocument();
  });

  it("renders login link when not logged in", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Home />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders user info when logged in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Admin", email: "admin@test.com", role: "admin", image: null } },
    });
    render(<Home />);
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
