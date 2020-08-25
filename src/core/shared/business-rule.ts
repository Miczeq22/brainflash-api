export abstract class BusinessRule {
  public readonly message: string;

  public abstract isBroken(): Promise<boolean> | boolean;
}
