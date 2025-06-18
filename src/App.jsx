import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/signup.jsx";
import { Link } from 'react-router-dom';
import Navbar from "./Components/Navbar.jsx";


function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        {/* Other routes */}
      </Routes>
    </Router>
    </>
  )
}

export default App;
