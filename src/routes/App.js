import React, { useEffect, useState } from 'react';
import { Routes } from './index';
import WifiOffIcon from '@material-ui/icons/WifiOff';




function App() {


  const [state, setState] = useState({ isDisconnected: false });

  useEffect(() => {
    try {
      handleConnectionChange();
      window.addEventListener('online', handleConnectionChange);
      window.addEventListener('offline', handleConnectionChange);
      // handleComponentWillMount();
    } catch (error) {
  
    }
  })

  
const handleConnectionChange = () => {
  const condition = navigator.onLine ? 'online' : 'offline';
  if (condition === 'online') {
    const webPing = setInterval(
      () => {
        fetch('//google.com', {
          mode: 'no-cors',
        })
          .then(() => {
            setState({ isDisconnected: false }, () => {
              return clearInterval(webPing)
            });
          }).catch(() => setState({ isDisconnected: true }))
      }, 2000);
    return;
  }

  return setState({ isDisconnected: true });
}


  let { isDisconnected } = state;
  console.log("Working")
  if (isDisconnected === true) {
    return (
      <div style={{ textAlign: 'center', height: "-webkit-fill-available", backgroundColor: 'lightgrey' }}>
        <WifiOffIcon style={{ height: 80, width: 80, marginTop: '16%' }} color="primary" fontSize="large" />
        <p style={{ fontSize: 40 }}>No Internet Connection !</p>
      </div>
    )
  } else {
    return (
      <Routes />
    );

  }
}

export default App;