"use client"

import React from "react"

const AdminMobile: React.FC = React.memo(() => {

    return (
        <div className="flex justify-center items-center fixed w-[calc(375/375*100vw)] h-[calc(660/812*100vh)]">
            <h1>Admin data is not available for mobile view</h1>
        </div>
    );
});

AdminMobile.displayName = 'AdminMobile';
export default AdminMobile;