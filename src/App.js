import React from 'react';
import './App.css';
import Header from './Components/Header/header';
import { AuthProvider } from './Contexts/AuthContext/authContext';
function App() {
  return (
    <div className="App">
       <AuthProvider>
       <Header/>
       </AuthProvider>
  
    </div>
  );
}

export default App;
