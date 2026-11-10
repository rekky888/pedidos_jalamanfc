// ============================================================
//  CONFIGURACIÓN DEL JALAMAN FC  ·  edita aquí tus enlaces
// ============================================================

// URL de tu Web App de Google Apps Script (termina en /exec).
// Mientras esté vacía, el formulario SIMULA el envío (útil para probar la web).
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhPKbAI19mKadVWbVYUtewVcvpRHVJs8wi-e1GjhHrrU8N93qwiNGA7Da9LnI6NXIQUg/exec'

// Número de teléfono al que se envía el Bizum (se muestra en la web y en el formulario).
export const BIZUM_PHONE = '602 45 83 22'

// Fecha límite para hacer pedidos (30 de noviembre a las 23:59:59)
export const ORDER_DEADLINE = '2026-11-30T23:59:59+01:00'

export const LINKS = {
  instagram: 'https://www.instagram.com/jalamanfc', // Cambia por vuestro usuario
  email: 'jalamanfc@gmail.com', // Cambia por vuestro correo
}

export const PRICES = {
  shirt: 25,
  kit: 35,
}

// Tallas disponibles en el formulario
export const KIDS_SIZES = ['4', '6', '8', '10', '12', '14', '16']
export const ADULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
export const SHIRT_SIZES = [...KIDS_SIZES, ...ADULT_SIZES]
