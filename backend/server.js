const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();




const app = express();

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images/users', express.static(path.join(__dirname, 'uploads/avatar')));



app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Connexion MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const computeProfileCompletion = (user) => {
  let score = 0;
  if (user.photo) score += 10;
  if (user.firstname) score += 5;
  if (user.lastname) score += 5;
  if (user.address || user.city || user.country) score += 5;
  if (user.présentation) score += 5;
  if (user.languages && Array.isArray(user.languages) && user.languages.length) score += 3;
  if (user.phone) score += 2;
  if (user.email) score += 2;
  if (user.category) score += 5;
  if (user.experience) score += 3;
  if (user.tags && Array.isArray(user.tags) && user.tags.length) score += 3;
  if (user.website) score += 2;
  if (user.availability) score += 2;

  if (user.instagram || user.tiktok || user.youtube || user.twitter) score += 10;

  const percentage = Math.round((score / 70) * 100);
  const isComplete = score >= 63;
  return { percentage, isComplete };
};


db.connect(err => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    process.exit(1);
  } else {
    console.log("Connexion à MySQL réussie !");
  }
});

// Config nodemailer avec Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

app.post('/api/register', async (req, res) => {
  const { firstname, lastname, email, password, accountType, brand } = req.body;
  const validTypes = ['business', 'influencer'];

  if (!validTypes.includes(accountType)) {
    return res.status(400).json({ error: 'Type d’utilisateur invalide.' });
  }

  try {
    // Vérifier si email existe déjà
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur MySQL' });
      if (results.length > 0) return res.status(400).json({ error: 'Email déjà utilisé' });

      const hash = await bcrypt.hash(password, 10);
      const business_name = accountType === 'business' ? brand : null;

      // Générer token confirmation
      const confirmationToken = generateToken({ email }, '24h');

      db.query(
        `INSERT INTO users (firstname, lastname, email, password, _type, business_name, verified, confirmation_token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstname, lastname, email, hash, accountType, business_name, 0, confirmationToken],
        (err, result) => {
          if (err) {
            console.error("Erreur MySQL :", err);
            return res.status(500).json({ error: 'Erreur MySQL' });
          }

          //  mail de confirmation
          const confirmationUrl = `http://localhost:3000/confirm/${confirmationToken}`;

          const mailOptions = {
            from: '"Mon App" <no-reply@influconnect.com>',
            to: email,
            subject: "Confirme ton inscription",
            html: `<p>Bonjour ${firstName},</p>
                   <p>Merci pour ton inscription. Clique sur ce lien pour valider ton compte :</p>
                   <a href="${confirmationUrl}">${confirmationUrl}</a>
                   <p>Ce lien expire dans 24h.</p>`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Erreur envoi mail :", error);
              return res.status(500).json({ error: 'Erreur envoi mail' });
            }

            console.log("Mail de confirmation envoyé à :", email);
            res.status(201).json({ message: 'Inscription réussie, merci de confirmer ton email.' });
          });
        }
      );
    });

  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: 'Erreur serveur lors de l’inscription.' });
  }
});

app.get('/api/confirm/:token', (req, res) => {
  const { token } = req.params;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      
      return res.redirect('http://localhost:3000/email-invalid');
    }

    const email = decoded.email;

    db.query(
      'UPDATE users SET verified = 1, confirmation_token = NULL WHERE email = ?',
      [email],
      (err, result) => {
        if (err) {
          console.error("Erreur MySQL :", err);
          return res.redirect('http://localhost:3000/email-error');
        }

        if (result.affectedRows === 0) {
          return res.redirect('http://localhost:3000/email-already-confirmed');
        }

        //  Redirige vers la page 
        return res.redirect('http://localhost:3000/email-confirmed');
      }
    );
  });
});


// --- Connexion utilisateur avec JWT 
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).json({ error: 'Erreur MySQL' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email non trouvé' });
    }

    const user = results[0];

    if (user.verified === 0) {
      return res.status(403).json({ error: 'Compte non confirmé. Vérifie ton email.' });
    }

    bcrypt.compare(password, user.password, (err, valid) => {
      if (err || !valid) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      // Ici je genère le token JWT d'accès 
      const accessToken = generateToken({ id: user.id, email: user.email }, '2h');

      res.json({ message: 'Connexion réussie', token: accessToken, user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _type: user._type,
      }});
    });
  });
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};

app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    const { percentage, isComplete } = computeProfileCompletion(user);

    const dashboardData = {
      name: `${user.firstname} ${user.lastname}`,
      role: user._type,
      verified: user.verified === 1,
      followers: Math.floor(Math.random() * 5000),
      profileViews: Math.floor(Math.random() * 10000),
      collaborations: Math.floor(Math.random() * 20),
      rating: (Math.random() * 2 + 3).toFixed(1),
      profileCompletion: percentage,
      is_profile_complete: isComplete
    };

    res.json(dashboardData);
  });
});


