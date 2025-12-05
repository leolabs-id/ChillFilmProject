
import React from 'react';
import '../../styles/Footer.css'; 

const Footer = () => {
    // Data link footer statis berdasarkan kategori di desain
    const footerData = {
        genre: [
            'Aksi', 'Drama', 'Komedi', 'Sains & Alam',
            'Anak-anak', 'Fantasi Ilmiah & Fantasi', 'Petualangan', 'Thriller',
            'Anime', 'Kejahatan', 'Perang', 'Romantis',
            'Britania', 'K-Drama', 'Musik', 'Horor', 
            'Keluarga', 'Dokumenter', 'Sejarah', 'Tindakan',
        ],
        bantuan: [
            'FAQ', 'Kontak Kami', 'Privasi', 'Syarat & Ketentuan',
            'Tentang Kami', 'Pusat Bantuan', 
        ],
    };
    
    // Fungsi untuk membagi array menjadi beberapa kolom
    const chunkArray = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };
    
    // Membagi array genre dan bantuan menjadi beberapa kolom
    const genreColumns = chunkArray(footerData.genre, 4);
    const bantuanColumns = chunkArray(footerData.bantuan, 3);


    return (
        <footer className="footer-main">
            <div className="footer-content">

                <div className="footer-links-wrapper">

                    <div className="footer-left-info">
                        <img src="/logo-text.svg" alt="CHILL Logo" className="footer-logo" />
                        <p className="copyright-text">
                            &copy; {new Date().getFullYear()} CHILL All Rights Reserved.
                        </p>
                    </div>

                    <div className="footer-right-categories">

                        <div className="category-section genre-section">
                            <h4 className="category-title">Genre</h4>
                            <div className="category-columns">
                                {genreColumns.map((column, colIndex) => (
                                    <ul key={`genre-col-${colIndex}`} className="footer-column-list">
                                        {column.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <a href="#" className="footer-link">{item}</a>
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        </div>

                        <div className="category-section help-section">
                            <h4 className="category-title">Bantuan</h4>
                            <div className="category-columns">
                                {bantuanColumns.map((column, colIndex) => (
                                    <ul key={`help-col-${colIndex}`} className="footer-column-list">
                                        {column.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <a href="#" className="footer-link">{item}</a>
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;