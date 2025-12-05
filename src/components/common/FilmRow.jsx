import React, { useRef } from 'react';
import FilmCard from './FilmCard';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import '../../styles/FilmRow.css'; 

const FilmRow = ({ title, movies, onClick }) => {
    const scrollRef = useRef(null); 

    const scroll = (scrollOffset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += scrollOffset;
        }
    };

    if (!movies || !Array.isArray(movies) || movies.length === 0) return null;

    return (
        <div className="film-row-container">
            <h2 className="row-title">{title}</h2>
            
            <div className="film-row-wrapper">
        
                <button 
                    className="scroll-btn scroll-btn-left" 
                    onClick={() => scroll(-300)}
                >
                    <FiArrowLeft size={24} />
                </button>

                <div className="film-row-scroll-area" ref={scrollRef}>
                    {movies.map(movie => (
                        <FilmCard key={movie.id} movie={movie} onClick={onClick} /> 
                    ))}
                </div>

                <button 
                    className="scroll-btn scroll-btn-right" 
                    onClick={() => scroll(300)} 
                >
                    <FiArrowRight size={24} />
                </button>
            </div>

            
        </div>
    );
};

export default FilmRow;