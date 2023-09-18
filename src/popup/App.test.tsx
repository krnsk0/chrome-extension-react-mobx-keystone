import { describe, expect, it } from 'vitest';

import { customRender } from '../../testing/customRender';
import App from './App';

describe('the App component', () => {
  it('should render without erroring', () => {
    expect(() => customRender(<App />)).not.toThrow();
  });

  it('should initially display a loading message', () => {
    const { getByTestId } = customRender(<App />);
    expect(getByTestId('loading')).toBeTruthy();
  });
});