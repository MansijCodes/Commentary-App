export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-[80px] '>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <h1 className='text-2xl sm:text-3xl font-bold'>
          ✉️ Receive Anonymous Messages – Effortlessly
        </h1>
        <p className='text-base sm:text-lg max-w-xl'>
          Create your account to get a <strong>unique messaging link</strong>{' '}
          you can share with anyone.
          <br />
          Anyone with the link can send you a message anonymously — no sign-up
          needed.
        </p>
        <ul className='list-disc list-inside text-sm sm:text-base mt-4 text-gray-700 dark:text-gray-300'>
          <li>✅ Simple Sign Up</li>
          <li>✅ Private & Anonymous</li>
          <li>✅ Real-Time Dashboard Access</li>
        </ul>
        <p className='mt-4 text-sm sm:text-base'>
          Start connecting — without revealing your identity.
        </p>

        <div className='flex gap-4 items-center flex-col sm:flex-row mt-6'>
          <a
            className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-cyan-500 text-background gap-2 hover:bg-cyan-600 dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
            href='/sign-up'
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
