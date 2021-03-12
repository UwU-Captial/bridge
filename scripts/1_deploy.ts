import { ethers } from 'hardhat';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import PoolArtifact from '../artifacts/contracts/Pool.sol/Pool.json';
import TokenArtifact from '../artifacts/contracts/mock/Token.sol/Token.json';

import { TokenFactory } from '../type/TokenFactory';
import { PoolFactory } from '../type/PoolFactory';

async function main() {
	const signer = await ethers.getSigners();
	const account = await signer[0].getAddress();

	try {
		const debaseFactory = (new ethers.ContractFactory(
			TokenArtifact.abi,
			TokenArtifact.bytecode,
			signer[0]
		) as any) as TokenFactory;

		const poolFactory = (new ethers.ContractFactory(
			PoolArtifact.abi,
			PoolArtifact.bytecode,
			signer[0]
		) as any) as PoolFactory;

		const debase = await debaseFactory.deploy('DEBASE', 'DEBASE');
		const pool = await poolFactory.deploy(60 * 60 * 2, debase.address);

		console.log(debase.address, pool.address);
	} catch (error) {
		console.error(error);
	}
}

main().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});
