import React from 'react';
import './App.css';
import Header from './Components/Header/header';
import { AuthProvider } from './Contexts/AuthContext/authContext';
import Main from './Components/Main/main';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import store from './Redux/store';

function App() {
  return (
    <div className="App">
      <SnackbarProvider  maxSnack={2} autoHideDuration={3000}>
        <AuthProvider>
          <Provider store={store}>
            <Header/>
            <Main/>
          </Provider>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;