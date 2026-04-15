import { ClientCardInfo } from './client-card-info';
import { ClientCardActions } from './client-card-actions';
import { ClientResponse } from './types';

interface ClientCardProps {
  client: ClientResponse;
  isSelected?: boolean;
  onSelect?: (client: ClientResponse) => void;
  onEdit?: (client: ClientResponse) => void;
  onDelete?: (client: ClientResponse) => void;
  onRemove?: (client: ClientResponse) => void;
  variant?: 'default' | 'selected';
}

export function ClientCard({
  client,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onRemove,
  variant = 'default',
}: ClientCardProps) {
  return (
    <div className="flex flex-col items-center rounded-[4px] border border-gray-200 bg-white px-5 pb-3 pt-5 shadow-sm">
      <ClientCardInfo
        id={client.id}
        name={client.name}
        salary={client.salary}
        companyValue={client.companyValue}
      />
      <ClientCardActions
        clientName={client.name}
        variant={variant}
        isSelected={isSelected}
        onSelect={onSelect ? () => onSelect(client) : undefined}
        onEdit={onEdit ? () => onEdit(client) : undefined}
        onDelete={onDelete ? () => onDelete(client) : undefined}
        onRemove={onRemove ? () => onRemove(client) : undefined}
      />
    </div>
  );
}
