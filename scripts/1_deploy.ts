import { ethers } from 'hardhat';

import PoolArtifact from '../artifacts/contracts/Pool.sol/Pool.json';

import { PoolFactory } from '../type/PoolFactory';

import { promises } from 'fs';

async function main() {
	const signer = await ethers.getSigners();
	const account = await signer[0].getAddress();

	let contractAddresses = {
		debase: '0x9248c485b0B80f76DA451f167A8db30F33C70907',
		debaseDaiLp: '0xE98f89a2B3AeCDBE2118202826478Eb02434459A',
		debasePool: '',
		debaseDaiLpPool: ''
	};

	try {
		const poolFactory = (new ethers.ContractFactory(
			PoolArtifact.abi,
			PoolArtifact.bytecode,
			signer[0]
		) as any) as PoolFactory;

		const debasePool = await poolFactory.deploy(60 * 60 * 24 * 14, contractAddresses.debase);
		const debaseDaiLpPool = await poolFactory.deploy(60 * 60 * 24 * 14, contractAddresses.debaseDaiLp);

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
