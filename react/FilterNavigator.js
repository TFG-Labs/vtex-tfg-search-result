import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo, Fragment, useState, useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
// eslint-disable-next-line no-restricted-imports
import { flatten } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import FilterSidebar from './components/FilterSidebar'
import SelectedFilters from './components/SelectedFilters'
import AvailableFilters from './components/AvailableFilters'
import DepartmentFilters from './components/DepartmentFilters'
import {
  facetOptionShape,
  paramShape,
  hiddenFacetsSchema,
} from './constants/propTypes'
import useFacetNavigation from './hooks/useFacetNavigation'
import FilterNavigatorTitleTag from './components/FilterNavigatorTitleTag'
import styles from './searchResult.css'
import { CATEGORIES_TITLE } from './utils/getFilters'
import { newFacetPathName } from './utils/slug'
import { FACETS_RENDER_THRESHOLD } from './constants/filterConstants'

const CSS_HANDLES = [
  'filter__container',
  'filtersWrapper',
  'filtersWrapperMobile',
  'clearAllFilters',
]

const LAYOUT_TYPES = {
  responsive: 'responsive',
  desktop: 'desktop',
  phone: 'phone',
}

const DRAWER_DIRECTION_MOBILE = {
  drawerRight: 'drawerRight',
  drawerLeft: 'drawerLeft',
}

const getSelectedCategories = tree => {
  for (const node of tree) {
    if (!node.selected) {
      continue
    }

    if (node.children) {
      return [node, ...getSelectedCategories(node.children)]
    }

    return [node]
  }

  return []
}

