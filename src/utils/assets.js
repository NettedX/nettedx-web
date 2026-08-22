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
  return ASSETS[code]?.decimals ?? 0
}

// 将人类可读数量转换为对应 ERC-20 代币的最小单位整数
export function toBaseUnits(amount, code) {
  const decimals = getAssetDecimals(code)
  return Math.round(Number(amount) * 10 ** decimals)
}
