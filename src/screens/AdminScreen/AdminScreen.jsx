import { useMemo, useState } from 'react';
import { useRaceConfig } from '../../hooks/useRaceConfig.js';
import './AdminScreen.css';

const avatarTypes = ['iniciales', 'foto'];
const genderOptions = ['', 'masculino', 'femenino', 'otro'];
const allowedPhotoTypes = ['image/png', 'image/jpeg', 'image/webp'];
const recommendedPhotoSize = 2 * 1024 * 1024;
const maxPhotoDimension = 300;

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function getPublicRaceUrl() {
  return `${window.location.origin}${window.location.pathname.replace(/\/admin\/?$/, '')}/race/`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo procesar la imagen'));
    image.src = dataUrl;
  });
}

async function resizeVendorPhoto(file) {
  const sourceDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceDataUrl);
  const ratio = Math.min(1, maxPhotoDimension / image.width, maxPhotoDimension / image.height);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL(outputType, 0.84),
    mimeType: outputType,
    width,
    height,
  };
}

export default function AdminScreen() {
  const {
    config,
    updateSettings,
    updateSeller,
    addSeller,
    removeSeller,
    resetConfig,
    replaceConfig,
  } = useRaceConfig();
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('Cambios guardados en este navegador');

  const exportText = useMemo(() => JSON.stringify(config, null, 2), [config]);

  function handleNumberChange(sellerId, field, value) {
    updateSeller(sellerId, {
      [field]: value === '' ? 0 : Number(value),
    });
  }

  async function handleVendorPhotoUpload(vendorId, file) {
    if (!file) {
      return;
    }

    if (!allowedPhotoTypes.includes(file.type)) {
      setMessage('Formato no valido. Usar PNG, JPG o WebP.');
      return;
    }

    try {
      const result = await resizeVendorPhoto(file);

      updateSeller(vendorId, {
        fotoDataUrl: result.dataUrl,
        fotoMimeType: result.mimeType,
        fotoOriginalName: file.name,
        tipoAvatar: 'foto',
      });

      setMessage(
        file.size > recommendedPhotoSize
          ? 'Imagen grande comprimida automaticamente a 300 px'
          : 'Foto cargada y optimizada',
      );
    } catch {
      setMessage('No se pudo cargar la imagen');
    }
  }

  function removeVendorPhoto(vendorId) {
    updateSeller(vendorId, {
      fotoDataUrl: '',
      fotoMimeType: '',
      fotoOriginalName: '',
      fotoUrl: '',
      tipoAvatar: 'iniciales',
    });
    setMessage('Foto quitada');
  }

  function handleImport() {
    try {
      replaceConfig(JSON.parse(importText));
      setMessage('Datos importados correctamente');
    } catch {
      setMessage('El JSON no es valido');
    }
  }

  function handleReset() {
    resetConfig();
    setImportText('');
    setMessage('Datos restaurados');
  }

  return (
    <main className="admin-screen">
      <header className="admin-header">
        <div>
          <p>Administracion</p>
          <h1>Carrera de Ventas</h1>
        </div>
        <nav className="admin-actions" aria-label="Acciones principales">
          <a className="admin-button admin-button--secondary" href={getPublicRaceUrl()}>
            Ver carrera
          </a>
          <button className="admin-button admin-button--danger" type="button" onClick={handleReset}>
            Restaurar
          </button>
        </nav>
      </header>

      <section className="admin-notice">
        <strong>{message}</strong>
        <span>
          Esta version guarda la configuracion en el navegador. Para editar desde una compu y verlo en
          la TV con otro dispositivo, el siguiente paso es conectar Firebase.
        </span>
      </section>

      <section className="admin-panel">
        <div className="admin-section-title">
          <h2>Textos de pantalla</h2>
          <span>Visible solo en /race</span>
        </div>
        <div className="admin-grid admin-grid--settings">
          <Field label="Titulo">
            <input
              value={config.settings.title}
              onChange={(event) => updateSettings({ title: event.target.value })}
            />
          </Field>
          <Field label="Subtitulo">
            <input
              value={config.settings.subtitle}
              onChange={(event) => updateSettings({ subtitle: event.target.value })}
            />
          </Field>
          <Field label="Etiqueta de meta">
            <input
              value={config.settings.goalLabel}
              onChange={(event) => updateSettings({ goalLabel: event.target.value })}
            />
          </Field>
          <Field label="Objetivo general">
            <input
              min="1"
              type="number"
              value={config.settings.goalBoxes}
              onChange={(event) => updateSettings({ goalBoxes: Number(event.target.value) })}
            />
          </Field>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-section-title">
          <h2>Vendedores</h2>
          <button className="admin-button" type="button" onClick={addSeller}>
            Agregar vendedor
          </button>
        </div>

        <div className="seller-editor">
          <div className="seller-editor__head" aria-hidden="true">
            <span>Nombre</span>
            <span>Cajas</span>
            <span>Objetivo</span>
            <span>Color</span>
            <span>Avatar</span>
            <span>Foto</span>
            <span>Genero</span>
            <span />
          </div>

          {config.sellers.map((seller) => (
            <article className="seller-editor__row" key={seller.id}>
              <Field label="Nombre">
                <input
                  value={seller.nombre}
                  onChange={(event) => updateSeller(seller.id, { nombre: event.target.value })}
                />
              </Field>
              <Field label="Cajas">
                <input
                  min="0"
                  type="number"
                  value={seller.cajasVendidas}
                  onChange={(event) =>
                    handleNumberChange(seller.id, 'cajasVendidas', event.target.value)
                  }
                />
              </Field>
              <Field label="Objetivo">
                <input
                  min="1"
                  type="number"
                  value={seller.objetivoCajas}
                  onChange={(event) =>
                    handleNumberChange(seller.id, 'objetivoCajas', event.target.value)
                  }
                />
              </Field>
              <Field label="Color">
                <div className="color-control">
                  <input
                    aria-label={`Color de auto de ${seller.nombre}`}
                    type="color"
                    value={seller.colorAuto}
                    onChange={(event) => updateSeller(seller.id, { colorAuto: event.target.value })}
                  />
                  <span>{seller.colorAuto}</span>
                </div>
              </Field>
              <Field label="Avatar">
                <select
                  value={seller.tipoAvatar}
                  onChange={(event) => updateSeller(seller.id, { tipoAvatar: event.target.value })}
                >
                  {avatarTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="admin-photo-field">
                <span>Foto</span>
                <div className="photo-control">
                  {(seller.fotoDataUrl || seller.fotoUrl) && (
                    <img
                      className="photo-control__preview"
                      src={seller.fotoDataUrl || seller.fotoUrl}
                      alt=""
                    />
                  )}
                  <div className="photo-control__actions">
                    <label className="photo-control__upload">
                      Subir foto
                      <input
                        accept="image/png,image/jpeg,image/webp"
                        type="file"
                        onChange={(event) => {
                          handleVendorPhotoUpload(seller.id, event.target.files?.[0]);
                          event.target.value = '';
                        }}
                      />
                    </label>
                    {(seller.fotoDataUrl || seller.fotoUrl) && (
                      <button
                        className="photo-control__remove"
                        type="button"
                        onClick={() => removeVendorPhoto(seller.id)}
                      >
                        Quitar
                      </button>
                    )}
                    <small>PNG recomendado</small>
                  </div>
                </div>
              </div>
              <Field label="Genero">
                <select
                  value={seller.genero}
                  onChange={(event) => updateSeller(seller.id, { genero: event.target.value })}
                >
                  {genderOptions.map((gender) => (
                    <option key={gender || 'none'} value={gender}>
                      {gender || 'sin dato'}
                    </option>
                  ))}
                </select>
              </Field>
              <button
                className="admin-icon-button"
                type="button"
                onClick={() => removeSeller(seller.id)}
                aria-label={`Eliminar ${seller.nombre}`}
              >
                ×
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel admin-panel--json">
        <div className="admin-section-title">
          <h2>Importar y exportar</h2>
          <button className="admin-button" type="button" onClick={handleImport}>
            Importar JSON
          </button>
        </div>
        <div className="admin-json-grid">
          <Field label="Export actual">
            <textarea readOnly value={exportText} />
          </Field>
          <Field label="Importar cambios">
            <textarea
              placeholder="Pegar JSON de configuracion"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
            />
          </Field>
        </div>
      </section>
    </main>
  );
}
