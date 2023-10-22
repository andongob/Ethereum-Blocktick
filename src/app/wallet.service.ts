import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


import * as Mnemonic from 'bitcore-mnemonic';
import { ethers } from 'ethers';
import { hdkey } from 'ethereumjs-wallet';
import * as bip39 from 'bip39';
import * as util from '@ethereumjs/util';
import * as CryptoJS from "crypto-js";
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class WalletService {
  wallet:any = { //Este campo almacena la información de la billetera del usuario, incluyendo la dirección y la clave privada.
    address: '',
    privateKey: '',
  }
  loginForm: any; //Este campo almacena el formulario utilizado para iniciar sesión en la aplicación.
  sendForm: any;//Este campo almacena el formulario utilizado para enviar información en la aplicación.
  encrypted: any; //Este campo almacena información cifrada utilizada en la aplicación.
  web3: any; //Este campo almacena una instancia del objeto Web3 utilizado para interactuar con la cadena de bloques.
  window: any; //Este campo almacena una referencia al objeto de ventana global.
  mining = false; //Este campo indica si la minería está en curso o no.
  lastTransaction: any; //Este campo almacena información sobre la última transacción realizada en la aplicación.
  walletAddress: string = ''; //Este campo almacena la dirección de la billetera del usuario.
  hasNFT: any; //Este campo indica si el usuario posee un NFT (Token No Fungible) en la aplicación.
  nftContract: any; //Este campo almacena una instancia del contrato NFT utilizado en la aplicación.

  /**
   * Constructor de la clase WalletService.
   *
   * @función
   * @description Este constructor se utiliza para inicializar una instancia de la clase WalletService.
   *
   * @param document - Una instancia del objeto Document proporcionada mediante inyección de dependencia.
   * @param formBuilder - Una instancia del objeto FormBuilder para la construcción de formularios en Angular.
   */

  constructor(@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder) {
    // Obtiene la ventana global del documento.
    this.window = document.defaultView;

    // Inicializa el formulario de inicio de sesión.
    this.loginForm = this.formBuilder.group({
      seeds: '',
      password: ''
    });

    // Inicializa el formulario de envío.
    this.sendForm = this.formBuilder.group({
      to: '',
      amount: ''
    });

    // Recupera información cifrada del almacenamiento local.
    this.encrypted = window.localStorage.getItem('seeds');
    //this.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now'); // trampa

    // Crea una instancia de Web3.
    this.web3 = new Web3;
	
    // Configura el proveedor Web3 con Ethereum (si está disponible en la ventana global).
	  this.web3 = new Web3(this.window.ethereum); 

    // Configura el proveedor Web3 con una dirección HTTP de Infura.
    this.web3.setProvider(
      new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f')
    );
  }


/**
 * Inicializa una billetera utilizando una semilla mnemotécnica.
 *
 * @función
 * @description Esta función crea una billetera Ethereum utilizando una semilla mnemotécnica y devuelve información relevante sobre la billetera.
 *
 * @param seeds - La semilla mnemotécnica utilizada para generar la billetera.
 * @returns {Promise<any>} Devuelve un objeto que contiene la dirección y el saldo de la billetera.
 */
async initWallet(seeds: string): Promise<any> {
  // Convierte la semilla mnemotécnica en una clave de acceso.
  var mnemonic = new Mnemonic(seeds);
  var seed = await bip39.mnemonicToSeed(mnemonic.toString());

  // Define la ruta para derivar la dirección de la billetera.
  var path = "m/44'/60'/0'/0/0";

  // Deriva una dirección de billetera a partir de la clave de acceso.
  var wallet = hdkey
    .fromMasterSeed(seed)
    .derivePath(path)
    .getWallet();

  // Obtiene la clave privada de la billetera.
  var privateKey = wallet.getPrivateKey();

  // Calcula la clave pública a partir de la clave privada.
  var publicKey = util.privateToPublic(privateKey);

  // Calcula la dirección a partir de la clave pública.
  var addressBuffer = util.pubToAddress(publicKey);
  var address = "0x" + Buffer.from(addressBuffer).toString("hex");

  // Asigna la clave privada y la dirección a la billetera.
  this.wallet.privateKey = privateKey;
  this.wallet.address = address;

  // Obtiene el saldo de la billetera y lo convierte a Ether.
  this.wallet.balance = await this.web3.eth.getBalance(address).then((result: any) => {
    return this.web3.utils.fromWei(result, 'ether');
  });

  return this.wallet;
}
  

/**
 * Obtiene y actualiza el saldo de una billetera Ethereum.
 *
 * @función
 * @description Esta función obtiene el saldo de una billetera Ethereum y actualiza la propiedad 'balance' de la billetera.
 *
 * @param address - La dirección de la billetera de la cual se desea obtener el saldo.
 * @returns {Promise<any>} Devuelve un objeto que contiene la dirección y el saldo de la billetera actualizados.
 */
async getBalance(address: string) {
  // Asigna la dirección a la billetera.
  this.wallet.address = this.walletAddress;

  // Obtiene el saldo de la dirección y lo convierte a Ether.
  this.wallet.balance = await this.web3.eth.getBalance(address).then((result: any) => {
    return this.web3.utils.fromWei(result, 'ether');
  });

  // Actualiza la dirección de la billetera.
  this.walletAddress = address;

  console.log("Final wallet:", this.walletAddress);
  console.log("Finished initWallet");

  return this.wallet;
}

  
/**
 * Inicia sesión o desbloquea la billetera Ethereum con una contraseña proporcionada.
 *
 * @función
 * @description Esta función se utiliza para iniciar sesión o desbloquear la billetera Ethereum con una contraseña proporcionada. Si la contraseña es válida, se utiliza para desencriptar las semillas y desbloquear la billetera.
 *
 * @param loginData - Un objeto que contiene la contraseña (password) y las semillas (seeds) para la billetera.
 * @returns {void} Esta función no devuelve un valor, pero puede mostrar una alerta en caso de errores de contraseña o semilla inválidos.
 */
sendLogin(loginData: any) {
  if (loginData.password == '') {
    return alert('Introduce tu contraseña');
  }

  if (this.encrypted) {
    var decrypt = CryptoJS.AES.decrypt(this.encrypted, loginData.password);
    loginData.seeds = decrypt.toString(CryptoJS.enc.Utf8);
  }

  if (!Mnemonic.isValid(loginData.seeds)) {
    return alert('Semilla inválida');
  }

  var encrypted = CryptoJS.AES.encrypt(loginData.seeds, loginData.password).toString();

  window.localStorage.setItem('seeds', encrypted);

  this.loginForm.reset();

  this.initWallet(loginData.seeds);
}


async checkNetwork(): Promise<void> {
  if (!window.ethereum) {
    return alert('MetaMask no está instalado');
  }

  window.ethereum.on('networkChanged', (networkId: string) => {
    if (networkId === '11155111') {
      // Usuario en la red correcta (Sepolia)
    } else {
      alert('Cambia a la red Sepolia en MetaMask para continuar.');
    }
  });
}


/**
 * Inicia sesión utilizando la extensión MetaMask para billeteras Ethereum.
 *
 * @función
 * @description Esta función se utiliza para permitir a los usuarios iniciar sesión utilizando la extensión MetaMask para billeteras Ethereum. Verifica si MetaMask está instalado en el navegador y, si lo está, habilita la extensión y obtiene la dirección de la billetera conectada.
 *
 * @returns {void} Esta función no devuelve un valor, pero actualiza la dirección de la billetera en la propiedad 'wallet.address' y obtiene el saldo de la billetera.
 */
loginWithMetamask() {
  if (!this.window.ethereum) {
    return alert('MetaMask no está instalado');
  }

  this.window.ethereum.enable().then((accounts: any) => {
    let address = accounts[0];
    this.getBalance(address);
    this.wallet.address = address;
  });
}

/**
 * Elimina las semillas almacenadas y restablece la información de la billetera.
 *
 * @función
 * @description Esta función se utiliza para eliminar las semillas almacenadas en el navegador y restablecer la información de la billetera a un estado inicial vacío. Esto implica eliminar las semillas cifradas almacenadas en el almacenamiento local y restablecer la dirección de la billetera y su saldo en cero.
 *
 * @returns {void} Esta función no devuelve un valor, pero tiene el efecto de eliminar las semillas almacenadas y restablecer la información de la billetera.
 */
removeSeeds() {
  window.localStorage.removeItem('seeds');
  this.encrypted = '';
  this.wallet = {
    address: '',
    balance: ''
  };
}


/**
 * Envía una cantidad especificada de Ether a una dirección Ethereum destino.
 *
 * @función
 * @description Esta función permite al usuario enviar una cantidad especificada de Ether a una dirección Ethereum destino. Realiza una serie de comprobaciones para garantizar que los campos sean válidos y luego inicia el proceso de envío de Ether.
 *
 * @param {any} sendData - Un objeto que contiene la información necesaria para la transacción, incluyendo la dirección de destino (to) y la cantidad de Ether (amount) a enviar.
 *
 * @returns {Promise<void>} Una promesa que se resuelve una vez que la transacción se ha completado con éxito. No devuelve un valor directo, pero actualiza el estado de la aplicación y la información sobre la transacción más reciente.
 */
async sendEther(sendData: any) {
  if (sendData.to == '' || sendData.amount == null) {
    return alert('Campos son obligatorios');
  }

  if (!util.isValidAddress(sendData.to)) {
    return alert('Dirección inválida');
  }

  this.mining = true;

  var rawData = {
    from: this.wallet.address,
    to: sendData.to,
    value: sendData.amount,
    gasPrice: this.web3.utils.toHex(10000000000),
    gasLimit: this.web3.utils.toHex(1000000),
  };

  var signed = await this.web3.eth.sendTransaction(rawData).then((receipt: any) => {
    console.log("Transacción exitosa", receipt);
    this.mining = false;
    this.lastTransaction = receipt;

    this.sendForm.reset();
  });
}

  
}