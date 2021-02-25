import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoggerService } from '../../logging/logger.service';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import { ResetAuthDataService } from '../reset-auth-data.service';

@Injectable()
export class ImplicitFlowCallbackHandlerService {
  constructor(
    private readonly resetAuthDataService: ResetAuthDataService,
    private readonly loggerService: LoggerService,
    private readonly flowsDataService: FlowsDataService
  ) {}

  // STEP 1 Code Flow
  // STEP 1 Implicit Flow
  implicitFlowCallback(hash?: string): Observable<CallbackContext> {
    const isRenewProcessData = this.flowsDataService.isSilentRenewRunning();

    this.loggerService.logDebug('BEGIN authorizedCallback, no auth data');
    if (!isRenewProcessData) {
      this.resetAuthDataService.resetAuthorizationData();
    }

    hash = hash || window.location.hash.substr(1);

    const authResult: any = hash.split('&').reduce((resultData: any, item: string) => {
      const parts = item.split('=');
      resultData[parts.shift() as string] = parts.join('=');
      return resultData;
    }, {});

    const callbackContext = {
      code: null,
      refreshToken: null,
      state: null,
      sessionState: null,
      authResult,
      isRenewProcess: isRenewProcessData,
      jwtKeys: null,
      validationResult: null,
      existingIdToken: null,
    };

    return of(callbackContext);
  }
}
