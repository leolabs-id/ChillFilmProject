// src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Dashboard.css';
import Navbar from './common/Navbar'; 
import Footer from './common/Footer';
import HeroSection from './sections/HeroSection';
import FilmRow from './common/FilmRow';
import LandscapeCard from './common/LandscapeCard';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import DetailModal from './common/DetailModal';




const TMDB_INTERNAL_TRENDING_URL = 'http://localhost:3001/api/trending';

const TMDB_URLS = {
    trending: 'http://localhost:3001/api/trending',
    topRated: 'http://localhost:3001/api/top-rated',
    upcoming: 'http://localhost:3001/api/upcoming',
    popularTV: 'http://localhost:3001/api/popular-tv'
};

const Dashboard = ({ setIsLoggedIn, setIsDashboardLoading }) => {

  const [dataCatalog, setDataCatalog] = useState({
    trending: null,
    topRated: null,
    upcoming: null,
    popularTV: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);

  const handleCardClick = (data) => {
      console.log('Card clicked with FULL data:', data);
      console.log('Movie ID:', data.id);
      if (!data.id) {
        console.error('ERROR: No movie ID in clicked data!');
        return;
      } else if (data.movieData) {
          setModalData({
              id: data.id,
              isSeries: data.isSeries,
              movieData: data.movieData, // Simpan data lengkap
              position: data.position
          });
      } else {
          setModalData(data);
      }
  };

  const closeModal = () => {
      setModalData(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const fetchAllData = async () => {
      setIsLoading(true); 
        setError(null);    

        try {
            // Ambil respons dari semua endpoint secara paralel
            const responses = await Promise.all([
                fetch(TMDB_URLS.trending),
                fetch(TMDB_URLS.topRated),
                fetch(TMDB_URLS.upcoming),
                fetch(TMDB_URLS.popularTV)
            ]);

            // Cek status OK untuk semua respons
            for (const response of responses) {
                if (!response.ok) {
                    throw new Error(`Gagal memuat data dari backend. Status: ${response.status}`);
                }
            }
            
            // Parse semua respons JSON secara paralel
            const [
                trendingData, 
                topRatedData, 
                upcomingData, 
                tvData
            ] = await Promise.all(responses.map(response => response.json()));

            // Simpan semua hasil ke dalam satu state object
            setDataCatalog({
                trending: trendingData, 
                topRated: topRatedData,
                upcoming: upcomingData,
                popularTV: tvData
            });

        } catch (err) {
            console.error("Gagal mengambil data katalog:", err);
            setError(err.message || "Gagal memuat semua film. Cek koneksi backend Anda."); 

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!isLoading && !error) {
            setTimeout(() => {
              setIsDashboardLoading(false); 
            }, 500);
        }
    }, [isLoading, error, setIsDashboardLoading]);

    useEffect(() => {
    if (modalData) {
            console.log('ModalData set to:', modalData);
            console.log('Will fetch from:', `http://localhost:3001/api/movie-details/${modalData.id}`);
        }
    }, [modalData]);
  
    const trendingMovie = 
      dataCatalog.trending && dataCatalog.trending.length > 0 
      ? dataCatalog.trending[2] // 💡 Ambil film pertama dari array Trending
      : null;

    console.log("Is Loading:", isLoading);
    console.log("Trending Movie Data:", trendingMovie);

    const landscapeScrollRef = useRef(null); 

    // 💡 FUNGSI SCROLL (Dipanggil oleh tombol)
    const scrollLandscape = (scrollOffset) => {
        if (landscapeScrollRef.current) {
            landscapeScrollRef.current.scrollLeft += scrollOffset;
        }
    };  
  
  return (
    
    <div className="dashboard-main">  
      <Navbar handleLogout={handleLogout} />
        {isLoading && <p>Memuat...</p>}
        {error && <p>Error: {error}</p>}

        {!isLoading && trendingMovie && (
          <HeroSection movie={trendingMovie} />
        )}

      <main className="dashboard-content-area">

        {!isLoading && dataCatalog.trending && (
          <section className="film-rows-wrapper">
            <h2 className="row-title-special">Melanjutkan Tonton Film</h2>
              <div className="film-row-wrapper">
                <button 
                  className="scroll-btn scroll-btn-left" 
                  onClick={() => scrollLandscape(-300)}
                >
                  <FiArrowLeft size={24} />
                </button>
                <div className="landscape-row-scroll" ref={landscapeScrollRef}>
                  {dataCatalog.trending.slice(0, 5).map(movie => (
                    <LandscapeCard key={`cont-${movie.id}`} movie={movie} onClick={handleCardClick} />
                  ))}
                </div>
                <button 
                  className="scroll-btn scroll-btn-right" 
                  onClick={() => scrollLandscape(300)}
                >
                  <FiArrowRight size={24} />
                </button>
              </div>
                  
              <FilmRow 
                title="TV Populer Hari Ini" 
                movies={dataCatalog.popularTV} 
                onClick={handleCardClick}
              />
              <FilmRow
                title="Top Rating Film dan Series Hari Ini" 
                movies={dataCatalog.topRated} 
                onClick={handleCardClick}
              />
                  
              <FilmRow 
                title="Film Trending" 
                movies={dataCatalog.trending} 
                onClick={handleCardClick}
              />
              <FilmRow 
                title="Rilis Baru" 
                movies={dataCatalog.upcoming} 
                onClick={handleCardClick}
              />
                    
                
            </section>
          )}
        </main>
      <Footer />

      {modalData && (
        <DetailModal 
          data={modalData} 
          onClose={closeModal}
        />
      )}
    </div>
    
  );
};

export default Dashboard;