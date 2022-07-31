import { assert } from "chai";
import BigNumber from "bignumber.js";
import { Transaction } from "./transaction";
import { TransactionOptions, TransactionVersion } from "./networkParams";
import { TransactionPayload } from "./transactionPayload";
import { loadTestWallets, TestWallet } from "./testutils";
import { TokenPayment } from "./tokenPayment";


describe("test transaction construction", async () => {
    let wallets: Record<string, TestWallet>;
    let minGasLimit = 50000;
    let minGasPrice = 1000000000;

    before(async function () {
        wallets = await loadTestWallets();
    });

    it("with no data, no value", async () => {
        let transaction = new Transaction({
            nonce: 89,
            value: "0",
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: minGasLimit,
            chainID: "local-testnet"
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("b56769014f2bdc5cf9fc4a05356807d71fcf8775c819b0f1b0964625b679c918ffa64862313bfef86f99b38cb84fcdb16fa33ad6eb565276616723405cd8f109", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "eb30c50c8831885ebcfac986d27e949ec02cf25676e22a009b7a486e5431ec2e");
    });

    it("with data, no value", async () => {
        let transaction = new Transaction({
            nonce: 90,
            value: "0",
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: 80000,
            data: new TransactionPayload("hello"),
            chainID: "local-testnet"
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("e47fd437fc17ac9a69f7bf5f85bafa9e7628d851c4f69bd9fedc7e36029708b2e6d168d5cd652ea78beedd06d4440974ca46c403b14071a1a148d4188f6f2c0d", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "95ed9ac933712d7d77721d75eecfc7896873bb0d746417153812132521636872");
    });

    it("with data, with opaque, unused options (the protocol ignores the options when version == 1)", async () => {
        let transaction = new Transaction({
            nonce: 89,
            value: "0",
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: minGasLimit,
            chainID: "local-testnet",
            version: new TransactionVersion(1),
            options: new TransactionOptions(1)
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("c83e69b853a891bf2130c1839362fe2a7a8db327dcc0c9f130497a4f24b0236140b394801bb2e04ce061a6f873cb432bf1bb1e6072e295610904662ac427a30a", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "32fb1681bd532b226b5bdeed61ae62ce9416bf5e92e48caf96253ff72d1670ac");
    });

    it("with data, with value", async () => {
        let transaction = new Transaction({
            nonce: 91,
            value: TokenPayment.egldFromAmount(10),
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: 100000,
            data: new TransactionPayload("for the book"),
            chainID: "local-testnet"
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("9074789e0b4f9b2ac24b1fd351a4dd840afcfeb427b0f93e2a2d429c28c65ee9f4c288ca4dbde79de0e5bcf8c1a5d26e1b1c86203faea923e0edefb0b5099b0c", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "af53e0fc86612d5068862716b5169effdf554951ecc89849b0e836eb0b63fa3e");
    });

    it("with data, with large value", async () => {
        let transaction = new Transaction({
            nonce: 92,
            value: TokenPayment.egldFromBigInteger("123456789000000000000000000000"),
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: 100000,
            data: new TransactionPayload("for the spaceship"),
            chainID: "local-testnet"
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("39938d15812708475dfc8125b5d41dbcea0b2e3e7aabbbfceb6ce4f070de3033676a218b73facd88b1432d7d4accab89c6130b3abe5cc7bbbb5146e61d355b03", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "e4a6048d92409cfe50f12e81218cb92f39966c618979a693b8d16320a06061c1");
    });

    it("with nonce = 0", async () => {
        let transaction = new Transaction({
            nonce: 0,
            value: 0,
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: 80000,
            data: new TransactionPayload("hello"),
            chainID: "local-testnet",
            version: new TransactionVersion(1)
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("dfa3e9f2fdec60dcb353bac3b3435b4a2ff251e7e98eaf8620f46c731fc70c8ba5615fd4e208b05e75fe0f7dc44b7a99567e29f94fcd91efac7e67b182cd2a04", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "6ffa1a75f98aaf336bfb87ef13b9b5a477a017158285d34ee2a503668767e69e");
    });

    it("without options field, should be omitted", async () => {
        let transaction = new Transaction({
            nonce: 89,
            value: 0,
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: minGasLimit,
            chainID: "local-testnet"
        });

        await wallets.alice.signer.sign(transaction);
        assert.equal("b56769014f2bdc5cf9fc4a05356807d71fcf8775c819b0f1b0964625b679c918ffa64862313bfef86f99b38cb84fcdb16fa33ad6eb565276616723405cd8f109", transaction.getSignature().hex());
        assert.equal(transaction.getHash().toString(), "eb30c50c8831885ebcfac986d27e949ec02cf25676e22a009b7a486e5431ec2e");

        let result = transaction.serializeForSigning(wallets.alice.address);
        assert.isFalse(result.toString().includes("options"));
    });

    it("computes correct fee", () => {
        let transaction = new Transaction({
            nonce: 92,
            value: TokenPayment.egldFromBigInteger("123456789000000000000000000000"),
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: 500,
            gasLimit: 20,
            chainID: "local-testnet"
        });

        let networkConfig = {
            MinGasLimit: 10,
            GasPerDataByte: 1500,
            GasPriceModifier: 0.01,
            ChainID: "T"
        };

        let fee = transaction.computeFee(networkConfig);
        assert.equal(fee.toString(), "5050");
    });

    it("computes correct fee with data field", () => {
        let transaction = new Transaction({
            nonce: 92,
            value: TokenPayment.egldFromBigInteger("123456789000000000000000000000"),
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            data: new TransactionPayload("testdata"),
            gasPrice: 500,
            gasLimit: 12010,
            chainID: "local-testnet"
        });

        let networkConfig = {
            MinGasLimit: 10,
            GasPerDataByte: 1500,
            GasPriceModifier: 0.01,
            ChainID: "T"
        };

        let fee = transaction.computeFee(networkConfig);
        assert.equal(fee.toString(), "6005000");
    });

    it("should convert transaction to plain object and back", () => {
        const sender = wallets.alice.address;
        const transaction = new Transaction({
            nonce: 90,
            value: new BigNumber("1000000000000000000"),
            sender: wallets.alice.address,
            receiver: wallets.bob.address,
            gasPrice: minGasPrice,
            gasLimit: 80000,
            data: new TransactionPayload("hello"),
            chainID: "local-testnet"
        });

        const plainObject = transaction.toPlainObject(sender);
        const restoredTransaction = Transaction.fromPlainObject(plainObject);
        assert.deepEqual(restoredTransaction, transaction);
    });
});
