import React from 'react';
import type { Quotation, StyleOptions } from '../types';

interface QuotationPreviewProps {
  quotation: Quotation;
  subtotal: number;
  taxAmount: number;
  total: number;
  styleOptions: StyleOptions;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const getTextColorForBackground = (hexcolor: string): 'text-gray-900' | 'text-white' => {
    if (!hexcolor) return 'text-gray-900';
    try {
        const color = hexcolor.startsWith('#') ? hexcolor.substring(1, 7) : hexcolor;
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'text-gray-900' : 'text-white';
    } catch (e) {
        return 'text-gray-900';
    }
};

export const QuotationPreview: React.FC<QuotationPreviewProps> = ({ quotation, subtotal, taxAmount, total, styleOptions }) => {
    const pageTextColor = getTextColorForBackground(styleOptions.backgroundColor);
    const accentTextColor = getTextColorForBackground(styleOptions.accentColor);
    
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
        <div 
            id="quotation-preview" 
            className={`a4-preview relative ${pageTextColor} ${styleOptions.fontSize}`} 
            style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                margin: 'auto', 
                backgroundColor: styleOptions.backgroundColor, 
                fontFamily: styleOptions.fontFamily 
            }}
        >
            <div className="p-12">
                {/* Header */}
                <header className="flex justify-between items-start pb-8" style={{ borderBottom: `2px solid ${styleOptions.accentColor}` }}>
                    <div className="w-2/3">
                        <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ color: styleOptions.accentColor }}>{quotation.company.name}</h1>
                        <p className="mt-2">{quotation.company.address}</p>
                        <p>{quotation.company.phone} | {quotation.company.email}</p>
                    </div>
                    {quotation.company.logo && (
                        <div className="w-1/3 flex justify-end">
                            <img src={quotation.company.logo} alt="Company Logo" className="max-h-24 object-contain"/>
                        </div>
                    )}
                </header>

                {/* Sub-header */}
                <section className="flex justify-between items-start mt-8">
                    <div>
                        <h3 className="font-bold text-gray-500 dark:text-gray-400">QUOTATION FOR:</h3>
                        <p className="font-bold text-lg mt-1">{quotation.client.name}</p>
                        <p>{quotation.client.address}</p>
                        <p>{quotation.client.phone} | {quotation.client.email}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold uppercase" style={{ color: pageTextColor === 'text-white' ? '#FFFFFF' : '#374151' }}>Quotation</h2>
                        <table className="mt-2">
                            <tbody>
                                <tr>
                                    <td className="font-bold pr-4">Quotation #:</td>
                                    <td>{quotation.quotationNumber}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold pr-4">Date:</td>
                                    <td>{quotation.date}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold pr-4">Valid Until:</td>
                                    <td>{quotation.validUntil}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Line Items Table */}
                <section className="mt-10">
                    <table className="w-full">
                        <thead style={{ backgroundColor: styleOptions.accentColor }} className={accentTextColor}>
                            <tr>
                                <th className="text-left font-bold p-2 uppercase tracking-wider w-1/2">Description</th>
                                <th className="text-center font-bold p-2 uppercase tracking-wider">Qty</th>
                                <th className="text-right font-bold p-2 uppercase tracking-wider">Unit Price</th>
                                <th className="text-right font-bold p-2 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotation.lineItems.map(item => (
                                <tr key={item.id} className="border-b" style={{ borderColor: 'rgba(128, 128, 128, 0.3)' }}>
                                    <td className="p-2 align-top">{item.description}</td>
                                    <td className="text-center p-2 align-top">{item.quantity}</td>
                                    <td className="text-right p-2 align-top">{formatCurrency(item.unitPrice)}</td>
                                    <td className="text-right p-2 align-top">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Totals */}
                <section className="flex justify-end mt-6">
                    <div className="w-1/2 sm:w-1/3">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="font-bold pr-4 py-1">Subtotal:</td>
                                    <td className="text-right py-1">{formatCurrency(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold pr-4 py-1">Tax ({quotation.taxRate}%):</td>
                                    <td className="text-right py-1">{formatCurrency(taxAmount)}</td>
                                </tr>
                                <tr className="border-t-2" style={{ borderColor: styleOptions.accentColor }}>
                                    <td className="font-bold text-lg pr-4 py-2">TOTAL:</td>
                                    <td className="text-right font-bold text-lg py-2">{formatCurrency(total)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Notes */}
                <section className="mt-10 pb-24"> {/* Added padding bottom to avoid overlap with footer */}
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-2">NOTES / TERMS & CONDITIONS</h3>
                    <p className="text-xs whitespace-pre-wrap">{quotation.notes}</p>
                </section>
                
                {/* Footer */}
                <footer className="absolute bottom-12 left-12 right-12 pt-4 border-t text-center text-xs text-gray-500 dark:text-gray-400" style={{ borderColor: 'rgba(128, 128, 128, 0.3)' }}>
                    <p>If you have any questions concerning this quotation, contact {quotation.company.name} at {quotation.company.phone}.</p>
                    <p className="font-bold mt-2">Thank you for your business!</p>
                </footer>
            </div>
        </div>
    </div>
  );
};
