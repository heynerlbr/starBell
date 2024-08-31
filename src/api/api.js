export const urlRest = 'http://10.0.2.2:8000/';
// export const urlRest = "http://127.0.0.1:8000/";
// export const urlRest = "https://reservables.net/";
export const CLIENT_ID = '3';
export const CLIENT_SECRET = 'wZp4tXyVtBgHMfwhH5cTGM7u7ttGJt4cS3iDOEms';

export const INFO_CLIENTE = [];

// Variable que almacenará la información del perfil del usuario
let userProfile = null;

// Función para guardar el perfil del usuario
export const guardarPerfilUsuario = profile => {
  userProfile = profile;
};

// Función para obtener el perfil del usuario
export const obtenerPerfilUsuario = () => {
  return userProfile;
};

// Función para eliminar el perfil del usuario
export const eliminarPerfilUsuario = () => {
  userProfile = null;
};
