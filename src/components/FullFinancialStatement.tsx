import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Download, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const FullFinancialStatement: React.FC = () => {
  const { state } = useAppContext();
  const company = state.companyInfo;
  // Dynamic values from company info or fallback
  const establishedDate = company.establishedDate;
  const approvalDate = company.approvalDate;
  const chamberOfCommerce = company.chamberOfCommerce;
  const directorName = company.owner;
  const city = company.city;
  const country = company.country;
  const year = company.financialYear;
  const prevYear = year && !isNaN(Number(year)) ? (parseInt(year) - 1).toString() : '';
  // Remove mock resultComparison and use only real data
  // PDF Export Handler
  const buildIndexEntries = () => {
    // This function returns an array of { label, page } for the UI index
    // The PDF export will use a similar array, but with actual page numbers
    return [
      { label: '1 General', children: [
        { label: '1.1 Result comparison' }
      ] },
      { label: '2 Financial statements', children: [
        { label: `2.1 Balance per 31-12-${year}` },
        { label: `2.2 Profit and Loss Account ${year}` },
        { label: '2.3 Basis of the financial statement', children: [
          { label: '2.3.1 General principles' },
          { label: '2.3.2 Basis for balance sheet assets' },
          { label: '2.3.3 Basis for balance sheet liabilities' },
          { label: '2.3.4 Policies for result determination' },
          { label: '2.3.5 General disclosures' },
        ] },
        { label: '2.4 Related parties', children: [
          { label: '2.4.1 Specification shareholder(s)' },
        ] },
        { label: `2.5 Additional information on balance sheets assets per 31-12-${year}`, children: [
          { label: '2.5.1 Inventories' },
          { label: '2.5.2 Receivables' },
          { label: '2.5.3 Cash and cash equivalents' },
        ] },
        { label: `2.6 Additional information on balance sheets liabilities per 31-12-${year}`, children: [
          { label: '2.6.1 Equity' },
          { label: '2.6.2 Short-term debts' },
        ] },
        { label: `2.7 Additional information profit and loss account ${year}`, children: [
          { label: '2.7.1 Income' },
          { label: '2.7.2 Purchase costs and outsourced work' },
          { label: '2.7.3 Other operating expenses' },
          { label: '2.7.4 Financial income and expenses' },
        ] },
      ] },
    ];
  };

  // PDF Export Handler (dynamic index)
  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 60;
    let pageNum = 1;
    const addPageNumber = () => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${pageNum}`, pageWidth - 60, pageHeight - 30, { align: 'right' });
      pageNum++;
    };
    // --- Cover Page ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('To the board of', 60, y);
    doc.text(company.name || '', 60, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(company.address || '', 60, y + 56);
    let coverY = y + 84;
    if (city) { doc.text(city, 60, coverY); coverY += 22; }
    if (country) { doc.text(country, 60, coverY); coverY += 22; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Financial Statements ${year || ''}`, 60, coverY + 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Date established:', 60, coverY + 70);
    doc.text(establishedDate || '', 200, coverY + 70);
    addPageNumber();
    doc.addPage();
    // --- Index Page ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    let indexY = 60;
    doc.text('Index', 60, indexY);
    indexY += 28;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const staticIndex = [
      '1 General',
      '  1.1 Result comparison',
      '2 Financial statements',
      `  2.1 Balance per 31-12-${year}`,
      `  2.2 Profit and loss account ${year}`,
      '  2.3 Basis of the financial statement',
      '    2.3.1 General principles',
      '    2.3.2 Basis for balance sheet assets',
      '    2.3.3 Basis for balance sheet liabilities',
      '    2.3.4 Policies for result determination',
      '    2.3.5 General disclosures',
      '  2.4 Related parties',
      '    2.4.1 Specification shareholder(s)',
      `  2.5 Additional information on balance sheets assets per 31-12-${year}`,
      '    2.5.1 Inventories',
      '    2.5.2 Receivables',
      '    2.5.3 Cash and cash equivalents',
      `  2.6 Additional information on balance sheets liabilities per 31-12-${year}`,
      '    2.6.1 Equity',
      '    2.6.2 Short-term debts',
      `  2.7 Additional information profit and loss account ${year}`,
      '    2.7.1 Income',
      '    2.7.2 Purchase costs and outsourced work',
      '    2.7.3 Other operating expenses',
      '    2.7.4 Financial income and expenses',
    ];
    staticIndex.forEach(line => {
      doc.text(line, 60, indexY);
      indexY += 20;
    });
    addPageNumber();
    doc.addPage();
    // --- 1. General ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('1 General', 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('These financial statements are based on fiscal figures.', 60, y);
    y += 22;
    doc.text(`The limited liability company ${company.name || ''} has the following trade names: ${company.name || ''}.`, 60, y);
    y += 22;
    if (city) { doc.text(`The limited liability company seat is located in ${city}.`, 60, y); y += 22; }
    if (chamberOfCommerce) { doc.text(`The limited liability company is registered with the Chamber of Commerce under file number ${chamberOfCommerce}.`, 60, y); y += 22; }
    doc.setFont('helvetica', 'bold');
    doc.text('Date of determination financial statements', 60, y);
    doc.setFont('helvetica', 'normal');
    y += 22;
    doc.text(`The financial statements ${year} has been established in the General Meeting held on ${approvalDate}.`, 60, y);
    addPageNumber();
    doc.addPage();
    // --- 1.1 Result comparison ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('1.1 Result comparison', 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    if (state.financialStatements.profitLoss.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Particulars', 'Amount (€)']],
        body: state.financialStatements.profitLoss.map(i => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
    } else {
      doc.text('No profit & loss data available. Generate statements to view data.', 60, y);
      y += 20; // Add some space after the message
    }
    addPageNumber();
    doc.addPage();
    // --- 2.1 Balance Sheet ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`2.1 Balance per 31-12-${year}`, 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    autoTable(doc, {
      startY: 80,
      head: [['Category', 'Account', 'Amount (€)']],
      body: state.financialStatements.balanceSheet.filter(i => i.type === 'asset').map(i => [i.category, i.account, i.amount.toLocaleString()]),
      margin: { left: 60, right: 60 },
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 12 },
    });
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Category', 'Account', 'Amount (€)']],
      body: state.financialStatements.balanceSheet.filter(i => i.type === 'liability' || i.type === 'equity').map(i => [i.category, i.account, i.amount.toLocaleString()]),
      margin: { left: 60, right: 60 },
      theme: 'grid',
      headStyles: { fillColor: [185, 41, 41], textColor: 255 },
      styles: { fontSize: 12 },
    });
    addPageNumber();
    doc.addPage();
    // --- 2.2 Profit & Loss ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`2.2 Profit and Loss Account ${year}`, 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    autoTable(doc, {
      startY: 80,
      head: [['Accounts', 'Amount (€)']],
      body: (state.financialStatements.detailedProfitLoss && state.financialStatements.detailedProfitLoss.length > 0
        ? state.financialStatements.detailedProfitLoss
        : state.financialStatements.profitLoss
      ).map((i: any) => [
        typeof i.label === 'string' ? i.label : (typeof i.account === 'string' ? i.account : ''),
        i.amount !== undefined ? i.amount.toLocaleString() : ''
      ]),
      margin: { left: 60, right: 60 },
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 12 },
      didParseCell: function (data: any) {
        if (data.section === 'body' && typeof data.row.raw[0] === 'string' &&
          /Total|Gross Profit|Operating Profit|Profit Before Tax|Net Profit/.test(data.row.raw[0])) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    });
    addPageNumber();
    doc.addPage();
    // --- 2.3 Basis of Financial Statement ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('2.3 Basis of the Financial Statement', 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    // 2.3.1 General principles
    doc.text('2.3.1 General principles', 60, y);
    y += 22;
    const para1 = doc.splitTextToSize('Assets and liabilities are generally valued at historical cost, production cost or at fair value at the time of acquisition. If no specific valuation principle has been stated, valuation is at historical cost. In the balance sheet, income statement and the cash flow statement, references are made to the notes. Income and expenses are allocated to the year to which they relate. Profits are only included insofar as they have been realized on the balance sheet date. Liabilities and possible losses that originate before the end of the reporting year are taken into account if they have become known before the preparation of the annual accounts.', pageWidth - 120);
    doc.text(para1, 60, y);
    y += para1.length * 16 + 10;
    // 2.3.2 Basis for balance sheet assets
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2.3.2 Basis for balance sheet assets', 60, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    const para2 = doc.splitTextToSize('Inventories (stocks) are valued at historical price or production cost based on the FIFO method (first in, first out) or lower realisable value. The historical cost or production cost consist of all costs relating to the acquisition or production and the costs incurred in order to bring the inventories to their current location and current condition. The production cost includes direct labour and fixed and variable production overheads, taking into account the costs of the operations office, the maintenance department and internal logistics. The realisable value is the estimated sales price less directly attributable sales costs. In determining the realisable value the obsolescence of the inventories is taken into account. Trade receivables are recognised initially at fair value and subsequently measured at amortised cost. If payment of the receivable is postponed under an extended payment deadline, fair value is measured on the basis of the discounted value of the expected revenues. Interest gains are recognised using the effective interest method. When a trade receivable is uncollectible, it is written off against the allowance account for trade receivables. Cash at banks represent bank balances. Cash at banks is carried at nominal value.', pageWidth - 120);
    doc.text(para2, 60, y);
    y += para2.length * 16 + 10;
    // 2.3.3 Basis for balance sheet liabilities
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2.3.3 Basis for balance sheet liabilities', 60, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    const para3 = doc.splitTextToSize('On initial recognition current liabilities are recognised at fair value. After initial recognition current liabilities are recognised at the amortised cost price, being the amount received taking into account premiums or discounts and minus transaction costs. This is usually the nominal value.', pageWidth - 120);
    doc.text(para3, 60, y);
    y += para3.length * 16 + 10;
    // 2.3.4 Policies for result determination
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2.3.4 Policies for result determination', 60, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    const para4 = doc.splitTextToSize('Net turnover comprises the income from the supply of goods and services and realised income from construction contracts after deduction of discounts and such like and of taxes levied on the turnover. Revenues from the goods supplied are recognised when all significant risks and rewards in respect of the goods have been transferred to the buyer. The result is the difference between the realisable value of the goods/services provided and the costs and other charges during the year. The results on transactions are recognised in the year in which they are realised.', pageWidth - 120);
    doc.text(para4, 60, y);
    y += para4.length * 16 + 10;
    // 2.3.5 General disclosures
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2.3.5 General disclosures', 60, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    const para5 = doc.splitTextToSize(`The activities of ${company.name || 'the company'}, established in ${city}, consists mainly of: The import, export, production, distribution of all kinds of food and non-food products, holding and management.`, pageWidth - 120);
    doc.text(para5, 60, y);
    y += para5.length * 16 + 10;
    addPageNumber();
    doc.addPage();
    // --- 2.4 Related Parties ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('2.4 Related Parties', 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    if (state.financialStatements.relatedParties && state.financialStatements.relatedParties.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Name', 'Type', 'Details']],
        body: state.financialStatements.relatedParties.map(p => [p.name || '', p.type || '', p.details || '']),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
    } else {
      doc.text('No related parties/shareholders info available.', 60, y);
    }
    addPageNumber();
    doc.addPage();
    // --- 2.5 Asset Breakdown ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`2.5 Additional Information – Assets`, 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    // Inventories
    doc.text('Inventories', 60, y);
    y += 22;
    if (state.financialStatements.assetBreakdown && state.financialStatements.assetBreakdown.inventories.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.assetBreakdown.inventories.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No inventories data.', 60, y);
      y += 22;
    }
    // Receivables
    doc.text('Receivables', 60, y);
    y += 22;
    if (state.financialStatements.assetBreakdown && state.financialStatements.assetBreakdown.receivables.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.assetBreakdown.receivables.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No receivables data.', 60, y);
      y += 22;
    }
    // Cash and cash equivalents
    doc.text('Cash and Cash Equivalents', 60, y);
    y += 22;
    if (state.financialStatements.assetBreakdown && state.financialStatements.assetBreakdown.cashAndCashEquivalents.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.assetBreakdown.cashAndCashEquivalents.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No cash and cash equivalents data.', 60, y);
      y += 22;
    }
    addPageNumber();
    doc.addPage();
    // --- 2.6 Liability Breakdown ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`2.6 Additional Information – Liabilities`, 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    // Equity
    doc.text('Equity', 60, y);
    y += 22;
    if (state.financialStatements.liabilityBreakdown && state.financialStatements.liabilityBreakdown.equity.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.liabilityBreakdown.equity.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [185, 41, 41], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No equity data.', 60, y);
      y += 22;
    }
    // Short-term debts
    doc.text('Short-term Debts', 60, y);
    y += 22;
    if (state.financialStatements.liabilityBreakdown && state.financialStatements.liabilityBreakdown.shortTermDebts.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.liabilityBreakdown.shortTermDebts.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [185, 41, 41], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No short-term debts data.', 60, y);
      y += 22;
    }
    addPageNumber();
    doc.addPage();
    // --- 2.7 Profit & Loss Breakdown ---
    y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`2.7 Additional Information – Profit & Loss`, 60, y);
    y += 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    // Income
    doc.text('Income', 60, y);
    y += 22;
    if (state.financialStatements.profitLossBreakdown && state.financialStatements.profitLossBreakdown.income.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.profitLossBreakdown.income.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No income data.', 60, y);
      y += 22;
    }
    // COGS
    doc.text('COGS', 60, y);
    y += 22;
    if (state.financialStatements.profitLossBreakdown && state.financialStatements.profitLossBreakdown.COGS.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.profitLossBreakdown.COGS.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No COGS data.', 60, y);
      y += 22;
    }
    // Operating Expenses
    doc.text('Operating Expenses', 60, y);
    y += 22;
    if (state.financialStatements.profitLossBreakdown && state.financialStatements.profitLossBreakdown.operatingExpenses.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.profitLossBreakdown.operatingExpenses.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No operating expenses data.', 60, y);
      y += 22;
    }
    // Financial Items
    doc.text('Financial Items', 60, y);
    y += 22;
    if (state.financialStatements.profitLossBreakdown && state.financialStatements.profitLossBreakdown.financialItems.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.profitLossBreakdown.financialItems.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No financial items data.', 60, y);
      y += 22;
    }
    // Tax
    doc.text('Tax', 60, y);
    y += 22;
    if (state.financialStatements.profitLossBreakdown && state.financialStatements.profitLossBreakdown.tax.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Account', 'Amount (€)']],
        body: state.financialStatements.profitLossBreakdown.tax.map((i: any) => [i.account, i.amount.toLocaleString()]),
        margin: { left: 60, right: 60 },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No tax data.', 60, y);
      y += 22;
    }
    addPageNumber();
    doc.addPage();
    // --- Signature Page ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${city || ''}, ${country || ''}, ${approvalDate || ''}`, 60, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('Signature:', 60, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(company.name || '', 60, 160);
    doc.text(directorName || '', 60, 180);
    doc.text('Former Director', 60, 200);
    doc.text('..................', 60, 240);
    addPageNumber();
    doc.save(`Full-Financial-Statement-${company.name || 'Company'}.pdf`);
  };

  // UI Index rendering (dynamic)
  type IndexEntry = { label: string; children?: IndexEntry[] };
  const renderIndexUI = (entries: IndexEntry[], level = 0): JSX.Element => (
    <ol className={`ml-${level * 6} space-y-1 text-gray-800`}>
      {entries.map((entry: IndexEntry, idx: number) => (
        <li key={entry.label + idx} className={entry.children ? 'font-bold' : ''}>
          {entry.label}
          {entry.children && renderIndexUI(entry.children, level + 1)}
        </li>
      ))}
    </ol>
  );

  // Add grouped P&L helper
  const getGroupedProfitLoss = () => {
    const groupMap: Record<string, string> = {
      'Revenue': 'Revenue',
      'Other income': 'Revenue',
      'Discounts received': 'Revenue',
      'COGS': 'COGS',
      'Opening inventory': 'COGS',
      'Purchases': 'COGS',
      'Operating Expenses': 'OpEx',
      'Selling expenses': 'OpEx',
      'Administrative expenses': 'OpEx',
      'Other operating expenses': 'OpEx',
      'Interest income': 'Other',
      'Interest expense': 'Other',
      'Other income/expenses': 'Other',
      'Tax': 'Tax',
    };
    const items = state.financialStatements.profitLoss;
    const grouped: Record<string, { account: string; amount: number; type: string; category: string }[]> = {
      Revenue: [],
      COGS: [],
      OpEx: [],
      Other: [],
      Tax: [],
    };
    items.forEach(item => {
      const group = groupMap[item.category] || groupMap[item.account] || (item.type === 'revenue' ? 'Revenue' : (item.category === 'COGS' ? 'COGS' : (item.category === 'Tax' ? 'Tax' : (item.category === 'Other' ? 'Other' : 'OpEx'))));
      if (grouped[group]) grouped[group].push(item);
      else grouped['Other'].push(item);
    });
    return grouped;
  };

  // Helper for No Data Icon
  const NoDataIcon = () => (
    <AlertCircle className="w-5 h-5 text-gray-400 inline-block align-middle mr-1" />
  );

  // --- Calculation helpers for tax formulas ---
  const sumPL = (arr: any[] = []) => Array.isArray(arr) ? arr.reduce((sum, i) => sum + (typeof i.amount === 'number' ? i.amount : 0), 0) : 0;
  const getNonOperatingExpenses = (arr: any[] = []) => Array.isArray(arr) ? arr.filter(i => i.type === 'expense').reduce((sum, i) => sum + (typeof i.amount === 'number' ? i.amount : 0), 0) : 0;

  const income = state.financialStatements.profitLossBreakdown?.income || [];
  const cogs = state.financialStatements.profitLossBreakdown?.COGS || [];
  const opEx = state.financialStatements.profitLossBreakdown?.operatingExpenses || [];
  const finItems = state.financialStatements.profitLossBreakdown?.financialItems || [];
  const taxArr = state.financialStatements.profitLossBreakdown?.tax || [];

  const revenueVal = sumPL(income);
  const cogsVal = sumPL(cogs);
  const opExVal = sumPL(opEx);
  const nonOpExpVal = getNonOperatingExpenses(finItems);
  const taxableIncome = revenueVal - cogsVal - opExVal - nonOpExpVal;
  const hasTax = Array.isArray(taxArr) && taxArr.length > 0;
  const taxVal = hasTax ? sumPL(taxArr) : null;
  const netIncome = hasTax ? taxableIncome - (taxVal ?? 0) : null;
  const effectiveTaxRate = hasTax && taxableIncome !== 0 ? ((taxVal! / taxableIncome) * 100).toFixed(2) : null;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Export Button */}
      <div className="flex justify-end mb-8">
        <button
          className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow"
          onClick={handleExportPDF}
        >
          <Download className="w-5 h-5" />
          <span>Export PDF</span>
        </button>
      </div>
      {/* 1. Cover Page & General Info */}
      <section className="bg-white rounded-xl shadow p-12 border border-gray-100 flex flex-col items-center text-center mb-8">
        {company.logo && typeof company.logo === 'string' && (
          <img src={company.logo} alt="Logo" className="h-20 w-20 rounded-full object-cover border mb-4" />
        )}
        <h2 className="text-2xl font-bold mb-2">To the board of</h2>
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">{company.name}</h1>
        <div className="text-gray-700 mb-2">{company.address}</div>
        {city && <div className="text-gray-700 mb-2">{city}</div>}
        {country && <div className="text-gray-700 mb-2">{country}</div>}
        <div className="text-lg font-semibold mt-4 mb-2">Financial Statements {year}</div>
        <div className="text-gray-600">Date of establishment: <span className="font-medium">{establishedDate}</span></div>
      </section>
      {/* 2. Index Page */}
      <section className="bg-white rounded-xl shadow p-10 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-6">Index</h2>
        {renderIndexUI(buildIndexEntries().map((entry) => {
          // Recursively replace year in all labels
          const replaceYear = (e: IndexEntry): IndexEntry => ({
            ...e,
            label: e.label.replace(/2023/g, year || ''),
            children: e.children ? e.children.map(replaceYear) : undefined,
          });
          return replaceYear(entry);
        }))}
      </section>
      {/* 3. General Info Section */}
      <section className="bg-white rounded-xl shadow p-10 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4">1. General</h2>
        {chamberOfCommerce && <div className="mb-2">Chamber of Commerce No.: <span className="font-medium">{chamberOfCommerce}</span></div>}
        <div className="mb-2">Company name: <span className="font-medium">{company.name}</span></div>
        <div className="mb-2">Trade name: <span className="font-medium">{company.name}</span></div>
        <div className="mb-2">Address: <span className="font-medium">{company.address}</span></div>
        {city && <div className="mb-2">City: <span className="font-medium">{city}</span></div>}
        {country && <div className="mb-2">Country: <span className="font-medium">{country}</span></div>}
        <div className="mb-2">Date of approval of financial statement: <span className="font-medium">{approvalDate}</span></div>
        <h3 className="text-lg font-semibold mt-8 mb-4">1.1 Result Comparison</h3>
        {/* Real P&L table for result comparison */}
        <section className="bg-white rounded-xl shadow p-10 border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">1.1 Result Comparison</h2>
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm mb-4">
              <thead className="bg-blue-50">
              <tr>
                <th className="py-2 px-4 border">Particulars</th>
                  <th className="py-2 px-4 border text-right">{year}</th>
                  {/* No prevYear column since no comparison data */}
              </tr>
            </thead>
            <tbody>
                {state.financialStatements.profitLoss.length > 0 ? (
                  state.financialStatements.profitLoss.map((item, idx) => (
                    <tr key={item.account + idx} className="hover:bg-blue-50">
                  <td className="py-2 px-4 border font-medium">{item.account}</td>
                  <td className="py-2 px-4 border text-right">{item.amount.toLocaleString()}</td>
                </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-gray-500 text-center py-4">
                      <NoDataIcon /> No profit & loss data available. Generate statements to view data.
                    </td>
                  </tr>
                )}
                {state.financialStatements.profitLoss.length > 0 && (
                  <tr className="font-bold bg-blue-100">
                <td className="py-2 px-4 border text-right font-semibold">Net Profit/Loss</td>
                <td className="py-2 px-4 border text-right font-semibold">
                      {state.financialStatements.profitLoss.reduce((sum, item) => sum + (item.type === 'revenue' ? item.amount : -item.amount), 0).toLocaleString()}
                </td>
              </tr>
                )}
            </tbody>
          </table>
          </div>
        </section>
      </section>

      {/* 4. Balance Sheet Section (Real Data) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-2">2.1 Balance per 31-12-{year}</h2>
        {state.financialStatements.balanceSheet.length === 0 ? (
          <div className="text-gray-500 mb-2">No balance sheet data available. Generate statements to view data.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assets Table */}
            <div>
              <h5 className="font-bold text-blue-700 mb-4 text-lg">🟦 ASSETS</h5>
              <table className="min-w-full border border-gray-300 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-left">Category</th>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-left">Account</th>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-right">Amount (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {state.financialStatements.balanceSheet
                    .filter(item => item.type === 'asset')
                    .map((item, idx) => (
                      <tr key={item.account + idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 border border-gray-300">{item.category}</td>
                        <td className="py-3 px-4 border border-gray-300 font-medium">{item.account}</td>
                        <td className="py-3 px-4 border border-gray-300 text-right font-medium">€{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  <tr className="font-bold bg-gray-100">
                    <td colSpan={2} className="py-3 px-4 border border-gray-300 text-right font-semibold">Total Assets</td>
                    <td className="py-3 px-4 border border-gray-300 text-right font-semibold">
                      €{state.financialStatements.balanceSheet
                        .filter(item => item.type === 'asset')
                        .reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Equity & Liabilities Table */}
            <div>
              <h5 className="font-bold text-red-700 mb-4 text-lg">🟥 EQUITY AND LIABILITIES</h5>
              <table className="min-w-full border border-gray-300 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-left">Category</th>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-left">Account</th>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-right">Amount (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {state.financialStatements.balanceSheet
                    .filter(item => item.type === 'liability' || item.type === 'equity')
                    .map((item, idx) => (
                      <tr key={item.account + idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 border border-gray-300">{item.category}</td>
                        <td className="py-3 px-4 border border-gray-300 font-medium">{item.account}</td>
                        <td className="py-3 px-4 border border-gray-300 text-right font-medium">€{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  <tr className="font-bold bg-gray-100">
                    <td colSpan={2} className="py-3 px-4 border border-gray-300 text-right font-semibold">Total Equity & Liabilities</td>
                    <td className="py-3 px-4 border border-gray-300 text-right font-semibold">
                      €{state.financialStatements.balanceSheet
                        .filter(item => item.type === 'liability' || item.type === 'equity')
                        .reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 5. Profit & Loss Section (Real Data) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-2">2.2 Profit and Loss Account {year}</h2>
        {(() => {
          // Use detailedProfitLoss if available, otherwise fall back to profitLoss
          const detailedPL = (state.financialStatements.detailedProfitLoss && state.financialStatements.detailedProfitLoss.length > 0
            ? state.financialStatements.detailedProfitLoss
            : (state.financialStatements.profitLoss || [])) as { label?: string; account?: string; amount?: number }[];
          if (detailedPL.length === 0) {
            return (
              <div className="text-gray-500 mb-2">No profit & loss data available. Generate statements to view data.</div>
            );
          }
            return (
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                  <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-left">Accounts</th>
                    <th className="py-3 px-4 border border-gray-300 font-semibold text-gray-900 text-right">Amount (€)</th>
                  </tr>
                </thead>
                <tbody>
                {detailedPL.map((row: { label?: string; account?: string; amount?: number }, idx: number) => (
                  <tr key={`${row.label ?? row.account ?? ''}${idx}`} className={/Total|Gross Profit|Operating Profit|Profit Before Tax|Net Profit/.test(row.label || row.account || '') ? "font-bold bg-gray-100" : ""}>
                    <td className="py-3 px-4 border border-gray-300 font-medium">{row.label || row.account}</td>
                    <td className="py-3 px-4 border border-gray-300 text-right font-medium">
                      {row.amount !== undefined && row.amount !== null ? `€${Number(row.amount).toLocaleString()}` : '€0'}
                    </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            );
        })()}
      </section>

      {/* 6. Basis of Financial Statement (Static) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-2">2.3 Basis of the Financial Statement</h2>
        <h3 className="font-semibold mt-4 mb-1">2.3.1 General principles</h3>
        <p className="text-gray-700 mb-2">Assets and liabilities are generally valued at historical cost, production cost or at fair value at the time of acquisition. If no specific valuation principle has been stated, valuation is at historical cost. In the balance sheet, income statement and the cash flow statement, references are made to the notes. Income and expenses are allocated to the year to which they relate. Profits are only included insofar as they have been realized on the balance sheet date. Liabilities and possible losses that originate before the end of the reporting year are taken into account if they have become known before the preparation of the annual accounts.</p>
        <h3 className="font-semibold mt-4 mb-1">2.3.2 Basis for balance sheet assets</h3>
        <p className="text-gray-700 mb-2">Inventories (stocks) are valued at historical price or production cost based on the FIFO method (first in, first out) or lower realisable value. The historical cost or production cost consist of all costs relating to the acquisition or production and the costs incurred in order to bring the inventories to their current location and current condition. The production cost includes direct labour and fixed and variable production overheads, taking into account the costs of the operations office, the maintenance department and internal logistics. The realisable value is the estimated sales price less directly attributable sales costs. In determining the realisable value the obsolescence of the inventories is taken into account. Trade receivables are recognised initially at fair value and subsequently measured at amortised cost. If payment of the receivable is postponed under an extended payment deadline, fair value is measured on the basis of the discounted value of the expected revenues. Interest gains are recognised using the effective interest method. When a trade receivable is uncollectible, it is written off against the allowance account for trade receivables. Cash at banks represent bank balances. Cash at banks is carried at nominal value.</p>
        <h3 className="font-semibold mt-4 mb-1">2.3.3 Basis for balance sheet liabilities</h3>
        <p className="text-gray-700 mb-2">On initial recognition current liabilities are recognised at fair value. After initial recognition current liabilities are recognised at the amortised cost price, being the amount received taking into account premiums or discounts and minus transaction costs. This is usually the nominal value.</p>
        <h3 className="font-semibold mt-4 mb-1">2.3.4 Policies for result determination</h3>
        <p className="text-gray-700 mb-2">Net turnover comprises the income from the supply of goods and services and realised income from construction contracts after deduction of discounts and such like and of taxes levied on the turnover. Revenues from the goods supplied are recognised when all significant risks and rewards in respect of the goods have been transferred to the buyer. The result is the difference between the realisable value of the goods/services provided and the costs and other charges during the year. The results on transactions are recognised in the year in which they are realised.</p>
        <h3 className="font-semibold mt-4 mb-1">2.3.5 General disclosures</h3>
        <p className="text-gray-700 mb-2">The activities of {company.name || 'the company'}, established in {city}, consists mainly of: The import, export, production, distribution of all kinds of food and non-food products, holding and management.</p>
      </section>

      {/* 7. Related Parties (Dynamic) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-2">2.4 Related Parties</h2>
        {state.financialStatements.relatedParties && state.financialStatements.relatedParties.length > 0 ? (
          <ul className="list-disc ml-6">
            {state.financialStatements.relatedParties.map((party: any, idx: number) => (
              <li key={idx}>{party.name || JSON.stringify(party)}</li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 mb-2">No related parties/shareholders info available.</div>
        )}
      </section>

      {/* 8. Additional Info – Assets (Dynamic) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-2">2.5 Additional Information – Assets</h2>
        {state.financialStatements.assetBreakdown ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inventories */}
            <div className="bg-blue-50 rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-2 flex items-center">Inventories</h4>
            {state.financialStatements.assetBreakdown.inventories.length > 0 ? (
                <table className="min-w-full text-sm">
                  <tbody>
                    {state.financialStatements.assetBreakdown.inventories.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-100">
                        <td className="py-1 font-medium">{item.account}</td>
                        <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center text-gray-500">
                  <NoDataIcon /> No inventories data.
                </div>
              )}
            </div>
            {/* Receivables */}
            <div className="bg-blue-50 rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-2 flex items-center">Receivables</h4>
            {state.financialStatements.assetBreakdown.receivables.length > 0 ? (
                <table className="min-w-full text-sm">
                  <tbody>
                    {state.financialStatements.assetBreakdown.receivables.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-100">
                        <td className="py-1 font-medium">{item.account}</td>
                        <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center text-gray-500">
                  <NoDataIcon /> No receivables data.
                </div>
              )}
            </div>
            {/* Cash and Cash Equivalents */}
            <div className="bg-blue-50 rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-2 flex items-center">Cash and Cash Equivalents</h4>
            {state.financialStatements.assetBreakdown.cashAndCashEquivalents.length > 0 ? (
                <table className="min-w-full text-sm">
                  <tbody>
                    {state.financialStatements.assetBreakdown.cashAndCashEquivalents.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-100">
                        <td className="py-1 font-medium">{item.account}</td>
                        <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center text-gray-500">
                  <NoDataIcon /> No cash and cash equivalents data.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-500 mt-4">
            <NoDataIcon /> No asset breakdown data available.
          </div>
        )}
      </section>

      {/* 9. Additional Info – Liabilities (Dynamic) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100">
        <h2 className="text-xl font-bold mb-2">2.6 Additional Information – Liabilities</h2>
        {state.financialStatements.liabilityBreakdown ? (
          <>
            <h4 className="font-semibold mt-2 mb-1">Equity</h4>
            {state.financialStatements.liabilityBreakdown.equity.length > 0 ? (
              <ul className="list-disc ml-6 mb-2">
                {state.financialStatements.liabilityBreakdown.equity.map((item: any, idx: number) => (
                  <li key={idx}>{item.account}: €{item.amount.toLocaleString()}</li>
                ))}
              </ul>
            ) : <div className="text-gray-500 mb-2">No equity data.</div>}
            <h4 className="font-semibold mt-2 mb-1">Short-term Debts</h4>
            {state.financialStatements.liabilityBreakdown.shortTermDebts.length > 0 ? (
              <ul className="list-disc ml-6 mb-2">
                {state.financialStatements.liabilityBreakdown.shortTermDebts.map((item: any, idx: number) => (
                  <li key={idx}>{item.account}: €{item.amount.toLocaleString()}</li>
                ))}
              </ul>
            ) : <div className="text-gray-500 mb-2">No short-term debts data.</div>}
          </>
        ) : <div className="text-gray-500 mb-2">No liability breakdown data available.</div>}
      </section>

      {/* 10. Additional Info – Profit & Loss (Dynamic) */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-2">2.7 Additional Information – Profit & Loss</h2>
        {state.financialStatements.profitLossBreakdown ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Income */}
              <div className="bg-green-50 rounded-lg p-4 shadow">
                <h4 className="font-semibold mb-2 flex items-center">Income</h4>
                {income && income.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <tbody>
                      {income.map((item, idx) => (
                        <tr key={idx} className="hover:bg-green-100">
                          <td className="py-1 font-medium">{item.account}</td>
                          <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <NoDataIcon /> No income data.
                  </div>
                )}
              </div>
              {/* COGS */}
              <div className="bg-green-50 rounded-lg p-4 shadow">
                <h4 className="font-semibold mb-2 flex items-center">COGS</h4>
                {cogs && cogs.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <tbody>
                      {cogs.map((item, idx) => (
                        <tr key={idx} className="hover:bg-green-100">
                          <td className="py-1 font-medium">{item.account}</td>
                          <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <NoDataIcon /> No COGS data.
                  </div>
                )}
              </div>
              {/* Operating Expenses */}
              <div className="bg-green-50 rounded-lg p-4 shadow">
                <h4 className="font-semibold mb-2 flex items-center">Operating Expenses</h4>
                {opEx && opEx.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <tbody>
                      {opEx.map((item, idx) => (
                        <tr key={idx} className="hover:bg-green-100">
                          <td className="py-1 font-medium">{item.account}</td>
                          <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <NoDataIcon /> No operating expenses data.
                  </div>
                )}
              </div>
              {/* Financial Items */}
              <div className="bg-green-50 rounded-lg p-4 shadow">
                <h4 className="font-semibold mb-2 flex items-center">Financial Items</h4>
                {finItems && finItems.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <tbody>
                      {finItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-green-100">
                          <td className="py-1 font-medium">{item.account}</td>
                          <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <NoDataIcon /> No financial items data.
                  </div>
                )}
              </div>
              {/* Tax */}
              <div className="bg-green-50 rounded-lg p-4 shadow">
                <h4 className="font-semibold mb-2 flex items-center">Tax</h4>
                {taxArr && taxArr.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <tbody>
                      {taxArr.map((item, idx) => (
                        <tr key={idx} className="hover:bg-green-100">
                          <td className="py-1 font-medium">{item.account}</td>
                          <td className="py-1 text-right">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <NoDataIcon /> No tax data.
                  </div>
                )}
              </div>
            </div>
            {/* Tax Summary Card */}
            <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow p-6 max-w-xl mx-auto">
              <h3 className="text-lg font-bold mb-4 text-center">Tax & Net Income Summary</h3>
              <table className="min-w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold">Taxable Income (EBT)</td>
                    <td className="py-2 text-right">{!isNaN(taxableIncome) ? `€${taxableIncome.toLocaleString()}` : '—'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Income Tax Expense</td>
                    <td className="py-2 text-right">{hasTax ? `€${taxVal.toLocaleString()}` : <span className="text-gray-500">No tax data</span>}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Net Income (After Tax)</td>
                    <td className="py-2 text-right">{hasTax ? `€${netIncome !== null && netIncome !== undefined ? netIncome.toLocaleString() : '—'}` : <span className="text-gray-500">No tax data</span>}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Effective Tax Rate</td>
                    <td className="py-2 text-right">{hasTax && effectiveTaxRate !== null ? `${effectiveTaxRate}%` : <span className="text-gray-500">No tax data</span>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex items-center text-gray-500 mt-4">
            <NoDataIcon /> No profit & loss breakdown data available.
          </div>
        )}
      </section>

      {/* 11. Signature Page */}
      <section className="bg-white rounded-xl shadow p-8 border border-gray-100 text-center">
        <div className="mb-2">{city || ''}, {country || ''}, {approvalDate || ''}</div>
        <div className="mb-2 font-bold text-lg">Signature:</div>
        <div className="mb-2 font-semibold text-blue-900">{company.name || ''}</div>
        <div className="mb-2 font-medium">{directorName || ''}</div>
        <div className="mb-2 text-gray-500">Former Director</div>
        <div className="mt-8 text-2xl">..................</div>
      </section>
    </div>
  );
}; 