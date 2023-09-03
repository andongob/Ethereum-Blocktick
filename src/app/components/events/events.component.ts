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
import { ABI as factoryABI } from 'src/app/components/events/blockTick_factory';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  web3: any;
  contractAddress: string = '0x33578C5548e8ed6984d0a3705234996EF3d8386D'; // Reemplaza con la dirección del contrato TicketAsset
  walletAddress: string = ''; // Aquí almacenarás la dirección de la billetera del usuario
  connectWallet: any;

  constructor(public walletService: WalletService) {
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f')); // Reemplaza con tu URL de Infura
  }

  async ngOnInit() {
    // Verifica si el usuario está conectado a una billetera
    if (this.isUserLoggedIn()) {
      this.walletAddress = this.walletService.wallet.walletAddress;
    } else {
      // Maneja el caso en el que el usuario no está conectado
    }
  }

  isUserLoggedIn(): boolean {
    // Verifica si el usuario está conectado a una billetera
    return this.walletService && this.walletService.wallet && this.walletService.wallet.walletAddress;
  }

  async buyTicket() {
    try {
      // Obtén la instancia del contrato
      const contract = new this.web3.eth.Contract(factoryABI, '0x33578C5548e8ed6984d0a3705234996EF3d8386D');

      // Calcula el valor en wei que se enviará con la transacción
      const ticketPriceWei = await contract.methods.getPrice().call();
      const amount = 1; // Cantidad de boletos a comprar (puedes cambiarlo según tus necesidades)
      const totalValueWei = ticketPriceWei * amount;

      // Conecta a la billetera del usuario (asegúrate de que el usuario ya haya desbloqueado su billetera)
      await this.walletService.initWallet;

      // Obtiene la dirección de la billetera del usuario
      const userAddress = this.walletService.wallet.walletAddress;

      // Realiza la transacción para comprar el boleto
      const result = await contract.methods.buyTicket().send({
        from: userAddress,
        value: totalValueWei,
      });

      if (result.status) {
        console.log('Compra de boleto exitosa. Hash de la transacción:', result.transactionHash);
        // Puedes realizar acciones adicionales después de una compra exitosa
      } else {
        console.error('La compra de boleto falló.');
        // Maneja el caso en el que la compra falla
      }
    } catch (error) {
      console.error('Error comprando boleto:', error);
      // Maneja el error de la compra de boleto
    }
  }
}
