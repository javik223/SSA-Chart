'use client';

export function PageHeader() {
  return (
    <header className='border-b bg-white px-4 py-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 md:gap-4'>
          <div className='flex items-center gap-2'>
            <h1 className='text-xl font-bold text-zinc-900 md:text-2xl'>
              SSA Charts
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
