import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store,{persistor} from './store/Redux-Store.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '18px'
          }}>
            Loading workflows...
          </div>
        }
        persistor={persistor}
      >
      <App />
      </PersistGate>
    </Provider>
  
  </StrictMode>,
)
