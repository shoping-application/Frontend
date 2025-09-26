import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import store , { persistor } from "../redux/store/store.js"; 
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  //  <Provider store={store}>
  //   <App />
  // </Provider>,
  <Provider store={store}>
    <PersistGate  persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
