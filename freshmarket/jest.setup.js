import '@testing-library/jest-dom';

// Mock Next.js <Image /> so tests don’t need its optimization pipeline
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Forward all props to a standard img
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));