app.get('/api/stats/:id', (req, res) => {
  const userId = req.params.id;

  const fakeStats = {
    userId,
    followers: Math.floor(Math.random() * 5000),
    views: Math.floor(Math.random() * 10000),
    collaborations: Math.floor(Math.random() * 50),
    rating: (Math.random() * 2 + 3).toFixed(1)
  };

  res.status(200).json(fakeStats);
});

// Ici je  récupère les marques vérifiées avec filtres et tri
app.get('/api/brands', (req, res) => {
  const { search = '', industry = '', sort = 'name' } = req.query;

  
  const allowedSortFields = {
    name: 'business_name',
    email: 'email',
    created: 'created_at',
  };
  const sortField = allowedSortFields[sort] || 'business_name';

  const sql = `
    SELECT id, business_name, email, business_sector, verified
    FROM users
    WHERE _type = 'business'
      AND verified = 1
      AND business_name LIKE ?
      AND business_sector LIKE ?
    ORDER BY ${sortField} ASC
  `;

  db.query(sql, [`%${search}%`, `%${industry}%`], (err, results) => {
    if (err) {
      console.error('Erreur MySQL dans /api/brands :', err);
      return res.status(500).json({ message: 'Erreur serveur interne.' });
    }
    res.json(results);
  });
});


app.get('/api/sectors', (req, res) => {
  const sql = `
    SELECT DISTINCT business_sector
    FROM users
    WHERE _type = 'business'
      AND business_sector IS NOT NULL
      AND business_sector != ''
    ORDER BY business_sector ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur MySQL dans /api/sectors :', err);
      return res.status(500).json({ message: 'Erreur serveur interne.' });
    }
    
    const sectors = results.map(row => row.business_sector);
    res.json(sectors);
  });
});

app.get('/api/influencers', (req, res) => {
  const { search = '', category = '', sort = 'followers' } = req.query;

  const allowedSortFields = {
    followers: 'total_followers',
    name: 'u.firstname',
    rating: 'u.rating'
  };
  const sortField = allowedSortFields[sort] || 'total_followers';

  const sql = `
    SELECT 
      u.id,
      u.firstname AS name,
      u.lastname,
      CONCAT(u.city, ', ', u.country) AS location,
      u.photo AS image,
      u.cover_image,
      u.présentation AS description,
      u.birthdate,
      u.verified,
      u.tags,
      u.collaborations,
      u.rating,
      u.category,
      u.languages,
      MAX(CASE WHEN sn.name = 'Instagram' THEN sn.url END) AS instagram_url,
      MAX(CASE WHEN sn.name = 'TikTok' THEN sn.url END) AS tiktok_url,
      SUM(sn.followers) AS total_followers
    FROM users u
    LEFT JOIN Social_networks sn ON u.id = sn.user_id
    WHERE 
      u._type = 'influencer'
      AND CONCAT(u.firstname, ' ', u.lastname) LIKE ?
      AND (? = '' OR JSON_CONTAINS(u.tags, JSON_QUOTE(?)))
    GROUP BY u.id
    ORDER BY ${sortField} DESC
  `;

  const searchKeyword = `%${search}%`;

  db.query(sql, [searchKeyword, category, category], (err, results) => {
    if (err) {
      console.error('Erreur dans /api/influencers:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    const formatted = results.map(row => {
      let age = '-';
      if (row.birthdate) {
        const birthYear = new Date(row.birthdate).getFullYear();
        const currentYear = new Date().getFullYear();
        age = currentYear - birthYear;
      }

      return {
        id: row.id,
        name: row.name,
        location: row.location,
        image: row.photo,
        description: row.présentation,
        age,
        verified: row.verified === 1,
        rating: row.rating || 4.0,
        followers: row.total_followers ? row.total_followers + 'K' : '0K',
        engagement: '-', 
        collaborations: row.collaborations ||'-', 
        category: row.category || 'Autre',
        languages: Array.isArray(row.languages)
          ? row.languages
          : JSON.parse(row.languages || '[]'),
        platforms: {
          instagram: row.instagram_url || '',
          tiktok: row.tiktok_url || ''
        }
      };
    });

    res.json(formatted);
  });
});

app.get('/api/influencer-tags', (req, res) => {
  const sql = `
    SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(tags, '$[0]')) AS first_tag
    FROM users
    WHERE _type = 'influencer'
      AND tags IS NOT NULL
      AND JSON_LENGTH(tags) > 0
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur MySQL dans /api/influencer-tags :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    
    const uniqueTags = Array.from(
      new Set(
        results
          .map(row => row.first_tag)
          .filter(tag => tag && tag.trim().length > 0)
      )
    );

    res.json(['Tous', ...uniqueTags]);
  });
});



