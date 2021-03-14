import { ethers } from 'hardhat';

import PoolArtifact from '../artifacts/contracts/Pool.sol/Pool.json';
import TokenArtifact from '../artifacts/contracts/mock/Token.sol/Token.json';

import { TokenFactory } from '../type/TokenFactory';
import { PoolFactory } from '../type/PoolFactory';

import { promises } from 'fs';

async function main() {
	const signer = await ethers.getSigners();
	const account = await signer[0].getAddress();

	let contractAddresses = {
		debase: '',
		debaseDaiLp: '',
		debasePool: '',
		debaseDaiLpPool: ''
	};

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
		const debaseDaiLP = await debaseFactory.deploy('LP', 'LP');

		const debasePool = await poolFactory.deploy(60 * 20, debase.address);
		const debaseDaiLpPool = await poolFactory.deploy(60 * 20, debaseDaiLP.address);

		await debasePool.setEnabled();
		await debaseDaiLpPool.setEnabled();

		contractAddresses.debase = debase.address;
		contractAddresses.debaseDaiLp = debaseDaiLP.address;
		contractAddresses.debasePool = debasePool.address;
		contractAddresses.debaseDaiLpPool = debaseDaiLpPool.address;

		const data = JSON.stringify(contractAddresses);
		await promises.writeFile('contracts.json', data);
		console.log('JSON data is saved.');
	} catch (error) {
		console.error(error);
	}
}

main().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});
