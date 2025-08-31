import bcrypt from 'bcrypt';
const saltRounds = 12;

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Password comparison failed");
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Password hashing failed");
    }
};