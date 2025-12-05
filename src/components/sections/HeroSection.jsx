
import React, { useState, useEffect } from 'react';
import { FiPlay, FiInfo, FiVolume2, FiVolumeX } from 'react-icons/fi';
import '../../styles/HeroSection.css'; 

const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

const YOUTUBE_EMBED_BASE_URL = 'https://www.youtube.com/embed/';

const HeroSection = ({ movie }) => {
    const [trailerKey, setTrailerKey] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isTrailerLoading, setIsTrailerLoading] = useState(true);
    const [ageRatingText, setAgeRatingText] = useState('N/A');
    
    if (!movie) {
        return null; // Jika tidak ada data movie, jangan render apa-apa
    }

    const title = movie.title || movie.name || movie.original_name || 'Judul Tidak Diketahui';
    const overview = movie.overview || 'Deskripsi tidak tersedia.';
    const imageUrl = `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path || movie.poster_path}`;
    
    
    // Fungsi dummy (palsu) untuk interaksi
    const handleStart = () => console.log('Mulai menonton...');
    const handleMoreInfo = () => console.log('Lihat informasi selengkapnya...');
    
    const handleToggleMute = () => {
        setIsMuted(!isMuted);
        console.log('Toggle Mute...');
    };


    useEffect(() => {
        if (!movie || !movie.id) return; // Hentikan jika data film belum ada
        
        const fetchTrailer = async () => {
            setIsTrailerLoading(true);

            try {
                // Panggil endpoint backend dengan ID film
                const url = `http://localhost:3001/api/movie-details/${movie.id}`;
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setTrailerKey(data.trailerKey); // Simpan key YouTube
                    setAgeRatingText(data.ageRating || 'N/A');
                } else {
                    console.log("Trailer tidak ditemukan untuk film ini.");
                    setTrailerKey(null);
                }
            } catch (error) {
                console.error("Gagal mengambil trailer:", error);
                setTrailerKey(null);

            } finally {
                setIsTrailerLoading(false);
            }
        };

        fetchTrailer();
    }, [movie]);


    const videoEmbedUrl = trailerKey 
        ? `${YOUTUBE_EMBED_BASE_URL}${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&rel=0`
        : null;

    return (
        <div className="hero-section">
            
            {/* 💡 KONDISI 1: Tampilkan Video Latar Belakang */}
            {isTrailerLoading && <div className="loading-placeholder">Memuat Trailer...</div>}

            <img 
                src={imageUrl} 
                alt={title} 
                className="hero-backdrop hero-poster-overlay" // 💡 CLASS BARU
            />
            
            {videoEmbedUrl && !isTrailerLoading ? (
                <iframe
                    key={trailerKey + isMuted} 
                    src={videoEmbedUrl}
                    title={`${title} Trailer`}
                    className="hero-backdrop hero-video-layer" // 💡 CLASS BARU
                    frameBorder="0"
                    allow="autoplay; encrypted-media; gyroscope;"
                    allowFullScreen
                />
            ) : (
                 // 2b. Fallback Gambar saat Trailer tidak Ditemukan/Loading
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="hero-backdrop" 
                />
            )}
            
            <div className="hero-overlay"></div>

            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">{title}</h1>
                    <p className="hero-overview">{overview}</p>

                    <div className="hero-actions">
                        <button className="btn-play" onClick={handleStart}>
                            <FiPlay size={20} /> Mulai
                        </button>
                        <button className="btn-info" onClick={handleMoreInfo}>
                            <FiInfo size={20} /> Selengkapnya
                        </button>
                        <span className="age-rating">{ageRatingText}</span>
                    </div>
                </div>

                <button className="btn-mute" onClick={handleToggleMute}>
                    {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
                </button>
            </div>

        </div>
    );
};

export default HeroSection;