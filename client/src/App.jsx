import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/Signup.jsx";
import Signin from "./pages/Signin/signin.jsx";
import { Link } from "react-router-dom";
import Navbar from "./Components/navbar.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
