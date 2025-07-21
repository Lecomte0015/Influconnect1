exports.sendMessage = async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
  
    try {
      await db.promise().execute(`
        INSERT INTO Messages (sender_id, receiver_id, content, is_read, created_at)
        VALUES (?, ?, ?, ?, ?)`,
        [sender_id, receiver_id, content, 0, new Date()]
      );
  
      res.status(201).json({ success: true, message: 'Message enregistré' });
    } catch (err) {
      console.error('Erreur enregistrement message :', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
  