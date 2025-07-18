import React, { useState } from 'react';
import { Building2, Upload, Mail, Phone, Globe, MapPin, User, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CompanyInfo: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [form, setForm] = useState({
    name: state.companyInfo.name || '',
    address: state.companyInfo.address || '',
    email: state.companyInfo.email || '',
    phone: state.companyInfo.phone || '',
    website: state.companyInfo.website || '',
    logo: state.companyInfo.logo,
    owner: state.companyInfo.owner || '',
    city: state.companyInfo.city || '',
    country: state.companyInfo.country || '',
    establishedDate: state.companyInfo.establishedDate || '',
    approvalDate: state.companyInfo.approvalDate || '',
    chamberOfCommerce: state.companyInfo.chamberOfCommerce || '',
    financialYear: state.companyInfo.financialYear || '',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(typeof form.logo === 'string' ? form.logo : null);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, logo: file }));
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setSaved(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_COMPANY_INFO', payload: { ...form, logo: logoPreview || form.logo } });
    setSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Building2 className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner/Contact Person</label>
              <input
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. info@acme.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 123 Main St, City, Country"
                  rows={2}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. www.acme.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Amsterdam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Netherlands"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Established</label>
              <input
                type="date"
                name="establishedDate"
                value={form.establishedDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Date</label>
              <input
                type="date"
                name="approvalDate"
                value={form.approvalDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chamber of Commerce No.</label>
              <input
                type="text"
                name="chamberOfCommerce"
                value={form.chamberOfCommerce}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 71333983"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
              <input
                type="number"
                name="financialYear"
                value={form.financialYear}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2023"
                min="1900"
                max="2100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <Upload className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-blue-600">Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo Preview" className="h-10 w-10 rounded-full object-cover border" />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Save
            </button>
            {saved && (
              <span className="ml-4 flex items-center text-green-600 font-medium"><CheckCircle className="w-4 h-4 mr-1" /> Saved!</span>
            )}
          </div>
        </form>
      </div>
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 flex items-center space-x-6">
        {logoPreview ? (
          <img src={logoPreview} alt="Logo" className="h-16 w-16 rounded-full object-cover border" />
        ) : (
          <Building2 className="w-16 h-16 text-blue-300" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-1">{form.name || 'Company Name'}</h2>
          <div className="text-gray-700 mb-1 flex items-center"><User className="w-4 h-4 mr-1 text-gray-400" /> {form.owner || 'Owner/Contact'}</div>
          <div className="text-gray-700 mb-1 flex items-center"><Mail className="w-4 h-4 mr-1 text-gray-400" /> {form.email || 'Email'}</div>
          <div className="text-gray-700 mb-1 flex items-center"><Phone className="w-4 h-4 mr-1 text-gray-400" /> {form.phone || 'Phone'}</div>
          <div className="text-gray-700 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" /> {form.address || 'Address'}</div>
          <div className="text-gray-700 mb-1 flex items-center"><Globe className="w-4 h-4 mr-1 text-gray-400" /> {form.website || 'Website'}</div>
        </div>
      </div>
    </div>
  );
}; 