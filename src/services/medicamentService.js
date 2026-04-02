import axios from 'axios';
import { API_URL } from './authService';

const MEDICAMENT_RESOURCES = {
  medicaments: {
    label: 'médicaments',
    url: 'medicament/listemedicament_API',
  },
  familles: {
    label: 'familles',
    url: 'medicament/listefamille_API',
  },
  presentations: {
    label: 'présentations',
    url: 'medicament/listepresentation_API',
  },
  formuler: {
    label: 'formulations',
    url: 'medicament/listeformuler_API',
  },
  composants: {
    label: 'composants',
    url: 'medicament/listecomposant_API',
  },
  constituer: {
    label: 'liaisons constituer',
    url: 'medicament/listeconstituer_API',
  },
  prescrire: {
    label: 'prescriptions',
    url: 'medicament/listeprescrire_API',
  },
};

export const normalizeId = (value) => (value == null ? '' : String(value));

export const pickFirstValue = (record, keys, fallback = '') => {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return fallback;
};

export const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const fetchMedicamentData = async (token, keys) => {
  const headers = { Authorization: `Bearer ${token}` };
  const resources = keys
    .map((key) => ({ key, ...MEDICAMENT_RESOURCES[key] }))
    .filter((resource) => resource.url);

  const results = await Promise.allSettled(
    resources.map((resource) => axios.get(`${API_URL}${resource.url}`, { headers }))
  );

  const data = {};
  const warnings = [];

  results.forEach((result, index) => {
    const resource = resources[index];

    if (result.status === 'fulfilled') {
      data[resource.key] = Array.isArray(result.value.data) ? result.value.data : [];
      return;
    }

    data[resource.key] = [];
    warnings.push(resource.label);
    console.warn(`Impossible de charger ${resource.label}`, result.reason);
  });

  return { data, warnings };
};
