import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  name: yup.string().required('닉네임을 입력해주세요'),
  email: yup.string().required('이메일을 입력해주세요').email('올바른 이메일 형식을 입력하세요'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .matches(/^[a-zA-Z0-9]*$/, '비밀번호에는 특수문자가 포함될 수 없어요')
    .matches(/[a-z]/, '비밀번호에는 1개 이상의 소문자가 포함되어야 해요')
    .matches(/[A-Z]/, '비밀번호에는 1개 이상의 대문자가 포함되어야 해요')
    .matches(/\d/, '비밀번호에는 1개 이상의 숫자가 포함되어야 해요')
    .min(12, '비밀번호는 12자 이상이어야 해요')
    .max(25, '비밀번호는 25자를 넘을 수 없어요'),
  confirmPassword: yup
    .string()
    .required('비밀번호를 다시 입력해주세요')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않아요'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required('이메일을 입력해주세요').email('올바른 이메일 형식을 입력하세요'),
  password: yup.string().required('비밀번호를 입력해주세요'),
});
