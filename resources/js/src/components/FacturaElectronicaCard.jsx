import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Download, 
  Copy, 
  Check, 
  Eye
} from 'lucide-react';

export default function FacturaElectronicaCard({ 
  facturaData, 
  onViewVoucher,
  isThermalStyle = true,
  isCompact = false 
}) {
  const [copiedCufe, setCopiedCufe] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const facturaRef = useRef(null);

  if (!facturaData) return null;

  const {
    orderId = 'FE-592819',
    orderNumber = '592819',
    cufe = '7b8e3a2f9c1d0e4b8a7c6f5d4e3b2a1c0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c',
    items = [],
    subtotal = 12963,
    discountPercentage = null,
    discountAmount = 0,
    tax = 1037,
    deliveryFee = 0,
    total = 14000,
    paymentMethod = 'Nequi',
    paymentId = 'nequi',
    voucher = null,
    customerName = 'Carlos Mendoza',
    customerPhone = '318 765 4321',
    customerAddress = 'Carrera 4 # 5-20, Centro, Yaguará',
    businessName = 'Asadero & Restaurante 1',
    businessNit = '901.482.910-4',
    businessPhone = '314 406 6458',
    deliveryMode = 'pickup',
    date = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } = facturaData;

  const handleCopyCufe = () => {
    navigator.clipboard?.writeText(cufe);
    setCopiedCufe(true);
    setTimeout(() => setCopiedCufe(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!facturaRef.current) return;
    setIsDownloading(true);
    try {
      const element = facturaRef.current;
      
      const dataUrl = await toPng(element, { 
        quality: 1.0,
        backgroundColor: '#fdfdfd',
        pixelRatio: 2
      });
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const pdfWidth = img.width;
      const pdfHeight = img.height;
      
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura_${orderId}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert(`Hubo un error al descargar el PDF: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`w-full max-w-[280px] mx-auto animate-in zoom-in-95 ${isCompact ? 'scale-90 origin-top mb-[-10%]' : 'my-2'}`}>
      
      {/* Container for the receipt - Thermal Paper Look */}
      <div 
        ref={facturaRef} 
        className="bg-[#fdfdfd] text-gray-800 p-5 shadow-sm relative font-mono text-[10px] leading-tight"
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 20px rgba(0,0,0,0.02)',
          borderTop: '2px dashed #d1d5db',
          borderBottom: '2px dashed #d1d5db'
        }}
      >
        {/* Top Header */}
        <div className="text-center mb-3">
          <div className="flex flex-col items-center justify-center mb-2">
            <img src="/uploads/servigo-icon.png" alt="SERVI-GO" className="h-8 object-contain opacity-90 grayscale" />
            <p className="text-[7px] font-bold tracking-widest mt-0.5">DIRECTORIO LOCAL</p>
          </div>
          <h2 className="font-bold text-sm uppercase mb-1">{businessName}</h2>
          <p>NIT: {businessNit}</p>
          <p>TEL: {businessPhone}</p>
          <p>Yaguará, Huila</p>
          <p className="mt-2 text-gray-400">--------------------------------</p>
        </div>

        {/* Receipt Info */}
        <div className="mb-3 space-y-0.5">
          <div className="flex justify-between">
            <span>FECHA: {date}</span>
            <span>{time}</span>
          </div>
          <div className="flex justify-between">
            <span>CAJA: 01</span>
            <span>TICKET: #{orderNumber}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>CLIENTE:</span>
            <span className="truncate max-w-[130px] text-right">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>TEL:</span>
            <span>{customerPhone}</span>
          </div>
          {deliveryMode === 'delivery' && (
            <div className="flex justify-between mt-1 pt-1 border-t border-dashed border-gray-300">
              <span>DIR:</span>
              <span className="truncate max-w-[140px] text-right">{customerAddress}</span>
            </div>
          )}
          <p className="text-center mt-2 text-gray-400">--------------------------------</p>
        </div>

        {/* Items Table */}
        <div className="mb-3">
          <div className="flex justify-between font-bold mb-1">
            <span className="w-6">CANT</span>
            <span className="flex-1">DESCRIPCION</span>
            <span className="w-16 text-right">TOTAL</span>
          </div>
          <div className="border-b border-dashed border-gray-400 mb-1.5"></div>
          
          {items.map((it, idx) => {
            const qty = it.quantity || 1;
            const lineTotal = it.price * qty;
            return (
              <div key={idx} className="flex justify-between items-start mb-2">
                <span className="w-6">{qty}</span>
                <div className="flex-1 pr-2">
                  <span className="block break-words leading-tight">{it.name}</span>
                  <span className="text-[8px] text-gray-500">${it.price.toLocaleString('es-CO')} c/u</span>
                </div>
                <span className="w-16 text-right">${lineTotal.toLocaleString('es-CO')}</span>
              </div>
            );
          })}
          <div className="border-b border-dashed border-gray-400 mt-2 mb-2"></div>
        </div>

        {/* Totals block */}
        <div className="mb-4 space-y-0.5">
          <div className="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>${subtotal.toLocaleString('es-CO')}</span>
          </div>
          {discountPercentage && discountAmount > 0 && (
            <div className="flex justify-between">
              <span>DSCTO ({discountPercentage}%):</span>
              <span>-${discountAmount.toLocaleString('es-CO')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>IVA (INCL):</span>
            <span>${tax.toLocaleString('es-CO')}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>DOMICILIO:</span>
              <span>${deliveryFee.toLocaleString('es-CO')}</span>
            </div>
          )}
          <div className="flex justify-between text-[13px] font-bold mt-2 pt-1 border-t border-dashed border-gray-400">
            <span>TOTAL:</span>
            <span>${total.toLocaleString('es-CO')}</span>
          </div>
        </div>

        <div className="text-center mb-3">
          <p className="text-gray-400 mb-1">--------------------------------</p>
          <p>PAGO: {paymentMethod.toUpperCase()}</p>
          <p>ESTADO: {paymentId === 'efectivo' ? 'PENDIENTE' : 'PAGADO'}</p>
          <p>TIPO: {deliveryMode === 'delivery' ? 'DOMICILIO' : 'RECOGER'}</p>
          <p className="mt-1 mb-2 text-gray-400">--------------------------------</p>
        </div>

        {/* CUFE / QR Code */}
        <div className="flex flex-col items-center">
          <QRCodeCanvas value={cufe} size={80} />
          <p className="text-[6px] mt-2 text-center w-full break-all text-gray-500">CUFE: {cufe}</p>
          <p className="text-[9px] mt-4 font-bold text-center">¡GRACIAS POR SU COMPRA!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2 font-sans relative z-10 text-xs px-2">
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="flex-1 py-1.5 px-2 rounded-md bg-[#1a1a1e] hover:bg-[#222] border border-white/10 text-white font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
        >
          <Download className="w-3.5 h-3.5" />
          {isDownloading ? '...' : 'PDF'}
        </button>

        <button
          type="button"
          onClick={handleCopyCufe}
          className="py-1.5 px-2 rounded-md bg-[#1a1a1e] hover:bg-[#222] border border-white/10 text-white font-bold transition-colors flex items-center justify-center gap-1 shadow"
        >
          {copiedCufe ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          CUFE
        </button>

        {voucher && (
          <button
            type="button"
            onClick={() => onViewVoucher && onViewVoucher(voucher)}
            className="py-1.5 px-2 rounded-md bg-[#ff6b00] hover:bg-[#ff4500] text-white font-bold transition-colors flex items-center justify-center gap-1 shadow"
          >
            <Eye className="w-3.5 h-3.5" /> Baucher
          </button>
        )}
      </div>

    </div>
  );
}
