import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";
import UnsignedOrder from "@openrelay/element-utilities/unsignedorder.js";


describe('should hash correctly', () => {
  it('order.hash()', () => {
    var web3 = getFakeWeb3();
    let order = new UnsignedOrder({
      "makerAddress": "0x0000000000000000000000000000000000000000",
      "makerAssetData": "0x0000000000000000000000000000000000000000",
      "makerAssetAmount": "0",
      "makerFee": "0",
      "takerAddress": "0x0000000000000000000000000000000000000000",
      "takerAssetData": "0x0000000000000000000000000000000000000000",
      "takerAssetAmount": "0",
      "takerFee": "0",
      "expirationTimeSeconds": "0",
      "feeRecipientAddress": "0x0000000000000000000000000000000000000000",
      "senderAddress": "0x0000000000000000000000000000000000000000",
      "salt": "0",
      "exchangeAddress": "0xb69e673309512a9d726f87304c6984054f87a93b",
    }, web3);
    assert.equal(order.hash(), "0x367ad7730eb8b5feab8a9c9f47c6fcba77a2d4df125ee6a59cc26ac955710f7e");
  });
});
