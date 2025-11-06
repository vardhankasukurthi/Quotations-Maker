
import React, { useState, useEffect, useCallback } from 'react';
import { QuotationForm } from './components/QuotationForm';
import { QuotationPreview } from './components/QuotationPreview';
import type { Quotation, StyleOptions } from './types';
import { DownloadIcon } from './components/Icons';

// Access jspdf and html2canvas from the window object
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [quotation, setQuotation] = useState<Quotation>({
    company: { name: 'Your Company', address: '123 Business Rd, Suite 100, City, State 54321', phone: '(123) 456-7890', email: 'contact@yourcompany.com', logo: null },
    client: { name: 'Client Name', address: '456 Client Ave, Apt 2, City, State 12345', phone: '(987) 654-3210', email: 'client@email.com' },
    quotationNumber: `QUO-${new Date().getFullYear()}-001`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    lineItems: [
      { id: '1', description: 'Website Design & Development', quantity: 1, unitPrice: 2500 },
      { id: '2', description: 'Hosting (1 Year)', quantity: 1, unitPrice: 300 },
    ],
    taxRate: 8,
    notes: `Thank you for your business.

Terms & Conditions:
1. All payments are due within 15 days of the invoice date.
2. A deposit of 50% is required before any work begins.
3. This quotation is valid for a period of 30 days from the date of issue.`
  });

  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    backgroundColor: '#ffffff',
    accentColor: '#2563eb', // a nice blue
    fontFamily: "'Tinos', serif",
    fontSize: 'text-sm',
  });

  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateTotals = useCallback(() => {
    const newSubtotal = quotation.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const newTaxAmount = newSubtotal * (quotation.taxRate / 100);
    const newTotal = newSubtotal + newTaxAmount;
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotal(newTotal);
  }, [quotation.lineItems, quotation.taxRate]);
  
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleDownload = async () => {
    setIsGenerating(true);
    const previewElement = document.getElementById('quotation-preview');
    if (!previewElement) {
      console.error("Preview element not found");
      setIsGenerating(false);
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      
      // Render the entire preview element to a single, high-resolution canvas
      const canvas = await window.html2canvas(previewElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: styleOptions.backgroundColor,
      });

      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const totalCanvasHeight = canvas.height;
      
      // Calculate the height of one A4 page in canvas pixels based on A4 aspect ratio
      const pageCanvasHeight = (canvasWidth * pdfHeight) / pdfWidth;
      
      // Calculate the number of pages required
      const totalPages = Math.ceil(totalCanvasHeight / pageCanvasHeight);

      // Loop through each page, slice the main canvas, and add it to the PDF
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Create a temporary canvas for the current page's content
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = pageCanvasHeight;
        const pageCtx = pageCanvas.getContext('2d');

        if (pageCtx) {
           // Slicing the main canvas to get the content for the current page.
           // The y-coordinate on the source canvas is i * pageCanvasHeight.
           // We draw this slice onto the top (0,0) of our temporary pageCanvas.
           pageCtx.drawImage(canvas, 0, i * pageCanvasHeight, canvasWidth, pageCanvasHeight, 0, 0, canvasWidth, pageCanvasHeight);

           const imgData = pageCanvas.toDataURL('image/png');
           pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
      }

      pdf.save(`Quotation-${quotation.quotationNumber}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Quotation Generator</h1>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <DownloadIcon />
                Download PDF
              </>
            )}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <QuotationForm quotation={quotation} setQuotation={setQuotation} styleOptions={styleOptions} setStyleOptions={setStyleOptions} />
        </div>
        <div className="lg:col-span-3">
          <div className="sticky top-8">
             <QuotationPreview 
              quotation={quotation}
              subtotal={subtotal}
              taxAmount={taxAmount}
              total={total}
              styleOptions={styleOptions}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
