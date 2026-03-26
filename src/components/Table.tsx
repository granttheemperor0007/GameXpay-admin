import EmptyState from './EmptyState';
import type { TableColumn } from '../types';

interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export default function Table<T extends Record<string, unknown>>({ columns, data, onRowClick, emptyMessage = 'No records found.' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto scrollbar-thin rounded-xl border border-gray-700/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                style={col.width ? { width: col.width } : {}}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={(row.id as string | number) ?? idx}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ backgroundColor: idx % 2 === 0 ? '#0F0F0D' : '#161615' }}
                className={`hover:brightness-125 transition-all ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : ((row[col.key] as string | number | null | undefined) ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
