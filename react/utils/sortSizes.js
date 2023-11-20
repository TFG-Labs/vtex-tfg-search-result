const clothingSizes = [
  'xxs',
  '2xs',
  'xs',
  'xs - s',
  'xs/s',
  's',
  'small',
  's - m',
  's-m',
  'sml/med',
  's/m',
  'm',
  'medium',
  'm - l',
  'm-l',
  'ml',
  'm/l',
  'l',
  'large',
  'l - xl',
  'l-xl',
  'l/xl',
  'lrg/xlrg',
  'xl',
  'xxl',
  '2xl',
  'xxxl',
  '3xl',
  'xxxxl',
  '4xl',
  'xxxxxl',
  '5xl',
]

const bedSizes = [
  'single',
  'three-quarter',
  'threeqtr',
  'double',
  'queen',
  'king',
  'kingxl',
  'super-king',
]

const pillowSizes = ['standard', 'emporer']
const towelSizes = [
  'facecloth',
  'face cloth',
  'handtowel',
  'hand towel',
  'bathtowel',
  'bath towel',
  'bathsheet',
  'bath sheet',
]

const sortSizes = (facet, options) => {
  if (facet === 'Size') {
    // clothing sizes from 2xs to 5xl
    const clothingSizesOptions = options.filter(option =>
      clothingSizes.includes(option.name.toLowerCase())
    )

    const bedSizeOptions = options.filter(option =>
      bedSizes.includes(option.name.toLowerCase())
    )

    const pillowSizeOptions = options.filter(option =>
      pillowSizes.includes(option.name.toLowerCase())
    )

    const towelSizeOptions = options.filter(option =>
      towelSizes.includes(option.name.toLowerCase())
    )

    const otherSizeOptions = options.filter(
      option =>
        ![
          ...clothingSizes,
          ...bedSizes,
          ...pillowSizes,
          ...towelSizes,
        ].includes(option.name.toLowerCase())
    )

    otherSizeOptions.sort((a, b) => {
      // remove non-number, non-alpha from start of string (eg. ±40cm)
      const aName = parseFloat(
        a.name.toLowerCase().replace(/^[^a-zA-Z0-9]+/, '')
      )

      const bName = parseFloat(
        b.name.toLowerCase().replace(/^[^a-zA-Z0-9]+/, '')
      )

      if (!Number.isNaN(aName) && !Number.isNaN(bName)) {
        if (aName < bName) return -1
        if (aName > bName) return 1
      }

      if (!Number.isNaN(aName) && Number.isNaN(bName)) {
        return -1
      }

      if (Number.isNaN(aName) && !Number.isNaN(bName)) {
        return 1
      }

      return a.name.localeCompare(b.name)
    })

    // sort clothing sizes by index in clothingSizes array
    clothingSizesOptions.sort(
      (a, b) =>
        clothingSizes.indexOf(a.name.toLowerCase()) -
        clothingSizes.indexOf(b.name.toLowerCase())
    )

    // sort bed sizes by index in bedSizes array
    bedSizeOptions.sort(
      (a, b) =>
        bedSizes.indexOf(a.name.toLowerCase()) -
        bedSizes.indexOf(b.name.toLowerCase())
    )

    pillowSizeOptions.sort(
      (a, b) =>
        pillowSizes.indexOf(a.name.toLowerCase()) -
        pillowSizes.indexOf(b.name.toLowerCase())
    )

    towelSizeOptions.sort(
      (a, b) =>
        towelSizes.indexOf(a.name.toLowerCase()) -
        towelSizes.indexOf(b.name.toLowerCase())
    )

    return [
      ...clothingSizesOptions,
      ...bedSizeOptions,
      ...pillowSizeOptions,
      ...towelSizeOptions,
      ...otherSizeOptions,
    ]
  }

  return options
}

export default sortSizes
