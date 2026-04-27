import { render, screen } from "@testing-library/react";
import ProdukPage from "@/pages/produk/index";

// Mock Next Router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/produk",
    query: {},
    asPath: "/produk",
  }),
}));

// Mock Next Link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock SWR
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from "swr";

describe("Produk Page", () => {
  it("renders loading state", () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: undefined });
    render(<ProdukPage />);
    expect(screen.getByText("Loading produk...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: { message: "Failed" } });
    render(<ProdukPage />);
    expect(screen.getByText(/Gagal memuat data/i)).toBeInTheDocument();
  });

  it("renders produk list", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: [
        { id: "1", name: "Produk A", price: "100000", category: "Kategori A", size: "M", image: "" },
      ],
      error: undefined,
    });
    render(<ProdukPage />);
    expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
    expect(screen.getByText("Produk A")).toBeInTheDocument();
  });
});
