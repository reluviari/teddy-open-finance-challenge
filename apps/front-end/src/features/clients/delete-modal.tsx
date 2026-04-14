interface DeleteModalProps {
  isOpen: boolean;
  clientName: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteModal({ isOpen, clientName, onClose, onConfirm, isPending }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-[420px] rounded-[4px] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-gray-800">Excluir cliente:</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-5 text-[14px] text-gray-600">
          Você está prestes a excluir o cliente: <strong className="text-gray-800">{clientName}</strong>
        </p>

        <button
          onClick={onConfirm}
          disabled={isPending}
          className="w-full rounded-[4px] bg-teddy-orange py-3 text-[14px] font-semibold text-white transition-colors hover:bg-teddy-orange-hover disabled:opacity-50"
        >
          {isPending ? 'Excluindo...' : 'Excluir cliente'}
        </button>
      </div>
    </div>
  );
}
