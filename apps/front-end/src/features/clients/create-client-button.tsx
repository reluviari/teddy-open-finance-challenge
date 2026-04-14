interface CreateClientButtonProps {
  onClick: () => void;
}

export function CreateClientButton({ onClick }: CreateClientButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-6 w-full rounded-[4px] border-2 border-teddy-orange bg-white py-3 text-[14px] font-semibold text-teddy-orange transition-colors hover:bg-orange-50"
    >
      Criar cliente
    </button>
  );
}
