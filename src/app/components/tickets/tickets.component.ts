import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { ABI as NFTblockTickABI } from 'src/ABI/NFTblockTickABI';
declare let window: any;

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  wallet: any = {
    address: ''
  };
  web3: any;
  walletAddress: string = '';
  ticketAmount: number = 0;
  ticketPrice: number = 1;
  etherAmount: number = 0;
  contract: any; // Instancia del contrato EventNFTManager
  transactionResult: string = '';
  nftContract: any;
  nftContractAddress: any = '0xDb885a7cd58aD7cA96fAb45A0F8574140627002B';
  gas: string = '200000';
  network: string = 'Desconocida';


  constructor(public walletService: WalletService) {
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));
    this.nftContract = new this.web3.eth.Contract(NFTblockTickABI.default, this.nftContractAddress);

    console.log('nftContract:', this.nftContract);

    this.wallet = {
      address: '',
      privateKey: ''
    };
  }


  async ngOnInit() {
    try {
      //await this.walletService.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now');
      this.wallet = this.walletService.wallet;
      // await this.loadNFTs();
    } catch (error) {
      console.error('Error al inicializar la billetera:', error);
    }
    try {
      const networkId = await this.getNetworkId();
      if (networkId !== null) {
        this.network = networkId.toString();
      } else {
        this.network = 'Desconocido';
      }
    } catch (error) {
      console.error('Error al inicializar la red:', error);
      this.network = 'Desconocido';
    }
  }

  async getNetworkId() {
    try {
      const networkId = await this.web3.eth.net.getId();
      return networkId;
    } catch (error) {
      console.error('Error al obtener la versión de la red:', error);
      return null;
    }
  }

  async getNetwork(): Promise<string> {
    try {
      const networkId = await this.web3.eth.net.getId();
      switch (networkId) {
        case 1:
          return 'Mainnet';
        case 3:
          return 'Ropsten';
        case 4:
          return 'Rinkeby';
        case 42:
          return 'Kovan';
        default:
          return 'Desconocida';
      }
    } catch (error) {
      console.error('Error al obtener la versión de la red:', error);
      return 'Desconocida';
    }
  }
  
  

  isUserLoggedIn(): boolean {
    if (this.walletService && this.walletService.wallet && this.walletService.wallet.walletAddress) {
      return this.walletService.web3.utils.isAddress(this.walletService.wallet.walletAddress);
    }
    return false;
  }

  disconnectWallet() {
    this.wallet = {
      address: '',
      privateKey: ''
    };
    this.walletService.wallet = this.wallet; // También puedes actualizar el servicio si es necesario
  }
  

  async buyTickets() {
    // Obtén el valor del precio del ticket y el número de tickets de las propiedades del componente
    const ticketPrice = await this.nftContract.methods.ticketPrice().call();
    const amount = 1; // Comprar 1 ticket
  
    // Calcula el valor en wei necesario
    const value = ticketPrice * amount;
  
    try {
      if (!window.ethereum || !window.ethereum.selectedAddress) {

        console.error('No se encontró una cuenta conectada en MetaMask.');

        return;
      }
  
      const fromAddress = window.ethereum.selectedAddress;
  
      //  transacción
      const tx = {
        from: fromAddress,
        to: this.nftContractAddress,
        value: value,
        gas: this.gas, // Asegúrate de que gas sea un valor adecuado
        data: this.nftContract.methods.buyTickets(fromAddress, amount).encodeABI()
      };
  
      // Solicita a MetaMask que firme y envíe la transacción
      const result = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });
  
      console.log('Resultado de la compra de tickets:', result);

    } catch (error) {
      console.error('Error al comprar tickets:', error);

    }
  }
  

  async buyOneTicketForMe() {

    const amount = 1;
  
    // Obtiene el valor del precio del ticket
    const ticketPrice = await this.nftContract.methods.ticketPrice().call();
  
    try {

      if (typeof window !== 'undefined' && 'ethereum' in window) {
        const ethereum = window['ethereum'];
  
        // Solicita al usuario que apruebe la transacción
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  
        if (accounts.length === 0) {

          console.error('El usuario no aprobó la transacción.');
          return;
        }
  
        const fromAddress = accounts[0];
  
        // transacción
        const tx = {
          from: fromAddress,
          to: this.nftContractAddress,
          value: ticketPrice,
          gas: this.gas,
          data: this.nftContract.methods.buyOneTicketForMe().encodeABI()
        };
  
        // Envía la transacción a través de MetaMask
        const result = await ethereum.request({ method: 'eth_sendTransaction', params: [tx] });
  
        console.log('Resultado de la compra de un ticket para el usuario actual:', result);

      } else {
        console.error('MetaMask no está instalado o configurado en el navegador.');

      }
    } catch (error) {
      console.error('Error al comprar un ticket para el usuario actual:', error);

    }
  }
  
}
