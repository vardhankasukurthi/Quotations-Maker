export interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null;
}

export interface Client {
  name:string;
  address: string;
  phone: string;
  email: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quotation {
  company: Company;
  client: Client;
  quotationNumber: string;
  date: string;
  validUntil: string;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
}

export interface StyleOptions {
  backgroundColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: string;
}
