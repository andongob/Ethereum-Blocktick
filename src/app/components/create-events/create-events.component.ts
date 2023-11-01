import { Component } from '@angular/core';
import Web3 from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { ABI as blockTickEventABI } from 'src/ABI/blockTickEventABI';

declare let window: any;

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})

export class CreateEventsComponent {
  wallet: any = {
    address: ''
  };
  contractAddress: string = '0x86C27e65542dB6ab00a82297A97bD3fD6412d2D6';
  ownerAddress: string | undefined;
  web3: Web3 | undefined;
  contract: any;
  eventName: string = '';
  eventOrganizer: string = '';
  eventCategory: string = '';
  ticketPrice: number = 0;
  gas: string = '300000';
  transactionHash: string = '';
  transactionMessage: string = '';

  constructor(public walletService: WalletService) {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(() => {
        this.contract = new this.web3!.eth.Contract(blockTickEventABI.default, this.contractAddress);
      });

      this.getOwnerAddress(); // Llamada a la función para obtener la dirección del propietario
    } else {
      console.error('MetaMask no está instalado o configurado en el navegador.');
    }
  }

  async ngOnInit() {
    try {
      if (!this.walletService.wallet || !this.walletService.wallet.walletAddress) {
        await this.walletService.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now');
      }
      this.wallet = this.walletService.wallet;
    } catch (error) {
      console.error('Error al inicializar la billetera:', error);
    }
  }

  async createEvent() {
    try {
      if (!this.ownerAddress) {
        console.error('La dirección del propietario no está definida.');
        return;
      }

      const accounts = await this.web3!.eth.getAccounts();
      this.ownerAddress = accounts[0];

      const transaction = await this.contract.methods.createEvent(
        this.eventName,
        this.eventOrganizer,
        this.eventCategory,
        this.ticketPrice
      ).send({
        from: this.ownerAddress,
        gas: this.gas,
      })
        .on('transactionHash', (hash: string) => {
          this.transactionHash = hash;
          this.transactionMessage = 'Ver estado de la transacción en Sepolia';
          console.log('Hash de la transacción:', hash);
        });

      console.log('Transacción exitosa:', transaction);
    } catch (error) {
      console.error('Error al crear el evento:', error);
    }
  }

  async getOwnerAddress() {
    const accounts = await this.web3!.eth.getAccounts();
    this.ownerAddress = accounts[0];
  }
}
