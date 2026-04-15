interface CreateClientButtonProps {
  onClick: () => void;
}

export function CreateClientButton({ onClick }: CreateClientButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-6 w-full rounded-[4px] border-[3px] border-teddy-orange px-4 py-2.5 font-bold text-teddy-orange transition-colors hover:bg-orange-50"
    >
      Criar cliente
    </button>
  );
}
