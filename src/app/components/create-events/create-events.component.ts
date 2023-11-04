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
  //contractAddress: string = '0x86C27e65542dB6ab00a82297A97bD3fD6412d2D6';
  contractAddress: string = '0x387B70DEe5FAE65a384d60691De758f1dD1343B3';
  ownerAddress: string | undefined = '';

  web3: Web3 | undefined;
  contract: any;
  _eventName: string = '';
  _eventOrganizer: string = '';
  _eventCategory: string = '';
  _ticketPrice: number = 0; // Inicializado con un valor predeterminado
  gas: string = '6000000';
  transactionHash: string = '';
  transactionMessage: string = '';


  constructor(public walletService: WalletService) {

      // Inicializa una instancia de Web3 con el proveedor de Infura si está disponible.
  this.web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));

    // Inicializa la propiedad wallet con una dirección y clave privada en blanco.
    this.wallet = {
      address: '',
      privateKey: ''
    };

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

          // Asegúrate de que this.web3 tenga un valor definido
    if (!this.web3) {
      console.error('web3 no está inicializado correctamente.');
      return;
    }

    // Obtener el nonce actual de la dirección del propietario
    const nonce = await this.web3.eth.getTransactionCount(this.ownerAddress);
    console.log(`Nonce actual de ${this.ownerAddress}: ${nonce}`); // Agregamos el console.log
  
      const accounts = await this.web3!.eth.getAccounts();
      this.ownerAddress = accounts[0];
  
      // Mostrar detalles de la ABI
      console.log('ABI completo:', this.contract.options.jsonInterface);
  
      // Para mostrar información específica sobre una función del contrato:
      const createEventFunction = this.contract.methods.createEvent;
      console.log('Detalles de la función createEvent:', createEventFunction._method);
  
      // También puedes imprimir detalles específicos de los eventos si los tienes en tu ABI:
  
      console.log('Valores de los parámetros:');
      console.log('Nombre del evento:', this._eventName);
      console.log('Organizador:', this._eventOrganizer);
      console.log('Categoría del evento:', this._eventCategory);
      console.log('Precio de los boletos:', this._ticketPrice);

          // Agrega estos console.log para verificar los valores de los parámetros
    console.log('Tipo de _eventName:', typeof this._eventName);
    console.log('Tipo de _eventOrganizer:', typeof this._eventOrganizer);
    console.log('Tipo de _eventCategory:', typeof this._eventCategory);
    console.log('Tipo de _ticketPrice:', typeof this._ticketPrice);
  
      const contractMethod = createEventFunction(
        this._eventName,
        this._eventOrganizer,
        this._eventCategory,
        this._ticketPrice
      );
  
      // Verificar el método que se está aplicando
      console.log('Método que se está aplicando:', contractMethod.encodeABI());
  
      // Verificar la dirección del contrato
      console.log('Dirección del contrato:', this.contract.options.address);
  
      // Verificar la dirección del propietario
      console.log('Dirección del propietario:', this.ownerAddress);
  
      // Verificar el gas
      console.log('Valor de gas:', this.gas);
  
      // Obtén la firma de la función createEvent del ABI
      const abiCreateEvent = this.contract.options.jsonInterface.find(
        (item: any) =>
          item.name === 'createEvent' &&
          item.type === 'function' &&
          item.inputs.length === 4
      );
      console.log('Firma de createEvent en el ABI:', abiCreateEvent.signature);
  

  
      // Antes de realizar la transacción
      console.log('Realizando la transacción...');

      // Convierte el precio del ticket a una cadena hexadecimal
const ticketPriceInWei = this.web3.utils.toWei(this._ticketPrice.toString(), 'ether');
const value = this.web3.utils.toHex(ticketPriceInWei);

 
      const transaction = await this.contract.methods.createEvent(
        this._eventName,
        this._eventOrganizer,
        this._eventCategory,
        this._ticketPrice
      ).send({
        from: this.ownerAddress,
        to: this.contractAddress, // Agregar la dirección del contrato como "to"
        gas: this.gas,
        data: this.contract.methods.createEvent(this._eventName, this._eventOrganizer, this._eventCategory, this._ticketPrice).encodeABI()
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