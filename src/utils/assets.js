// 可交易资产的元数据映射
export const ASSETS = {
  USDC: { code: 'USDC', name: 'Mock USDC', symbol: 'mUSDC', decimals: 6 },
  BOND: { code: 'BOND', name: 'Mock Bond', symbol: 'mBOND', decimals: 0 },
}

export const ASSET_OPTIONS = Object.values(ASSETS).map((asset) => ({
  label: `${asset.name} (${asset.symbol})`,
  value: asset.code,
}))

export function getAssetDecimals(code) {
  if (!code) {
    return 0
  }
  const normalizedCode = String(code).trim()
  if (!normalizedCode) {
    return 0
  }

  if (ASSETS[normalizedCode]) {
    return ASSETS[normalizedCode].decimals
  }

  const upperCode = normalizedCode.toUpperCase()
  if (ASSETS[upperCode]) {
    return ASSETS[upperCode].decimals
  }

  const matchedBySymbol = Object.values(ASSETS).find(
    (asset) =>
      String(asset.symbol).toUpperCase() === upperCode ||
      String(asset.code).toUpperCase() === upperCode,
  )
  return matchedBySymbol?.decimals ?? 0
}

// 将人类可读数量转换为对应 ERC-20 代币的最小单位整数
export function toBaseUnits(amount, code) {
  const decimals = getAssetDecimals(code)
  return Math.round(Number(amount) * 10 ** decimals)
}

// 将最小单位整数转换为人类可读字符串（按资产 decimals 处理）
export function fromBaseUnits(amount, code) {
  if (amount === null || amount === undefined || amount === '') {
    return '-'
  }

  const normalized = String(amount).trim()
  if (!/^-?\d+$/.test(normalized)) {
    return Number(amount).toLocaleString()
  }

  const negative = normalized.startsWith('-')
  const unsigned = negative ? normalized.slice(1) : normalized
  const decimals = getAssetDecimals(code)

  if (decimals <= 0) {
    return `${negative ? '-' : ''}${groupInteger(unsigned)}`
  }

  const padded = unsigned.padStart(decimals + 1, '0')
  const integerPart = padded.slice(0, -decimals)
  const fractionPart = padded.slice(-decimals).replace(/0+$/, '')
  const groupedInteger = groupInteger(integerPart)

  if (!fractionPart) {
    return `${negative ? '-' : ''}${groupedInteger}`
  }
  return `${negative ? '-' : ''}${groupedInteger}.${fractionPart}`
}

export function formatAssetAmount(amount, code) {
  return fromBaseUnits(amount, code)
}

function groupInteger(value) {
  const sanitized = value.replace(/^0+(?=\d)/, '') || '0'
  return sanitized.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
