import {bigNumberToBuffer} from '@openrelay/element-utilities';
import {trim} from '@openrelay/element-utilities';
import {addressValidOrThrow, numberValidOrThrow, assetDataValidOrThrow} from '@openrelay/element-utilities/validations.js';

export default class UnsignedOrder {
  constructor(order, web3) {
    this.web3 = web3 || window.web3;
    if(!this.web3) {
      throw "Web3 not found. Please provide one.";
    }
    console.log(order);
    this.exchangeAddress = addressValidOrThrow(order.exchangeAddress);
    this.expirationTimeSeconds = numberValidOrThrow(this.web3.toBigNumber(order.expirationTimeSeconds));
    this.feeRecipientAddress = addressValidOrThrow(order.feeRecipientAddress);
    this.makerAddress = addressValidOrThrow(order.makerAddress);
    this.makerAssetAmount = numberValidOrThrow(this.web3.toBigNumber(order.makerAssetAmount));
    this.makerAssetData = assetDataValidOrThrow(order.makerAssetData);
    this.makerFee = numberValidOrThrow(this.web3.toBigNumber(order.makerFee));
    this.salt = numberValidOrThrow(this.web3.toBigNumber(order.salt));
    this.senderAddress = addressValidOrThrow(order.senderAddress);
    this.takerAddress = addressValidOrThrow(order.takerAddress);
    this.takerAssetAmount = numberValidOrThrow(this.web3.toBigNumber(order.takerAssetAmount));
    this.takerAssetData = assetDataValidOrThrow(order.takerAssetData);
    this.takerFee = numberValidOrThrow(this.web3.toBigNumber(order.takerFee));
  }
  get hash() {
    let domainSchemaSha = this.web3.sha3("DomainSeparator(address contract)");
    let orderSchemaSha = this.web3.sha3("Order(address makerAddress,address takerAddress,address feeRecipientAddress,address senderAddress,uint256 makerAssetAmount,uint256 takerAssetAmount,uint256 makerFee,uint256 takerFee,uint256 expirationTimeSeconds,uint256 salt,bytes makerAssetData,bytes takerAssetData,)");
    let exchangeSha = this.web3.sha3(this.exchangeAddress, {encoding: "hex"});
    let makerAssetSha = this.web3.sha3(this.makerAssetData, {encoding: "hex"});
    let takerAssetSha = this.web3.sha3(this.takerAssetData, {encoding: "hex"});
    let orderBytes = Buffer.concat([
      new Buffer(trim(this.makerAddress, "0x"), "hex"),
      new Buffer(trim(this.takerAddress, "0x"), "hex"),
      new Buffer(trim(this.feeRecipientAddress, "0x"), "hex"),
      new Buffer(trim(this.senderAddress, "0x"), "hex"),
      bigNumberToBuffer(this.makerAssetAmount),
      bigNumberToBuffer(this.takerAssetAmount),
      bigNumberToBuffer(this.makerFee),
      bigNumberToBuffer(this.takerFee),
      bigNumberToBuffer(this.expirationTimeSeconds),
      bigNumberToBuffer(this.salt),
      new Buffer(trim(makerAssetSha, "0x"), "hex"),
      new Buffer(trim(takerAssetSha, "0x"), "hex"),
    ]);
    let orderSha = this.web3.sha3(orderBytes.toString("hex"), {encoding: "hex"});

    return this.web3.sha3(
      trim(domainSchemaSha, "0x") +
      trim(exchangeSha, "0x") +
      trim(orderSchemaSha, "0x") +
      trim(orderSha, "0x"),
      {encoding: "hex"}
    );
  }
}
