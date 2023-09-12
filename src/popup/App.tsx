import './App.css'

interface Message {
  message: string;
}

const messageAllTabs = async (message: Message) => {
  const tabs = await chrome.tabs.query({});
  return Promise.all(tabs.map(tab => chrome.tabs.sendMessage(tab.id!, message)))
}


function App() {

  const activate = () => {
    messageAllTabs({message: 'hello'});
  }

  return (
    <div>
      <button onClick={activate}>send message</button>
    </div>
  )
}

export default App
