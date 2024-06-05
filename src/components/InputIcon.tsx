import { ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react';

type InputIconProps = ComponentPropsWithoutRef<'input'> & {
  icon?: ReactNode;
};

const InputIcon = forwardRef<HTMLInputElement, InputIconProps>(
  ({ className, icon, ...rest }, ref) => {
    return (
      <div className="relative mb-3">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          {...rest}
          className="block w-full rounded border border-gray-300 bg-gray-50 px-2.5 py-3 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    );
  }
);

export default InputIcon;

InputIcon.displayName = 'Input';
