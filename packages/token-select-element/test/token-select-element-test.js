import "@openrelay/token-select-element";
import "@openrelay/web3-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";


describe('<or-token-select>', () => {
  var testArea;
  before(() => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should have a list of tokens', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-token-select id="test-element"></or-token-select></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    var testElement = document.getElementById('test-element');
    return testElement.isReady.then(() => {
      return testElement.initialized.then(() => {
        assert.isNotOk(testElement.selectedToken);
        assert.isAtLeast(testElement.shadowRoot.querySelectorAll("option").length, 5);
      });
    })
  });
  it('should emit a change event', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-token-select id="test-element"></or-token-select></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    var testElement = document.getElementById('test-element')
    let eventPromise = new Promise((resolve, reject) => {
      document.getElementById("test-element").addEventListener("change", (e) => {
        if(e.detail.token) {
          assert.equal(e.detail.token.symbol, testElement.tokens[0].symbol);
          assert.equal(e.detail.token.decimals, testElement.tokens[0].decimals);
          assert.equal(e.detail.token.address, testElement.tokens[0].address);
          assert.equal(e.detail.token.symbol, testElement.selectedSymbol);
          assert.equal(testElement.selectedIndex, 0);
          resolve();
        }
      });
    });
    return testElement.isReady.then(() => {
      return testElement.initialized.then(() => {
        testElement.setToken(0);
      }).then(() => {
        return eventPromise;
      });
    });
  });
  it('should select the indicated token by index', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-token-select selectedIndex="0" id="test-element"></or-token-select></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById("fixture").requestUpdate().then(() => {
      var testElement = document.getElementById('test-element')
      return testElement.isReady.then(() => {
        return testElement.initialized;
      }).then(() => {
        return new Promise((resolve, reject) => {
          testElement.addEventListener("change", (e) => {
            if(e.detail.token) {
              assert.equal(testElement.selectedIndex, 0);
              assert.equal(testElement.selectedSymbol, testElement.tokens[0].symbol);
              resolve();
            }
          });
          testElement.setToken(0);
        });
      });
    })
  });
  it('should select the indicated token by symbol', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-token-select selectedSymbol="MBGN" id="test-element"></or-token-select></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    var testElement = document.getElementById('test-element')
    document.getElementById("fixture").addEventListener("token-selected", (e) => {
      assert.equal(testElement.selectedSymbol, "MBGN");
      assert.equal(testElement.selectedToken.symbol, "MBGN");
    })
  });
  it('should select load the tokens from a URL', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-token-select tokenListUrl="/base/test/sampleTokens.json" id="test-element"></or-token-select></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    var testElement = document.getElementById('test-element')
    return testElement.isReady.then(() => {
      return testElement.initialized.then(() => {
        assert.isNotOk(testElement.selectedToken);
        assert.equal(testElement.shadowRoot.querySelectorAll("option").length, 17);
      });
    });
  });
});
