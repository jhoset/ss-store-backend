import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
    
    hash: (password: string) => {
        const salt = genSaltSync();
        return hashSync(password, salt);
    },

    compare: (password: string, prevHash: string) => {
        return compareSync(password, prevHash);
    }


}