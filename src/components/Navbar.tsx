'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className='fixed top-0 left-0 w-full z-50'>
      <div className='w-full p-8 flex flex-col gap-4 justify-center items-center bg-cyan-700 md:flex-row  md:justify-between'>
        <Link href='/' className=' font-bold text-white text-2xl'>
          <Image
            src='/commentary.png'
            alt='commentary logo'
            width={300}
            height={40}
            priority
          />
        </Link>
        {session ? (
          <>
            <p className='text-white text-xl'>
              Welcome, {session?.user.username}
            </p>
            <button
              onClick={() => signOut()}
              className='rounded bg-neutral-500 border border-white hover:bg-neutral-400 p-2 cursor-pointer text-white max-w-[100px]'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a
              href='/sign-in'
              className='rounded bg-green-500 p-2 cursor-pointer text-white hover:bg-green-600 max-w-[100px]'
            >
              LogIn
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
