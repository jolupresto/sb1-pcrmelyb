import { DEFAULT_BACKGROUND } from '../constants/defaults';

interface SettingsModalProps {
  onClose: () => void;
  onBackgroundChange: (url: string) => void;
}

export function SettingsModal({ onClose, onBackgroundChange }: SettingsModalProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onBackgroundChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    onBackgroundChange(DEFAULT_BACKGROUND);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Reset to default background
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}