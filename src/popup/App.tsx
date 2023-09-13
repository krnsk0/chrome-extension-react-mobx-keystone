import { observer } from 'mobx-react-lite';
import './App.css'
import { useStore } from '../common/store/useStore';


const App = observer(() => {
  const root = useStore();


  return (
    <div>
      <button onClick={() => {}}>{root.displayableState}</button>
    </div>
  )
})

export default App
