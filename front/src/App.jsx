import ChatOperator from "./Components/ChatOperators";
import { NavLink, Route, Routes } from "react-router";
import "./App.css";
import IncidentMap from "./Components/IncidentMap";
function App() {
  return (
    <div className="container">
      <header>
        <h2>Helpers</h2>
        <ul>
          <li>
            <NavLink to="/chat">Чат</NavLink>
          </li>
          <li>
            <NavLink to="/map">Инциденты</NavLink>
          </li>
        </ul>
      </header>
      <Routes>
        <Route path="/chat/" element={<ChatOperator />} />
        <Route path="/map/" element={<IncidentMap />} />
      </Routes>
    </div>
  );
}

export default App;
