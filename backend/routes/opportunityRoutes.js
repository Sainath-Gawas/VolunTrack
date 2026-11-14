import express from 'express';
import { 
  getOpportunities, 
  getOpportunityById,
  createOpportunity, 
  updateOpportunity, 
  deleteOpportunity,
  validatePasscode
} from '../controllers/opportunityController.js';

const router = express.Router();

router.route('/')
  .get(getOpportunities)
  .post(createOpportunity);

router.route('/:id/verify-passcode')
  .post(validatePasscode);

router.route('/:id')
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

export default router;