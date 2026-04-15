import { Link } from 'react-router-dom';
import { formatCurrency } from '@/shared/lib/format';

interface ClientCardInfoProps {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
}

export function ClientCardInfo({ id, name, salary, companyValue }: ClientCardInfoProps) {
  return (
    <div className="w-full text-center">
      <Link to={`/clients/${id}`} className="text-[16px] font-bold text-gray-800 no-underline transition-colors hover:text-teddy-orange">
        {name}
      </Link>
      <p className="mt-1.5 text-[13px] text-gray-500">Salário: {formatCurrency(salary)}</p>
      <p className="text-[13px] text-gray-500">Empresa: {formatCurrency(companyValue)}</p>
    </div>
  );
}