app.get('/api/influencer/:id', (req, res) => {
  const influencerId = req.params.id;

  const sql = `
    SELECT 
      u.id,
      u.firstname,
      u.lastname,
      u.city,
      u.country,
      u.collaborations,
      u.photo,
      u.cover_image,
      u.présentation,
      u.birthdate,
      u.verified,
      u.tags,
      u.rating,
      sn.name AS platform_name,
      sn.url AS platform_url,
      sn.followers
    FROM users u
    LEFT JOIN Social_networks sn ON u.id = sn.user_id
    WHERE u._type = 'influencer' AND u.id = ?
  `;

  db.query(sql, [influencerId], (err, rows) => {
    if (err) {
      console.error('Erreur dans /api/influencer/:id :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Influenceur non trouvé' });
    }

    const base = rows[0];

   
    const platforms = {};
    rows.forEach(r => {
      if (r.platform_name) {
        const key = r.platform_name.toLowerCase();
        platforms[key] = {
          url: r.platform_url,
          followers: r.followers || 0
        };
      }
    });

    //  Calcul de l’âge
    let age = '-';
    if (base.birthdate) {
      const birth = new Date(base.birthdate);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
    }

   
    res.json({
      id: base.id,
      name: `${base.firstname} ${base.lastname}`,
      location: `${base.city}, ${base.country}`,
      image: base.photo,
      description: base.présentation,
      age,
      collaborations: base.collaborations,
      verified: base.verified === 1,
      rating: base.rating || 4.0,
      tags: Array.isArray(base.tags) ? base.tags : JSON.parse(base.tags || '[]'),
      followers: rows.reduce((sum, r) => sum + (r.followers || 0), 0),
      platforms
    });
  });
});


