export abstract class DomainEvent {
  private occuredOn: Date;

  constructor(public readonly name: string) {
    this.occuredOn = new Date();
  }

  public getOccuredOn() {
    return this.occuredOn;
  }
}
