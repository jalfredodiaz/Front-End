export const environment = {
  production: true,
  version: "1.0.0.0",
  urlApi: 'https://localhost:44323/api/',
  segundosExpiracionSesion: 600,
  tamanoMaximoArchivoImagenPerfilByte: 51200, // 50 KB
  tamanoMaximoArchivoByte: 4200000,
  KeyEncryptacion: 'Contraseña123456Contraseña123456',
  IVEncryptacion: 'Contraseña123456',
  imagenPerfilMujer: '../../../../imagenes/mujer_avatar.png',
  imagenPerfilHombre: '../../../../imagenes/hombre_avatar.png',
  idTipoMovimientoIngreso: 5,
  idTipoMovimientoCancelacionIngreso: 6,
  idTipoMovimientoGasto: 7,
  idTipoMovimientoCancelacionGasto: 8,
  estatusCrecimientoEmpleado: [{ id: 1, nombre: 'Apto' }, { id: 2, nombre: 'No Apto' }, { id: 3, nombre: 'Congelado' }],
};
