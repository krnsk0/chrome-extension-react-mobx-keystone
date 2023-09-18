import './App.css';

import { observer } from 'mobx-react-lite';

import { useStore } from '../common/store/useStore';

const App = observer(() => {
  const store = useStore();

  if (store.isLoading) {
    return <div data-testid="loading">loading...</div>;
  }

  return <div data-testid="app-wrapper">loaded!</div>;
});

export default App;
