import classNames from 'classnames'
import React, { useContext, useMemo, useState } from 'react'
import { applyModifiers } from 'vtex.css-handles'
import { usePixel } from 'vtex.pixel-manager'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { Checkbox } from 'vtex.styleguide'

import { FACETS_RENDER_THRESHOLD } from '../constants/filterConstants'
import styles from '../searchResult.css'
import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'
import { SearchFilterBar } from './SearchFilterBar'
import SettingsContext from './SettingsContext'
import ShowMoreFilterButton from './ShowMoreFilterButton'

const useSettings = () => useContext(SettingsContext)

const FacetCheckboxList = ({
  facets,
  onFilterCheck,
  facetTitle,
  quantity,
  truncateFilters,
  navigationType,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
}) => {
  const { push } = usePixel()
  const { searchQuery } = useSearchPage()
  const { showFacetQuantity } = useContext(SettingsContext)
  const { getSettings } = useRuntime()
  const { thresholdForFacetSearch } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [truncated, setTruncated] = useState(true)
  const isLazyFacetsFetchEnabled =
    getSettings('vtex.store')?.enableFiltersFetchOptimization

  const sampling = searchQuery?.facets?.sampling

  const filteredFacets = useMemo(() => {
    if (thresholdForFacetSearch === undefined || searchTerm === '') {
      return facets
    }

    return facets.filter(
      facet => facet.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    )
  }, [facets, searchTerm, thresholdForFacetSearch])

  const shouldTruncate =
    navigationType === 'collapsible' &&
    truncateFilters &&
    // The "+ 1" prevents from truncating a single value
    quantity > FACETS_RENDER_THRESHOLD + 1

  const endSlice =
    shouldTruncate && truncated
      ? FACETS_RENDER_THRESHOLD
      : filteredFacets.length

  const showSearchBar =
    thresholdForFacetSearch !== undefined &&
    thresholdForFacetSearch < facets.length

  const openTruncated = value => {
    if (isLazyFacetsFetchEnabled && !truncatedFacetsFetched) {
      setTruncatedFacetsFetched(true)
    }

    setTruncated(value)
  }

  return (
    <>
      {showSearchBar ? (
        <SearchFilterBar name={facetTitle} handleChange={setSearchTerm} />
      ) : null}
      {filteredFacets.slice(0, endSlice).map(facet => {
        const { name, value: slugifiedName } = facet

        return (
          <div
            className={classNames(
              applyModifiers(styles.filterAccordionItemBox, slugifiedName),
              'pr4 pt3 items-center flex bb b--muted-5'
            )}
            key={name}
            style={{ hyphens: 'auto', wordBreak: 'break-word' }}
          >
            <Checkbox
              className="mb0"
              checked={facet.selected}
              id={name}
              label={facet.name}
              name={name}
              onChange={() => {
                pushFilterManipulationPixelEvent({
                  name: facetTitle,
                  value: name,
                  products: searchQuery?.products ?? [],
                  push,
                })

                onFilterCheck({ ...facet, title: facetTitle })
              }}
              value={name}
            />{' '}
            {showFacetQuantity && !sampling && facet.quantity && (
              <span className="thefoschini-search-result-3-x-filterItemQuantity">
                ({facet.quantity})
              </span>
            )}
          </div>
        )
      })}
      {shouldTruncate && (
        <ShowMoreFilterButton
          quantity={quantity - FACETS_RENDER_THRESHOLD}
          truncated={truncated}
          toggleTruncate={() => openTruncated(prevTruncated => !prevTruncated)}
        />
      )}
    </>
  )
}

export default FacetCheckboxList
