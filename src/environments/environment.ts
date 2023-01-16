// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: "1.0.0.0",
  urlApi: 'https://localhost:44323/api/',
  segundosExpiracionSesion: 600,
  tamanoMaximoArchivoImagenPerfilByte: 51200, // 50 KB
  tamanoMaximoArchivoByte: 4200000,
  KeyEncryptacion: 'Contrasena123456Contrasena123456',
  IVEncryptacion: 'Contrasena123456',
  imagenPerfilMujer: '../../../../imagenes/mujer_avatar.png',
  imagenPerfilHombre: '../../../../imagenes/hombre_avatar.png',
  idTipoMovimientoIngreso: 5,
  idTipoMovimientoCancelacionIngreso: 6,
  idTipoMovimientoGasto: 7,
  idTipoMovimientoCancelacionGasto: 8,
  estatusCrecimientoEmpleado: [{id: 1, nombre: 'Apto'}, {id: 2, nombre: 'No Apto'}, {id: 3, nombre: 'Congelado'}],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
