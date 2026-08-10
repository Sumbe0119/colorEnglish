import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'И-мэйл хаягаа оруулна уу').email('И-мэйл хаяг буруу байна'),
  password: z.string().min(1, 'Нууц үгээ оруулна уу'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Нэрээ оруулна уу').max(50),
    email: z.string().min(1, 'И-мэйл хаягаа оруулна уу').email('И-мэйл хаяг буруу байна'),
    password: z
      .string()
      .min(8, 'Нууц үг доод тал нь 8 тэмдэгт байх ёстой')
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Том, жижиг үсэг, тоо хослуулна уу'),
    confirmPassword: z.string().min(1, 'Нууц үгээ давтан оруулна уу'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Нууц үг таарахгүй байна',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
