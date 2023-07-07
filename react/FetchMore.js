import React from 'react'
// eslint-disable-next-line no-restricted-imports
import classNames from 'classnames'
import PropTypes from 'prop-types'

import styles from './searchResult.css'

const FetchMore = () => {
  // const { pagination, searchQuery, maxItemsPerPage, page } = useSearchPage()
  // const products = path(['data', 'productSearch', 'products'], searchQuery)
  // const recordsFiltered = path(
  //   ['data', 'productSearch', 'recordsFiltered'],
  //   searchQuery
  // )

  // const fetchMore = path(['fetchMore'], searchQuery)
  // const queryData = {
  //   query: path(['variables', 'query'], searchQuery),
  //   map: path(['variables', 'map'], searchQuery),
  //   orderBy: path(['variables', 'orderBy'], searchQuery),
  //   priceRange: path(['variables', 'selectedFacets'], searchQuery)?.find(
  //     facet => facet.key === 'priceRange'
  //   )?.value,
  // }

  // const { handleFetchMoreNext, loading, to, nextPage } = useFetchMore({
  //   page,
  //   recordsFiltered,
  //   maxItemsPerPage,
  //   fetchMore,
  //   products,
  //   queryData,
  // })

  // const isShowMore = pagination === PAGINATION_TYPE.SHOW_MORE

  return (
    <div
      className={classNames(
        styles['buttonShowMore--layout'],
        'w-100 flex justify-center'
      )}
    >
      {/* <FetchMoreButton
          products={products}
          to={to}
          recordsFiltered={recordsFiltered}
          onFetchMore={handleFetchMoreNext}
          loading={loading}
          showProductsCount={false}
          htmlElementForButton={htmlElementForButton}
          nextPage={nextPage}
        /> */}
    </div>
  )
}

FetchMore.propTypes = {
  /* html element to render for fetch more button */
  htmlElementForButton: PropTypes.string,
}

FetchMore.schema = {
  title: 'admin/editor.search-result.fetch-more',
}

export default FetchMore
