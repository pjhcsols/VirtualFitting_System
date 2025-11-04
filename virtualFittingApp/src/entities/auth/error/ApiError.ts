export class ApiError extends Error {
  public name: string;
  public status?: number;

  constructor(message: string, name: string = "api-error", status?: number) {
    super(message);
    this.name = name;
    this.status = status;
  }
}
