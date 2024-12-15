import React from 'react'; // React kütüphanesini içeri aktarır
import './styles.css'; // CSS dosyasını içeri aktarır
import Table from './Components/Table'; // Table bileşenini içeri aktarır
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // React Router bileşenlerini içeri aktarır

// Ana uygulama bileşeni
const App = () => {
  return (
    <Router> {/* Router bileşenini başlatır, uygulamanın yönlendirmelerini yönetir */}
      <div className="app-container"> {/* Ana kapsayıcı div */}
        <h1>Rick and Morty Character List</h1> {/* Başlık kısmı */}
        <Routes> {/* Yönlendirmeleri tanımlar */}
          {/* Ana sayfada Table bileşenini göster */}
          <Route path="/" element={<Table />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; // App bileşenini dışa aktarır