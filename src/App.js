import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import ImageSlider from "./components/ImageSlider";
function App() {
  return (
      <div className="App">
          <Navbar />
          <ImageSlider />
          <Header />
        <div className="container">
          <MainContent />
        </div>
        <Footer />
      </div>
  );
}

export default App;
