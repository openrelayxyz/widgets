import "@openrelay/erc20-balance";
import "@openrelay/web3-element";
import erc20ABI from '@openrelay/element-utilities/erc20-abi.json';
import erc20Bytecode from '@openrelay/element-utilities/erc20-bytecode.json';
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";


describe('<or-erc20-balance>', () => {
  var testArea;
  var tokenAddress
  var rootAddress;
  before((done) => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
    var web3 = getFakeWeb3(true);
    var tokenContract = web3.eth.contract(erc20ABI);
    web3.eth.getAccounts((err, accounts) => {
      rootAddress = accounts[0];
      tokenContract.new(
        "Test",
        "TST",
        {data: erc20Bytecode.bytecode, from: accounts[0], gas: 6000000},
        (err, tx) => {
          if(!err) {
            var interval = setInterval(() => {
              web3.eth.getTransactionReceipt(tx.transactionHash, (err, receipt) => {
                if(!err) {
                  console.log(receipt);
                  clearInterval(interval);
                  tokenAddress = receipt.contractAddress;
                  tokenContract.at(tokenAddress).issue("100000000000000000", {from: accounts[0]}, () => {
                    done();
                  })
                }
              })
            }, 50);
          } else {
            console.log(err);
          }
        }
      );

    })
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should show balance for f00df00df00d...', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-erc20-balance token="' + tokenAddress + '" id="test-element"></or-erc20-balance></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById('test-element').balancePromise.then(() => {
      document.getElementById("test-element").requestRender();
      return document.getElementById("fixture").renderComplete.then(() => {
        assert.notEqual(document.getElementById('test-element').shadowRoot.innerHTML.indexOf(">0.0000000000<"), -1);
        assert.equal(document.getElementById('test-element').balance.toString(), "0");
        web3.currentProvider.stop(console.log);
      });
    })
  });
  it('should show balance for f00df00df00d...', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-erc20-balance round="2" token="' + tokenAddress + '" id="test-element"></or-erc20-balance></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById('test-element').balancePromise.then(() => {
      document.getElementById("test-element").requestRender();
      return document.getElementById("fixture").renderComplete.then(() => {
        assert.notEqual(document.getElementById('test-element').shadowRoot.innerHTML.indexOf(">0.00<"), -1);
        assert.equal(document.getElementById('test-element').balance.toString(), "0");
        web3.currentProvider.stop(console.log);
      });
    })
  });
  it('should show balance for the root address...', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-erc20-balance round="2" address="' + rootAddress + '" token="' + tokenAddress + '" id="test-element"></or-erc20-balance></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById('test-element').balancePromise.then(() => {
      document.getElementById("test-element").requestRender();
      return document.getElementById("fixture").renderComplete.then(() => {
        assert.notEqual(document.getElementById('test-element').shadowRoot.innerHTML.indexOf(">0.10<"), -1);
        assert.equal(document.getElementById('test-element').balance.toString(), "100000000000000000");
        web3.currentProvider.stop(console.log);
      });
    })
  });
});
