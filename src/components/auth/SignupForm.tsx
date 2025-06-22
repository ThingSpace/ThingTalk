"use client";
import React, { useRef } from 'react';
import { trpc } from '@utils/trpc';
import { handleError, loadZxcvbn } from '@utils/client.util';
import { zxcvbn, zxcvbnOptions, type ZxcvbnResult } from '@zxcvbn-ts/core';
import { z } from 'zod';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { StrengthBar } from '@components/ui/StrengthBar';
import { Loading } from '@components/ui/Loading';
import { AnimatePresence, motion } from 'framer-motion';
import { Toast } from '@components/ui/Toast';
import { showToastAtom, toastIntentAtom, toastMessageAtom } from '@utils/store';
import { useAtom } from 'jotai';

export default function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [pageLoad, setPageLoad] = React.useState(false);
  const [pwdStrength, setPwdStrength] = React.useState<ZxcvbnResult>(zxcvbn(''));
  const [showPage, setShowPage] = React.useState(0);
  const captchaRef = useRef(null);
  // Toast State
  const [displayToast, setDisplayToast] = useAtom(showToastAtom);
  const [, setToastMessage] = useAtom(toastMessageAtom);
  const [, setToastIntent] = useAtom(toastIntentAtom);
  //TRPC
  const mutation = trpc.user.signup.useMutation();

  const signupSchema = z.object({
    password: z
      .string()
      .trim()
      .min(8)
      .max(30)
      .refine(() => pwdStrength.score >= 3, {
        message: 'Password is too weak',
      }),
    acceptTerms: z.boolean().refine((v) => v, {
      message: 'You must accept the terms and conditions',
    }),
    token: z.string(),
  });

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      password: '',
      acceptTerms: false,
      token: '',
    },
    validationSchema: toFormikValidationSchema(signupSchema),
    onSubmit: async (values, actions) => {
      try {
        actions.setSubmitting(true);
        await mutation.mutateAsync({
          password: values.password,
          acceptTerms: values.acceptTerms,
          token: values.token,
        });
        setShowPage(1);
      } catch (err) {
        const errorMessage = await handleError(err);
        setToastIntent('error');
        setToastMessage(errorMessage);
        setDisplayToast(true);
      }
    },
  });

  const onCaptchError = () => {
    setToastIntent('error');
    setToastMessage('There was an error with the captcha! Please Refresh the page and try again.');
    setDisplayToast(true);
  };

  const onCaptchaExpire = () => {
    setToastIntent('error');
    setToastMessage('The captcha has expired! Please Refresh the page and try again.');
    setDisplayToast(true);
  };

  React.useEffect(() => {
    if (!pageLoad) {
      loadOptions();
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });
      setPageLoad(true);
    }
  }, []);

  React.useEffect(() => {
    const results = zxcvbn(values.password);
    setPwdStrength(results);
  }, [values.password]);

  React.useEffect(() => {
    // Cleanup: Remove the event listener on unmount.
    return () => {
      document.removeEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });
    };
  }, []);

  async function loadOptions(): Promise<void> {
    const options = await loadZxcvbn();
    zxcvbnOptions.setOptions(options);
    return Promise.resolve();
  }

  return (
    <div>
      <div className="flex">
        <AnimatePresence>{mutation.status === 'pending' && <Loading />}</AnimatePresence>
      </div>
      <AnimatePresence>
        {showPage === 0 ? (
          <motion.div
            className="flex min-w-[250px] flex-col p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
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
            <StrengthBar strength={pwdStrength.score} />
            <div className="my-2 flex items-center gap-2">
              <input
                id="acceptTerms"
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-blue-500"
                checked={values.acceptTerms}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700 select-none">
                I accept the <a href="https://athing.space/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">terms and conditions</a>.
              </label>
            </div>
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_SITE_KEY || ''}
              onVerify={(token) => {
                setFieldValue('token', token);
              }}
              onError={onCaptchError}
              onExpire={onCaptchaExpire}
              ref={captchaRef}
            />
            <Button
              letterSpaced={true}
              disabled={isSubmitting || Object.keys(errors).length > 0}
              type="submit"
              onClick={() => {
                handleSubmit();
              }}>
              Signup
            </Button>
          </motion.div>
        ) : showPage === 1 ? (
          <motion.div
            className="flex min-w-[250px] flex-col p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="my-2 text-center text-4xl font-black text-red-600">Write It Down!</h1>
            <p className="prose my-2 text-center">
              Hey! <b className="text-black">please write down</b> your <b>Password</b> and your assigned Username:{' '}
              <b className="text-black">{mutation.data?.username}</b>. There is no way to recover your password/account
              if you forget it we do not store anything about you to identify you.
              <br />
              <span className="block mt-4 text-blue-700 text-base font-medium">You can also use this account to log in on our main website: <a href="https://athing.space" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">athing.space</a></span>
            </p>
            <Button
              styles="danger"
              letterSpaced={true}
              type="button"
              onClick={() => {
                if (onSuccess) onSuccess();
              }}>
              I agree, Continue
            </Button>
          </motion.div>
        ) : null}
        {displayToast ? <Toast key="toastKey" /> : null}
      </AnimatePresence>
    </div>
  );
} 