// src/components/common/DetailModal.jsx - PERBAIKAN
import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, FiPlay, FiPlus, FiThumbsUp, FiChevronDown,
  FiShare2, FiVolumeX, FiVolume2, FiCheck, FiClock,
  FiUsers, FiCalendar, FiStar, FiGlobe, FiFilm,
  FiTv, FiCreditCard, FiDollarSign, FiMapPin
} from 'react-icons/fi';
import '../../styles/DetailModal.css';

const TMDB_DETAIL_BASE_URL = 'http://localhost:3001/api/movie-details/';
const TMDB_TV_DETAIL_BASE_URL = 'http://localhost:3001/api/tv-details/';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const DetailModal = ({ data, onClose }) => {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isInMyList, setIsInMyList] = useState(false);
    
    const modalRef = useRef(null);

    // Format durasi
    const formatRuntime = (minutes) => {
        if (!minutes || minutes < 1) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0 && mins > 0) return `${hours}j ${mins}m`;
        if (hours > 0) return `${hours}j`;
        return `${mins}m`;
    };

    // Format angka
    const formatNumber = (num) => {
        if (!num) return 'N/A';
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Format mata uang
    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Deteksi apakah ini series
    const isSeries = () => {
        if (data.isSeries !== undefined) return data.isSeries;
        if (details?.tvDetails) return true; // Jika ada tvDetails, ini series
        if (details?.movieDetails?.name) return true; // Jika ada 'name' bukan 'title'
        return false;
    };

    // Fetch data
    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                let url;
                let isTVSeries = data.isSeries;
                
                // Coba endpoint TV series jika isSeries true
                if (isTVSeries) {
                    url = `${TMDB_TV_DETAIL_BASE_URL}${data.id}`;
                } else {
                    url = `${TMDB_DETAIL_BASE_URL}${data.id}`;
                }
                
                console.log('Fetching from:', url);
                const response = await fetch(url);
                
                if (!response.ok) {
                    // Fallback: jika TV endpoint gagal, coba movie endpoint
                    if (isTVSeries) {
                        console.log('TV endpoint failed, trying movie endpoint...');
                        url = `${TMDB_DETAIL_BASE_URL}${data.id}`;
                        const fallbackResponse = await fetch(url);
                        if (!fallbackResponse.ok) {
                            throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
                        }
                        const fallbackData = await fallbackResponse.json();
                        setDetails(fallbackData);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    const result = await response.json();
                    console.log('Data received:', result);
                    setDetails(result);
                }
                
            } catch (err) {
                console.error("Error fetching details:", err);
                setError(`Gagal mengambil detail: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (data.id) {
            fetchDetails();
        } else {
            setError("ID tidak tersedia");
            setIsLoading(false);
        }
    }, [data.id]);

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Debug log untuk melihat struktur data
    useEffect(() => {
        if (details) {
            console.log('📊 Details structure:', details);
            console.log('🎬 Movie details:', details.movieDetails);
            console.log('📺 TV details:', details.tvDetails);
            console.log('🎞️ Trailer key:', details.trailerKey);
            console.log('🔞 Age rating:', details.ageRating);
            if (details.movieDetails) {
                console.log('🏷️ Genres:', details.movieDetails.genres);
            }
            if (details.tvDetails) {
                console.log('🏷️ TV Genres:', details.tvDetails.genres);
            }
        }
    }, [details]);

    if (isLoading) {
        return (
            <div className="modal-backdrop">
                <div className="modal-loading">
                    <div className="loading-spinner"></div>
                    <p>Memuat detail film...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-error">
                    <h3>Terjadi Kesalahan</h3>
                    <p>{error}</p>
                    <button className="btn-close-error" onClick={onClose}>
                        Tutup
                    </button>
                </div>
            </div>
        );
    }

    // Tentukan data utama (movie atau tv)
    const isTV = isSeries();
    const mainData = isTV ? details.tvDetails : details.movieDetails;
    
    if (!mainData) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-error">
                    <p>Data tidak ditemukan</p>
                    <button onClick={onClose}>Tutup</button>
                </div>
            </div>
        );
    }

    // Data untuk render - DENGAN VALIDASI
    const backdropUrl = mainData.backdrop_path 
        ? `${TMDB_IMAGE_BASE_URL}/original${mainData.backdrop_path}`
        : mainData.poster_path
        ? `${TMDB_IMAGE_BASE_URL}/original${mainData.poster_path}`
        : 'https://via.placeholder.com/800x450/333/666?text=No+Image';

    const title = mainData.title || mainData.name || "Judul tidak tersedia";
    const rating = mainData.vote_average ? mainData.vote_average.toFixed(1) : null;
    const runtime = formatRuntime(mainData.runtime || mainData.episode_run_time?.[0]);
    const genres = mainData.genres ? mainData.genres.slice(0, 5).map(g => g.name) : ["Genre tidak tersedia"];
    const releaseYear = mainData.release_date ? mainData.release_date.split('-')[0] : 
                       mainData.first_air_date ? mainData.first_air_date.split('-')[0] : 'N/A';
    
    // Info cast & crew
    const mainCast = mainData.credits?.cast?.slice(0, 6) || [];
    const director = mainData.credits?.crew?.find(c => c.job === 'Director')?.name;
    const creators = mainData.created_by?.map(c => c.name).join(', ') || 
                    mainData.credits?.crew?.filter(c => c.job === 'Creator').map(c => c.name).join(', ');
    
    // Info tambahan
    const overview = mainData.overview || "Tidak ada sinopsis tersedia.";
    const tagline = mainData.tagline || null;
    const originalLanguage = mainData.original_language ? 
                           mainData.original_language.toUpperCase() : 'N/A';
    const status = mainData.status || 'N/A';
    const budget = mainData.budget;
    const revenue = mainData.revenue;
    const productionCompanies = mainData.production_companies?.slice(0, 3).map(p => p.name) || [];
    
    // Info khusus series
    const episodeCount = mainData.number_of_episodes;
    const seasonCount = mainData.number_of_seasons;
    const episodeRuntime = mainData.episode_run_time?.[0] ? 
                         `${mainData.episode_run_time[0]}m per episode` : null;

    // Age rating dari response utama
    const ageRating = details.ageRating && details.ageRating !== 'N/A' ? details.ageRating : 'N/A';

    return (
        <div className="modal-backdrop">
            <div className="detail-modal-card" ref={modalRef}>
                
                {/* HEADER */}
                <div 
                    className="modal-header" 
                    style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${backdropUrl})` }}
                >
                    <div className="header-overlay">
                        <button className="modal-close-btn" onClick={onClose}>
                            <FiX size={24} />
                        </button>
                        
                        <div className="header-controls">
                            {details.trailerKey && (
                                <button 
                                    className="volume-btn"
                                    onClick={() => setIsMuted(!isMuted)}
                                    title={isMuted ? "Unmute trailer" : "Mute trailer"}
                                >
                                    {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="header-info">
                        <h1 className="modal-title">{title}</h1>
                        
                        {tagline && (
                            <p className="tagline">{tagline}</p>
                        )}
                        
                        {/* METADATA ROW LENGKAP */}
                        <div className="metadata-row">
                            {/* Rating */}
                            {rating && (
                                <div className="rating-container">
                                    <FiStar className="star-icon" />
                                    <span className="rating-value">{rating}/10</span>
                                </div>
                            )}
                            
                            {/* Tahun + Durasi/Episode */}
                            <div className="year-runtime">
                                <span className="year-runtime-item">
                                    <FiCalendar size={16} />
                                    {releaseYear}
                                </span>
                                
                                {isTV ? (
                                    <>
                                        {episodeCount && (
                                            <span className="year-runtime-item">
                                                <FiTv size={16} />
                                                {episodeCount} Episode
                                            </span>
                                        )}
                                        {episodeRuntime && (
                                            <span className="year-runtime-item">
                                                <FiClock size={16} />
                                                {episodeRuntime}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    runtime && (
                                        <span className="year-runtime-item">
                                            <FiClock size={16} />
                                            {runtime}
                                        </span>
                                    )
                                )}
                            </div>
                            
                            {/* Age Rating */}
                            {ageRating && ageRating !== 'N/A' && (
                                <span className="age-rating-badge">{ageRating}</span>
                            )}
                            
                            {/* HD Badge */}
                            <span className="hd-badge">HD</span>
                        </div>
                        
                        {/* GENRE TAGS - INI YANG PERLU DIPERBAIKI */}
                        <div className="genre-section">
                            <div className="genre-tags-container">
                                {genres.map((genre, idx) => (
                                    <span key={idx} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BODY */}
                <div className="modal-body">
                    {/* ACTION BUTTONS */}
                    <div className="action-buttons">
                        <button className="btn-play">
                            <FiPlay size={22} /> Putar
                        </button>
                        
                        {details.trailerKey && (
                            <button className="btn-play-secondary">
                                <FiPlay size={20} /> Putar Trailer
                            </button>
                        )}
                        
                        <div className="secondary-actions">
                            <button 
                                className={`icon-btn ${isInMyList ? 'active' : ''}`}
                                onClick={() => setIsInMyList(!isInMyList)}
                                title={isInMyList ? "Hapus dari Daftar Saya" : "Tambahkan ke Daftar Saya"}
                            >
                                {isInMyList ? <FiCheck size={20} /> : <FiPlus size={20} />}
                            </button>
                            
                            <button className="icon-btn" title="Suka">
                                <FiThumbsUp size={20} />
                            </button>
                            
                            <button className="icon-btn" title="Bagikan">
                                <FiShare2 size={20} />
                            </button>
                            
                            <button className="icon-btn" title="Info lebih lanjut">
                                <FiChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    {/* SINOPSIS */}
                    <div className="overview-section">
                        <h3>Sinopsis</h3>
                        <p className="overview-text">{overview}</p>
                    </div>

                    {/* DETAILED INFO - Grid Layout */}
                    <div className="detailed-info">
                        <div className="info-column">
                            <h4>Info {isTV ? 'Series' : 'Film'}</h4>
                            
                            {isTV ? (
                                <>
                                    {creators && (
                                        <div className="info-item">
                                            <span className="info-label">Dibuat oleh:</span>
                                            <span className="info-value">{creators}</span>
                                        </div>
                                    )}
                                    {seasonCount && (
                                        <div className="info-item">
                                            <span className="info-label">Season:</span>
                                            <span className="info-value">{seasonCount}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {director && (
                                        <div className="info-item">
                                            <span className="info-label">Sutradara:</span>
                                            <span className="info-value">{director}</span>
                                        </div>
                                    )}
                                    {budget > 0 && (
                                        <div className="info-item">
                                            <span className="info-label">Budget:</span>
                                            <span className="info-value">{formatCurrency(budget)}</span>
                                        </div>
                                    )}
                                    {revenue > 0 && (
                                        <div className="info-item">
                                            <span className="info-label">Pendapatan:</span>
                                            <span className="info-value">{formatCurrency(revenue)}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            <div className="info-item">
                                <span className="info-label">Status:</span>
                                <span className="info-value">{status}</span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Bahasa:</span>
                                <span className="info-value">{originalLanguage}</span>
                            </div>
                        </div>
                        
                        <div className="info-column">
                            <h4>Produksi</h4>
                            
                            {productionCompanies.length > 0 && (
                                <div className="info-item">
                                    <span className="info-label">Studio:</span>
                                    <span className="info-value">{productionCompanies.join(', ')}</span>
                                </div>
                            )}
                            
                            {mainData.production_countries?.length > 0 && (
                                <div className="info-item">
                                    <span className="info-label">Negara:</span>
                                    <span className="info-value">
                                        {mainData.production_countries.map(c => c.name).join(', ')}
                                    </span>
                                </div>
                            )}
                            
                            {mainData.spoken_languages?.length > 0 && (
                                <div className="info-item">
                                    <span className="info-label">Bahasa:</span>
                                    <span className="info-value">
                                        {mainData.spoken_languages.map(l => l.english_name).join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CAST SECTION */}
                    {mainCast.length > 0 && (
                        <div className="cast-section">
                            <h4>Pemeran Utama</h4>
                            <div className="cast-grid">
                                {mainCast.map(actor => (
                                    <div key={actor.id} className="cast-card">
                                        {actor.profile_path ? (
                                            <img 
                                                src={`${TMDB_IMAGE_BASE_URL}/w185${actor.profile_path}`} 
                                                alt={actor.name}
                                                className="cast-image"
                                            />
                                        ) : (
                                            <div className="cast-image placeholder">
                                                <FiUsers size={40} />
                                            </div>
                                        )}
                                        <div className="cast-info">
                                            <div className="cast-name">{actor.name}</div>
                                            <div className="cast-character">{actor.character}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TRAILER SECTION */}
                    {details.trailerKey ? (
                        <div className="trailer-section">
                            <h4>Trailer</h4>
                            <div className="trailer-embed">
                                <iframe
                                    src={`https://www.youtube.com/embed/${details.trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
                                    title={`${title} trailer`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="trailer-section">
                            <h4>Trailer</h4>
                            <div className="trailer-fallback">
                                <p>Tidak ada trailer tersedia</p>
                            </div>
                        </div>
                    )}

                    {/* RECOMMENDATIONS SECTION */}
                    {mainData.recommendations?.results?.length > 0 && (
                        <div className="recommendations-section">
                            <h4>Rekomendasi Lainnya</h4>
                            <div className="recommendations-grid">
                                <p className="coming-soon">Fitur rekomendasi akan segera hadir</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailModal;