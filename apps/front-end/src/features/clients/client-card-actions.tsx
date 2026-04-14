interface ClientCardActionsProps {
  clientName: string;
  variant: 'default' | 'selected';
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRemove?: () => void;
}

export function ClientCardActions({
  clientName,
  variant,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onRemove,
}: ClientCardActionsProps) {
  return (
    <div className="mt-3 flex w-full items-center justify-between border-t border-gray-100 px-2 pt-3">
      {variant === 'default' && (
        <>
          {isSelected ? (
            <span className="text-green-500" aria-label={`${clientName} já selecionado`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          ) : (
            <button
              onClick={onSelect}
              className="text-gray-400 transition-colors hover:text-teddy-orange"
              aria-label={`Selecionar ${clientName}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
          <button
            onClick={onEdit}
            className="text-gray-400 transition-colors hover:text-teddy-orange"
            aria-label={`Editar ${clientName}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-teddy-orange transition-colors hover:text-red-700"
            aria-label={`Excluir ${clientName}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </>
      )}
      {variant === 'selected' && onRemove && (
        <button
          onClick={onRemove}
          className="mx-auto text-teddy-orange transition-colors hover:text-red-700"
          aria-label={`Remover ${clientName}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14" />
          </svg>
        </button>
      )}
    </div>
  );
}