const newNamedFacet = facet => {
  return { ...facet, newQuerySegment: newFacetPathName(facet) }
}

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
const FilterNavigator = ({
  priceRange,
  tree = [],
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  loading = false,
  filters = [],
  preventRouteChange = false,
  hiddenFacets = {},
  initiallyCollapsed = false,
  truncateFilters = false,
  layout = LAYOUT_TYPES.responsive,
  maxItemsDepartment = 8,
  maxItemsCategory = 8,
  categoryFiltersMode = 'default',
  filtersTitleHtmlTag = 'h5',
  scrollToTop = 'none',
  openFiltersMode = 'many',
  filtersFetchMore,
  closeOnOutsideClick = false,
  appliedFiltersOverview = 'hide',
  totalProductsOnMobile = 'hide',
  fullWidthOnMobile = false,
  navigationTypeOnMobile = 'page',
  updateOnFilterSelectionOnMobile = false,
  drawerDirectionMobile = DRAWER_DIRECTION_MOBILE.drawerLeft,
  showClearByFilter = false,
  showClearAllFiltersOnDesktop = false,
  priceRangeLayout = 'slider',
  showQuantityBadgeOnMobile = false,
}) => {
  const { isMobile } = useDevice()
  const handles = useCssHandles(CSS_HANDLES)
  const [truncatedFacetsFetched, setTruncatedFacetsFetched] = useState(false)

  const mobileLayout =
    (isMobile && layout === LAYOUT_TYPES.responsive) ||
    layout === LAYOUT_TYPES.mobile ||
    layout === LAYOUT_TYPES.phone

  const filtersDrawerDirectionMobile =
    DRAWER_DIRECTION_MOBILE[drawerDirectionMobile] ??
    DRAWER_DIRECTION_MOBILE.drawerLeft

  useEffect(() => {
    // This condition confirms if there are facets that still need fetching
    const needsFetching = !!filters.find(
      filter => filter.quantity > filter.facets.length
    )

    if (truncatedFacetsFetched && needsFetching && !loading) {
      filtersFetchMore({
        variables: {
          from: FACETS_RENDER_THRESHOLD,
          to: undefined, // to the end of the results
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!prevResult || !fetchMoreResult) {
            return
          }

          const prevFacets = prevResult.facets.facets
          const newFacets = fetchMoreResult.facets.facets
          const fullFacets = []

          for (let i = 0; i < prevFacets.length; i++) {
            const completeFacets = [
              ...prevFacets[i].facets,
              ...newFacets[i].facets,
            ]

            fullFacets.push({
              ...prevFacets[i],
              facets: completeFacets,
            })
          }

          return {
            facets: {
              ...prevResult.facets,
              facets: fullFacets,
            },
          }
        },
      })
    }
  }, [filters, filtersFetchMore, truncatedFacetsFetched, loading])

  const selectedFilters = useMemo(() => {
    const options = [
      ...specificationFilters.map(filter => {
        return filter.facets.map(facet => {
          return {
            ...newNamedFacet({ ...facet, title: filter.name }),
            hidden: filter.hidden,
          }
        })
      }),
      ...brands,
      ...priceRanges,
    ]

    return flatten(options)
  }, [brands, priceRanges, specificationFilters]).filter(
    facet => facet.selected
  )

  const { searchQuery } = useSearchPage()
  const hasFiltersApplied = searchQuery?.variables?.selectedFacets?.length > 1

  const handleResetFilters = () => {
    navigateToFacet(selectedFilters, preventRouteChange)
  }

  const selectedCategories = getSelectedCategories(tree)
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedCategories.concat(selectedFilters)
    }, [selectedFilters, selectedCategories]),
    scrollToTop
  )

  const filterClasses = classNames({
    'flex items-center justify-center flex-auto h-100': mobileLayout,
    dn: loading,
  })

  return (
    <Fragment>
      {loading && !mobileLayout ? (
        <div className="mv5" style={{ marginTop: ''}}>
          <ContentLoader
            style={{
              width: '290px',
              height: '1000px',
            }}
            width="290"
            height="1000"
            y="0"
            x="0"
          >
            <rect width="100%" height="56px" y="16px" />
            <rect width="100%" height="56px" y="80px" />
            <rect width="100%" height="56px" y="144px" />
            <rect width="100%" height="56px" y="208px" />
            <rect width="100%" height="56px" y="272px" />
            <rect width="100%" height="56px" y="336px" />
            <rect width="100%" height="56px" y="400px" />
            <rect width="100%" height="56px" y="464px" />
            <rect width="100%" height="56px" y="528px" />
            <rect width="100%" height="56px" y="592px" />
            <rect width="100%" height="56px" y="656px" />
            <rect width="100%" height="56px" y="720px" />
            <rect width="100%" height="56px" y="784px" />
            <rect width="100%" height="56px" y="848px" />
            <rect width="100%" height="56px" y="912px" />
            <rect width="100%" height="56px" y="976px" />
            <rect width="100%" height="56px" y="1040px" />
            <rect width="100%" height="56px" y="1104px" />
            <rect width="100%" height="56px" y="1168px" />
            <rect width="100%" height="56px" y="1232px" />
          </ContentLoader>
        </div>
      ) : null}

      {mobileLayout ? (
        <div className={styles.filters}>
          <div className={`${filterClasses} ${handles.filtersWrapperMobile}`}>
            <FilterSidebar
              selectedFilters={selectedCategories.concat(selectedFilters)}
              filters={filters}
              tree={tree}
              priceRange={priceRange}
              preventRouteChange={preventRouteChange}
              navigateToFacet={navigateToFacet}
              appliedFiltersOverview={appliedFiltersOverview}
              totalProductsOnMobile={totalProductsOnMobile}
              fullWidth={fullWidthOnMobile}
              navigationType={navigationTypeOnMobile}
              initiallyCollapsed={initiallyCollapsed}
              truncateFilters={truncateFilters}
              truncatedFacetsFetched={truncatedFacetsFetched}
              setTruncatedFacetsFetched={setTruncatedFacetsFetched}
              categoryFiltersMode={categoryFiltersMode}
              loading={loading}
              updateOnFilterSelectionOnMobile={updateOnFilterSelectionOnMobile}
              showClearByFilter={showClearByFilter}
              priceRangeLayout={priceRangeLayout}
              filtersDrawerDirectionMobile={filtersDrawerDirectionMobile}
              showQuantityBadgeOnMobile={showQuantityBadgeOnMobile}
            />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className={`${filterClasses} ${handles.filtersWrapper}`}>
            <div
              className={`${applyModifiers(
                handles.filter__container,
                'title'
              )} bb b--muted-4`}
            >
              <FilterNavigatorTitleTag
                filtersTitleHtmlTag={filtersTitleHtmlTag}
              />
            </div>
            <SelectedFilters
              filters={selectedFilters}
              preventRouteChange={preventRouteChange}
              navigateToFacet={navigateToFacet}
            />
            <DepartmentFilters
              title={CATEGORIES_TITLE}
              tree={tree}
              isVisible={!hiddenFacets.categories}
              onCategorySelect={navigateToFacet}
              preventRouteChange={preventRouteChange}
              maxItemsDepartment={maxItemsDepartment}
              maxItemsCategory={maxItemsCategory}
              categoryFiltersMode={categoryFiltersMode}
            />
            <AvailableFilters
              filters={filters}
              priceRange={priceRange}
              preventRouteChange={preventRouteChange}
              initiallyCollapsed={initiallyCollapsed}
              navigateToFacet={navigateToFacet}
              truncatedFacetsFetched={truncatedFacetsFetched}
              setTruncatedFacetsFetched={setTruncatedFacetsFetched}
              truncateFilters={truncateFilters}
              openFiltersMode={openFiltersMode}
              closeOnOutsideClick={closeOnOutsideClick}
              appliedFiltersOverview={appliedFiltersOverview}
              showClearByFilter={showClearByFilter}
              priceRangeLayout={priceRangeLayout}
              scrollToTop={scrollToTop}
            />
            {showClearAllFiltersOnDesktop && hasFiltersApplied && (
              <div
                className={`${applyModifiers(
                  handles.filter__container,
                  'clearAllFilters'
                )} bb b--muted-4`}
              >
                <Button onClick={handleResetFilters}>
                  <FormattedMessage id="store/search-result.filter-button.clearAll" />
                </Button>
              </div>
            )}
          </div>
          <ExtensionPoint id="shop-review-summary" />
        </Fragment>
      )}
    </Fragment>
  )
}

FilterNavigator.propTypes = {
  /** Categories tree */
  tree: PropTypes.arrayOf(facetOptionShape),
  /** Params from pages */
  params: paramShape,
  /** List of brand filters (e.g. Samsung) */
  brands: PropTypes.arrayOf(facetOptionShape),
  /** List of specification filters (e.g. Android 7.0) */
  specificationFilters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      facets: PropTypes.arrayOf(facetOptionShape),
    })
  ),
  /** List of price ranges filters (e.g. from-0-to-100) */
  priceRanges: PropTypes.arrayOf(facetOptionShape),
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
  /** Loading indicator */
  loading: PropTypes.bool,
  layout: PropTypes.oneOf(Object.values(LAYOUT_TYPES)),
  filtersDrawerDirectionMobile: PropTypes.oneOf(
    Object.values(DRAWER_DIRECTION_MOBILE)
  ),
  initiallyCollapsed: PropTypes.bool,
  truncateFilters: PropTypes.bool,
  filtersTitleHtmlTag: PropTypes.string,
  /** Whether an overview of the applied filters should be displayed (`"show"`) or not (`"hide"`). */
  appliedFiltersOverview: PropTypes.string,
  ...hiddenFacetsSchema,
}

export default FilterNavigator