app.post('/api/favorites', authenticateToken, async  (req, res) => {
  const { influencerId } = req.body;
  const userId = req.user.id; 

  try {
    await db.promise().query(
      'INSERT INTO favorites (user_id, influencer_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id',
      [userId, influencerId]
    );
    res.status(201).json({ message: 'Ajouté aux favoris' });
  } catch (err) {
    console.error('Erreur ajout favoris :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


app.delete('/api/favorites/:influencerId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const influencerId = req.params.influencerId;

  try {
    await db.promise().query(
      'DELETE FROM favorites WHERE user_id = ? AND influencer_id = ?',
      [userId, influencerId]
    );
    res.json({ message: 'Supprimé des favoris' });
  } catch (err) {
    console.error('Erreur suppression favoris :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


app.get('/api/favorites/:influencerId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const influencerId = req.params.influencerId;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM favorites WHERE user_id = ? AND influencer_id = ?',
      [userId, influencerId]
    );

    res.json({ isFavorite: rows.length > 0 });
  } catch (err) {
    console.error('Erreur check favori :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/brands/:id', (req, res) => {
  const brandId = req.params.id;

  const sql = `
  SELECT 
  id, business_name, email, business_sector, website, phone,
  address, city, country, présentation AS description, cover_image, photo,logo
  FROM users
  WHERE _type = 'business' AND id = ?
  `;

  db.query(sql, [brandId], (err, results) => {
    if (err) {
      console.error('Erreur MySQL dans /api/brands/:id :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Marque non trouvée' });
    }

    res.json(results[0]);
  });
});


app.get('/api/brands-full', (req, res) => {
  const { search = '', industry = '', sort = 'name' } = req.query;

  const allowedSortFields = {
    name: 'u.business_name',
    created: 'u.created_at',
    rating: 'u.rating'
  };
  const sortField = allowedSortFields[sort] || 'u.business_name';

  const sql = `
    SELECT 
      u.id,
      u.business_name,
      u.email,
      u.business_sector,
      u.verified,
      u.photo,
      u.logo,
      u.cover_image,
      u.city,
      u.country,
      u.présentation,
      u.rating,
      u.collaborations,
      u.created_at,
      MIN(s.price) AS min_price,
      MAX(s.price) AS max_price
    FROM users u
    LEFT JOIN Services s ON s.business_id = u.id
    WHERE u._type = 'business'
      AND u.verified = 1
      AND u.business_name LIKE ?
      AND u.business_sector LIKE ?
    GROUP BY u.id
    ORDER BY ${sortField} ASC
  `;

  db.query(sql, [`%${search}%`, `%${industry}%`], (err, results) => {
    if (err) {
      console.error('Erreur dans /api/brands-full :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    const formatted = results.map(brand => {
      let budget = 'Non précisé';
      if (brand.min_price && brand.max_price && brand.min_price !== brand.max_price) {
        budget = `Entre ${brand.min_price}€ et ${brand.max_price}€`;
      } else if (brand.min_price) {
        budget = `À partir de ${brand.min_price}€`;
      }
      return { ...brand, budget };
    });

    res.json(formatted);
  });
});


app.patch('/api/user/:id/complete', (req, res) => {
  const userId = parseInt(req.params.id);

  if (userId !== 122) {
    return res.status(403).json({ error: 'Accès refusé à cet ID.' });
  }

  
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la récupération utilisateur' });
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const user = results[0];
    const { isComplete } = computeProfileCompletion(user);

    db.query(
      'UPDATE users SET is_profile_complete = ? WHERE id = ?',
      [isComplete ? 1 : 0, userId],
      (err2) => {
        if (err2) return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        res.json({ message: `Profil ${isComplete ? 'complet' : 'incomplet'} enregistré.` });
      }
    );
  });
});

app.put('/api/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  const {
    firstname,
    lastname,
    photo,
    cover_image,
    logo,
    phone,
    city,
    country,
    présentation,
    tags,
    languages,
    instagram,
    tiktok,
    youtube,
    twitter,
    website
  } = req.body;

  const updateQuery = `
    UPDATE users 
    SET 
      firstname = ?, 
      lastname = ?, 
      photo = ?, 
      cover_image = ?, 
      logo = ?,
      phone = ?,
      city = ?,
      country = ?,
      présentation = ?,
      tags = ?,
      languages = ?
    WHERE id = ?
  `;

  const updateValues = [
    firstname || null,
    lastname || null,
    photo || null,
    cover_image || null,
    logo || null,
    phone || null,
    city || null,
    country || null,
    présentation || null,
    tags ? JSON.stringify(tags): null,
    languages ? JSON.stringify(languages) : null,
    userId
  ];

  db.query(updateQuery, updateValues, (err) => {
    if (err) {
      console.error('Erreur MySQL (users):', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil utilisateur.' });
    }

    // Mise à jour des réseaux sociaux
    const socialNetworks = [];
    if (instagram) socialNetworks.push({ name: 'Instagram', url: instagram });
    if (tiktok)    socialNetworks.push({ name: 'TikTok',    url: tiktok });
    if (youtube)   socialNetworks.push({ name: 'YouTube',   url: youtube });
    if (twitter)   socialNetworks.push({ name: 'Twitter',   url: twitter });
    if (website)   socialNetworks.push({ name: 'Website',   url: website });

    db.query('DELETE FROM social_networks WHERE user_id = ?', [userId], (errDel) => {
      if (errDel) {
        console.error('Erreur suppression social_networks:', errDel);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour des réseaux sociaux.' });
      }

      const now = new Date();
      const insertQueries = socialNetworks.map(({ name, url }) => {
        return new Promise((resolve, reject) => {
          const sql = `
            INSERT INTO social_networks 
              (user_id, name, url, followers, year_of_creation, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          db.query(sql, [
            userId,
            name,
            url,
            0,
            null,
            now,
            now
          ], (errIns) => {
            if (errIns) return reject(errIns);
            resolve();
          });
        });
      });

      Promise.all(insertQueries)
        .then(() => res.json({ message: 'Profil mis à jour avec succès ' }))
        .catch((insertErr) => {
          console.error('Erreur MySQL (social_networks):', insertErr);
          res.status(500).json({ error: 'Erreur lors de la mise à jour des réseaux sociaux.' });
        });
    });
  });
});







const uploadDirs = ['uploads/avatar', 'uploads/covers', 'uploads/logo'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(` Dossier créé : ${dir}`);
  }
});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Seules les images sont autorisées !'), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderMap = {
      avatar: 'avatar',
      photo: 'avatar',
      cover: 'covers',
      cover_image: 'covers',
      logo: 'logo'
    };

    const columnMap = {
      photo: 'photo',
      avatar: 'photo',
      cover: 'cover_image',
      cover_image: 'cover_image',
      logo: 'logo'
    };
    
    const folder = folderMap[file.fieldname] || 'avatar';
    cb(null, path.join(__dirname, 'uploads', folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});


const upload = multer({ storage, fileFilter: imageFileFilter });



app.post('/api/upload-image', authenticateToken, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const userId = req.user.id; 

    const results = [];

    req.files.forEach(file => {
      const field = file.fieldname;
      const folder = field === 'covers' ? 'covers' : field === 'logo' ? 'logo' : 'avatar';
      const imageUrl = `/uploads/${folder}/${file.filename}`;
      const column = field === 'covers' ? 'cover_image' : field === 'logo' ? 'logo' : 'photo';

      
      db.query(`UPDATE users SET ${column} = ? WHERE id = ?`, [imageUrl, userId], (err) => {
        if (err) {
          console.error(`Erreur lors de la mise à jour du champ ${column}:`, err);
          
        }
      });

      results.push({
        fieldname: field,
        filename: file.filename,
        url: imageUrl
      });
    });

    return res.status(200).json({
      message: ' Upload(s) réussi(s)',
      files: results
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur lors de l’upload' });
  }
});




const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});
