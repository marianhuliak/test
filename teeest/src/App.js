import logo from './logo.svg';
import './App.css';

import ListOfHomeworks from './components/ListOfHomeworks';
import ListOfActivities from './components/ListOfActivities';

function App() {
  return (
    <div className="App">
      <ListOfActivities />
      <ListOfHomeworks />
    </div>
  );
}

export default App;
