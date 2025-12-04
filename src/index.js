import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from "./store"
import {Provider} from "react-redux"
import {BrowserRouter} from "react-router-dom"
import {CssBaseLine, Container} from "@mui/material";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <Provider store={store}>
   
    <BrowserRouter>
     
     <Container  maxWidth ="lg" sx={{mt:4}}>
            <App />
     </Container>
       
    </BrowserRouter>
   </Provider>
   
  
);


