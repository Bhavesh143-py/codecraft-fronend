// Desc: Main App component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUp from './signup/signup';
import Apps from './Apps/Apps';
import CreateApp from './Apps/CreateApp';
import Canvas from './canvas/canvas';
import { useWorkflowStore } from './store/Mystore';
function App() {
  const { selectedWorkflowId } = useWorkflowStore();
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/create-app" element={<CreateApp />} />
          <Route path='/canvas' element={<Canvas/>} />
        </Routes>
      </Router>

    </>
  )
}

export default App
