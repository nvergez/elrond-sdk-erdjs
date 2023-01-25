export const TRANSACTION_MIN_GAS_PRICE = 1000000000;
export const TRANSACTION_OPTIONS_DEFAULT = 0;
export const TRANSACTION_OPTIONS_TX_HASH_SIGN = 1;
export const TRANSACTION_OPTIONS_TX_GUARDED = 2;
export const TRANSACTION_VERSION_DEFAULT = 1;
export const TRANSACTION_VERSION_WITH_OPTIONS = 2;
export const ESDT_TRANSFER_GAS_LIMIT = 500000;
export const ESDT_TRANSFER_FUNCTION_NAME = "ESDTTransfer";
export const ESDTNFT_TRANSFER_FUNCTION_NAME = "ESDTNFTTransfer";
export const MULTI_ESDTNFT_TRANSFER_FUNCTION_NAME = "MultiESDTNFTTransfer";
export const ESDT_TRANSFER_VALUE = "0";

// Masks needed for checking specific options when Transaction version is not default (1)
// 0b0001 - TRANSACTION_OPTIONS_TX_HASH_SIGN (only)
// 0b0010 - TRANSACTION_OPTIONS_TX_GUARDED (only)
export const TRANSACTION_OPTIONS_TX_HASH_SIGN_MASK = 0b0001
export const TRANSACTION_OPTIONS_TX_GUARDED_MASK = 0b0010
