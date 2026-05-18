import { DEFAULT_RACE_CONFIG } from '../data/MockSalesData.js';

const STORAGE_KEY = 'app-carreras-race-config-v1';

function asNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeSeller(seller, index) {
  const name = seller?.nombre?.trim() || `Vendedor ${index + 1}`;
  const color = /^#[0-9a-f]{6}$/i.test(seller?.colorAuto || '') ? seller.colorAuto : '#3a86ff';

  return {
    id: seller?.id || name.toLowerCase().replaceAll(' ', '-') || `seller-${index + 1}`,
    nombre: name,
    cajasVendidas: Math.max(0, asNumber(seller?.cajasVendidas, 0)),
    objetivoCajas: Math.max(1, asNumber(seller?.objetivoCajas, 60)),
    colorAuto: color,
    fotoUrl: seller?.fotoUrl || '',
    fotoDataUrl: seller?.fotoDataUrl || '',
    fotoMimeType: seller?.fotoMimeType || '',
    fotoOriginalName: seller?.fotoOriginalName || '',
    genero: seller?.genero || '',
    tipoAvatar: seller?.tipoAvatar || 'iniciales',
  };
}

export function normalizeRaceConfig(config) {
  const sellers = Array.isArray(config?.sellers) ? config.sellers : DEFAULT_RACE_CONFIG.sellers;

  return {
    settings: {
      ...DEFAULT_RACE_CONFIG.settings,
      ...(config?.settings || {}),
      goalBoxes: Math.max(1, asNumber(config?.settings?.goalBoxes, 60)),
    },
    sellers: sellers.map(normalizeSeller),
  };
}

export function loadRaceConfig() {
  if (typeof window === 'undefined') {
    return DEFAULT_RACE_CONFIG;
  }

  const savedConfig = window.localStorage.getItem(STORAGE_KEY);

  if (!savedConfig) {
    return normalizeRaceConfig(DEFAULT_RACE_CONFIG);
  }

  try {
    return normalizeRaceConfig(JSON.parse(savedConfig));
  } catch {
    return normalizeRaceConfig(DEFAULT_RACE_CONFIG);
  }
}

export function saveRaceConfig(config) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeRaceConfig(config)));
}

export function clearRaceConfig() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY };
