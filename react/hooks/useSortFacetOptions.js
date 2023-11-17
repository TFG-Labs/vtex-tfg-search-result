const clothingSizes = [
  'xxs',
  '2xs',
  'xs',
  'xs - s',
  's',
  'small',
  's - m',
  's-m',
  'sml/med',
  'm',
  'medium',
  'm - l',
  'm-l',
  'l',
  'large',
  'l - xl',
  'l-xl',
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
  'double',
  'queen',
  'king',
  'super-king',
]

const useSortFacetOptions = (facet, options) => {
  if (facet === 'Size') {
    // clothing sizes from 2xs to 5xl

    const clothingSizesOptions = options.filter(option =>
      clothingSizes.includes(option.name.toLowerCase())
    )

    const bedSizeOptions = options.filter(option =>
      bedSizes.includes(option.name.toLowerCase())
    )

    const otherSizeOptions = options.filter(
      option =>
        ![...clothingSizes, ...bedSizes].includes(option.name.toLowerCase())
    )

    otherSizeOptions.sort((a, b) => {
      // remove non-digits from start of string (eg. ±40cm)
      const aName = parseFloat(a.name.replace(/^\D+/g, ''))
      const bName = parseFloat(b.name.replace(/^\D+/g, ''))

      if (aName < bName) return -1
      if (aName > bName) return 1

      return 0
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

    return [...clothingSizesOptions, ...bedSizeOptions, ...otherSizeOptions]
  }

  return options
}

export default useSortFacetOptions
