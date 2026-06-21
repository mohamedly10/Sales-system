import React from 'react';
import type { ReportItem } from '../api/reports';

interface ReportPrintViewProps {
  reports: ReportItem[];
  dateFrom: string;
  dateTo: string;
  companyName?: string;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({
  reports,
  dateFrom,
  dateTo,
  companyName = 'شركة الأمل التجارية',
}) => {
  const totalImports = reports
    .filter((r) => r.type === 'import')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExports = reports
    .filter((r) => r.type === 'export')
    .reduce((sum, r) => sum + Math.abs(r.amount), 0);

  const netBalance = totalImports - totalExports;

  const formatDate = (d: string) => {
    if (!d) return '';
    const parts = d.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const displayDateFrom = dateFrom ? formatDate(dateFrom) : '--';
  const displayDateTo = dateTo ? formatDate(dateTo) : '--';

  const refYear = dateFrom ? dateFrom.split('-')[0] : new Date().getFullYear();
  const refMonth = dateFrom ? dateFrom.split('-')[1] : '01';
  const referenceNumber = `REF-${refYear}-${refMonth}`;

  return (
    <div className="report-print-wrapper">
      <style>{`
        @page {
          size: A4;
          margin: 20mm 15mm;
        }

        .report-print-wrapper {
          display: none;
        }

        @media print {
          html, body {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden;
          }

          .report-print-wrapper,
          .report-print-wrapper * {
            visibility: visible;
          }

          .report-print-wrapper {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            font-family: 'Arial', 'Tahoma', sans-serif;
            background-color: #ffffff;
            color: #000000;
            direction: rtl;
          }

          .no-print {
            display: none !important;
          }
        }

        .report-header {
          text-align: center;
          border-bottom: 2px solid #000000;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }

        .report-header h2 {
          margin: 0;
          font-size: 20pt;
        }

        .meta-table {
          width: 100%;
          margin-bottom: 25px;
          border-collapse: collapse;
        }

        .meta-table td {
          border: none;
          padding: 6px 0;
          font-size: 11pt;
          width: 50%;
        }

        .meta-table td.left-align {
          text-align: left;
        }

        table.data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }

        table.data-table th,
        table.data-table td {
          border: 1px solid #000000;
          padding: 10px;
          text-align: center;
          font-size: 10.5pt;
        }

        table.data-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        table.data-table tfoot td {
          font-weight: bold;
          background-color: #fafafa;
        }

        table.data-table tfoot tr.final-row td {
          background-color: #eeeeee;
          font-size: 11.5pt;
          border-top: 2px solid #000000;
        }

        .text-left {
          text-align: left !important;
          padding-left: 15px !important;
        }
      `}</style>

      <div className="report-header">
        <h2>تقرير حركة الصادر والوارد</h2>
      </div>

      <table className="meta-table">
        <tbody>
          <tr>
            <td><strong>اسم الجهة / الشخص:</strong> {companyName}</td>
            <td className="left-align"><strong>من تاريخ:</strong> {displayDateFrom}</td>
          </tr>
          <tr>
            <td><strong>رقم المرجع:</strong> {referenceNumber}</td>
            <td className="left-align"><strong>إلى تاريخ:</strong> {displayDateTo}</td>
          </tr>
        </tbody>
      </table>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>التاريخ</th>
            <th>البيان / الوصف</th>
            <th>نوع المعاملة</th>
            <th>الوارد</th>
            <th>الصادر</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{formatDate(report.date)}</td>
              <td>{report.desc || report.name}</td>
              <td>{report.type === 'import' ? 'وارد' : 'صادر'}</td>
              <td>{report.type === 'import' ? report.amount.toLocaleString() : '-'}</td>
              <td>{report.type === 'export' ? Math.abs(report.amount).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="text-left">مجموع الوارد:</td>
            <td>{totalImports > 0 ? totalImports.toLocaleString() : '-'}</td>
            <td>-</td>
          </tr>
          <tr>
            <td colSpan={4} className="text-left">مجموع الصادر:</td>
            <td>-</td>
            <td>{totalExports > 0 ? totalExports.toLocaleString() : '-'}</td>
          </tr>
          <tr className="final-row">
            <td colSpan={4} className="text-left">
              الرصيد الصافي (مجموع الوارد - مجموع الصادر):
            </td>
            <td colSpan={2}>{netBalance.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
