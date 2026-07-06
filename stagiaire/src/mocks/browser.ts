import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { stagiairesHandlers } from './handlers/stagiaires.handlers';
import { mentorsHandlers } from './handlers/mentors.handlers';
import { usersHandlers } from './handlers/users.handlers';
import {rapportsHandlers} from './handlers/rapports.handlers';
import { presencesHandlers} from './handlers/presences.handlers';
import { projetsHandlers } from './handlers/projet.handlers';
import { demandeHandlers } from './handlers/demande.handlers';
import { evenementsHandlers } from './handlers/evenement.handlers';
export const worker = setupWorker(...authHandlers, ...stagiairesHandlers, 
                        ...mentorsHandlers, ...usersHandlers, 
                        ...rapportsHandlers, ...presencesHandlers, ...projetsHandlers, ...demandeHandlers , ...evenementsHandlers);