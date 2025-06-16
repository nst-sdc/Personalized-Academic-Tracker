import React, { useEffect, useState } from 'react'

function App() {
  const [msg, setMsg] = useState('');
  
  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then((res) => res.json()) 
      .then((data) => setMsg(data.message)); 
  }, []);

  return (
    <div>
      <h1>Personalized Academic Tracker</h1>
      <p>Server says: {msg}</p>
    </div>
  )
}

export default App;