interface ClientsCountProps {
  total: number;
}

export function ClientsCount({ total }: ClientsCountProps) {
  return (
    <p className="text-[15px] text-gray-700">
      <strong className="font-bold">{total}</strong> clientes encontrados:
    </p>
  );
}
