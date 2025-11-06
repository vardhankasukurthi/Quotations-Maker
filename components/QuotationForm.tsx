import React from 'react';
import type { Quotation, LineItem, StyleOptions } from '../types';
import { PlusIcon, TrashIcon, PaintBrushIcon } from './Icons';

interface QuotationFormProps {
  quotation: Quotation;
  setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;
  styleOptions: StyleOptions;
  setStyleOptions: React.Dispatch<React.SetStateAction<StyleOptions>>;
}

const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; name: string; }> = ({ label, value, onChange, type = 'text', name }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string; rows?: number; }> = ({ label, value, onChange, name, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);


export const QuotationForm: React.FC<QuotationFormProps> = ({ quotation, setQuotation, styleOptions, setStyleOptions }) => {
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuotation(prev => ({ ...prev, company: { ...prev.company, [e.target.name]: e.target.value } }));
  };
  
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuotation(prev => ({ ...prev, client: { ...prev.client, [e.target.name]: e.target.value } }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setQuotation(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuotation(prev => ({ ...prev, notes: e.target.value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setQuotation(prev => ({ ...prev, company: { ...prev.company, logo: event.target?.result as string } }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLineItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string) => {
    const updatedLineItems = [...quotation.lineItems];
    const item = updatedLineItems[index];
    if (field === 'quantity' || field === 'unitPrice') {
        (item[field] as number) = parseFloat(value) || 0;
    } else {
        (item[field] as string) = value;
    }
    setQuotation(prev => ({ ...prev, lineItems: updatedLineItems }));
  };

  const addLineItem = () => {
    setQuotation(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: `${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeLineItem = (index: number) => {
    const updatedLineItems = quotation.lineItems.filter((_, i) => i !== index);
    setQuotation(prev => ({ ...prev, lineItems: updatedLineItems }));
  };
  
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setStyleOptions(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {/* Company Details */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Company Details</h2>
        <InputField label="Company Name" name="name" value={quotation.company.name} onChange={handleCompanyChange} />
        <InputField label="Address" name="address" value={quotation.company.address} onChange={handleCompanyChange} />
        <InputField label="Phone" name="phone" value={quotation.company.phone} onChange={handleCompanyChange} />
        <InputField label="Email" name="email" value={quotation.company.email} onChange={handleCompanyChange} type="email" />
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Company Logo</label>
          <input type="file" id="logo" name="logo" onChange={handleLogoChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
      </div>

      {/* Client Details */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-800">Client Details</h2>
        <InputField label="Client Name" name="name" value={quotation.client.name} onChange={handleClientChange} />
        <InputField label="Address" name="address" value={quotation.client.address} onChange={handleClientChange} />
        <InputField label="Phone" name="phone" value={quotation.client.phone} onChange={handleClientChange} />
        <InputField label="Email" name="email" value={quotation.client.email} onChange={handleClientChange} type="email" />
      </div>

      {/* Quotation Details */}
      <div className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800">Quotation Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Quotation #" name="quotationNumber" value={quotation.quotationNumber} onChange={handleDetailsChange} />
            <InputField label="Date" name="date" value={quotation.date} onChange={handleDetailsChange} type="date" />
            <InputField label="Valid Until" name="validUntil" value={quotation.validUntil} onChange={handleDetailsChange} type="date" />
            <InputField label="Tax Rate (%)" name="taxRate" value={quotation.taxRate} onChange={handleDetailsChange} type="number" />
          </div>
      </div>
      
      {/* Line Items */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Line Items</h2>
        <div className="space-y-4">
          {quotation.lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-md border">
              <div className="col-span-12 sm:col-span-5">
                <label className="text-xs text-gray-500">Description</label>
                <input type="text" value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="text-xs text-gray-500">Qty</label>
                <input type="number" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="text-xs text-gray-500">Unit Price (₹)</label>
                <input type="number" value={item.unitPrice} onChange={e => handleLineItemChange(index, 'unitPrice', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
              </div>
              <div className="col-span-4 sm:col-span-2 flex items-end">
                <button onClick={() => removeLineItem(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addLineItem} className="mt-4 flex items-center gap-2 text-blue-600 font-semibold py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
          <PlusIcon /> Add Item
        </button>
      </div>

      {/* Appearance */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-semibold text-gray-800 w-full mb-2 flex items-center gap-2">
          <PaintBrushIcon /> Appearance
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">Page Background</label>
            <input type="color" id="backgroundColor" name="backgroundColor" value={styleOptions.backgroundColor} onChange={handleStyleChange} className="mt-1 block w-full h-10 px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">Accent Color</label>
            <input type="color" id="accentColor" name="accentColor" value={styleOptions.accentColor} onChange={handleStyleChange} className="mt-1 block w-full h-10 px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
        </div>
        <div>
          <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">Font Family</label>
          <select id="fontFamily" name="fontFamily" value={styleOptions.fontFamily} onChange={handleStyleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="'Tinos', serif">Tinos (Serif)</option>
            <option value="'Roboto', sans-serif">Roboto (Sans-serif)</option>
            <option value="'Lato', sans-serif">Lato (Sans-serif)</option>
            <option value="'Merriweather', serif">Merriweather (Serif)</option>
          </select>
        </div>
        <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size</label>
            <select id="fontSize" name="fontSize" value={styleOptions.fontSize} onChange={handleStyleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="text-xs">Small</option>
                <option value="text-sm">Medium</option>
                <option value="text-base">Large</option>
            </select>
        </div>
      </fieldset>

      {/* Notes */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">Notes / Terms & Conditions</h2>
        <TextAreaField label="" name="notes" value={quotation.notes} onChange={handleNotesChange} rows={6} />
      </div>
    </div>
  );
};
