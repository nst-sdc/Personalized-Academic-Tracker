import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/Signup.jsx";
import { Link } from 'react-router-dom';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        {/* Other routes */}
      </Routes>
    </Router>
    </>
  )
}

export default App;
