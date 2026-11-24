import express from 'express';
import { 
  getOpportunities, 
  getOpportunityById,
  createOpportunity, 
  updateOpportunity, 
  deleteOpportunity,
  validatePasscode,
  getOpportunityStats,
  joinOpportunity
} from '../controllers/opportunityController.js';

const router = express.Router();

router.route('/')
  .get(getOpportunities)
  .post(createOpportunity);

// CRITICAL: This MUST go before the /:id routes!
router.get('/stats', getOpportunityStats);

router.route('/:id/verify-passcode')
  .post(validatePasscode);

router.post('/:id/join', joinOpportunity);

router.route('/:id')
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

export default router;