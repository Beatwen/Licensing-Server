import { useState } from 'react';
import { License } from '../types/license';
import { Device } from '../types/types';
import { Trash2 } from 'lucide-react';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

interface SelectedDevice extends Device {
  licenseId: number;
}

interface LicensesTabProps {
  licenses: License[];
  setLicenses: (licenses: License[]) => void;
}

const LicensesTab = ({ licenses, setLicenses }: LicensesTabProps) => {
  const { user } = useAuthStore();
  const [selectedDevice, setSelectedDevice] = useState<SelectedDevice | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleDeleteDevice = async (licenseKey: string, deviceId: string) => {
    try {
      logger.info('Deleting device:', licenseKey, deviceId);
      await api.post('/devices/remove', { 
        licenseKey, 
        deviceId: String(deviceId)
      });
      toast.success('Device deleted successfully');
      const response = await api.get(`/licenses/${user?.id}`);
      setLicenses(response.data);
      setOpenConfirmDialog(false);
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
    }
  };

  const openDeleteConfirmation = (device: Device, license: License) => {
    setSelectedDevice({ ...device, licenseId: license.id });
    setSelectedLicense(license);
    setOpenConfirmDialog(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vos licences</h2>
      {licenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vous n'avez pas encore de licence active.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {licenses.map((license) => (
            <div
              key={license.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Licence </span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  license.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : license.status === 'expired'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {license.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clé: {license.licenseKey}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Type: {license.type}
              </p>
              {license.activatedAt && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Activée le: {new Date(license.activatedAt).toLocaleDateString()}
                </p>
              )}
              {license.expiresAt && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expire le: {new Date(license.expiresAt).toLocaleDateString()}
                </p>
              )}
              {license.devices && license.devices.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Appareils associés:</h4>
                  <ul className="space-y-2">
                    {license.devices.map((device: Device) => (
                      <li key={device.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-600 rounded">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{device.name || device.deviceId}</p>
                        </div>
                        <button
                          onClick={() => openDeleteConfirmation(device, license)}
                          className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          aria-label="Supprimer l'appareil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {openConfirmDialog && selectedDevice && selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer cet appareil ? Cela vous permettra de transférer la licence vers un autre appareil.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setOpenConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteDevice(selectedLicense.licenseKey, selectedDevice.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicensesTab; 