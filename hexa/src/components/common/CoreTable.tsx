import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';
import { CoreButton, CoreIconButton, CorePagination } from './CoreComponents';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  hideOnMobile?: boolean;
}

interface CoreTableProps<T> {
  title?: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  onAdd?: () => void;
  addLabel?: string;
  onExportCsv?: () => void;
  pageSize?: number;
  mobileCardRender?: (row: T) => React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  filterComponent?: React.ReactNode;
}

export function CoreTable<T>({
  title,
  subtitle,
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchFilter,
  onAdd,
  addLabel = 'New Record',
  onExportCsv,
  pageSize = 10,
  mobileCardRender,
  actions,
  filterComponent
}: CoreTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filtered
  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchQuery.trim() && searchFilter) {
      result = result.filter((item) => searchFilter(item, searchQuery.trim()));
    }
    if (sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
    }
    return result;
  }, [data, searchQuery, searchFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }
    // Generic CSV export
    if (!filteredData.length) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((row: any) => {
      return columns
        .map((c) => {
          const val = row[c.key];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val ?? '';
        })
        .join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title || 'export'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e0e2e6] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-4 border-b border-[#e0e2e6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div>
          {title && <h3 className="text-base font-semibold text-[#202124]">{title}</h3>}
          {subtitle && <p className="text-xs text-[#5f6368] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#f8f9fa] hover:bg-[#f1f3f4] focus:bg-white border border-[#dadce0] rounded-lg text-[#202124] placeholder-[#5f6368] transition-colors focus:outline-none focus:border-[#1a73e8]"
            />
          </div>

          {filterComponent && (
            <CoreButton
              variant={showFilterDrawer ? 'primary' : 'outline'}
              size="sm"
              icon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            >
              Filter
            </CoreButton>
          )}

          <CoreIconButton
            variant="outline"
            size="sm"
            onClick={handleExport}
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </CoreIconButton>

          {onAdd && (
            <CoreButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onAdd}
            >
              {addLabel}
            </CoreButton>
          )}
        </div>
      </div>

      {/* Filter Component if open */}
      {filterComponent && showFilterDrawer && (
        <div className="p-3 bg-[#f8f9fa] border-b border-[#e0e2e6]">{filterComponent}</div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#e0e2e6] text-[#5f6368] font-medium uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`py-3 px-4 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:text-[#202124] select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={`flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        className={`w-3.5 h-3.5 ${
                          sortKey === col.key ? 'text-[#1a73e8]' : 'text-[#80868b]'
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f4]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center text-xs text-[#5f6368]"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="hover:bg-[#f8f9fa] transition-colors group"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-4 text-[#202124] ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                  {actions && <td className="py-3 px-4 text-right">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Responsive View */}
      <div className="md:hidden divide-y divide-[#e0e2e6]">
        {paginatedData.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#5f6368]">No matching records found.</div>
        ) : (
          paginatedData.map((row) => (
            <div key={keyExtractor(row)} className="p-4 hover:bg-[#f8f9fa] transition-colors">
              {mobileCardRender ? (
                mobileCardRender(row)
              ) : (
                <div className="space-y-1.5">
                  {columns.map((col) => (
                    <div key={col.key} className="flex items-center justify-between text-xs">
                      <span className="text-[#5f6368] font-medium">{col.header}:</span>
                      <span className="text-[#202124]">
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </span>
                    </div>
                  ))}
                  {actions && <div className="pt-2 flex justify-end gap-2">{actions(row)}</div>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <CorePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
