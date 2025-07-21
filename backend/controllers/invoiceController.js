const db = require('../db');
const path = require('path');
const fs = require('fs');

exports.getUserInvoices = async (req, res) => {
  console.log(" getUserInvoices () appelé");
  console.log("user reçu :", req.user);
  const userId = req.user.id;
  try {
    const [rows] = await db.promise().execute(
      'SELECT id, amount, status, pdf_path, hosted_invoice_url, created_at FROM invoices WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur getUserInvoices :', err);
    console.error('Erreur récupération factures :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadInvoice = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;
  const serviceId = req.body.service_id;
  const receiver_id = req.body.receiver_id; 

  if (!file || !serviceId || !receiver_id) {
    return res.status(400).json({ error: 'Fichier, service_id ou receiver_id manquant' });
  }

  try {
    const pdfPath = `/invoices/${file.filename}`;
    const hostedUrl = `http://localhost:3001${pdfPath}`;
    const amount = 0;
    const status = 'pending';
    const createdAt = new Date();

    
    await db.promise().execute(
      `INSERT INTO invoices (user_id, service_id, amount, status, pdf_path, created_at, hosted_invoice_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, serviceId, amount, status, pdfPath, createdAt, hostedUrl]
    );

    
    await db.promise().execute(
      `INSERT INTO Messages (sender_id, receiver_id, content, type, file_url, file_name, is_read, created_at)
       VALUES (?, ?, ?, 'file', ?, ?, false, ?)`,
      [userId, receiver_id, `${file.originalname}`, hostedUrl, file.originalname, createdAt]
    );

    res.status(201).json({ message: 'Fichier enregistré', url: hostedUrl });
  } catch (err) {
    console.error('Erreur uploadInvoice :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

