import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');

const TMDB_API_KEY = "28fdb6b0f1212b3aa15e0d6f13194377"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// Middleware to enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Endpoint to fetch detail video trailer from TMDB
app.get('/api/movie-details/:movieId', async (req, res) => {
    const movieId = req.params.movieId;

    if (!movieId) {
        return res.status(400).json({ message: 'Movie ID wajib disertakan.' });
    }

    try {
        const videoUrl = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
        const videoResponse = fetch(videoUrl);

        const releaseUrl = `${TMDB_BASE_URL}/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`;
        const releaseResponse = fetch(releaseUrl);

        const detailUrl = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations`;
        const detailResponse = fetch(detailUrl);

        const [videoRes, releaseRes, detailRes] = await Promise.all([videoResponse, releaseResponse, detailResponse]);

        

        if (!videoRes.ok || !releaseRes.ok || !detailRes.ok) {
            return res.status(videoRes.status || releaseRes.status || detailRes.status).json({ message: `Gagal memuat data dari TMDB.` });
        }

        const videoData = await videoRes.json();
        const releaseData = await releaseRes.json();
        const detailData = await detailRes.json();

        const mainTrailer = videoData.results.find(
            video => video.site === "YouTube" && video.type === "Trailer"
        );


        const usReleases = releaseData.results.find(r => r.iso_3166_1 === 'US');
        const certification = usReleases 
            ? usReleases.release_dates[0].certification // Ambil sertifikasi pertama
            : 'N/A';

        if (mainTrailer) {
            res.status(200).json({ 
                trailerKey: mainTrailer.key,
                ageRating: certification,
                movieDetails: detailData
             });
        } else {
            res.status(404).json({ message: 'Trailer utama tidak ditemukan.' });
        }


    } catch (error) {
        console.error(`Gagal mengambil data video untuk ID ${movieId}:`, error.message);
        res.status(500).json({ message: 'Terjadi kesalahan internal saat memproses video.' });
    }
});


// Endpoint to fetch trending movies from TMDB
app.get('/api/trending', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ message: 'API Key TMDB belum dikonfigurasi di backend.' });
    }
    
    try {
        // Memanggil TMDB API untuk mendapatkan data film trending
        const url = `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
             // Error handling jika response tidak OK
            throw new Error(`TMDB API returned status: ${response.status}`);
        }

        const data = await response.json();
        
        // Kirim data film kembali ke frontend
        res.status(200).json(data.results);

    } catch (error) {
        console.error("Gagal mengambil data film dari TMDB:", error.message);
        res.status(500).json({ message: 'Gagal memuat data film dari server eksternal.' });
    }
});

// Endpoint to fetch top rated movies from TMDB
app.get('/api/top-rated', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`TMDB status: ${response.status}`);
        
        const data = await response.json();
        res.status(200).json(data.results); // Kirim array film
    } catch (error) {
        res.status(500).json({ message: 'Gagal memuat film Top Rated.' });
    }
});

// Endpoint to fetch upcoming movies from TMDB
app.get('/api/upcoming', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`TMDB status: ${response.status}`);
        
        const data = await response.json();
        res.status(200).json(data.results); // Kirim array film
    } catch (error) {
        res.status(500).json({ message: 'Gagal memuat film Akan Datang.' });
    }
});

// Endpoint to fetch popular TV series from TMDB
app.get('/api/popular-tv', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`TMDB status: ${response.status}`);
        
        const data = await response.json();
        res.status(200).json(data.results); // Kirim array series
    } catch (error) {
        res.status(500).json({ message: 'Gagal memuat Serial TV Populer.' });
    }
});


// Tambahkan di backend server.js
app.get('/api/tv-details/:tvId', async (req, res) => {
    const tvId = req.params.tvId;

    if (!tvId) {
        return res.status(400).json({ message: 'TV ID wajib disertakan.' });
    }

    try {
        const videoUrl = `${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}`;
        const detailUrl = `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations`;
        
        const [videoRes, detailRes] = await Promise.all([
            fetch(videoUrl),
            fetch(detailUrl)
        ]);

        if (!videoRes.ok || !detailRes.ok) {
            return res.status(videoRes.status || detailRes.status).json({ 
                message: `Gagal memuat data TV series dari TMDB.` 
            });
        }

        const videoData = await videoRes.json();
        const detailData = await detailRes.json();

        const mainTrailer = videoData.results.find(
            video => video.site === "YouTube" && video.type === "Trailer"
        );

        res.status(200).json({ 
            trailerKey: mainTrailer ? mainTrailer.key : null,
            tvDetails: detailData
        });

    } catch (error) {
        console.error(`Gagal mengambil data TV series untuk ID ${tvId}:`, error.message);
        res.status(500).json({ message: 'Terjadi kesalahan internal.' });
    }
});



// API endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error.' });
        }

        let users = [];
        try {
            users = JSON.parse(data); // Membaca data user yang sudah ada
        } catch (parseErr) {
            console.error('Error parsing users.json:', parseErr);
            users = []; //jika error parsing, anggap file kosong
        }

        const newUser = { username, password };
        users.push(newUser);

        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to users.json:', writeErr);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            res.status(201).json({ 
                message: 'User registered successfully.',
                user: { username: newUser.username } 
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing users.json:', parseErr);
            users = []; //jika error parsing, anggap file kosong
        }

        const userFound = users.find(u => u.username === username && u.password === password);

        if (userFound) {
            res.status(200).json({ 
                message: 'Login successful.',
                user: { username: userFound.username }
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});