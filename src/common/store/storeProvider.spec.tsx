import { describe, it, expect } from 'vitest';
import StoreProvider from './storeProvider';
import { render } from '@testing-library/react';




describe('the StoreProvide', () => {


  it('should pass an instance of the store down to child components', () => {
    const Child = () => <></>;
    const { container } = render(
      <StoreProvider>
        <Child />
      </StoreProvider>
    );
    expect(true).toBe(false);
  });
});
