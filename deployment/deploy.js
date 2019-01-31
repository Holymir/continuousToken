const etherlime = require('etherlime');
const BancorBondingCurve = require('../build/SafeMath.json');


const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(BancorBondingCurve);
	// console.log(result);

};

module.exports = {
	deploy
};