// 可交易资产的元数据映射（名称、最小单位小数位等）
export const ASSETS = {
  USDC: { code: 'USDC', name: 'USDC', decimals: 6 },
  BOUND: { code: 'BOUND', name: 'BOUND', decimals: 0 },
}

export const ASSET_OPTIONS = Object.values(ASSETS).map((asset) => ({
  label: asset.name,
  value: asset.code,
}))

export function getAssetDecimals(code) {
  return ASSETS[code]?.decimals ?? 0
}

// 将人类可读数量转换为对应 ERC-20 代币的最小单位整数
export function toBaseUnits(amount, code) {
  const decimals = getAssetDecimals(code)
  return Math.round(Number(amount) * 10 ** decimals)
}
