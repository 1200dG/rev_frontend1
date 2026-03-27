'use client';

import { signOut } from 'next-auth/react';
import { routes } from '../routes';
import { hardNavigate } from './helpers';

export const handleLogout = async () => {
  await signOut({ redirect: false });
  hardNavigate(routes.ui.auth.signIn);
};
