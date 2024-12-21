import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Send GET request to the servlet
    axios.get('http://localhost:8080/cat201project_war_exploded/hello-servlet')
      .then((res) => {
        setResponse(res.data);  // Update state with the response from the servlet
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Servlet Response:</h1>
      <p>{response}</p>
    </div>
  );
}

export default App;
