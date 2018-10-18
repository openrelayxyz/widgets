import erc20ABI from "./erc20-abi.json";
import zeroExABI from "./0xv2-exchange-abi.json";
import {utils} from 'ethers';

let exchangeInterface = new utils.Interface(zeroExABI);

export function fillOrKillOrder(order, amountToFill, account, web3) {
  let baseToken = web3.eth.contract(erc20ABI);
  // The version of web3 we're using doesn't support abiv2, so we're using
  // ethers Interface library to handle the encoding of orders;
  // let exchangeContract = web3.eth.contract(zeroExABI).at(order.exchangeAddress);
  // exchangeContract.getAssetProxy(order)
  let fillData = exchangeInterface.functions.fillOrKillOrder.encode([order, amountToFill, order.signature]);
  // TODO: Lots of validation about whether this is likely to succeed

  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction({from: account, to: order.exchangeAddress, data: fillData}, (err, result) => {
      if(err) { reject(err) }
      else { resolve(result) }
    })

  })
}
