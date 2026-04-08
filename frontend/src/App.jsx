import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LogIn from './pages/LogInPage';
import SignUp from './pages/SignUpPage';
import ForgotPassword from './pages/ForgotPasswordPage';
import ResetPassword from './pages/ResetPasswordPage';
import MainPage from './pages/mainPage';
import ViewCart from './pages/viewCartPage';
import RankingsPage from './pages/globalRankingsPage';
import AIAssistant from './pages/AskAIPage';
import AboutBook from './pages/aboutBook';
import SearchResults from './pages/searchResults';
import Layout from './components/layout';
import AddReview from './pages/addReview';
import CheckoutPage from './pages/checkoutPage';
import ConfirmationPage from './pages/confirmationPage';

export default function App() {
  return(
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<MainPage />} />
            <Route path='/aboutBook' element={<AboutBook />} />
            <Route path='/ViewCart' element={<ViewCart />} />
            <Route path='/Rankings' element={<RankingsPage />} />
            <Route path='/AIAssistant' element={<AIAssistant />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='/addreview' element={<AddReview />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/confirmation' element={<ConfirmationPage />} />
        </Route>
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot' element={<ForgotPassword />} />
        <Route path='/reset' element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}