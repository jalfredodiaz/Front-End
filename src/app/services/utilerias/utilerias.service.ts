import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import swal from 'sweetalert';
import * as CryptoJS from 'crypto-js';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtileriasService {

  constructor() { }

  desencriptar(textoEncriptado: string) {
    if (textoEncriptado === null || textoEncriptado ===  undefined) {
      return null;
    }

    let resultado: string = '';

    try {
      var key = CryptoJS.enc.Utf8.parse(environment.KeyEncryptacion);
      var iv = CryptoJS.enc.Utf8.parse(environment.IVEncryptacion);

      var decrypted = CryptoJS.AES.decrypt(textoEncriptado.trim(), key,
        {
          keySize: 16,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

      resultado = decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.log(e);
    }

    return resultado;
  }

  encriptar(texto: string) {
    if (texto === null) {
      return null;
    }

    const key = CryptoJS.enc.Utf8.parse(environment.KeyEncryptacion);
    const iv = CryptoJS.enc.Utf8.parse(environment.IVEncryptacion);

    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(texto), key,
      {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    const res = encrypted.toString();

    return res;
  }

  downloadFile(data: HttpResponse<Blob>, nombre: string) {
    const body: Blob = data.body as Blob;
    const downloadedFile = new Blob([body], { type: body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    if (nombre !== null && nombre !== undefined && nombre !== '') { a.download = nombre; }

    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  abrirLink(link: string) {
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    a.href = link;
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }


  // FORMATO NUMEROS
  formatearNumero(value: number | string, decimales: number = 2, separadorDecimal: string = '.', separadorMillar: string = ','): string {
    let final: string;

    value = parseFloat(value.toString());

    const padding = '000000000000';
    let [integer, fraction = ''] = (value || '').toString()
      .split(separadorDecimal);

    fraction = decimales > 0
      ? separadorDecimal + (fraction + padding).substring(0, decimales)
      : '';

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separadorMillar);

    if (integer.length === 0) {
      // si la cadena integer esta vacia colocar el valor 0
      integer = '0';
    } else {
      // Limpiar los 0 a la izquierda en la parte de enteros
      const enteros = integer.split('');
      let resultado = '';
      let valorEncontrado = false;

      enteros.forEach(caracter => {
        if (caracter === '0' && valorEncontrado) {
          resultado += caracter;
        } else if (caracter !== '0' && !(caracter === separadorMillar && !valorEncontrado)) {
          resultado += caracter;
          valorEncontrado = true;
        }
      });

      integer = resultado;
    }

    // console.log('integer.length', integer.length);
    if (integer.length === 0) {
      // si la cadena integer esta vacia colocar el valor 0
      integer = '0';
    }

    final = integer + fraction;

    // console.log('integer', integer);
    // console.log('fraction', fraction);
    // console.log('formatearNumero', final);

    return final; //integer + fraction;
  }
  limpiarFormatoNumero(value: string, decimales: number = 2, separadorDecimal: string = '.', separadorMillar: string = ','): string {
    let [integer, fraction = ''] = (value || '').split(separadorDecimal);
    const padding = '000000000000';

    integer = integer.replace(new RegExp(separadorMillar, 'g'), '');

    fraction = parseInt(fraction, 10) > 0 && decimales > 0
      ? separadorDecimal + (fraction + padding).substring(0, decimales)
      : '';

    return integer + fraction;
  }



  // Mensajes
  mensajeInformacion(titulo: string, contenido: string) {
    return this.mensaje(titulo, contenido, 'info');
  }
  mensajeAdvertencia(titulo: string, contenido: string) {
    return this.mensaje(titulo, contenido, 'warning');
  }
  mensajeExito(titulo: string, contenido: string) {
    return this.mensaje(titulo, contenido, 'success');
  }
  mensajeError(titulo: string, contenido: string) {
    return this.mensaje(titulo, contenido, 'error');
  }
  mensajePregunta(titulo: string, contenido: string, textoBotonAceptar = 'SI', textoBotonCancelar = 'NO') {
    // let res = false;

    return swal({
      title: titulo,
      text: contenido,
      icon: 'imagenes/question2.png',
      buttons: {
        confirm: {
          text: textoBotonAceptar,
          value: true,
          visible: true,
          className: '',
          closeModal: true,
        },
        cancel: {
          text: textoBotonCancelar,
          value: false,
          visible: true,
          className: '',
          closeModal: true,
        }
      },
      dangerMode: true,
    });
  }
  mensajerInput(titulo: string) {
    return swal({
      title: titulo,
      content: {
        element: 'input',
      },
      buttons: {
        confirm: {
          text: 'Aceptar',
          value: true,
          visible: true,
          className: '',
          closeModal: true,
        },
      }
    });
  }
  mensajeTrabajando(titulo: string, contenido: string) {
    swal({
      title: titulo,
      text: contenido,
      icon: 'info',
      buttons: {},
    });
  }
  cerrarMensajeTrabajando() {
    const estado = swal.getState();

    if (estado.isOpen) {
      swal.close();
    }
  }
  private mensaje(titulo: string, contenido: string, tipo: string) {
    if (contenido === null || contenido === undefined) {contenido = '';}

    // console.log('contenido',contenido);

    return swal({
      title: titulo,
      text: contenido,
      icon: tipo,
      buttons: {
        confirm: {
          text: 'Aceptar',
          value: true,
          visible: true,
          className: '',
          closeModal: true,
        },
        allowOutsideClick: false
      },
    });
  }




  calcualrAños(fechaIni: Date, fechaFin: Date): number {
    // Resultado en milisegundos
    const milisegundos = fechaFin.getTime() - fechaIni.getTime();
    const segundo = milisegundos / 1000;
    const minutos = segundo / 60;
    const horas = minutos / 60;
    const dias = horas / 24;
    const años = dias / 365.25;

    return años;
  }

  formatearFecha(fecha: Date): string {
    return formatDate(fecha, 'yyyy-MM-dd', 'en-MX');
  }

  formatearFechaHora(fecha: Date): string {
    return formatDate(fecha, 'yyyy-MM-ddTHH:mm:ss', 'en-MX');
  }
}
