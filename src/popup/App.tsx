import './App.css';

import { observer } from 'mobx-react-lite';

import { useStore } from '../common/store/useStore';

const App = observer(() => {
  const root = useStore();

  if (root.isLoading) {
    return <div data-testid="loading">loading...</div>;
  }

  return <div data-testid="app-wrapper">loaded!</div>;
});

export default App;
