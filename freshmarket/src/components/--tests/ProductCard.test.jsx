import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';

// Mock the SWR-based component so tests stay unit-level & deterministic
jest.mock('../StockLevel', () => ({
  __esModule: true,
  default: ({ productId }) => (
    <span data-testid="stock-mock">Stock mock for {productId}</span>
  ),
}));

const sample = {
  id: 11,
  name: 'Grapes',
  price: 200,
  unit: '500 g',
  image: 'https://wallpaperaccess.com/thumb/1466835.jpg',
  description: 'Seedless grapes.',
};

describe('ProductCard', () => {
  test('renders name, price + unit, image, and stock stub', () => {
    render(<ProductCard product={sample} showStock />);

    // Name
    expect(screen.getByRole('heading', { name: /grapes/i })).toBeInTheDocument();

    // Price + unit text
    expect(screen.getByText(/₹\s*200/i)).toBeInTheDocument();
    expect(screen.getByText(/\(500 g\)/i)).toBeInTheDocument();

    // Image (mocked next/image => <img>)
    const img = screen.getByRole('img', { name: /grapes/i });
    expect(img).toHaveAttribute('src', sample.image);

    // Stock stub is shown when showStock=true
    expect(screen.getByTestId('stock-mock')).toHaveTextContent('11');
  });

  test('links to the product details page', async () => {
    render(<ProductCard product={sample} showStock={false} />);
    const user = userEvent.setup();

    // The whole image is wrapped in a Link to /products/11
    const link = screen.getByRole('link', { name: /grapes/i });
    expect(link).toHaveAttribute('href', `/products/${sample.id}`);

    // (Optional) click it just to ensure it's interactive in the DOM
    await user.click(link);
  });
});