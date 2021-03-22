import { ethers } from 'hardhat';

import PoolArtifact from '../artifacts/contracts/Pool.sol/Pool.json';

import { Pool } from '../type/Pool';
import { promises } from 'fs';

async function main() {
	const signer = await ethers.getSigners();

	try {
		let data = await promises.readFile('contracts.json', 'utf-8');
		let dataParse = JSON.parse(data.toString());

		const debase = ((await ethers.getContractAt(
			PoolArtifact.abi,
			dataParse['debasePool'],
			signer[0]
		)) as any) as Pool;
		const debaseDai = ((await ethers.getContractAt(
			PoolArtifact.abi,
			dataParse['debaseDaiLp'],
			signer[0]
		)) as any) as Pool;

		await debase.setEnabled();
		await debaseDai.setEnabled();
	} catch (error) {
		console.error(error);
	}
}

main().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});
