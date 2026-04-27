import { render, screen } from "@testing-library/react";
import About from "@/pages/about/index";

describe("About Page", () => {
  it("renders without crashing (snapshot)", () => {
    const { container } = render(<About />);
    expect(container).toMatchSnapshot();
  });

  it("renders heading text", () => {
    render(<About />);
    expect(screen.getByText("Tentang Kami")).toBeInTheDocument();
  });

  it("renders title with correct text using getByTestId", () => {
    render(<About />);
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("title").textContent).toBe("Tentang Kami");
  });
});
