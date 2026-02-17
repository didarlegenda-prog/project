import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser({
      ...data,
      password2: data.password_confirm,
      role: 'CUSTOMER',
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-dark-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-600">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('first_name', {
                  required: 'First name is required',
                })}
                error={errors.first_name?.message}
                required
              />

              <Input
                label="Last Name"
                {...register('last_name', {
                  required: 'Last name is required',
                })}
                error={errors.last_name?.message}
                required
              />
            </div>

            <Input
              label="Username"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
              error={errors.username?.message}
              required
            />

            <Input
              label="Email address"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              {...register('phone_number', {
                required: 'Phone number is required',
              })}
              error={errors.phone_number?.message}
              required
            />

            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              error={errors.password?.message}
              helperText="Must be at least 8 characters"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('password_confirm', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={errors.password_confirm?.message}
              required
            />
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              {...register('terms', {
                required: 'You must accept the terms and conditions',
              })}
              className="h-4 w-4 text-primary focus:ring-primary border-dark-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-dark-900">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary-600">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-error">{errors.terms.message}</p>
          )}

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
