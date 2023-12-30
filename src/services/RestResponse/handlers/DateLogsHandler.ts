import { DateLogEntity } from '@app/entities/DateLogEntity';
import { CreateDateLogForm, PatchDateLogForm } from '@app/forms/DateLogsForm';
import { RestfulHandlerBase } from '@app/services/RestResponse/core/RestfulHandlerBase';

export class DateLogsHandler extends RestfulHandlerBase<DateLogEntity, CreateDateLogForm, PatchDateLogForm> {
    getEntityClass() {
        return DateLogEntity;
    }

    getEntityName() {
        return 'Date Log';
    }
}
