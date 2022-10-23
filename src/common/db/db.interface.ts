export interface DBInterface {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
}