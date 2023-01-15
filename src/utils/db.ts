export const getDBConnectionURI = (
  username: string,
  password: string,
  host: string,
  port: number,
  databaseName: string
): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
