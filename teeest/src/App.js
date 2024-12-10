import "./App.css";

import AssignHomework from "./components/AssignHomework";
import ListOfStudents from "./components/ListOfStudents";
import ListOfActivities from "./components/ListOfActivities";
import ListOfHomeworks from "./components/ListOfHomeworks";
import ReviewHomework from "./components/ReviewHomework";

function App() {
  return (
    <div className="App">
      <ReviewHomework />
      <AssignHomework />
      <ListOfHomeworks />
      <ListOfStudents />
      <ListOfActivities />
      
      
    </div>
  );
}

export default App;
