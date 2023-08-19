import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import * as Mnemonic from "bitcore-mnemonic";
import * as CryptoJS from "crypto-js";
import { hdkey } from "ethereumjs-wallet";
import * as bip39 from "bip39";
import * as util from "ethereumjs-util";
import Web3 from 'web3';

import { WalletService } from 'src/app/wallet.service';
import { ABI as NFTblockTickABI } from 'src/app/components/metamask/NFTblockTickABI';



@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.scss']
})


export class MetamaskComponent {

  wallet: any = {
    address: ""
  };

  web3: any;

  // NFT CONTRACT
  nftContract: any;

  nftContractAddress: any = '0xC65D9cdcEBF759eC6bc39629EA20A92b2695060b';

  nfts:any[] = [];

  constructor(public walletService: WalletService) {
    this.web3 = new Web3;


    // NFT CONTRACT
    this.nftContract = new this.web3.eth.Contract(NFTblockTickABI.default, this.nftContractAddress);
  }

  async ngOnInit() {
    this.wallet = await this.walletService.initWallet('february current defy one inform wet hurry cupboard type enable spare famous'); //semillas virtuales

    await this.loadNFTs();
  }

  async loadNFTs() {
    let supply = await this.nftContract.methods.totalSupply().call();

    this.nfts = [];

    for (var i = 1; i <= supply; i++) {
      let url = await this.nftContract.methods.tokenURI(i).call();
      let nft = await (await fetch(url)).json();

      nft.tokenId = i;
      nft.owner = await this.nftContract.methods.ownerOf(i).call();
      nft.price = await this.nftContract.methods.priceOf(i).call();
      nft.priceUsd = await this.nftContract.methods.usdPriceOf(i).call();
      nft.disabled = nft.owner.toLowerCase() == this.wallet.address.toLowerCase();

      this.nfts.push(nft);
    }
  }

  async mintNFT() {
    var rawData = {
      from: this.wallet.address,
      to: this.nftContractAddress,
      value: 10000000000000000,
      gasPrice: this.web3.utils.toHex(10000000000),
      gasLimit: this.web3.utils.toHex(1000000),
      nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
      data: await this.nftContract.methods.mint().encodeABI()
    };

    var signed = await this.web3.eth.accounts.signTransaction(rawData, this.wallet.privateKey.toString('hex'));

    this.web3.eth.sendSignedTransaction(signed.rawTransaction).then(
      (receipt: any) => {
        this.loadNFTs();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  async buyNFT(nft:any) {
    var rawData = {
      from: this.wallet.address,
      to: this.nftContractAddress,
      value: nft.price * 1.1,
      gasPrice: this.web3.utils.toHex(10000000000),
      gasLimit: this.web3.utils.toHex(1000000),
      nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
      data: await this.nftContract.methods.buy(nft.tokenId).encodeABI()
    };

    var signed = await this.web3.eth.accounts.signTransaction(rawData, this.wallet.privateKey.toString('hex'));

    this.web3.eth.sendSignedTransaction(signed.rawTransaction).then(
      (receipt: any) => {
        this.loadNFTs();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }
}
