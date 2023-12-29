import { ClientEntity } from '@app/entities/ClientEntity';
import { CreateClientForm, PatchClientForm } from '@app/forms/Client';
import { RestfulHandlerBase } from '@app/services/RestResponse/core/RestfulHandlerBase';

export class ClientsHandler extends RestfulHandlerBase<ClientEntity, CreateClientForm, PatchClientForm> {
    getEntityClass() {
        return ClientEntity;
    }

    getEntityName() {
        return 'Client';
    }
}
