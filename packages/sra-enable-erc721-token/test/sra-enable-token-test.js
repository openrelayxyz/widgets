import "@openrelay/sra-enable-token";
import "@openrelay/sra-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";
import erc20ABI from "@openrelay/element-utilities/erc20-abi.json";
import erc20Bytecode from '@openrelay/element-utilities/erc20-bytecode.json';



describe('<or-sra-enable-token>', () => {
  var testArea;
  var tokenAddress

  before((done) => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
    var web3 = getFakeWeb3(true);
    var tokenContract = web3.eth.contract(erc20ABI);
    web3.eth.getAccounts((err, accounts) => {
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
  it('should have a value of disabled', () => {
    var web3 = getFakeWeb3();
    testArea.innerHTML = `<or-sra sra="/base/test/" id="fixture">Content <or-sra-enable-token id="test-element" tokenAddress="${tokenAddress}"></or-sra-enable-token></or-sra>`;
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById("fixture").requestUpdate().then(() => {
      console.log(document.getElementById('test-element'), document.getElementById('test-element').value);
      assert.equal(document.getElementById('test-element').value, "disabled");
    });
  });
});
