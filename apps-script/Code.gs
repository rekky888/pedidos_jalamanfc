/**
 * JALAMAN FC · Recepción de pedidos (Google Apps Script)
 *
 * CÓMO INSTALARLO
 * 1. Crea una Hoja de cálculo de Google nueva.
 * 2. Menú Extensiones → Apps Script. Borra lo que haya y pega este archivo.
 * 3. Guarda y pulsa Implementar → Nueva implementación → Tipo: "Aplicación web".
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier usuario
 * 4. Autoriza los permisos y copia la URL que termina en /exec.
 * 5. Pégala en src/config.js → APPS_SCRIPT_URL.
 *
 * Si modificas este código, vuelve a implementar (Gestionar implementaciones → Editar → Nueva versión).
 */

const SHEET_NAME = 'Pedidos'

const HEADERS = [
  'Fecha',
  'Nombre y apellidos',
  'Teléfono',
  'Producto',
  'Precio (€)',
  'Talla camiseta',
  'Talla pantalón',
  'Dorsal',
  'Nombre espalda',
  'Bizum confirmado',
  'Idioma',
]

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getSheet_()

    sheet.appendRow([
      new Date(),
      data.nombre || '',
      "'" + (data.telefono || ''), // apóstrofo para que no se pierdan ceros/espacios
      data.producto || '',
      Number(data.precio) || '',
      data.tallaCamiseta || '',
      data.tallaPantalon || '',
      data.dorsal || '',
      data.nombreEspalda || '',
      data.bizumConfirmado || '',
      data.idioma || '',
    ])

    return json_({ result: 'success' })
  } catch (err) {
    return json_({ result: 'error', message: String(err) })
  } finally {
    lock.releaseLock()
  }
}

// Permite comprobar en el navegador que la URL funciona
function doGet() {
  return json_({ result: 'ok', message: 'Jalaman FC · API de pedidos activa' })
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#ff4fa3')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
