import "@openrelay/sra-fee-element";
import "@openrelay/sra-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";


describe('<or-sra-fee>', () => {
  var testArea;
  before(() => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should get a makerToken value', () => {
    testArea.innerHTML = '<or-sra sra="/base/test/" id="fixture">Content <or-sra-fee id="test-element"></or-sra-fee></or-sra>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    document.getElementById("fixture").requestRender();
    return document.getElementById("fixture").renderComplete.then(() => {
      return document.getElementById('test-element').feePromise.then(() => {
        assert.equal(document.getElementById('test-element').value, 0);
        assert.equal(document.getElementById('test-element').takerFee.toString(), "0");
        assert.equal(document.getElementById('test-element').makerFee.toString(), "200000000000000000");
      });
    })
  });
  it('should set a higher total fee', () => {
    testArea.innerHTML = '<or-sra sra="/base/test/" id="fixture">Content <or-sra-fee totalFee="5000000000000000000" id="test-element"></or-sra-fee></or-sra>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    document.getElementById("fixture").requestRender();
    return document.getElementById("fixture").renderComplete.then(() => {
      return document.getElementById('test-element').feePromise.then(() => {
        assert.equal(document.getElementById('test-element').value, 0);
        assert.equal(document.getElementById('test-element').takerFee.toString(), "0");
        assert.equal(document.getElementById('test-element').makerFee.toString(), "5000000000000000000");
      });
    })
  });
  it('should be able to set value and change the fee distribution', () => {
    testArea.innerHTML = '<or-sra sra="/base/test/" id="fixture">Content <or-sra-fee totalFee="5000000000000000000" id="test-element"></or-sra-fee></or-sra>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    document.getElementById("fixture").requestRender();
    return document.getElementById("fixture").renderComplete.then(() => {
      return document.getElementById('test-element').feePromise.then(() => {
        document.getElementById('test-element').value = 50;
        assert.equal(document.getElementById('test-element').takerFee.toString(), "2500000000000000000");
        assert.equal(document.getElementById('test-element').makerFee.toString(), "2500000000000000000");
      });
    })
  });
});
