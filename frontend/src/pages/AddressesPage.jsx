import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { addressesAPI } from '../api/addresses';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { MapPin, Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AddressesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesAPI.getAll,
  });

  const addresses = data?.results || data || [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleAddNew = () => {
    setEditingAddress(null);
    reset({});
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    reset(address);
    setShowModal(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await addressesAPI.delete(addressId);
      toast.success('Address deleted successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await addressesAPI.setDefault(addressId);
      toast.success('Default address updated!');
      refetch();
    } catch (error) {
      toast.error('Failed to set default address');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingAddress) {
        await addressesAPI.update(editingAddress.id, data);
        toast.success('Address updated successfully!');
      } else {
        await addressesAPI.create(data);
        toast.success('Address added successfully!');
      }
      setShowModal(false);
      reset({});
      refetch();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-900">My Addresses</h1>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No addresses saved"
            message="Add your delivery addresses for faster checkout"
            action={<Button onClick={handleAddNew}>Add Your First Address</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border border-dark-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-dark-900">
                        {address.label || 'Address'}
                      </h3>
                      {address.is_default && (
                        <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-600">
                      {address.street}
                    </p>
                    <p className="text-sm text-dark-600">
                      {address.city}, {address.state} {address.zip_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-dark-600 hover:text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-dark-600 hover:text-error transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-primary hover:text-primary-600"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          reset({});
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Label"
            {...register('label', { required: 'Label is required' })}
            placeholder="e.g., Home, Office"
            error={errors.label?.message}
            required
          />

          <Input
            label="Street Address"
            {...register('street', { required: 'Street address is required' })}
            error={errors.street?.message}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              {...register('city', { required: 'City is required' })}
              error={errors.city?.message}
              required
            />

            <Input
              label="State"
              {...register('state', { required: 'State is required' })}
              error={errors.state?.message}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code"
              {...register('zip_code', { required: 'ZIP code is required' })}
              error={errors.zip_code?.message}
              required
            />

            <Input
              label="Country"
              {...register('country', { required: 'Country is required' })}
              defaultValue="USA"
              error={errors.country?.message}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_default"
              type="checkbox"
              {...register('is_default')}
              className="h-4 w-4 text-primary focus:ring-primary border-dark-300 rounded"
            />
            <label htmlFor="is_default" className="ml-2 text-sm text-dark-900">
              Set as default address
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" fullWidth>
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setShowModal(false);
                reset({});
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressesPage;
