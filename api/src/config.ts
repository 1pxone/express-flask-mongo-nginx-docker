const environment = ['NODE_ENV', 'DATABASE', 'PORT'];

environment.forEach((name) => {
    if (!process.env[name]) {
        throw new Error(`${name}: ${process.env[name]}`);
    }
});

export const config: {
    [key: string]: string;
} = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE: process.env.DATABASE,
    PORT: process.env.PORT,
};
