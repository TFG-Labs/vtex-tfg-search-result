import React, { Fragment } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { ProductList as ProductListStructuredData } from 'vtex.structured-data'

// import GalleryLayout from './GalleryLayout'
import type { GalleryLayoutProps, Slots } from './GalleryLayout'
import type { GalleryProps as GalleryLegacyProps } from './GalleryLegacy'
import GalleryLegacy from './GalleryLegacy'
import { changeImageUrlSize } from './utils/normalize'

const CSS_HANDLES = [
  'searchGrid',
  'searchColumn',
  'searchColumnImage',
  'searchProductName',
]

/*
 * This type receives Slots directly, instead of using the 'slots' prop to do it.
 * Is the equivalent of adding '[key: string]: ComponentType' at the end of GalleryLayoutProps
 * and removing the 'slots' prop.
 */
type GalleryLayoutPropsWithSlots = Omit<GalleryLayoutProps, 'slots'> & Slots

/**
 * Refactor: This should be provided by the BFF in future as this is inefficient to do
 *
 */

type BaseAndRelativePath = {
  base: string
  relativePath: string
}
export function baseAndRelativePath(url: string): BaseAndRelativePath {
  const base = url.substring(0, url.lastIndexOf('/') + 1)
  const relativePath = url.substring(url.lastIndexOf('/') + 1, url.length)

  return {
    base,
    relativePath,
  }
}

export function resizePorportional(url: string, targetWidth: number): string {
  const { base, relativePath } = baseAndRelativePath(url)

  return `${base}${targetWidth}x/${relativePath}`
}

const RenderImage = (item: Product, handles: any) => {
  const [product] = item.items

  const { isMobile } = useDevice()
  const resizedUrl = changeImageUrlSize(
    product.images[0].imageUrl,
    isMobile ? 179 : 300
  )

  return (
    <div>
      <img
        className={handles.searchColumnImage}
        src={resizedUrl}
        alt={product.name}
      />
    </div>
  )
}

const Gallery: React.FC<
  GalleryLegacyProps | GalleryLayoutPropsWithSlots
> = props => {
  const handles = useCssHandles(CSS_HANDLES)

  if ('layouts' in props && props.layouts.length > 0) {
    const { products } = props as GalleryLayoutPropsWithSlots

    return (
      <Fragment>
        <ProductListStructuredData products={products} />

        <div className={handles.searchGrid}>
          {products.map((item: Product, index) => (
            <div className={handles.searchColumn} key={index}>
              {RenderImage(item, handles)}
              <p className={handles.searchProductName}>{item.productName}</p>
              <p className={handles.searchProductName}>{item.brand}</p>
            </div>
          ))}
        </div>
      </Fragment>
    )
  }

  return <GalleryLegacy {...(props as GalleryLegacyProps)} />
}

export interface Product {
  /** Product's id. */
  productId: string
  /** Product's cache id. */
  cacheId: string
  /** Product's name. */
  productName: string
  /** Product's description. */
  description: string
  /** Product's categories. */
  categories: unknown[]
  /** Product's link. */
  link?: string
  /** Product's link text. */
  linkText: string
  /** Product's brand. */
  brand?: string
  /** Product's SKU items. */
  items: ProductItem[]
}

interface ProductItemReference {
  Value: string
}

interface ProductItemImage {
  /** Images's imageUrl. */
  imageUrl: string
  /** Images's imageTag. */
  imageTag: string
}

interface ProductItemSeller {
  /** Sellers's commertialOffer. */
  commertialOffer: {
    /** CommertialOffer's price. */
    Price: number
    /** CommertialOffer's list price. */
    ListPrice: number
  }
}

interface ProductItem {
  /** SKU's id. */
  itemId: string
  /** SKU's name. */
  name: string
  /** SKU's referenceId. */
  referenceId?: ProductItemReference[]
  /** SKU's images. */
  images: ProductItemImage[]
  /** SKU's sellers. */
  sellers: ProductItemSeller[]
}

export default Gallery
