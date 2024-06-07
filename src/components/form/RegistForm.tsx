'use client';

import { Form, Formik } from 'formik';

import { signUpSchema } from '@/libs/validations/signUpSchema';
import { cn } from '@/utils/style';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Button from '../Button';
import InputFormik from '../InputFormik';

const RegistForm = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-[720px] mx-auto mt-28 bg-white rounded-xl">
      <div
        className={cn('flex w-full max-w-[330px] mx-auto flex-col gap-4 py-20')}
      >
        <div
          className="z-[20] mx-auto  flex w-full max-w-[330px] flex-col gap-8 "
        >
          <h2 className='text-lg font-bold text-center'>회원가입</h2>
          <Formik
            initialValues={{
              email: '',
              name: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={signUpSchema}
            onSubmit={async (data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                const response = await axios.post('/api/auth/signup', {
                  email: data.email,
                  name: data.name,
                  password: data.password,
                });

                if (response.status === 201) {
                  toast.success('회원가입 성공! 이메일 인증을 해주세요.');
                  resetForm();
                  router.push('/login');
                }
              } catch (error: any) {
                toast.error(
                  error.response?.data?.message ||
                    'An unexpected error occurred'
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="flex flex-col gap-6">
                <InputFormik
                  label="이메일"
                  name={'email'}
                  type={'email'}
                  touched={touched}
                  errors={errors}
                />
                <InputFormik
                  label="성함"
                  name={'name'}
                  type={'text'}
                  touched={touched}
                  errors={errors}
                />

                <InputFormik
                  label="비밀번호"
                  name={'password'}
                  type={'password'}
                  touched={touched}
                  errors={errors}
                />
                <InputFormik
                  label="비밀번호 확인"
                  name={'confirmPassword'}
                  type={'password'}
                  touched={touched}
                  errors={errors}
                />
                <Button type="submit" disabled={isSubmitting}>
                  회원가입
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegistForm;
