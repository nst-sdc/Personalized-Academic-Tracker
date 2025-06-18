import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/signup.jsx";
import Signin from "./pages/Signin/signin.jsx";
import { Link } from 'react-router-dom';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        {/* Other routes */}
      </Routes>
    </Router>
    </>
  )
}

export default App;
