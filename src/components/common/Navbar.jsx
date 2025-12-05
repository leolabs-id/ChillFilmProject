// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    FiSearch, FiBell, FiUser, FiMenu, FiX, FiLogOut, FiStar 
} from 'react-icons/fi';
import '../../styles/Navbar.css'; 

const Navbar = ({ handleLogout }) => {
    // State yang dikonsolidasi
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    
    // Ref yang disederhanakan
    const navContainerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchContainerRef = useRef(null);
    
    const navLinks = [
        { name: 'Series', href: '#' },
        { name: 'Film', href: '#' },
        { name: 'Daftar Saya', href: '#' },
    ];

    // Event handlers dengan useCallback untuk optimasi
    const toggleSearch = useCallback(() => {
        setIsSearchOpen(prev => {
            if (prev) {
                setSearchText('');
            }
            return !prev;
        });
        setIsProfileDropdownOpen(false);
    }, []);

    const handleSearchChange = useCallback((event) => {
        setSearchText(event.target.value);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
        setIsProfileDropdownOpen(false);
    }, []);

    const toggleProfileDropdown = useCallback(() => {
        setIsProfileDropdownOpen(prev => !prev);
    }, []);

    // Fungsi untuk menutup semua menu
    const closeAllMenus = useCallback(() => {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
        if (isSearchOpen) {
            setIsSearchOpen(false);
            setSearchText('');
        }
    }, [isMobileMenuOpen, isProfileDropdownOpen, isSearchOpen]);

    // Effect untuk menangani click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Jika klik di dalam navbar, biarkan event handlers yang menangani
            if (navContainerRef.current && navContainerRef.current.contains(event.target)) {
                return;
            }
            
            // Jika klik di luar navbar, tutup semua menu
            closeAllMenus();
        };

        // Hanya tambahkan event listener jika ada menu yang terbuka
        if (isMobileMenuOpen || isProfileDropdownOpen || isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isMobileMenuOpen, isProfileDropdownOpen, isSearchOpen, closeAllMenus]);

    // Effect untuk mencegah scroll saat mobile menu terbuka
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="navbar-main" ref={navContainerRef}>
            <div className="navbar-content">
                {/* Mobile Menu Button */}
                <button 
                    className="nav-icon-btn nav-mobile-btn" 
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                
                {/* Left Section */}
                <div className="nav-left">
                    <img 
                        src="/logo-text.svg" 
                        alt="CHILL Logo" 
                        className="navbar-logo" 
                    />
                    
                    {/* Desktop Navigation Links */}
                    <div className="nav-links-desktop">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className="nav-link"
                                onClick={closeAllMenus}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className="nav-right">
                    {/* Search Container (Desktop) */}
                    <div 
                        className={`search-container ${isSearchOpen ? 'open' : ''}`} 
                        ref={searchContainerRef}
                    >
                        <button 
                            className="nav-icon-btn" 
                            onClick={toggleSearch}
                            aria-label={isSearchOpen ? "Close search" : "Open search"}
                        >
                            <FiSearch size={20} />
                        </button>
                        <input 
                            type="text" 
                            placeholder="What to watch today?" 
                            className="search-input"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                    
                    {/* Notification Bell */}
                    <button 
                        className="nav-icon-btn"
                        aria-label="Notifications"
                    >
                        <FiBell size={20} />
                    </button>
                    
                    {/* Profile Dropdown */}
                    <div className="profile-dropdown" ref={dropdownRef}>
                        <img 
                            src="/default-profile.png" 
                            alt="Profile" 
                            className="profile-avatar" 
                            onClick={toggleProfileDropdown}
                            aria-expanded={isProfileDropdownOpen}
                            aria-haspopup="true"
                        />

                        <div 
                            className={`dropdown-menu ${isProfileDropdownOpen ? 'open' : ''}`}
                            role="menu"
                        >
                            <button className="dropdown-item" role="menuitem">
                                <FiUser size={20} className="profile-icon" />
                                Profil Saya
                            </button>
                            <button className="dropdown-item" role="menuitem">
                                <FiStar size={20} className="profile-icon" />
                                Ubah Premium
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="dropdown-item logout-btn"
                                role="menuitem"
                            >
                                <FiLogOut size={20} className="profile-icon" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Input (Mobile) */}
            <div 
                className={`navbar-search-wrapper ${isSearchOpen ? 'open' : ''}`}
                ref={searchContainerRef}
            >
                <input 
                    type="text" 
                    placeholder="What to watch today?" 
                    className="search-input-mobile"
                    value={searchText} 
                    onChange={handleSearchChange} 
                />
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`nav-mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="nav-mobile-links">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            className="mobile-link"
                            onClick={closeAllMenus}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;