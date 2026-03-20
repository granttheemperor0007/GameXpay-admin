export default function Table({ columns, data, onRowClick, emptyMessage = 'No records found.' }) {
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
        <tbody className="divide-y divide-gray-700/40">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`
                  bg-gray-900/40 hover:bg-gray-800/50 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
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
