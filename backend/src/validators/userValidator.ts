import validator from 'validator';

export function validateEmail(email: string): boolean {
    return validator.isEmail(email);
}

export function validatePassword(password: string): boolean {
    return validator.isLength(password, { min: 8 });
}
