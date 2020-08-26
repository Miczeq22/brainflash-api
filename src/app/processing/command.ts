export abstract class Command<P extends object = {}> {
  constructor(public readonly type: string, public readonly payload: P) {}
}
