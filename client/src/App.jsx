import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Beranda from './pages/Beranda';
import Admin from './pages/Admin';
import ErrorPage from './pages/ErrorPage';

const Layout = ({ children }) => {
  return (
    <>
      <main className="container">
        {children}
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/403" element={<ErrorPage code={403} />} />
          <Route path="/500" element={<ErrorPage code={500} />} />
          <Route path="*" element={<ErrorPage code={404} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
