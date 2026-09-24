import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Plus,
  Trash2,
  Copy,
  Printer,
  Palette,
  Check
} from 'lucide-react';
import { storage } from '../../services/storage';
import { DocTemplate, TemplateType } from '../../types';
import { CoreButton, CoreDialog, CoreInput, CoreSelect } from '../../components/common/CoreComponents';

export const TemplatesModule: React.FC = () => {
  const company = storage.getActiveCompany();
  const [templates, setTemplates] = useState(storage.getTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate>(templates[0]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [type, setType] = useState<TemplateType>('Invoice');
  const [headerTitle, setHeaderTitle] = useState('');
  const [themeColor, setThemeColor] = useState('#1A73E8');
  const [showLogo, setShowLogo] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [terms, setTerms] = useState('');
  const [footerNote, setFooterNote] = useState('');

  const refresh = () => {
    const list = storage.getTemplates();
    setTemplates(list);
    if (!list.find((t) => t.id === selectedTemplate.id)) {
      setSelectedTemplate(list[0]);
    }
  };

  const handleOpenEdit = (tmpl?: DocTemplate) => {
    if (tmpl) {
      setName(tmpl.name);
      setType(tmpl.type);
      setHeaderTitle(tmpl.headerTitle);
      setThemeColor(tmpl.themeColor);
      setShowLogo(tmpl.showLogo);
      setShowBankDetails(tmpl.showBankDetails);
      setTerms(tmpl.terms);
      setFooterNote(tmpl.footerNote);
    } else {
      setName('Custom Proposal Template');
      setType('Quotation');
      setHeaderTitle('PROPOSAL ESTIMATE');
      setThemeColor('#0F9D58');
      setShowLogo(true);
      setShowBankDetails(false);
      setTerms('1. Valid for 30 days.\n2. Standard milestone billing.');
      setFooterNote('Looking forward to partnership.');
    }
    setEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.saveTemplate({
      id: selectedTemplate?.id,
      name,
      type,
      isDefault: false,
      headerTitle,
      themeColor,
      showLogo,
      showBankDetails,
      terms,
      footerNote
    });
    setSelectedTemplate(updated);
    setEditModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#202124]">Document & Communication Templates</h1>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Configurable invoice layouts, quotation formats, official receipts, and client letters.
          </p>
        </div>
        <CoreButton
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenEdit()}
        >
          Create Template
        </CoreButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector List */}
        <div className="bg-white rounded-xl border border-[#e0e2e6] p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            Available Templates ({templates.length})
          </h3>

          <div className="space-y-2">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplate?.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#1a73e8] bg-[#e8f0fe]/40 font-medium'
                      : 'border-[#e0e2e6] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: tmpl.themeColor }}
                    />
                    <div>
                      <div className="text-xs text-[#202124]">{tmpl.name}</div>
                      <div className="text-[10px] text-[#5f6368]">{tmpl.type} format</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#1a73e8]" />}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#f1f3f4] flex gap-2">
            <CoreButton
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleOpenEdit(selectedTemplate)}
            >
              Edit Style
            </CoreButton>
            <CoreButton
              variant="primary"
              size="sm"
              className="flex-1"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Print Test
            </CoreButton>
          </div>
        </div>

        {/* Live Visual Interactive Template Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0e2e6] p-6 shadow-xs print:border-none print:p-0 space-y-6 text-xs">
          {/* Header */}
          <div
            className="flex items-start justify-between border-b pb-4"
            style={{ borderColor: selectedTemplate.themeColor }}
          >
            <div>
              {selectedTemplate.showLogo && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white mb-2"
                  style={{ backgroundColor: selectedTemplate.themeColor }}
                >
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <h2 className="text-base font-bold" style={{ color: selectedTemplate.themeColor }}>
                {company.name}
              </h2>
              <div className="text-[11px] text-[#5f6368] mt-0.5 space-y-0.5">
                <div>{company.address}</div>
                <div>{company.city}, {company.state} - {company.zipCode}</div>
                <div>GSTIN / Tax ID: {company.taxId}</div>
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-lg font-bold tracking-tight text-[#202124]">
                {selectedTemplate.headerTitle}
              </h1>
              <div className="font-mono text-xs font-semibold mt-1" style={{ color: selectedTemplate.themeColor }}>
                {company.invoicePrefix}0042
              </div>
              <div className="text-[11px] text-[#5f6368] mt-0.5">Date: {new Date().toISOString().substring(0, 10)}</div>
            </div>
          </div>

          {/* Sample Line Items */}
          <div>
            <table className="w-full border-collapse border border-[#e0e2e6]">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368]">
                  <th className="py-2 px-3 text-left">Item Description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-right">Total ({company.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                <tr>
                  <td className="py-2 px-3 font-medium text-[#202124]">Strategic Business Consulting Retainer</td>
                  <td className="py-2 px-3 text-center text-[#5f6368]">1</td>
                  <td className="py-2 px-3 text-right text-[#5f6368]">50,000</td>
                  <td className="py-2 px-3 text-right font-semibold text-[#202124]">50,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-[#202124]">Systems Compliance & Security Auditing</td>
                  <td className="py-2 px-3 text-center text-[#5f6368]">1</td>
                  <td className="py-2 px-3 text-right text-[#5f6368]">25,000</td>
                  <td className="py-2 px-3 text-right font-semibold text-[#202124]">25,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-60 space-y-1 text-right">
              <div className="flex justify-between text-[#5f6368]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#202124]">{company.currency}75,000</span>
              </div>
              <div className="flex justify-between text-[#5f6368]">
                <span>Tax (18%):</span>
                <span className="font-semibold text-[#202124]">{company.currency}13,500</span>
              </div>
              <div
                className="flex justify-between text-sm font-bold border-t border-[#e0e2e6] pt-1"
                style={{ color: selectedTemplate.themeColor }}
              >
                <span>Grand Total:</span>
                <span>{company.currency}88,500</span>
              </div>
            </div>
          </div>

          {/* Terms & Footer Note */}
          <div className="border-t border-[#e0e2e6] pt-4 space-y-3">
            <div>
              <span className="font-semibold text-[#202124] block mb-0.5">Terms & Conditions:</span>
              <p className="text-[11px] text-[#5f6368] whitespace-pre-line">{selectedTemplate.terms}</p>
            </div>
            <div className="p-2.5 bg-[#f8f9fa] rounded-lg text-center text-[11px] text-[#5f6368]">
              {selectedTemplate.footerNote}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Template Modal */}
      <CoreDialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Customize Document Template"
        subtitle="Live layout formatting, brand palette, and terms configuration"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-3">
          <CoreInput
            label="Template Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <CoreInput
              label="Header Title"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
            />
            <CoreInput
              label="Theme Color (Hex)"
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3c4043] mb-1">Standard Terms</label>
            <textarea
              className="w-full text-xs p-2.5 border border-[#dadce0] rounded-lg outline-none focus:border-[#1a73e8]"
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>
          <CoreInput
            label="Footer Note"
            value={footerNote}
            onChange={(e) => setFooterNote(e.target.value)}
          />
          <div className="pt-3 border-t border-[#e0e2e6] flex justify-end gap-2">
            <CoreButton variant="outline" type="button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </CoreButton>
            <CoreButton variant="primary" type="submit">
              Apply & Save
            </CoreButton>
          </div>
        </form>
      </CoreDialog>
    </div>
  );
};
