import React from 'react';
import './QRCodeModal.css';

const QRCodeModal = ({ qrData, onClose }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrData.qrCode;
    link.download = `${qrData.restaurant.name}_QR.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${qrData.restaurant.name} - QR Kod</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              max-width: 400px; 
              margin: 0 auto; 
            }
            .qr-code { 
              width: 300px; 
              height: 300px; 
            }
            h1 { 
              color: #333; 
              margin-bottom: 20px; 
            }
            p { 
              color: #666; 
              margin: 10px 0; 
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>${qrData.restaurant.name}</h1>
            <img src="${qrData.qrCode}" alt="QR Kod" class="qr-code" />
            <p>Menümüzü görüntülemek için QR kodu okutun</p>
            <p>${qrData.menuUrl}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="modal-overlay">
      <div className="qr-modal">
        <div className="modal-header">
          <h2>QR Kod - {qrData.restaurant.name}</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="qr-content">
          <div className="qr-display">
            <img src={qrData.qrCode} alt="QR Kod" className="qr-code-image" />
          </div>

          <div className="qr-info">
            <p><strong>Menü URL:</strong></p>
            <div className="url-display">
              {qrData.menuUrl}
            </div>
            
            <p className="qr-instructions">
              Müşteriler bu QR kodu okuttuktan sonra doğrudan {qrData.restaurant.name} menüsüne yönlendirilecektir.
            </p>
          </div>

          <div className="qr-actions">
            <button onClick={handleDownload} className="btn btn-primary">
              📥 İndir
            </button>
            <button onClick={handlePrint} className="btn btn-secondary">
              🖨️ Yazdır
            </button>
            <button onClick={onClose} className="btn btn-outline">
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;