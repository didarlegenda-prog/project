import { Package } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Package, 
  title = 'No items found', 
  message = 'There are no items to display.', 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-dark-100 p-6 mb-4">
        <Icon className="h-12 w-12 text-dark-400" />
      </div>
      <h3 className="text-lg font-medium text-dark-900 mb-2">{title}</h3>
      <p className="text-dark-500 text-center mb-6 max-w-md">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
