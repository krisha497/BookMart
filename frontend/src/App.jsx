import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import MainPage from './pages/mainPage';
import ViewCart from './pages/viewCartPage';
import RankingsPage from './pages/globalRankingsPage';
import AIAssistant from './pages/AskAIPage';
import AboutBook from './pages/aboutBook';

export default function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/aboutBook' element={<AboutBook />} />
        <Route path='/ViewCart' element={<ViewCart />} />
        <Route path='/Rankings' element={<RankingsPage />} />
        <Route path='/AIAssistant' element={<AIAssistant />} />
      </Routes>
    </Router>
  )
}
