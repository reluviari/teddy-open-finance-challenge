import { ClientsCount } from './clients-count';
import { ClientsPerPageSelect } from './clients-per-page-select';

interface ClientsToolbarProps {
  total: number;
  perPage: number;
  onPerPageChange: (value: number) => void;
}

export function ClientsToolbar({ total, perPage, onPerPageChange }: ClientsToolbarProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <ClientsCount total={total} />
      <ClientsPerPageSelect value={perPage} onChange={onPerPageChange} />
    </div>
  );
}
