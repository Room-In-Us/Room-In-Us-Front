import * as yup from 'yup';

export const signupSchema = yup.object().shape({
    name: yup
        .string()
        .required("닉네임은 필수항목이에요"),
    email: yup
        .string()
        .email('올바른 이메일 형식을 입력하세요')
        .required('이메일은 필수항목이에요'),
    password: yup
        .string()
        .min(12, '12자 이상의 비밀번호를 입력해 주세요')
        .max(25, '25자 이하의 비밀번호를 입력해 주세요')
        .matches(/^[a-zA-Z0-9]*$/, '비밀번호에는 특수문자가 포함될 수 없어요') // 특수문자 불가
        .matches(/[A-Z]/, '비밀번호에는 1개 이상의 대문자가 포함되어야 해요') // 대문자 포함
        .matches(/[a-z]/, '비밀번호에는 1개 이상의 소문자가 포함되어야 해요') // 소문자 포함
        .matches(/\d/, '비밀번호에는 1개 이상의 숫자가 포함되어야 해요') // 숫자 포함
        .required('비밀번호는 필수항목이에요'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], '비밀번호가 일치하지 않아요')
        .required('비밀번호를 다시 입력해 주세요'),
});

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('올바른 이메일 형식을 입력하세요')
        .required('이메일은 필수항목이에요'),
    password: yup
        .string()
        .required('비밀번호는 필수항목이에요'),
});