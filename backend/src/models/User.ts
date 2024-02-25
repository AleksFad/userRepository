export interface User {
    id: string;
    password: string;
    email: string;
    lastLogins: string[];
    isValidated: boolean;
}
