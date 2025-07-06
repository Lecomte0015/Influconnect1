import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ type = 'photo', userId, onUploadSuccess, children }) => {
  const [message, setMessage] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setMessage('');

    const token = localStorage.getItem('token'); // 🔐 récupère ton token JWT ici
    if (!token) {
      setMessage("Authentification requise");
      return;
    }

    const formData = new FormData();
    const fieldname = type === 'covers' ? 'cover_image' : type === 'logo' ? 'logo' : 'photo';

    formData.append(fieldname, file);
    formData.append('type', type);
    formData.append('userId', userId);

    fetch('http://localhost:3001/api/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}` 
      },
      body: formData,
    })
      .then(res => {
        if (res.status === 401) {
          setMessage("Non autorisé : reconnecte-toi.");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.files?.length > 0) {
          const uploadedUrl = data.files[0].url;
          setMessage('Image uploadée avec succès !');
          if (onUploadSuccess) onUploadSuccess(uploadedUrl);
        } else if (data) {
          setMessage("Erreur lors de l'upload");
        }
      })
      .catch(err => {
        console.error('Erreur:', err);
        setMessage("Erreur lors de l'upload");
      });
  }, [type, userId, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const containerClass =
    type === 'cover' ? 'image-preview wide' : 'profile-circle';

  return (
    <div className="image-uploader">
      <div {...getRootProps()} className={containerClass}>
        <input {...getInputProps()} />
        {children ? children({ isDragActive }) : (
          <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>
            {isDragActive ? 'Dépose ici...' : `Clique ou glisse une image (${type})`}
          </p>
        )}
      </div>

      {message && (
        <p className="upload-message" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#06a3ba' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
