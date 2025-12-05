import React, { useRef } from 'react';
import { FiStar } from 'react-icons/fi'; 
import '../../styles/FilmRow.css'; 

const TMDB_POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const FilmCard = ({ movie, onClick }) => {
    const cardRef = useRef(null);


    if (!movie || !movie.poster_path) return null;

    const imageUrl = `${TMDB_POSTER_BASE_URL}${movie.poster_path}`;
    const rating = (movie.vote_average / 2).toFixed(1);

    const handleClick = () => {
        console.log('FilmCard clicked, movie object:', movie); // ✅ DEBUG
        console.log('Movie ID to send:', movie.id); // ✅ DEBUG
        
        if (!movie.id) {
            console.error('ERROR: Movie has no ID!', movie);
            return;
        }
        
        const rect = cardRef.current.getBoundingClientRect();
        
        const cardPosition = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
        };
        
        onClick({
            id: movie.id,
            isSeries: movie.media_type === 'tv' || movie.name,
            movieData: movie, // ✅ TAMBAHKAN INI
            position: cardPosition
        });
    };

    return (
        <div className="film-card" ref={cardRef} onClick={handleClick}>
            <img 
                src={imageUrl} 
                alt={movie.title || movie.name} 
                className="film-poster" 
            />
            
            {/* Overlay Informasi (Muncul saat hover di desain Anda) */}
            <div className="card-info-overlay">
                <p className="card-title">{movie.title || movie.name}</p>
                <div className="card-rating">
                    <FiStar size={14} className="star-icon" />
                    <span>{rating} / 5</span>
                </div>
            </div>
            
            {/* Label Top 10/Episode Baru akan ditambahkan dengan conditional rendering di CSS */}

        </div>
    );
};

export default FilmCard;