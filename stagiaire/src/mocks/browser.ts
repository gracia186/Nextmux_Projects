import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { stagiairesHandlers } from './handlers/stagiaires.handlers';
import { mentorsHandlers } from './handlers/mentors.handlers';
import { usersHandlers } from './handlers/users.handlers';
import {rapportsHandlers} from './handlers/rapports.handlers';
import { presencesHandlers} from './handlers/presences.handlers';
export const worker = setupWorker(...authHandlers, ...stagiairesHandlers, 
                        ...mentorsHandlers, ...usersHandlers, 
                        ...rapportsHandlers, ...presencesHandlers);