import * as yup from 'yup';

export const signUpSchema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        '이메일을 정확히 입력해 주세요.'
      )
      .required('이메일을 입력해 주세요.'),
    name: yup
      .string()
      .min(2, '최소 2자 이상 작성해야 합니다.')
      .max(12, '최대 12자까지 작성 가능합니다.')
      .matches(
        /^[A-Za-z0-9가-힣]{2,12}$/,
        '닉네임은 영어, 한글, 숫자만 가능합니다.'
      )
      .required('성함을 입력해 주세요.'),

    password: yup
      .string()
      .min(8, '최소 8자 이상 작성해야 합니다.')
      .max(16, '최대 16자까지 작성 가능합니다.')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
        '비밀번호는 영어, 숫자, 특수문자만 가능합니다.'
      )
      .required('비밀번호를 입력해 주세요!'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], '비밀번호가 다릅니다.')
      .required('비밀번호를 한번 더 입력해 주세요'),
  })
  .required();

export const contactSchema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        '이메일을 정확히 입력해 주세요.'
      )
      .required('이메일을 입력해 주세요.'),
    name: yup
      .string()
      .min(2, '최소 2자 이상 작성해야 합니다.')
      .max(12, '최대 12자까지 작성 가능합니다.')
      .matches(
        /^[A-Za-z0-9가-힣]{2,12}$/,
        '닉네임은 영어, 한글, 숫자만 가능합니다.'
      )
      .required(),

    phone: yup
      .string()
      .matches(
        /^(\+\d{1,3}[- ]?)?\d{10,}$/,
        '유효한 전화번호를 입력해 주세요. 국가 코드를 포함할 수 있습니다.'
      )
      .required('전화번호를 입력해 주세요!'),

    message: yup
      .string()
      .min(1, '메시지를 입력해 주세요.')
      .required('메시지를 입력해 주세요.'),
  })
  .required();

export const verifyEmailSchema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        '이메일을 정확히 입력해 주세요.'
      )
      .required('이메일을 입력해 주세요.'),
  })
  .required();

export const changePasswordSchema = yup
  .object({
    password: yup
      .string()
      .min(8, '최소 8자 이상 작성해야 합니다.')
      .max(16, '최대 16자까지 작성 가능합니다.')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
        '비밀번호는 영어, 숫자, 특수문자만 가능합니다.'
      )
      .required('비밀번호를 입력해 주세요!'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], '비밀번호가 다릅니다.')
      .required('비밀번호를 한번 더 입력해 주세요'),
  })
  .required();