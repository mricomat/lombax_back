export const ErrorMessages = {
  PasswordInvalid:
    "La contraseña debe poseer al menos 8 caracteres, 1 letra minuscula, 1 letra mayuscula y 1 numero. " +
    "Por favor, ingrese otra contraseña y vuelva a intentarlo",
  UserEmailAlreadyExists: "El correo electrónico ingresado ya esta en uso. Por favor, ingrese otro correo electrónico y vuelva intentarlo",
  UsernameAlreadyExists: "El nombre de usuario ingresado ya esta en uso. Por favor, ingrese otro nombre de usuario y vuelva intentarlo",
  InvalidRegisterBody: "Los parámetros de registro no son válidos.",
  UserNotFound: "El usuario no existe. Por favor, use otro usuario y vuelva a intentarlo",
  gameAlreadyExists: "El juego ingresado ya existe actualmente",
  UnauthorizedUser: "Este usuario no tiene permisos para acceder a esta ruta",
  AccountNotVerified: "Debes verificar tu cuenta antes de poder acceder a la plataforma. Por favor, verifica tu cuenta y vuelve a intentarlo",
  AuthorizationHeaderNotFound:
    'El header "authorization" no esta definido. Por favor, agrega el header "authorization" a la petición y vuelva a intentarlo',
  AuthorizationHeaderBadFormed:
    'El header "authorization" no cuenta con el formato correcto.' +
    ' Por favor, usa el formato "bearer token" para el header "authorization" y vuelva a intentarlo',
  BadJwtToken: "El JSON Web Token utilizado no es valido. Por favor, ingrese uno valido y vuelva a intentarlo",
  WrongCredentials: "Correo electrónico o contraseña incorrectos. Por favor, ingrese las credenciales correctas y vuelva a intentarlo",
  FollowIdSameId: "El ID del usuario con el que tratas seguir, es tu mismo ID",
  NotFollowing: "No estás siguiendo a este usuario",
  AlreadyFollowing: "Ya sigues a este usuario",
  TakeQueryParamIsNotNumber: "El parámetro query Take no es un numero. Si deseas usar este parámetro, debes ingresar un numero",
  SkipQueryParamIsNotNumber: "El parámetro query Skip no es un numero. Si deseas usar este parámetro, debes ingresar un numero",
  SortByBadRequest: "Los parámetros de filtrado no son correctos",
  ReviewNotFound: "No se pudo encontrar el review",
  ReviewAlreadyLiked: "Ya has dado like a este review anteriormente, no puedes dar like al mismo mas de 1 vez",
  CommentIsAlreadyLiked: "Ya haz dado like a este comentario anteriormente, no puedes dar like al mismo mas de 1 vez",
  CommentNotFound: 'No se pudo encontrar el comentario',
  CommentIsNotParent: 'No se puede crear una respuesta a este comentario porque no es un comentario padre',
};
