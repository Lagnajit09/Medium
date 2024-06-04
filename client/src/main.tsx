import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="140577079580-euoih7me30b9eaj7hpffeuork3vv089k.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
)
