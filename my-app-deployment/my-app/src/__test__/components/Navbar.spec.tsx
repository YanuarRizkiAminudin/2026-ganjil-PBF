import { render, screen } from "@testing-library/react";
import Navbar from "@/components/layouts/Navbar/index";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
}));

// Mock next/script
jest.mock("next/script", () => {
  const MockScript = () => null;
  MockScript.displayName = "MockScript";
  return MockScript;
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

describe("Navbar Component", () => {
  it("renders snapshot", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    const { container } = render(<Navbar />);
    expect(container).toMatchSnapshot();
  });

  it("renders Login button when not logged in", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Navbar />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders welcome message when logged in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { fullname: "Admin", image: null } },
    });
    render(<Navbar />);
    expect(screen.getByTestId("welcome")).toBeInTheDocument();
    expect(screen.getByTestId("welcome").textContent).toBe("Welcome, Admin");
  });
});
