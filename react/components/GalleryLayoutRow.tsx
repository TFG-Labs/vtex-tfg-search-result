/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ComponentType } from 'react'
import React, { memo } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'

import { useRenderOnView } from '../hooks/useRenderOnView'
// import GalleryItem from './GalleryLayoutItem'
import type { Product } from '../Gallery'
import type { PreferredSKU } from '../GalleryLayout'

const CSS_HANDLES = ['galleryItem'] as const

interface GalleryLayoutRowProps {
  currentLayoutName: string
  displayMode: string
  GalleryItemComponent: ComponentType
  itemsPerRow: number
  lazyRender: boolean
  products: Product[]
  summary: unknown
  rowIndex: number
  listName: string
  /** Logic to enable which SKU will be the selected item */
  preferredSKU?: PreferredSKU
}

const GalleryLayoutRow: React.FC<GalleryLayoutRowProps> = ({
  displayMode,
  itemsPerRow,
  lazyRender,
  products,
  currentLayoutName,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const style = {
    flexBasis: `${100 / itemsPerRow}%`,
    maxWidth: `${100 / itemsPerRow}%`,
  }

  const { hasBeenViewed, dummyElement } = useRenderOnView({
    lazyRender,
    offset: 900,
  })

  if (!hasBeenViewed) {
    return dummyElement
  }

  return (
    <>
      {products.map(product => {
        return (
          <div
            key={product.cacheId}
            style={style}
            className={classNames(
              applyModifiers(handles.galleryItem, [
                displayMode,
                currentLayoutName,
              ]),
              'pa4'
            )}
          >
            <div style={{ width: 100, height: 100, backgroundColor: 'red' }} />
            {/* <GalleryItem
              GalleryItemComponent={GalleryItemComponent}
              item={product}
              summary={summary}
              displayMode={displayMode}
              position={absoluteProductIndex}
              listName={listName}
              preferredSKU={preferredSKU}
            /> */}
          </div>
        )
      })}
    </>
  )
}

export default memo(GalleryLayoutRow)
