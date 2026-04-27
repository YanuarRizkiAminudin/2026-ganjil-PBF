import { render, screen } from "@testing-library/react";
import Custom404 from "@/pages/404";

// Mock next/image
jest.mock("next/image", () => {
  const MockImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
  MockImage.displayName = "MockImage";
  return MockImage;
});

describe("404 Page", () => {
  it("renders snapshot", () => {
    const { container } = render(<Custom404 />);
    expect(container).toMatchSnapshot();
  });

  it("renders 404 heading", () => {
    render(<Custom404 />);
    expect(screen.getByText("404 - Halaman Tidak Ditemukan")).toBeInTheDocument();
  });

  it("renders 404 description", () => {
    render(<Custom404 />);
    expect(screen.getByText(/Maaf, halaman yang Anda cari tidak ada/i)).toBeInTheDocument();
  });

  it("renders 404 image", () => {
    render(<Custom404 />);
    expect(screen.getByAltText("404")).toBeInTheDocument();
  });
});
