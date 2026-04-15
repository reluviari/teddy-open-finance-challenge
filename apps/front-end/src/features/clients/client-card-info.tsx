import { formatCurrency } from '@/shared/lib/format';

interface ClientCardInfoProps {
  name: string;
  salary: number;
  companyValue: number;
}

export function ClientCardInfo({ name, salary, companyValue }: ClientCardInfoProps) {
  return (
    <div className="w-full text-center">
      <h3 className="text-[16px] font-bold text-gray-800">{name}</h3>
      <p className="mt-1.5 text-[13px] text-gray-500">Salário: {formatCurrency(salary)}</p>
      <p className="text-[13px] text-gray-500">Empresa: {formatCurrency(companyValue)}</p>
    </div>
  );
}
