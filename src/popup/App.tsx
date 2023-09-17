import { observer } from 'mobx-react-lite';
import { useStore } from '../common/store/useStore';
import './App.css';

const App = observer(() => {
  const root = useStore();

  return (
    <div>
      <button onClick={() => root.toggleActivation()}>
        {root.displayableState}
      </button>
    </div>
  );
});

export default App;
