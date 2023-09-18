import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { customRender } from '../../testing/customRender';
import { disableLogger } from '../../testing/disableLogger';
import App from './App';

disableLogger();

describe('the App component', () => {
  it('should render without erroring', () => {
    expect(() => customRender(<App />)).not.toThrow();
  });

  it('should show and then tear down loading message', () => {
    const { queryByTestId, store } = customRender(<App />);
    expect(queryByTestId('loading')).toBeInTheDocument();
    act(() => store.markLoadComplete());
    expect(queryByTestId('loading')).not.toBeInTheDocument();
  });
});
