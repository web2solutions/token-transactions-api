import { IBlockConfig } from "./interfaces";

export const _GENESIS_BLOCK_NAME_ = 0;

export const _GENESIS_BLOCK_CONFIG_: IBlockConfig = { 
    position: 0, 
    previousHash: '', 
    data: _GENESIS_BLOCK_NAME_,
    mineLevel: 0,
}

export const _MINE_LEVEL_ = 3;