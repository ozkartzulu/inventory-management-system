

export const validateEmail = (email: string): string | undefined => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.length || !validRegex.test(email)) {
      return "Por favor ingrese un email válido";
    }
}
  
export const validatePassword = (password: string): string | undefined => {
    if (password.length < 5) {
        return "Por favor ingrese una contraseña que al menos tenga 5 caractres de longitud";
    }
}
  
export const validateName = (name: string): string | undefined => {
    if (!name.length) return `Por favor ingrese un valor`;
}

export const validateFile = (name: string): string | undefined => {
    if (!name.length) return `Por favor cargue una imagen`;
}

export const validateLastName = (lastName: string): string | undefined => {
    if (!lastName.length) return `Por favor ingrese un valor`;
}

export const validateNumber = (number: number): string | undefined => {
    if (!number) return `Por favor ingrese un valor numerico`;
}

// validator of supplier

export const validatePhone = (number: number): string | undefined => {
    if (!number) return `Por favor ingrese un valor numerico`;
    if(number.toString().length < 8 || number.toString().length > 8) {
        return 'Por favor ingrese un número de teléfono válido';
    }
}