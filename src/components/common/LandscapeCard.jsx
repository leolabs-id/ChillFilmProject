import React, { useState } from 'react';
import { FiPlay, FiStar, FiClock, FiTv } from 'react-icons/fi';
import { FaClosedCaptioning } from 'react-icons/fa';
import '../../styles/FilmRow.css';

const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const LandscapeCard = ({ movie, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    if (!movie || !movie.backdrop_path) return null;

    const imageUrl = `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}`;
    const rating = (movie.vote_average / 2).toFixed(1);
    const progressPercent = (movie.id % 4) * 20 + 20;
    
    // Deteksi apakah ini series atau movie
    const isSeries = movie.media_type === 'tv' || movie.name;
    
    // Data untuk hover details
    const title = movie.title || movie.name || 'Judul tidak tersedia';
    const year = movie.release_date ? movie.release_date.substring(0, 4) : 
                movie.first_air_date ? movie.first_air_date.substring(0, 4) : 'N/A';
    
    // Mock data untuk demo (karena API free tidak punya semua data)
    const genres = ['Action', 'Drama', 'Thriller']; // Mock genres
    const ageRating = movie.adult ? '18+' : '13+'; // Mock age rating
    const duration = isSeries ? 
        `${movie.number_of_episodes || 10} Episode` : 
        `${Math.floor((movie.runtime || 120) / 60)}j ${(movie.runtime || 120) % 60}m`;
    
    const handleClick = () => {
        onClick({
            id: movie.id,
            isSeries: movie.media_type === 'tv' || movie.name,
            movieData: movie,
            position: { x: 0, y: 0, width: 0, height: 0 }
        });
    };

    return (
        <div 
            className={`landscape-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <div className="card-image-wrapper">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="landscape-backdrop" 
                />
                
                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                
                {/* Hover Overlay dengan Detail */}
                <div className="hover-details-overlay">
                    {/* Header Info */}
                    <div className="hover-header">
                        <button className="play-overlay-btn">
                            <FiPlay size={30} />
                        </button>
                        
                        <div className="hover-main-info">
                            <h3 className="hover-title">{title}</h3>
                            
                            {/* Metadata Row */}
                            <div className="hover-metadata">
                                <span className="metadata-item">
                                    <FiStar size={14} /> {rating}
                                </span>
                                
                                <span className="metadata-item">
                                    {isSeries ? <FiTv size={14} /> : <FiClock size={14} />}
                                    {duration}
                                </span>
                                
                                <span className="metadata-item">
                                    <FaClosedCaptioning size={14} />
                                    {ageRating}
                                </span>
                                
                                <span className="metadata-item year">
                                    {year}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Genre Tags */}
                    <div className="hover-genres">
                        {genres.map((genre, idx) => (
                            <span key={idx} className="genre-tag">{genre}</span>
                        ))}
                    </div>
                </div>
                
                {/* Default Content (saat tidak hover) */}
                <div className="default-content">
                    <div className="card-info-lanscape">
                        <p className="card-title">{title}</p>
                        <div className="card-rating-lanscape">
                            <FiStar size={14} className="star-icon" />
                            <span>{rating} / 5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandscapeCard;