const etherlime = require('etherlime');
const ethers = require('ethers');
const ContinuousToken = require('../build/ContinuousToken.json');


describe('Example', () => {
    let owner = accounts[9];
    let deployer;
    let ContinuousTokenInstance;
    const rate = "1";

    beforeEach(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(owner.secretKey);
        ContinuousTokenInstance = await deployer.deploy(ContinuousToken, {}, rate);
    });

    it('should have valid private key', async () => {
        assert.strictEqual(deployer.wallet.privateKey, owner.secretKey);
    });

    it('should be valid address', async () => {
        assert.isAddress(ContinuousTokenInstance.contractAddress, "The contract was not deployed");
    });

    it('should return initial supply', async () => {
        let totalSuply = await ContinuousTokenInstance.totalSupply();
        assert.strictEqual(oneEth, totalSuply.toString());
    });

    it('should set owner corectly', async () => {
        let _owner = await ContinuousTokenInstance.owner();
        assert.strictEqual(_owner, owner.wallet.address);
    });

    // tokenSupply, ETH, reserveRatio, depositAmount
    it('should return total supply', async () => {
        let oneEth = "50000000000000000000";
        let value = ethers.utils.bigNumberify(oneEth);

        for (let i = 0; i < 50; i++) {

            await ContinuousTokenInstance.mint({value: value});

            let tokenForOneEth = await ContinuousTokenInstance.calculateContinuousMintReturn(oneEth);
            // console.log(tokenForOneEth.toString());

            let etherForTokens = await ContinuousTokenInstance.calculateContinuousBurnReturn(tokenForOneEth.toString());
            let ethBigNum = ethers.utils.bigNumberify(tokenForOneEth.toString());

            while (!etherForTokens.gt(value)) {

                ethBigNum = ethBigNum.add(10000000000);
                etherForTokens = await ContinuousTokenInstance.calculateContinuousBurnReturn(ethBigNum.toString());
                // console.log(ethBigNum.toString());
            }

            console.log(ethBigNum.toString());

        }
    });

    it.only('should return total supply', async () => {
        let oneEth = "5000000000000000000";
        let value = ethers.utils.bigNumberify(oneEth);

        await ContinuousTokenInstance.mint({value: value});

        let totalSup = await ContinuousTokenInstance.totalSupply();
        console.log(totalSup.toString());

        let balance = await deployer.provider.getBalance(ContinuousTokenInstance.contractAddress);
        console.log(balance.toString());

        await ContinuousTokenInstance.burn("405465190309", {
            gasLimit: 90000
        });

        totalSup = await ContinuousTokenInstance.totalSupply();
        console.log(totalSup.toString());
        balance = await deployer.provider.getBalance(ContinuousTokenInstance.contractAddress);
        console.log(balance.toString());

    });

    //
    // it('should revert if try to create lime with 0 carbohydrates', async () => {
    //     let carbohydrates = 0;
    //     await assert.revert(limeFactoryInstance.createLime("newLime2", carbohydrates, 8, 2), "Carbohydrates are not set to 0");
    // });
    //
    // it('should create lime from another account', async () => {
    //     let bobsWallet = accounts[4].wallet;
    //     const transaction = await limeFactoryInstance.from(bobsWallet /* Could be address or just index in accounts like 4 */).createLime("newLime3", 6, 8, 2);
    //     // check sender
    //     assert.equal(transaction.from, bobsWallet.address, "The account that created lime was not bobs");
    //
    //     //check created lime
    //     let lime = await limeFactoryInstance.limes(1);
    //     assert.equal(lime.name, 'newLime3', '"newLime3" was not created');
    // })
    //
    // it('should emit event on lime created', async () => {
    //     let expectedEvent = 'FreshLime';
    //     const createTransaction = await limeFactoryInstance.contract.createLime("newLime4", 5, 8, 2);
    //     const transactionReceipt = await limeFactoryInstance.verboseWaitForTransaction(createTransaction);
    //     // check for event
    //     let isEmitted = utils.hasEvent(transactionReceipt, limeFactoryInstance.contract, expectedEvent);
    //     assert(isEmitted, 'Event FreshLime was not emitted');
    //
    //     // parse logs
    //     let logs = utils.parseLogs(transactionReceipt, limeFactoryInstance.contract, expectedEvent);
    //     assert.equal(logs[0].name, "newLime4", '"newLime4" was not created');
    // });
});