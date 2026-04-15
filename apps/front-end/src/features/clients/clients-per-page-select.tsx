const PER_PAGE_OPTIONS = [4, 8, 12, 16];

interface ClientsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export function ClientsPerPageSelect({ value, onChange }: ClientsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-gray-500">Clientes por página:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-[14px] text-gray-700 focus:border-teddy-orange focus:outline-none"
      >
        {PER_PAGE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
