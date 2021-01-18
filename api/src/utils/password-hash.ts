import { hash, compare } from 'bcrypt';

export async function getPasswordHash(password: string): Promise<string> {
    return hash(password, 10);
}

export async function checkPasswordHash(password: string, hashed: string): Promise<boolean> {
    return compare(password, hashed);
}
