import React from 'react';
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='flex items-center pt-10 h-screen flex-col bg-neutral-800'>{children}</main>
    )
}

export default AuthLayout;