// Tabla de medidas (cm, prenda en plano): [talla, largo, ancho]
export const SIZE_DATA = {
  shirt: [
    {
      group: 'kids',
      rows: [
        ['4', 32, 31], ['6', 34, 33], ['8', 37, 35], ['10', 39, 37],
        ['12', 44, 39], ['14', 47, 42], ['16', 51, 44],
      ],
    },
    {
      group: 'adults',
      rows: [
        ['S', 55, 47], ['M', 57, 50], ['L', 59, 52], ['XL', 61, 56],
        ['XXL', 64, 59], ['3XL', 68, 64], ['4XL', 68, 70],
      ],
    },
  ],
  shorts: [
    {
      group: 'adults',
      rows: [
        ['2XS', 40, 30], ['XS', 42, 32], ['S', 44, 34], ['M', 46, 36],
        ['L', 48, 38], ['XL', 50, 40], ['XXL', 52, 42],
      ],
    },
  ],
}

// Busca la medida [largo, ancho] de una talla adulta
export const findSize = (type, size) => {
  const groups = SIZE_DATA[type]
  const adult = groups.find((g) => g.group === 'adults')
  const row = adult?.rows.find((r) => r[0] === size)
  return row ? { length: row[1], width: row[2] } : null
}
