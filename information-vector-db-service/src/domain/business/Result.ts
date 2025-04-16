export class Result {
  success: boolean;
  error?: string;

  private constructor(success: boolean, error?: string) {
    this.success = success;
    this.error = error;
  }

  static ok(): Result {
    return new Result(true);
  }

  static fail(error: string): Result {
    return new Result(false, error);
  }

  static fromError(error: Error): Result {
    return new Result(false, error.message);
  }
} 