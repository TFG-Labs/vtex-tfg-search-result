/* eslint-disable @typescript-eslint/no-unused-vars */
// import type { ProductTypes } from 'vtex.product-context'

export const DEFAULT_WIDTH = 'auto'
export const DEFAULT_HEIGHT = 'auto'
export const MAX_WIDTH = 3000
export const MAX_HEIGHT = 4000

export type PreferenceType =
  | 'FIRST_AVAILABLE'
  | 'LAST_AVAILABLE'
  | 'PRICE_ASC'
  | 'PRICE_DESC'

const baseUrlRegex = new RegExp(/.+ids\/(\d+)/)

const httpRegex = new RegExp(/http:\/\//)

function getParamFromUrl(url: string, name: string) {
  return (url?.split(`${name}=`)[1] ?? '')?.split('&')[0]
}

function toHttps(url: string) {
  return url.replace(httpRegex, 'https://')
}

export function cleanImageUrl(imageUrl: string) {
  const cleanUrlResult = baseUrlRegex.exec(imageUrl)
  const vParam = getParamFromUrl(imageUrl, 'v')

  if (cleanUrlResult && cleanUrlResult.length > 0) {
    return {
      cleanUrl: cleanUrlResult[0],
      vParam,
    }
  }

  return { cleanUrl: imageUrl }
}

function replaceLegacyFileManagerUrl(
  imageUrl: string,
  width: string | number,
  height: string | number
) {
  const legacyUrlPattern = '/arquivos/ids/'
  const isLegacyUrl = imageUrl.includes(legacyUrlPattern)

  if (!isLegacyUrl) return imageUrl

  const { vParam, cleanUrl } = cleanImageUrl(imageUrl)

  return vParam
    ? `${cleanUrl}-${width}-${height}?v=${vParam}`
    : `${cleanUrl}-${width}-${height}`
}

export function changeImageUrlSize(
  imageUrl: string,
  width: string | number = DEFAULT_WIDTH,
  height: string | number = DEFAULT_HEIGHT
) {
  if (!imageUrl) return
  typeof width === 'number' && (width = Math.min(width, MAX_WIDTH))
  typeof height === 'number' && (height = Math.min(height, MAX_HEIGHT))

  const normalizedImageUrl = replaceLegacyFileManagerUrl(
    imageUrl,
    width,
    height
  )

  const queryStringSeparator = normalizedImageUrl.includes('?') ? '&' : '?'

  return `${normalizedImageUrl}${queryStringSeparator}width=${width}&height=${height}&aspect=true`
}

export const resizeImage = (url: string, imageSize: string | number) =>
  changeImageUrlSize(toHttps(url), imageSize)
