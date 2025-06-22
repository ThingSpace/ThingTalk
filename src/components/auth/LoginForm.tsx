"use client";
import React from 'react';
import { trpc } from '@utils/trpc';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useFormik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { setCookie } from 'nookies';
import { useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Loading } from '@components/ui/Loading';
import { Toast } from '@components/ui/Toast';
import { handleError } from '@utils/client.util';
import { showToastAtom, toastIntentAtom, toastMessageAtom } from '@utils/store';

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const params = useSearchParams();
  // Toast State
  const [showToast, setShowToast] = useAtom(showToastAtom);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const [pageLoad, setPageLoad] = React.useState(false);
  //TRPC
  const mutation = trpc.user.login.useMutation();

  // Zod Schema for form input validation
  const loginSchema = z.object({
    username: z.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
    password: z.string().trim().min(8).max(30),
    rememberMe: z.boolean(),
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (errors.username || errors.password) {
      setToastIntent('error');
      setToastMessage('Please check your username and password');
      setShowToast(true);
      return;
    }
    try {
      const res = await mutation.mutateAsync({
        username: values.username.trim(),
        password: values.password.trim(),
        rememberMe: values.rememberMe,
      });
      setCookie(null, 'token', res.token, {
        maxAge: values.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      setToastIntent('success');
      setToastMessage('Successfully logged in!');
      setShowToast(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = await handleError(err);
      setToastIntent('error');
      setToastMessage(errorMessage);
      setShowToast(true);
    }
  };

  // Formik hook for form validation and control.
  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      username: params.get('username') || '',
      password: '',
      rememberMe: false,
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit,
  });

  React.useEffect(() => {
    if (!pageLoad) {
      setPageLoad(true);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });
    }
  }, []);

  React.useEffect(() => {
    // Cleanup: Remove the event listener on unmount.
    return () => {
      document.removeEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });
    };
  });

  return (
    <div>
      <div className="flex">
        <AnimatePresence>{mutation.status === 'pending' && <Loading />}</AnimatePresence>
      </div>
      <AnimatePresence>
        <motion.div
          className="flex min-w-[250px] flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <Input
            label="Username"
            type="text"
            intent="default"
            id="username"
            fullWidth={true}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            canHide={true}
          />
          <Input
            label="Password"
            type="password"
            intent="default"
            id="password"
            fullWidth={true}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="Remember me for 7 days."
            type="checkbox"
            intent="default"
            id="rememberMe"
            checked={values.rememberMe}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Button
            letterSpaced={true}
            disabled={isSubmitting || Object.keys(errors).length > 0}
            type="submit"
            onClick={() => {
              handleSubmit();
            }}>
            Log In
          </Button>
        </motion.div>
        {showToast ? <Toast key="toastKey" /> : null}
      </AnimatePresence>
    </div>
  );
} 