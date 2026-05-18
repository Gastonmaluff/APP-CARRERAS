import { useEffect, useState } from 'react';
import {
  clearRaceConfig,
  loadRaceConfig,
  normalizeRaceConfig,
  saveRaceConfig,
  STORAGE_KEY,
} from '../storage/raceStorage.js';

export function useRaceConfig() {
  const [config, setConfig] = useState(loadRaceConfig);

  useEffect(() => {
    saveRaceConfig(config);
  }, [config]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        setConfig(loadRaceConfig());
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function updateSettings(nextSettings) {
    setConfig((currentConfig) =>
      normalizeRaceConfig({
        ...currentConfig,
        settings: {
          ...currentConfig.settings,
          ...nextSettings,
        },
      }),
    );
  }

  function updateSeller(id, nextSeller) {
    setConfig((currentConfig) =>
      normalizeRaceConfig({
        ...currentConfig,
        sellers: currentConfig.sellers.map((seller) =>
          seller.id === id ? { ...seller, ...nextSeller } : seller,
        ),
      }),
    );
  }

  function addSeller() {
    setConfig((currentConfig) => {
      const nextNumber = currentConfig.sellers.length + 1;

      return normalizeRaceConfig({
        ...currentConfig,
        sellers: [
          ...currentConfig.sellers,
          {
            id: `vendedor-${Date.now()}`,
            nombre: `Vendedor ${nextNumber}`,
            cajasVendidas: 0,
            objetivoCajas: currentConfig.settings.goalBoxes,
            colorAuto: '#3a86ff',
            fotoUrl: '',
            genero: '',
            tipoAvatar: 'iniciales',
          },
        ],
      });
    });
  }

  function removeSeller(id) {
    setConfig((currentConfig) =>
      normalizeRaceConfig({
        ...currentConfig,
        sellers: currentConfig.sellers.filter((seller) => seller.id !== id),
      }),
    );
  }

  function resetConfig() {
    clearRaceConfig();
    setConfig(loadRaceConfig());
  }

  function replaceConfig(nextConfig) {
    setConfig(normalizeRaceConfig(nextConfig));
  }

  return {
    config,
    updateSettings,
    updateSeller,
    addSeller,
    removeSeller,
    resetConfig,
    replaceConfig,
  };
}
