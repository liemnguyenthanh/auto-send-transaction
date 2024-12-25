interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    textarea?: boolean;
  }
  
  export function Input({ label, textarea, ...props }: InputProps) {
    const baseClasses = "w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";
    
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
        {textarea ? (
          <textarea
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
            className={`${baseClasses} h-24`}
          />
        ) : (
          <input
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
            className={baseClasses}
          />
        )}
      </div>
    );
  }