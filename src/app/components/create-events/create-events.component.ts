import { Component, OnInit } from '@angular/core';
import { NFTblockTickService } from 'src/app/nft-blocktick.service'; 
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
import { ABI as factoryABI } from 'src/app/components/events/blockTick_factory';

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})
export class CreateEventsComponent implements OnInit {
  web3: any;
  contractAddress: string = '0x33578C5548e8ed6984d0a3705234996EF3d8386D'; // dirección del contrato TicketAsset
  walletAddress: string = ''; // la dirección de la billetera del usuario
  connectWallet: any;

  constructor(public walletService: WalletService) {
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f')); 
  }

  async ngOnInit() {
  
    if (this.isUserLoggedIn()) {
      this.walletAddress = this.walletService.wallet.walletAddress;
    } else {
      
    }
  }

  isUserLoggedIn(): boolean {
   
    return this.walletService && this.walletService.wallet && this.walletService.wallet.walletAddress;
  }

  async buyTicket() {
    try {

      const contract = new this.web3.eth.Contract(factoryABI, '0x33578C5548e8ed6984d0a3705234996EF3d8386D');


      const ticketPriceWei = await contract.methods.getPrice().call();
      const amount = 1; 
      const totalValueWei = ticketPriceWei * amount;

      // Conecta a la billetera del usuario 
      await this.walletService.initWallet;


      const userAddress = this.walletService.wallet.walletAddress;

      const result = await contract.methods.buyTicket().send({
        from: userAddress,
        value: totalValueWei,
      });

      if (result.status) {
        console.log('Compra de ticket exitosa. Hash de la transacción:', result.transactionHash);
 
      } else {
        console.error('La compra de ticket falló.');

      }
    } catch (error) {
      console.error('Error comprando ticket:', error);

    }
  }
}
