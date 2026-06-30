import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handlers';
import { stagiairesHandlers } from './handlers/stagiaires.handlers';
import { mentorsHandlers } from './handlers/mentors.handlers';
export const worker = setupWorker(...authHandlers, ...stagiairesHandlers, ...mentorsHandlers);