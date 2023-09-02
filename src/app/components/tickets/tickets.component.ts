import { Component, OnInit } from '@angular/core';
import { NFTblockTickService } from 'src/app/nft-blocktick.service'; // Importa el servicio NFTService
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
import { ABI as NFTblockTickABI } from 'src/app/components/tickets/NFTblockTickABI';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  wallet: any = {
    address: ""
  };
  web3: any;
  nft: any; // Propiedad para almacenar los detalles del NFT

  nftContract: any;
  nftContractAddress: any = '0x1241b3410Cd85093C515c090A85b3163239CfD76';
  nfts: any[] = [];

  isUserLoggedIn(): boolean {
    if (this.walletService && this.walletService.wallet && this.walletService.wallet.walletAddress) {
      return this.walletService.web3.utils.isAddress(this.walletService.wallet.walletAddress);
    }
    return false;
  }

  logout() {
    // Aquí puedes agregar la lógica para desloguear de la cuenta de Metamask
    // Por ejemplo, puedes restablecer las variables o limpiar los datos relacionados con la cuenta
  
    // Ejemplo:
    this.walletService.wallet = {
      address: '',
      privateKey: ''
    };
  }

  constructor(public walletService: WalletService, private nftService: NFTblockTickService) {
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));
    this.nftContract = new this.web3.eth.Contract(NFTblockTickABI.default, this.nftContractAddress);

    this.wallet = {
      address: '',
      privateKey: ''
    };

  }

async ngOnInit() {
  try {
    const wallet: any = await this.walletService.initWallet('february current defy one inform wet hurry cupboard type enable spare famous');
    this.wallet = wallet;
    await this.loadNFTs();
  } catch (error) {
    console.error('Error al inicializar la billetera:', error);
  }
}


  async cargarDetalleNFT(nftId: number) {
    try {
      // Utiliza el servicio para cargar los detalles del NFT por su ID
      this.nft = await this.nftService.getNFTDetails(nftId);
    } catch (error) {
      console.error('Error al cargar los detalles del NFT:', error);
    }
  }

  async loadNFTs() {
    this.nfts = [];
    let nft: {
      tokenId: number;
      owner: any;
      price: any;
      priceUsd: any;
      disabled: boolean;
    } | undefined;
    for (var i = 1; i <= 10; i++) {
      nft = {
        tokenId: i,
        owner: await this.nftContract.methods.ownerOf(i).call(),
        price: await this.nftContract.methods.priceOf(i).call(),
        priceUsd: await this.nftContract.methods.usdPriceOf(i).call(),
        disabled: false
      };
      if (nft.owner.toLowerCase() == this.wallet.address.toLowerCase()) {
        nft.disabled = true;
      }
      this.nfts.push(nft);
    }
  }

  async buyTickets(amount: number) {
    const ticketPrice = BigInt(await this.nftContract.methods.ticketPrice().call());
    const value = BigInt(ticketPrice) * BigInt(amount) * BigInt(11) / BigInt(10);
    const contract = new this.web3.eth.Contract(NFTblockTickABI, '0x1241b3410Cd85093C515c090A85b3163239CfD76');

    const rawData = {
      from: this.wallet.address,
      to: this.nftContractAddress,
      value: value,
      gasPrice: this.web3.utils.toHex(10000000000),
      gasLimit: this.web3.utils.toHex(1000000),
      nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
      data: await this.nftContract.methods.buyTickets(this.wallet.address, amount).encodeABI()
    };
    const signed = await this.web3.eth.accounts.signTransaction(rawData, this.wallet.privateKey.toString('hex'));
    console.log('Raw transaction:', signed.rawTransaction); // Agregado console.log
    this.web3.eth.sendSignedTransaction(signed.rawTransaction).then(
      (receipt: any) => {
        console.log('Transaction receipt:', receipt); // Agregado console.log
        this.loadNFTs();
      },
      (error: any) => {
        console.log('Transaction error:', error); // Agregado console.log
      }
    );
  }

  async useTickets(amount: number) {
    const ticketHolders = await this.nftContract.methods.ticketHolders(this.wallet.address).call();
    if (ticketHolders.length < amount) {
      throw new Error("No tienes tickets suficientes");
    }
    for (let i = 0; i < amount; i++) {
      const tokenId = ticketHolders[ticketHolders.length - 1];
      ticketHolders.pop();
      const rawData = {
        from: this.wallet.address,
        to: this.nftContractAddress,
        value: 0,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: this.web3.utils.toHex(1000000),
        nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
        data: await this.nftContract.methods.useTickets(this.wallet.address, amount).encodeABI()
      };
      const signed = await this.web3.eth.accounts.signTransaction(rawData, this.wallet.privateKey.toString('hex'));
      this.web3.eth.sendSignedTransaction(signed.rawTransaction).then(
        (receipt: any) => {
          this.loadNFTs();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  async _mintNFTs(amount: number) {
    const ipfsUrl = "https://blocktick.infura-ipfs.io/ipfs/QmTp7Zdmk4ESqCDMzZHY8NgnK3pUvrymq9BYxZZBnNPVmt";
    const newTokenIds: number[] = [];
    for (let i = 0; i < amount; i++) {
      const tokenId = await this.nftContract.methods.tokenIdCounter().call();
      await this.nftContract.methods._mint(this.wallet.address, tokenId).send({ from: this.wallet.address });
      await this.nftContract.methods._setTokenURI(tokenId, ipfsUrl).send({ from: this.wallet.address });
      newTokenIds.push(tokenId);
    }
    return newTokenIds;
  }

}
