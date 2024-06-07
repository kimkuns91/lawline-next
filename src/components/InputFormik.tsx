import { ErrorMessage, Field } from 'formik';

import { cn } from '@/utils/style';

interface InputFormikProps {
  label?: string;
  name: string;
  type?: string;
  touched: { [key: string]: boolean };
  errors: { [key: string]: string };
}

const InputFormik: React.FC<InputFormikProps> = ({
  label,
  name,
  type,
  touched,
  errors,
}) => {
  return (
    <div className='flex flex-col gap-4'>
      {label && <label htmlFor={name} className='text-lg font-bold text-slate-900'>{label}</label>}
      <Field
        name={name}
        type={type || 'text'}
        className={cn(
          'block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
        )}
      />
      {touched[name] && errors[name] ? (
        <p className="font-semibold text-red-500">
          <ErrorMessage name={name} />
        </p>
      ) : null}
    </div>
  );
};

export default InputFormik;