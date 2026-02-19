import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Tag, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatters';

const PromotionsPage = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchPromotions = useCallback(async () => {
    try {
      const response = await api.get('/promotions/', {
        params: { is_active: true, ordering: '-discount_value' },
      });
      setPromotions(response.data.results || response.data);
    } catch {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Promo code copied!', { icon: '📋' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyPromo = (code) => {
    localStorage.setItem('pending_promo_code', code);
    toast.success('Promo code ready to apply!', { icon: '🎉' });
    navigate('/cart');
  };

  const getDiscountDisplay = (promo) => {
    if (promo.promotion_type === 'PERCENTAGE' && promo.discount_percentage) {
      return `${parseFloat(promo.discount_percentage)}% OFF`;
    } else if (promo.promotion_type === 'FIXED' && promo.discount_amount) {
      return `$${parseFloat(promo.discount_amount).toFixed(2)} OFF`;
    } else if (promo.discount_type === 'PERCENTAGE' && promo.discount_value) {
      return `${parseFloat(promo.discount_value)}% OFF`;
    } else if (promo.discount_value) {
      return `$${parseFloat(promo.discount_value).toFixed(2)} OFF`;
    }
    return '';
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">Loading promotions...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Active Promotions</h1>
          <p className="text-lg text-gray-600">Save money with our exclusive promo codes!</p>
        </div>

        {promotions.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No promotions available</h3>
            <p className="text-gray-500">Check back later for new deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map(promo => (
              <div key={promo.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border-2 border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{getDiscountDisplay(promo)}</div>
                  <div className="text-sm opacity-90">{promo.description}</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Promo Code</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 font-mono text-lg font-bold text-gray-900">
                        {promo.code}
                      </div>
                      <button onClick={() => handleCopyCode(promo.code)} className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors" title="Copy code">
                        {copiedCode === promo.code ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {promo.minimum_order_amount > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        Min order: ${parseFloat(promo.minimum_order_amount).toFixed(2)}
                      </div>
                    )}
                    {promo.end_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        Valid until {formatDate(promo.end_date)}
                      </div>
                    )}
                  </div>
                  <Button fullWidth variant="success" onClick={() => handleApplyPromo(promo.code)} className="group">
                    Apply to Cart
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How to use promo codes:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Click "Apply to Cart" or copy the promo code</li>
            <li>Add items to your cart</li>
            <li>The promo code will be automatically applied at checkout</li>
            <li>Enjoy your discount!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
