export abstract class Query<P extends object = {}> {
  constructor(public readonly type: string, public readonly payload: P) {}
}
