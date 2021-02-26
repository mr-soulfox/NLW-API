import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
    
    const defaulOptions = await getConnectionOptions();
    return createConnection(
        Object.assign(defaulOptions, {
            database: process.env.NODE_ENV === 'test' ? "./src/database/database.test.sqlite" : defaulOptions.database,
        })
    );
}