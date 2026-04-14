interface ClientsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientsPagination({ currentPage, totalPages, onPageChange }: ClientsPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(currentPage, totalPages);

  return (
    <nav className="mt-5 flex items-center justify-center gap-1" aria-label="Paginação">
      {items.map((item, i) =>
        item === '...' ? (
          <span key={`dots-${i}`} className="px-1.5 text-[14px] text-gray-400">...</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item as number)}
            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full text-[14px] font-medium transition-colors ${
              currentPage === item
                ? 'bg-teddy-orange text-white shadow-sm'
                : 'text-gray-500 hover:text-teddy-orange'
            }`}
            aria-current={currentPage === item ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}
    </nav>
  );
}

function getPaginationItems(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | '...')[] = [1];

  if (current > 3) items.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) items.push(i);

  if (current < total - 2) items.push('...');

  items.push(total);
  return items;
}
