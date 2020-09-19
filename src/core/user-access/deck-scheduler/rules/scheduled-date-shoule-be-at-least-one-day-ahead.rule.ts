import { BusinessRule } from '@core/shared/business-rule';
import moment from 'moment';

export class ScheduledDateShouldBeAtLeastOneDayAheadRule extends BusinessRule {
  message = 'Scheduled date should be at least one day ahead.';

  constructor(private readonly scheduledDate: Date) {
    super();
  }

  public isBroken() {
    const TOMORROW = moment().add(1, 'days').startOf('day');

    return moment(this.scheduledDate).isBefore(TOMORROW);
  }
}
