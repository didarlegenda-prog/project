import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { promotionsAPI } from '../../api/promotions';
import toast from 'react-hot-toast';

const PromoCodeInput = ({ onApply, currentPromo, onRemove, orderData }) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setIsValidating(true);
    try {
      const result = await promotionsAPI.validate(code, orderData);
      
      if (result.valid) {
        onApply(code, result.discount_amount);
        setCode('');
      } else {
        toast.error(result.message || 'Invalid promo code');
      }
    } catch (error) {
      const message = error.response?.data?.detail || 
                     error.response?.data?.message ||
                     'Failed to validate promo code';
      toast.error(message);
    } finally {
      setIsValidating(false);
    }
  };

  if (currentPromo) {
    return (
      <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
        <div className="flex items-center">
          <Tag className="h-5 w-5 text-success-600 mr-2" />
          <div>
            <p className="font-medium text-success-900">
              Promo Code Applied: {currentPromo}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-success-600 hover:text-success-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark-700">
        Have a promo code?
      </label>
      <div className="flex space-x-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="flex-1"
        />
        <Button
          onClick={handleApply}
          loading={isValidating}
          variant="outline"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
