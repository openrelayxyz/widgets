import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import erc20ABI from '@openrelay/element-utilities/erc20-abi.json';

export default class OrERC20Balance extends OrWeb3Base {
  static get is() { return "or-erc20-balance" };
  _render({balance, _divisor, round}) {
    if(balance) {
      return html`${balance.div(_divisor).toNumber().toFixed(round)}`;
    }
    return html`<span class="pending"></span>`;
  }
  static get properties() {
    return {
      account: String,
      address: String,
      token: String,
      balance: String,
      round: Number,
      refresh: Boolean,
      _divisor: String,
    };
  }
  constructor() {
    super();
    this._updateInterval = null;
    this.refresh = true;
    this._divisor = 1;
    this.round = 10;
    this.balancePromise = new Promise((resolve, reject) => {
      this._balanceResolve = resolve;
      this._balanceReject = reject;
    })
  }
  ready() {
    super.ready();
    this._useAccount = !this.address;
    if(this.refresh) {
      this.onBlock(() => {
        // Refresh the balance on new blocks
        this.updateBalance();
      });
    }
  }
  web3Updated() {
    this._tokenContract = this.web3.eth.contract(erc20ABI).at(this.token);
    this._tokenContract.decimals((err, decimals) => {
      if(!err) {
        this._divisor = this.web3.toBigNumber(10).pow(decimals);
      }
    });
    this.updateBalance();
  }
  updateBalance() {
    let address = this._useAccount ? this.account : this.address;
    if(address) {
      this._tokenContract.balanceOf(address, (err, balance) => {
        if(!err) {
          this.balance = balance;
          this._balanceResolve(balance);
        } else {
          console.log("Error getting balance:", err)
          this._balanceReject(err);
        }
      });
    }
  }
  _didRender(props, changedProps, prevProps) {
    if(props.token != prevProps.token && this.web3) {
      this._tokenContract = this.web3.eth.contract(erc20ABI).at(this.token);
      setTimeout(() => {this.updateBalance()});
    }
  }
}

window.customElements.define(OrERC20Balance.is, OrERC20Balance)
