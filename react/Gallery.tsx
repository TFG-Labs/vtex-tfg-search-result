/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Fragment, useMemo } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { ProductList as ProductListStructuredData } from 'vtex.structured-data'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { ProductContextProvider } from 'vtex.product-context'
import { Link } from 'vtex.render-runtime'

import type { GalleryLayoutProps, Slots } from './GalleryLayout'
import type { GalleryProps as GalleryLegacyProps } from './GalleryLegacy'
import { changeImageUrlSize } from './utils/normalize'

const CSS_HANDLES = [
  'searchGrid',
  'searchColumn',
  'searchColumnImage',
  'searchProductName',
  'searchProductPrice',
  'searchProductListPrice',
  'addToListBtn',
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

export type PreferredSKU =
  | 'FIRST_AVAILABLE'
  | 'LAST_AVAILABLE'
  | 'PRICE_ASC'
  | 'PRICE_DESC'

const RenderImage = (item: Product, handles: Record<string, string>) => {
  const [product] = item.items

  const { isMobile } = useDevice()
  const resizedUrl = changeImageUrlSize(
    product.images[0].imageUrl,
    isMobile ? 179 : 280
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

const RenderPrice = (
  props: { product: Product },
  handles: Record<string, string>
) => {
  const { product } = props
  const commertialOffer = product?.sku?.seller?.commertialOffer

  return (
    <div>
      <p>
        <span className={handles.searchProductPrice}>
          {commertialOffer.Price.toLocaleString('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
          })}
        </span>
        <span className={handles.searchProductListPrice}>
          {commertialOffer.ListPrice > commertialOffer.Price
            ? commertialOffer.ListPrice.toLocaleString('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
              })
            : ''}
        </span>
      </p>
    </div>
  )
}

const Gallery: React.FC<
  GalleryLegacyProps | GalleryLayoutPropsWithSlots
> = props => {
  const handles = useCssHandles(CSS_HANDLES)

  const { products, preferredSKU } = props as GalleryLayoutPropsWithSlots

  const structuredData = useMemo(
    () =>
      products.map(item =>
        ProductSummary.mapCatalogProductToProductSummary(item, preferredSKU)
      ),
    [products, preferredSKU]
  )

  const GetStructuredData = (index: number) => structuredData[index]

  return (
    <Fragment>
      <ProductListStructuredData products={products} />

      <div className={handles.searchGrid}>
        {products.map((item: Product, index) => (
          <Link to={item.link} className={handles.searchColumn} key={index}>
            <div
              role="button"
              onKeyDown={() => {}}
              className={`${handles.addToListBtn} absolute z-1`}
            >
              <ProductContextProvider
                product={GetStructuredData(index)}
                query={{}}
              >
              </ProductContextProvider>
            </div>
            {RenderImage(item, handles)}
            <p className={handles.searchProductName}>{item.productName}</p>
            <p className={handles.searchProductName}>{item.brand}</p>
            {RenderPrice({ product: GetStructuredData(index) }, handles)}
          </Link>
        ))}
      </div>
    </Fragment>
  )
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

  sku: any
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
